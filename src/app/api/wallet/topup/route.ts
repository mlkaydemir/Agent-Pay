import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/agent-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amountToAdd = typeof body.amount === "number" ? body.amount : 5000;
    const isReset = Boolean(body.reset);

    const wallet = await prisma.wallet.findFirst({
      include: { user: true },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const newBalance = isReset ? 10000.0 : wallet.balance + amountToAdd;

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance,
      },
    });

    await logAuditEvent({
      userId: wallet.userId,
      action: isReset ? "WALLET_BALANCE_RESET" : "WALLET_TOPUP_FAUCET",
      toolName: "sandbox_faucet",
      inputData: { amount: amountToAdd, isReset },
      outputData: { newBalance: updated.balance },
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      balance: updated.balance,
      message: isReset
        ? "Cüzdan bakiyesi ₺10.000 olarak sıfırlandı."
        : `Cüzdana ₺${amountToAdd.toLocaleString()} demo bakiyesi eklendi.`,
    });
  } catch (error: any) {
    console.error("POST /api/wallet/topup error:", error);
    return NextResponse.json({ error: error.message || "Failed to top up wallet" }, { status: 500 });
  }
}
