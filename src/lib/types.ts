export type TransactionStatus =
  | "PENDING"
  | "APPROVAL_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "FAILED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface PolicyCheckItem {
  name: string;
  passed: boolean;
  limit?: number;
  actual?: number | string;
  reason?: string;
  isWarning?: boolean;
}

export interface PolicyEvaluationResult {
  status: "APPROVED" | "APPROVAL_REQUIRED" | "REJECTED";
  isAllowed: boolean;
  requiresUserApproval: boolean;
  reasons: string[];
  passedChecks: string[];
  failedChecks: string[];
  checks: {
    emergencyFreeze: PolicyCheckItem;
    singleLimit: PolicyCheckItem;
    dailyLimit: PolicyCheckItem;
    monthlyLimit: PolicyCheckItem;
    categoryCheck: PolicyCheckItem;
    merchantCheck: PolicyCheckItem;
    approvalThreshold: PolicyCheckItem;
  };
  summaryText: string;
}

export interface RiskEvaluationResult {
  score: number; // 0-100
  level: RiskLevel;
  factors: {
    amountRisk: number;
    merchantRisk: number;
    categoryRisk: number;
    velocityRisk: number;
  };
  description: string;
}

export interface MpcShareState {
  aiShare: boolean;
  policyShare: boolean;
  userShare: boolean;
  threshold: number;
  total: number;
  status:
    | "PENDING_COLLECTION"
    | "2_OF_3_SIGNED"
    | "3_OF_3_SIGNED"
    | "WAITING_FOR_USER_SHARE"
    | "REJECTED_BY_POLICY"
    | "REJECTED_BY_USER";
  signatureHash?: string;
  signers: string[];
}

export interface ExecutionTimelineStep {
  step: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED" | "PENDING";
  timestamp: string;
  note: string;
  details?: Record<string, any>;
}

export interface AgentProductMatch {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  merchantName: string;
  merchantTrustScore: number;
  ram?: string | null;
  storage?: string | null;
  cpu?: string | null;
  score: number;
  imageUrl?: string | null;
  specs?: Record<string, any>;
  matchReason?: string;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    tool?: string;
    status: "RUNNING" | "COMPLETED" | "BLOCKED" | "FAILED";
    input?: any;
    output?: any;
  }>;
  thoughtTrace?: Array<{
    name: string;
    tool: string;
    status: "RUNNING" | "COMPLETED" | "BLOCKED" | "FAILED";
    input?: any;
    output?: any;
  }>;
  actionTrace?: Array<{
    name: string;
    tool: string;
    status: "RUNNING" | "COMPLETED" | "BLOCKED" | "FAILED";
    input?: any;
    output?: any;
  }>;
  transaction?: any;
  mpcShares?: any;
  policyEvaluation?: any;
  products?: AgentProductMatch[];
  paymentRequest?: {
    productId?: string;
    productName: string;
    amount: number;
    merchantName: string;
    category: string;
    policyStatus: "APPROVED" | "APPROVAL_REQUIRED" | "REJECTED";
    riskScore: number;
    transactionId?: string;
    reasons: string[];
  };
}

