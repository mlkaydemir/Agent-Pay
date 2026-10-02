import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const approvals = await prisma.approval.findMany({
      orderBy: { requestedAt: "desc" },
      include: {
        transaction: {
          include: {
            merchant: true,
            wallet: true,
          },
        },
      },
    });

    const parsed = approvals.map((a) => ({
      ...a,
      transaction: {
        ...a.transaction,
        policyEvaluation: a.transaction.policyEvaluation
          ? JSON.parse(a.transaction.policyEvaluation)
          : null,
        mpcShares: a.transaction.mpcShares ? JSON.parse(a.transaction.mpcShares) : null,
        executionTimeline: a.transaction.executionTimeline
          ? JSON.parse(a.transaction.executionTimeline)
          : [],
      },
    }));

    return NextResponse.json({ approvals: parsed });
  } catch (error: any) {
    console.error("GET /api/approvals error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch approvals" }, { status: 500 });
  }
}
