import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/agent-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const policy = await prisma.policy.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!policy) {
      return NextResponse.json({ error: "No policy found" }, { status: 404 });
    }

    return NextResponse.json({
      ...policy,
      allowedCategories: JSON.parse(policy.allowedCategories || "[]"),
      blockedCategories: JSON.parse(policy.blockedCategories || "[]"),
      allowedMerchants: JSON.parse(policy.allowedMerchants || "[]"),
      blockedMerchants: JSON.parse(policy.blockedMerchants || "[]"),
    });
  } catch (error: any) {
    console.error("GET /api/policies error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch policy" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const policy = await prisma.policy.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!policy) {
      return NextResponse.json({ error: "No policy found to update" }, { status: 404 });
    }

    const updated = await prisma.policy.update({
      where: { id: policy.id },
      data: {
        dailyLimit: typeof body.dailyLimit === "number" ? body.dailyLimit : policy.dailyLimit,
        singleLimit: typeof body.singleLimit === "number" ? body.singleLimit : policy.singleLimit,
        monthlyLimit: typeof body.monthlyLimit === "number" ? body.monthlyLimit : policy.monthlyLimit,
        approvalThreshold:
          typeof body.approvalThreshold === "number" ? body.approvalThreshold : policy.approvalThreshold,
        allowedCategories: Array.isArray(body.allowedCategories)
          ? JSON.stringify(body.allowedCategories)
          : policy.allowedCategories,
        blockedCategories: Array.isArray(body.blockedCategories)
          ? JSON.stringify(body.blockedCategories)
          : policy.blockedCategories,
        allowedMerchants: Array.isArray(body.allowedMerchants)
          ? JSON.stringify(body.allowedMerchants)
          : policy.allowedMerchants,
        blockedMerchants: Array.isArray(body.blockedMerchants)
          ? JSON.stringify(body.blockedMerchants)
          : policy.blockedMerchants,
        requireApprovalForUnknownMerchant:
          typeof body.requireApprovalForUnknownMerchant === "boolean"
            ? body.requireApprovalForUnknownMerchant
            : policy.requireApprovalForUnknownMerchant,
        autoFreezeOnRiskThreshold:
          typeof body.autoFreezeOnRiskThreshold === "number"
            ? body.autoFreezeOnRiskThreshold
            : policy.autoFreezeOnRiskThreshold,
        isStrict: typeof body.isStrict === "boolean" ? body.isStrict : policy.isStrict,
      },
    });

    await logAuditEvent({
      userId: policy.userId,
      action: "POLICY_CONFIG_UPDATED",
      toolName: "policy_manager",
      inputData: body,
      outputData: { policyId: updated.id, timestamp: updated.updatedAt },
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Spending policy successfully updated and active on chain.",
      policy: {
        ...updated,
        allowedCategories: JSON.parse(updated.allowedCategories),
        blockedCategories: JSON.parse(updated.blockedCategories),
        allowedMerchants: JSON.parse(updated.allowedMerchants),
        blockedMerchants: JSON.parse(updated.blockedMerchants),
      },
    });
  } catch (error: any) {
    console.error("PUT /api/policies error:", error);
    return NextResponse.json({ error: error.message || "Failed to update policy" }, { status: 500 });
  }
}
