import { RiskEvaluationResult, RiskLevel } from "./types";
import { prisma } from "./prisma";

export interface RiskParams {
  amount: number;
  category: string;
  merchantName: string;
  merchantTrustScore?: number;
  walletId: string;
}

export async function evaluateRisk({
  amount,
  category,
  merchantName,
  merchantTrustScore = 95,
  walletId,
}: RiskParams): Promise<RiskEvaluationResult> {
  let score = 10; // Baseline low risk

  // 1. Amount Risk (0 - 35 points)
  let amountRisk = 5;
  if (amount > 20000) {
    amountRisk = 35;
  } else if (amount > 10000) {
    amountRisk = 25;
  } else if (amount > 2500) {
    amountRisk = 18;
  } else if (amount > 1000) {
    amountRisk = 12;
  }

  // 2. Merchant Risk (0 - 40 points)
  let merchantRisk = 5;
  const merchantRecord = await prisma.merchant.findFirst({
    where: { name: { equals: merchantName } },
  });

  const effectiveTrustScore = merchantRecord ? merchantRecord.trustScore : merchantTrustScore;

  if (effectiveTrustScore < 40) {
    merchantRisk = 40;
  } else if (effectiveTrustScore < 75) {
    merchantRisk = 25;
  } else if (effectiveTrustScore < 90) {
    merchantRisk = 12;
  } else {
    merchantRisk = 3;
  }

  // 3. Category Risk (0 - 25 points)
  let categoryRisk = 5;
  const highRiskCategories = ["gambling", "crypto scams", "unknown", "high risk", "adult"];
  const mediumRiskCategories = ["unclassified", "general gift cards", "overseas wire"];

  const catLower = category.toLowerCase();
  if (highRiskCategories.some((c) => catLower.includes(c))) {
    categoryRisk = 25;
  } else if (mediumRiskCategories.some((c) => catLower.includes(c))) {
    categoryRisk = 15;
  } else {
    categoryRisk = 2;
  }

  // 4. Velocity Risk (0 - 15 points)
  // Check transaction frequency in the last 10 minutes
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentCount = await prisma.transaction.count({
    where: {
      walletId,
      createdAt: { gte: tenMinutesAgo },
    },
  });

  let velocityRisk = 2;
  if (recentCount > 5) {
    velocityRisk = 15;
  } else if (recentCount > 2) {
    velocityRisk = 8;
  }

  // Total raw score
  score = Math.min(100, Math.max(5, amountRisk + merchantRisk + categoryRisk + velocityRisk));

  let level: RiskLevel = "LOW";
  if (score >= 71) {
    level = "HIGH";
  } else if (score >= 31) {
    level = "MEDIUM";
  } else {
    level = "LOW";
  }

  let description = "";
  if (level === "HIGH") {
    description = "High risk profile detected due to untrusted merchant, blocked category, or abnormal velocity.";
  } else if (level === "MEDIUM") {
    description = "Moderate risk profile. High monetary value or unverified merchant warrants user co-signature.";
  } else {
    description = "Low risk profile. Verified merchant, compliant category, and normal velocity.";
  }

  return {
    score,
    level,
    factors: {
      amountRisk,
      merchantRisk,
      categoryRisk,
      velocityRisk,
    },
    description,
  };
}
