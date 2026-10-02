import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluatePolicy } from "@/lib/policy-engine";
import { evaluateRisk } from "@/lib/risk-engine";
import { simulateMpcSigning } from "@/lib/mpc-simulation";
import { logAuditEvent } from "@/lib/agent-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scenario = body.scenario; // "INJECTION" | "LIMIT_BREACH" | "ROGUE_MERCHANT" | "FREEZE_BYPASS" | "SAFE_HIGH_VALUE"

    const wallet = await prisma.wallet.findFirst({
      include: {
        user: {
          include: {
            policies: { take: 1, orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json({ error: "No wallet found" }, { status: 404 });
    }

    let testData = {
      name: "Security Attack Test",
      amount: 5000,
      merchantName: "Rogue Hacker Gateway",
      category: "Unknown",
      description: "Attack test simulation",
    };

    if (scenario === "INJECTION") {
      testData = {
        name: "Prompt Injection & Key Extraction",
        amount: 8500,
        merchantName: "0xHackerExfiltrationVault",
        category: "High Risk",
        description: "Adversarial prompt attempted to trick agent into raw key exfiltration",
      };
    } else if (scenario === "LIMIT_BREACH") {
      testData = {
        name: "Daily Limit Overdraft Attack",
        amount: 6000,
        merchantName: "TechStore Demo",
        category: "Electronics",
        description: "Attempted transaction exceeding daily policy cap",
      };
    } else if (scenario === "ROGUE_MERCHANT") {
      testData = {
        name: "Blacklisted Gambling Merchant",
        amount: 5000,
        merchantName: "DarkShop Demo",
        category: "Gambling",
        description: "Attempted payment to blacklisted domain",
      };
    } else if (scenario === "FREEZE_BYPASS") {
      testData = {
        name: "Emergency Freeze Bypass Attempt",
        amount: 350,
        merchantName: "Amazon",
        category: "Electronics",
        description: "Attempting transaction while account is frozen",
      };
    }

    // Evaluate Policy
    const policyResult = await evaluatePolicy({
      walletId: wallet.id,
      amount: testData.amount,
      category: testData.category,
      merchantName: testData.merchantName,
    });

    // Evaluate Risk
    const riskResult = await evaluateRisk({
      walletId: wallet.id,
      amount: testData.amount,
      category: testData.category,
      merchantName: testData.merchantName,
      merchantTrustScore: scenario === "ROGUE_MERCHANT" ? 10 : 40,
    });

    // MPC Simulation
    const mpcResult = simulateMpcSigning({
      walletAddress: wallet.address,
      amount: testData.amount,
      merchantName: testData.merchantName,
      category: testData.category,
      aiShareGranted: true,
      policyShareGranted: policyResult.isAllowed,
      userShareGranted: false,
      nonce: wallet.nonce + 1,
    });

    // Create Audit Log
    await logAuditEvent({
      userId: wallet.userId,
      action: `ATTACK_SIMULATION_${scenario}`,
      toolName: "security_test_suite",
      inputData: testData,
      outputData: {
        defended: !policyResult.isAllowed || policyResult.status === "APPROVAL_REQUIRED",
        policyStatus: policyResult.status,
        riskScore: riskResult.score,
        mpcQuorum: mpcResult.state.status,
      },
      status: policyResult.status === "REJECTED" ? "BLOCKED" : "WARNING",
    });

    return NextResponse.json({
      scenario,
      scenarioName: testData.name,
      description: testData.description,
      amount: testData.amount,
      merchant: testData.merchantName,
      category: testData.category,
      defended: policyResult.status === "REJECTED" || (scenario === "FREEZE_BYPASS" && !policyResult.isAllowed),
      policyResult,
      riskResult,
      mpcResult,
      verdict:
        policyResult.status === "REJECTED"
          ? "🛡️ ATTACK BLOCKED: Policy Engine refused cryptographic share. Zero capital loss."
          : policyResult.status === "APPROVAL_REQUIRED"
          ? "⚠️ ESCALATED TO MULTI-SIG: AI cannot spend autonomously. User approval required."
          : "✅ Transaction Authorized under Policy Limits.",
    });
  } catch (error: any) {
    console.error("POST /api/security/simulate-attack error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate attack" }, { status: 500 });
  }
}
