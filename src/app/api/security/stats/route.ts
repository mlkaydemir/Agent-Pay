import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalTransactions = await prisma.transaction.count();
    const completedTransactions = await prisma.transaction.count({
      where: { status: "COMPLETED" },
    });
    const blockedTransactions = await prisma.transaction.count({
      where: { status: "REJECTED" },
    });
    const pendingApprovals = await prisma.approval.count({
      where: { status: "PENDING" },
    });

    const wallet = await prisma.wallet.findFirst({
      include: {
        user: {
          include: {
            policies: { take: 1, orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    const recentAlerts = await prisma.auditLog.findMany({
      where: {
        status: { in: ["BLOCKED", "WARNING"] },
      },
      orderBy: { timestamp: "desc" },
      take: 6,
      include: { transaction: true },
    });

    // Compute live Security Score
    let securityScore = 98;
    if (wallet?.isFrozen) {
      securityScore = 100; // Total lockdown
    } else {
      if (blockedTransactions > 10) securityScore -= 2;
    }

    return NextResponse.json({
      securityScore,
      totalTransactions,
      completedTransactions,
      blockedTransactions,
      pendingApprovals,
      wallet: {
        address: wallet?.address,
        isFrozen: wallet?.isFrozen,
        network: wallet?.network,
      },
      policy: wallet?.user?.policies[0]
        ? {
            dailyLimit: wallet.user.policies[0].dailyLimit,
            singleLimit: wallet.user.policies[0].singleLimit,
            approvalThreshold: wallet.user.policies[0].approvalThreshold,
            isStrict: wallet.user.policies[0].isStrict,
          }
        : null,
      recentAlerts,
    });
  } catch (error: any) {
    console.error("GET /api/security/stats error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch security stats" }, { status: 500 });
  }
}
