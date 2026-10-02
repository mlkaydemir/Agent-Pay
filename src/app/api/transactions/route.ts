import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toolProcessPayment } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        merchant: true,
        approval: true,
      },
    });

    const parsed = transactions.map((t) => ({
      ...t,
      policyEvaluation: t.policyEvaluation ? JSON.parse(t.policyEvaluation) : null,
      mpcShares: t.mpcShares ? JSON.parse(t.mpcShares) : null,
      executionTimeline: t.executionTimeline ? JSON.parse(t.executionTimeline) : [],
    }));

    return NextResponse.json({ transactions: parsed });
  } catch (error: any) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const wallet = await prisma.wallet.findFirst();

    if (!wallet) {
      return NextResponse.json({ error: "No wallet found" }, { status: 404 });
    }

    const result = await toolProcessPayment({
      walletId: wallet.id,
      productId: body.productId,
      customAmount: body.amount,
      customMerchantName: body.merchantName,
      customCategory: body.category,
      description: body.description,
    });

    return NextResponse.json({
      success: true,
      transaction: {
        ...result.transaction,
        policyEvaluation: JSON.parse(result.transaction.policyEvaluation || "{}"),
        mpcShares: JSON.parse(result.transaction.mpcShares || "{}"),
        executionTimeline: JSON.parse(result.transaction.executionTimeline || "[]"),
      },
      policyResult: result.policyResult,
      riskResult: result.riskResult,
      mpcResult: result.mpcResult,
    });
  } catch (error: any) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json({ error: error.message || "Transaction creation failed" }, { status: 500 });
  }
}
