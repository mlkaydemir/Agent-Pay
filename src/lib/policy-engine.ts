import { prisma } from "./prisma";
import { PolicyEvaluationResult } from "./types";

export interface PolicyCheckParams {
  walletId: string;
  amount: number;
  category: string;
  merchantName: string;
  isUnknownMerchant?: boolean;
}

export async function evaluatePolicy({
  walletId,
  amount,
  category,
  merchantName,
  isUnknownMerchant = false,
}: PolicyCheckParams): Promise<PolicyEvaluationResult> {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    include: {
      user: {
        include: {
          policies: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!wallet || !wallet.user || wallet.user.policies.length === 0) {
    throw new Error("Wallet or active policy not found for policy evaluation.");
  }

  const policy = wallet.user.policies[0];

  // Parse policy lists
  const allowedCategories: string[] = JSON.parse(policy.allowedCategories || "[]");
  const blockedCategories: string[] = JSON.parse(policy.blockedCategories || "[]");
  const allowedMerchants: string[] = JSON.parse(policy.allowedMerchants || "[]");
  const blockedMerchants: string[] = JSON.parse(policy.blockedMerchants || "[]");

  // Calculate today's spending
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayTransactions = await prisma.transaction.findMany({
    where: {
      walletId: wallet.id,
      status: { in: ["COMPLETED", "APPROVED"] },
      createdAt: { gte: startOfToday },
    },
  });
  const todaySpent = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate month's spending
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthTransactions = await prisma.transaction.findMany({
    where: {
      walletId: wallet.id,
      status: { in: ["COMPLETED", "APPROVED"] },
      createdAt: { gte: startOfMonth },
    },
  });
  const monthSpent = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Initialize checks
  const reasons: string[] = [];
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];

  // 1. Emergency Freeze Check
  const emergencyFreezePassed = !wallet.isFrozen;
  if (!emergencyFreezePassed) {
    failedChecks.push("EMERGENCY_FREEZE_ACTIVE");
    reasons.push("🚨 Smart Account is currently in Emergency Freeze mode. All AI transactions are blocked.");
  } else {
    passedChecks.push("EMERGENCY_FREEZE_INACTIVE");
  }

  // 2. Blocked Category Check
  const isCategoryBlocked = blockedCategories.some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  const isCategoryAllowed = allowedCategories.some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );

  const categoryPassed = !isCategoryBlocked && (allowedCategories.length === 0 || isCategoryAllowed);
  if (isCategoryBlocked) {
    failedChecks.push("BLOCKED_CATEGORY");
    reasons.push(`❌ Category "${category}" is strictly blocked by your spending policy.`);
  } else if (!isCategoryAllowed && allowedCategories.length > 0) {
    failedChecks.push("UNLISTED_CATEGORY");
    reasons.push(`⚠️ Category "${category}" is not in your allowed whitelist.`);
  } else {
    passedChecks.push("CATEGORY_ALLOWED");
    reasons.push(`✓ Category "${category}" is verified and permitted.`);
  }

  // 3. Blocked / Allowed Merchant Check
  const isMerchantBlocked = blockedMerchants.some(
    (m) => m.toLowerCase() === merchantName.toLowerCase()
  );
  const isMerchantAllowed = allowedMerchants.some(
    (m) => m.toLowerCase() === merchantName.toLowerCase()
  );

  const merchantPassed = !isMerchantBlocked;
  if (isMerchantBlocked) {
    failedChecks.push("BLOCKED_MERCHANT");
    reasons.push(`❌ Merchant "${merchantName}" is blacklisted / high-risk.`);
  } else if (!isMerchantAllowed) {
    if (isUnknownMerchant || policy.requireApprovalForUnknownMerchant) {
      reasons.push(`⚠️ Merchant "${merchantName}" is not on your pre-approved whitelist (Requires approval).`);
    } else {
      passedChecks.push("MERCHANT_ACCEPTABLE");
    }
  } else {
    passedChecks.push("MERCHANT_ALLOWED");
    reasons.push(`✓ Merchant "${merchantName}" is on your trusted whitelist.`);
  }

  // 4. Single Limit Check
  const singleLimitPassed = amount <= policy.singleLimit;
  if (!singleLimitPassed) {
    reasons.push(`⚠️ Amount (₺${amount.toLocaleString()}) exceeds single transaction auto-limit of ₺${policy.singleLimit.toLocaleString()}.`);
  } else {
    passedChecks.push("SINGLE_LIMIT_OK");
    reasons.push(`✓ Amount (₺${amount.toLocaleString()}) is within single transaction limit (₺${policy.singleLimit.toLocaleString()}).`);
  }

  // 5. Daily Limit Check
  const dailyLimitPassed = todaySpent + amount <= policy.dailyLimit;
  if (!dailyLimitPassed) {
    failedChecks.push("DAILY_LIMIT_EXCEEDED");
    reasons.push(`❌ Transaction would exceed daily budget. Spent today: ₺${todaySpent.toLocaleString()} / Limit: ₺${policy.dailyLimit.toLocaleString()}.`);
  } else {
    passedChecks.push("DAILY_LIMIT_OK");
    reasons.push(`✓ Daily budget available. Remaining: ₺${(policy.dailyLimit - todaySpent - amount).toLocaleString()}.`);
  }

  // 6. Monthly Limit Check
  const monthlyLimitPassed = monthSpent + amount <= policy.monthlyLimit;
  if (!monthlyLimitPassed) {
    failedChecks.push("MONTHLY_LIMIT_EXCEEDED");
    reasons.push(`❌ Monthly budget limit of ₺${policy.monthlyLimit.toLocaleString()} exceeded.`);
  } else {
    passedChecks.push("MONTHLY_LIMIT_OK");
  }

  // 7. Approval Threshold Check
  const requiresThresholdApproval = amount > policy.approvalThreshold;
  if (requiresThresholdApproval) {
    reasons.push(`ℹ️ Amount (₺${amount.toLocaleString()}) exceeds approval threshold (₺${policy.approvalThreshold.toLocaleString()}) -> User Multi-Sig confirmation requested.`);
  } else {
    passedChecks.push("AUTO_THRESHOLD_OK");
    reasons.push(`✓ Amount is within autonomous threshold (≤ ₺${policy.approvalThreshold.toLocaleString()}).`);
  }

  // Determine final status
  // Hard Rejections: Emergency Freeze active, Category blacklisted, Merchant blacklisted
  const isHardReject =
    !emergencyFreezePassed ||
    isCategoryBlocked ||
    isMerchantBlocked;

  let finalStatus: "APPROVED" | "APPROVAL_REQUIRED" | "REJECTED" = "APPROVED";

  if (isHardReject) {
    finalStatus = "REJECTED";
  } else if (!singleLimitPassed || !dailyLimitPassed || !monthlyLimitPassed || !isMerchantAllowed || requiresThresholdApproval) {
    finalStatus = "APPROVAL_REQUIRED";
  } else {
    finalStatus = "APPROVED";
  }

  const result: PolicyEvaluationResult = {
    status: finalStatus,
    isAllowed: finalStatus !== "REJECTED",
    requiresUserApproval: finalStatus === "APPROVAL_REQUIRED",
    reasons,
    passedChecks,
    failedChecks,
    checks: {
      emergencyFreeze: {
        name: "Emergency Freeze Check",
        passed: emergencyFreezePassed,
        actual: wallet.isFrozen ? "FROZEN" : "ACTIVE",
        reason: wallet.isFrozen ? "Account frozen by user" : "Account active",
      },
      singleLimit: {
        name: "Single Transaction Limit",
        passed: singleLimitPassed,
        limit: policy.singleLimit,
        actual: amount,
        reason: singleLimitPassed ? "Passed" : "Exceeds auto-limit",
      },
      dailyLimit: {
        name: "Daily Spending Limit",
        passed: dailyLimitPassed,
        limit: policy.dailyLimit,
        actual: todaySpent + amount,
        reason: dailyLimitPassed ? `Remaining ₺${policy.dailyLimit - todaySpent - amount}` : "Exceeded",
      },
      monthlyLimit: {
        name: "Monthly Spending Limit",
        passed: monthlyLimitPassed,
        limit: policy.monthlyLimit,
        actual: monthSpent + amount,
      },
      categoryCheck: {
        name: "Category Policy",
        passed: categoryPassed,
        actual: category,
        reason: isCategoryBlocked ? "Category blocked" : "Category permitted",
      },
      merchantCheck: {
        name: "Merchant Trust Policy",
        passed: merchantPassed,
        actual: merchantName,
        reason: isMerchantBlocked ? "Blacklisted" : isMerchantAllowed ? "Whitelisted" : "Unknown merchant",
      },
      approvalThreshold: {
        name: "Autonomous Approval Threshold",
        passed: !requiresThresholdApproval,
        limit: policy.approvalThreshold,
        actual: amount,
        reason: requiresThresholdApproval ? "Requires user signature" : "Autonomous 2/3 MPC pass",
      },
    },
    summaryText:
      finalStatus === "APPROVED"
        ? "All policy parameters satisfied. 2-of-3 MPC threshold signature authorized."
        : finalStatus === "APPROVAL_REQUIRED"
        ? "Policy passed with elevated risk or limit excess. Dispatched to user approval queue."
        : "Policy Engine blocked transaction due to policy or risk violation.",
  };

  return result;
}
