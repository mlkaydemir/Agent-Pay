import crypto from "crypto";
import { MpcShareState, ExecutionTimelineStep } from "./types";

export interface MpcSigningInput {
  walletAddress: string;
  amount: number;
  merchantName: string;
  category: string;
  aiShareGranted: boolean;
  policyShareGranted: boolean;
  userShareGranted: boolean;
  nonce: number;
}

export interface MpcSigningResult {
  state: MpcShareState;
  signatureHash?: string;
  txHash?: string;
  blockNumber?: number;
  timelineSteps: ExecutionTimelineStep[];
  isAuthorized: boolean;
}

export function simulateMpcSigning({
  walletAddress,
  amount,
  merchantName,
  category,
  aiShareGranted,
  policyShareGranted,
  userShareGranted,
  nonce,
}: MpcSigningInput): MpcSigningResult {
  const signers: string[] = [];
  if (aiShareGranted) signers.push("AI_AGENT (Autonomous Intent)");
  if (policyShareGranted) signers.push("POLICY_ENGINE (HSM Co-Signer)");
  if (userShareGranted) signers.push("USER_DEVICE (Passkey / WebAuthn)");

  const grantedCount = signers.length;
  const threshold = 2;
  const total = 3;

  const isAuthorized = grantedCount >= threshold && policyShareGranted;

  let status: MpcShareState["status"] = "PENDING_COLLECTION";
  if (!policyShareGranted) {
    status = "REJECTED_BY_POLICY";
  } else if (grantedCount >= 3) {
    status = "3_OF_3_SIGNED";
  } else if (grantedCount === 2) {
    status = "2_OF_3_SIGNED";
  } else if (!userShareGranted) {
    status = "WAITING_FOR_USER_SHARE";
  }

  const payload = {
    wallet: walletAddress,
    amount,
    merchant: merchantName,
    category,
    nonce,
    signers,
    timestamp: new Date().toISOString(),
  };

  let signatureHash: string | undefined;
  let txHash: string | undefined;
  let blockNumber: number | undefined;

  const timelineSteps: ExecutionTimelineStep[] = [
    {
      step: "MPC_SESSION_INIT",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: `2-of-3 threshold session initialized for ${walletAddress.substring(0, 10)}...`,
    },
  ];

  if (aiShareGranted) {
    timelineSteps.push({
      step: "SHARE_1_AI_AGENT",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: "AI Agent generated ephemeral signature share s₁",
    });
  }

  if (policyShareGranted) {
    timelineSteps.push({
      step: "SHARE_2_POLICY_ENGINE",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: "Policy Engine validated constraints and co-signed share s₂",
    });
  } else {
    timelineSteps.push({
      step: "SHARE_2_POLICY_ENGINE",
      status: "BLOCKED",
      timestamp: new Date().toISOString(),
      note: "Policy Engine refused co-signing due to rule violation",
    });
  }

  if (userShareGranted) {
    timelineSteps.push({
      step: "SHARE_3_USER_DEVICE",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: "User provided biometric confirmation via passkey share s₃",
    });
  }

  if (isAuthorized) {
    const rawData = JSON.stringify(payload);
    signatureHash = "0x" + crypto.createHash("sha256").update("SIG:" + rawData).digest("hex");
    txHash = "0x" + crypto.createHash("sha256").update("TX:" + signatureHash + Date.now()).digest("hex");
    blockNumber = 1048300 + Math.floor(Math.random() * 50);

    timelineSteps.push({
      step: "THRESHOLD_REACHED",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: `${grantedCount} of ${total} threshold shares validated. Aggregate Schnorr signature assembled.`,
    });

    timelineSteps.push({
      step: "BLOCKCHAIN_SETTLEMENT",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      note: `Settled on AgentPay Sandbox L2 (Block #${blockNumber})`,
    });
  } else if (!policyShareGranted) {
    timelineSteps.push({
      step: "THRESHOLD_FAILED",
      status: "BLOCKED",
      timestamp: new Date().toISOString(),
      note: "Policy Engine vetoed transaction. Quorum cannot be reached.",
    });
  } else {
    timelineSteps.push({
      step: "AWAITING_USER_SHARE",
      status: "WARNING",
      timestamp: new Date().toISOString(),
      note: "Requires 1 more signature share from user device (Approval queue).",
    });
  }

  return {
    state: {
      aiShare: aiShareGranted,
      policyShare: policyShareGranted,
      userShare: userShareGranted,
      threshold,
      total,
      status,
      signatureHash,
      signers,
    },
    signatureHash,
    txHash,
    blockNumber,
    timelineSteps,
    isAuthorized,
  };
}
