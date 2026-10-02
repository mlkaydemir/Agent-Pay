import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/agent-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const wallet = await prisma.wallet.findFirst({
      include: { user: true },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const nextFrozenState = typeof body.isFrozen === "boolean" ? body.isFrozen : !wallet.isFrozen;

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { isFrozen: nextFrozenState },
    });

    await logAuditEvent({
      userId: wallet.userId,
      action: nextFrozenState ? "EMERGENCY_FREEZE_ACTIVATED" : "EMERGENCY_FREEZE_LIFTED",
      toolName: "smart_account_guardian",
      inputData: { targetState: nextFrozenState, trigger: "User UI Guardian Toggle" },
      outputData: { isFrozen: nextFrozenState, address: wallet.address },
      status: nextFrozenState ? "BLOCKED" : "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      isFrozen: updated.isFrozen,
      message: updated.isFrozen
        ? "🚨 Emergency Freeze is ACTIVE. All autonomous AI transactions are strictly blocked."
        : "✅ Emergency Freeze is lifted. Autonomous spending resumed under normal policy limits.",
    });
  } catch (error: any) {
    console.error("POST /api/wallet/freeze error:", error);
    return NextResponse.json({ error: error.message || "Failed to toggle freeze state" }, { status: 500 });
  }
}
