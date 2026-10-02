import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        wallet: true,
        merchant: true,
        agent: true,
        approval: true,
        auditLogs: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({
      transaction: {
        ...transaction,
        policyEvaluation: transaction.policyEvaluation ? JSON.parse(transaction.policyEvaluation) : null,
        mpcShares: transaction.mpcShares ? JSON.parse(transaction.mpcShares) : null,
        executionTimeline: transaction.executionTimeline ? JSON.parse(transaction.executionTimeline) : [],
      },
    });
  } catch (error: any) {
    console.error(`GET /api/transactions/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || "Failed to fetch transaction details" }, { status: 500 });
  }
}
