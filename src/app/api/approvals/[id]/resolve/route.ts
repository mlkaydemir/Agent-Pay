import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { logAuditEvent } from "@/lib/agent-engine";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const action = body.action; // "APPROVE" | "REJECT"
    const notes = body.notes || "";

    const approval = await prisma.approval.findUnique({
      where: { id },
      include: {
        transaction: {
          include: { wallet: true },
        },
      },
    });

    if (!approval) {
      return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
    }

    if (approval.status !== "PENDING") {
      return NextResponse.json({ error: "Approval has already been resolved" }, { status: 400 });
    }

    const tx = approval.transaction;
    const wallet = tx.wallet;

    if (action === "APPROVE") {
      // Check wallet balance; in sandbox demo mode auto-fund if needed
      if (wallet.balance < tx.amount) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: tx.amount + 10000 },
        });
      }

      // Generate cryptographically simulated aggregate signature and txHash
      const sigHash = "0x" + crypto.createHash("sha256").update("SIG_3_OF_3:" + tx.id + Date.now()).digest("hex");
      const txHash = "0x" + crypto.createHash("sha256").update("TX_CONFIRMED:" + sigHash).digest("hex");
      const blockNumber = 1048350 + Math.floor(Math.random() * 20);

      // Parse and update timeline
      const timeline = tx.executionTimeline ? JSON.parse(tx.executionTimeline) : [];
      timeline.push({
        step: "USER_APPROVAL_GRANTED",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        note: `User (${approval.approverName}) authorized transaction via Passkey / WebAuthn share.`,
      });
      timeline.push({
        step: "MPC_3_OF_3_AGGREGATED",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        note: "3 of 3 threshold shares validated. Quorum assembled successfully.",
      });
      timeline.push({
        step: "BLOCKCHAIN_SETTLED",
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
        note: `Settled on Sandbox L2 Rollup (Block #${blockNumber})`,
      });

      // Update mpcShares
      const mpcState = {
        aiShare: true,
        policyShare: true,
        userShare: true,
        threshold: 2,
        total: 3,
        status: "3_OF_3_SIGNED",
        signatureHash: sigHash,
        signers: ["AI_AGENT (Autonomous Intent)", "POLICY_ENGINE (HSM Co-Signer)", "USER_DEVICE (Passkey)"],
      };

      // Atomic balance reduction & transaction completion
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { decrement: tx.amount },
            nonce: { increment: 1 },
          },
        }),
        prisma.transaction.update({
          where: { id: tx.id },
          data: {
            status: "COMPLETED",
            signatureHash: sigHash,
            txHash,
            blockNumber,
            mpcShares: JSON.stringify(mpcState),
            executionTimeline: JSON.stringify(timeline),
          },
        }),
        prisma.approval.update({
          where: { id },
          data: {
            status: "APPROVED",
            resolvedAt: new Date(),
            notes,
          },
        }),
      ]);

      await logAuditEvent({
        userId: wallet.userId,
        transactionId: tx.id,
        action: "USER_APPROVAL_GRANTED",
        toolName: "mpc_threshold_signer",
        inputData: { approvalId: id, amount: tx.amount, notes },
        outputData: { status: "COMPLETED", txHash, blockNumber },
        status: "SUCCESS",
      });

      return NextResponse.json({
        success: true,
        status: "APPROVED",
        message: `İşlem başarıyla onaylandı ve ₺${tx.amount.toLocaleString()} tutarındaki ödeme L2 blokzincirinde tamamlandı.`,
        txHash,
        blockNumber,
      });
    } else {
      // Action === "REJECT"
      const timeline = tx.executionTimeline ? JSON.parse(tx.executionTimeline) : [];
      timeline.push({
        step: "USER_APPROVAL_REJECTED",
        status: "BLOCKED",
        timestamp: new Date().toISOString(),
        note: `User (${approval.approverName}) declined transaction authorization. Reason: ${notes || "User declined"}`,
      });

      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: tx.id },
          data: {
            status: "REJECTED",
            failureReason: `User manually rejected authorization: ${notes || "Declined by user"}`,
            executionTimeline: JSON.stringify(timeline),
          },
        }),
        prisma.approval.update({
          where: { id },
          data: {
            status: "REJECTED",
            resolvedAt: new Date(),
            notes,
          },
        }),
      ]);

      await logAuditEvent({
        userId: wallet.userId,
        transactionId: tx.id,
        action: "USER_APPROVAL_REJECTED",
        toolName: "user_approval_manager",
        inputData: { approvalId: id, amount: tx.amount, notes },
        outputData: { status: "REJECTED" },
        status: "BLOCKED",
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
        message: "İşlem kullanıcı tarafından reddedildi.",
      });
    }
  } catch (error: any) {
    console.error("POST /api/approvals/[id]/resolve error:", error);
    return NextResponse.json({ error: error.message || "Failed to resolve approval" }, { status: 500 });
  }
}
