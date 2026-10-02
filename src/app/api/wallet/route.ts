import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let user = await prisma.user.findFirst({
      include: {
        wallet: true,
        policies: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });

    if (!user || !user.wallet) {
      return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayTxs = await prisma.transaction.findMany({
      where: {
        walletId: user.wallet.id,
        status: { in: ["COMPLETED", "APPROVED"] },
        createdAt: { gte: startOfToday },
      },
    });

    const todaySpent = todayTxs.reduce((sum, tx) => sum + tx.amount, 0);

    const pendingApprovalsCount = await prisma.approval.count({
      where: { status: "PENDING" },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      wallet: {
        id: user.wallet.id,
        address: user.wallet.address,
        balance: user.wallet.balance,
        currency: user.wallet.currency,
        isFrozen: user.wallet.isFrozen,
        network: user.wallet.network,
        nonce: user.wallet.nonce,
        todaySpent,
        pendingApprovalsCount,
      },
      activePolicy: user.policies[0] || null,
    });
  } catch (error: any) {
    console.error("GET /api/wallet error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch wallet" }, { status: 500 });
  }
}
