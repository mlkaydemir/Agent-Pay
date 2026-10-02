const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function generateHash(data, prevHash = "0x0000000000000000000000000000000000000000000000000000000000000000") {
  return "0x" + crypto.createHash("sha256").update(JSON.stringify(data) + prevHash).digest("hex");
}

async function main() {
  console.log("🌱 Cleaning and seeding database for AgentPay...");

  // Clean existing tables in order
  await prisma.auditLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Demo User
  const user = await prisma.user.create({
    data: {
      name: "Melike Demo User",
      email: "melike@agentpay.network",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MelikeDemo",
      role: "FOUNDER_ADMIN",
    },
  });

  // 2. Create Smart Account Sandbox Wallet
  const wallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      address: "0xAGENTPAY7F82B91A40D4038E86c52994C3dE3e8F",
      balance: 50000.0,
      currency: "TRY",
      isFrozen: false,
      network: "AgentPay Sandbox L2 (MPC-AA)",
      nonce: 3,
    },
  });

  // 3. Create Procurement AI Agent
  const agent = await prisma.agent.create({
    data: {
      userId: user.id,
      name: "Sentinel-1 Procurement Agent",
      role: "Autonomous Buyer & Policy Executor",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sentinel1",
      permissions: JSON.stringify([
        "search_products",
        "compare_products",
        "check_budget",
        "check_policy",
        "create_payment_request",
        "request_user_approval",
        "execute_payment",
        "write_audit_log"
      ]),
      isActive: true,
    },
  });

  // 4. Create Policy
  await prisma.policy.create({
    data: {
      userId: user.id,
      name: "Melike Smart Spending Shield",
      dailyLimit: 2500.0,
      singleLimit: 1000.0,
      monthlyLimit: 10000.0,
      approvalThreshold: 1000.0,
      allowedCategories: JSON.stringify([
        "Electronics",
        "Education",
        "Software",
        "Office Equipment",
        "Books"
      ]),
      blockedCategories: JSON.stringify([
        "Gambling",
        "Unknown",
        "High Risk",
        "Crypto Scams",
        "Adult"
      ]),
      allowedMerchants: JSON.stringify([
        "TechStore Demo",
        "StudentTech",
        "Campus Market",
        "Teknosa",
        "Amazon",
        "Trendyol"
      ]),
      blockedMerchants: JSON.stringify([
        "DarkShop Demo",
        "Rogue Address 0x999",
        "Untrusted Crypto Gateway"
      ]),
      requireApprovalForUnknownMerchant: true,
      autoFreezeOnRiskThreshold: 80.0,
      isStrict: true,
    },
  });

  // 5. Create Merchants
  const merchantsData = [
    {
      name: "TechStore Demo",
      slug: "techstore-demo",
      domain: "techstore.demo.internal",
      trustScore: 98,
      isVerified: true,
      isBlocked: false,
      category: "Electronics",
      address: "0x8849E2568F8A80e3A7A5405cDfa5FBE5d43aB119",
    },
    {
      name: "StudentTech",
      slug: "studenttech",
      domain: "studenttech.edu.tr",
      trustScore: 96,
      isVerified: true,
      isBlocked: false,
      category: "Education & Hardware",
      address: "0x71C9d0F4A0a34E982c448aB3D72Be406A17Ce885",
    },
    {
      name: "Campus Market",
      slug: "campus-market",
      domain: "campusmarket.internal",
      trustScore: 94,
      isVerified: true,
      isBlocked: false,
      category: "Electronics & Books",
      address: "0x4FA9B302941E5D577239CFe29C8B49b6b7F0429C",
    },
    {
      name: "Teknosa",
      slug: "teknosa",
      domain: "teknosa.com",
      trustScore: 99,
      isVerified: true,
      isBlocked: false,
      category: "Electronics",
      address: "0x12FA90c91E60a48eBD34B68007aC2337E1C59218",
    },
    {
      name: "Amazon",
      slug: "amazon",
      domain: "amazon.com.tr",
      trustScore: 99,
      isVerified: true,
      isBlocked: false,
      category: "General Commerce",
      address: "0x33A0B1c901Fe4bA87410019C8746761A49B80182",
    },
    {
      name: "Trendyol",
      slug: "trendyol",
      domain: "trendyol.com",
      trustScore: 97,
      isVerified: true,
      isBlocked: false,
      category: "General Commerce",
      address: "0x89C1a941E60a48eBD34B68007aC2337E1C592004",
    },
    {
      name: "DarkShop Demo",
      slug: "darkshop-demo",
      domain: "darkshop.onion.mock",
      trustScore: 12,
      isVerified: false,
      isBlocked: true,
      category: "Gambling",
      address: "0x666DEADC001BADC0DE8888999900000000000000",
    },
  ];

  const merchantsMap = {};
  for (const m of merchantsData) {
    const created = await prisma.merchant.create({ data: m });
    merchantsMap[m.name] = created;
  }

  // 6. Create Products
  const productsData = [
    {
      name: "TechBook Pro 16",
      description: "Yüksek performanslı mühendislik ve yazılım laptopu. 16 GB DDR5 RAM, 512 GB Gen4 SSD, Intel Core i7-13700H.",
      category: "Electronics",
      price: 28000.0,
      merchantId: merchantsMap["TechStore Demo"].id,
      ram: "16 GB DDR5",
      storage: "512 GB NVMe SSD",
      cpu: "Intel Core i7-13700H",
      score: 9.6,
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ display: "16 inch QHD 165Hz", battery: "84 Wh", weight: "1.89 kg", warranty: "2 Years" }),
    },
    {
      name: "StudentTech UltraBook 15",
      description: "Üniversite öğrencileri ve kodlama için optimize edilmiş hafif ve güçlü laptop. 16 GB LPDDR5, 512 GB SSD, AMD Ryzen 7 7730U.",
      category: "Electronics",
      price: 24500.0,
      merchantId: merchantsMap["StudentTech"].id,
      ram: "16 GB LPDDR5",
      storage: "512 GB SSD",
      cpu: "AMD Ryzen 7 7730U",
      score: 9.3,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ display: "15.6 inch FHD IPS", battery: "65 Wh", weight: "1.65 kg", warranty: "2 Years" }),
    },
    {
      name: "Campus Book 14 (Budget)",
      description: "Giriş seviyesi ders ve ofis laptopu. 8 GB RAM, 512 GB SSD, Intel Core i5-12450H.",
      category: "Electronics",
      price: 18900.0,
      merchantId: merchantsMap["Campus Market"].id,
      ram: "8 GB DDR4",
      storage: "512 GB SSD",
      cpu: "Intel Core i5-12450H",
      score: 8.7,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ display: "14 inch FHD", battery: "50 Wh", weight: "1.45 kg", warranty: "2 Years" }),
    },
    {
      name: "Anker USB-C Multiport Hub & Stand",
      description: "Dersler ve laboratuvar için 8-in-1 Type-C hub ve laptop yükseltme standı (4K HDMI, 100W PD).",
      category: "Electronics",
      price: 840.0,
      merchantId: merchantsMap["Teknosa"].id,
      ram: null,
      storage: null,
      cpu: null,
      score: 9.8,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ ports: "8-in-1", powerDelivery: "100W PD", material: "Aluminum" }),
    },
    {
      name: "Logitech MX Master 3S Ergonomic Mouse",
      description: "Ultra sessiz, 8000 DPI kablosuz ergonomik çalışma ve tasarım faresi.",
      category: "Electronics",
      price: 950.0,
      merchantId: merchantsMap["Amazon"].id,
      ram: null,
      storage: null,
      cpu: null,
      score: 9.9,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ dpi: "8000 DPI", connection: "Bluetooth / Bolt", batteryLife: "70 Days" }),
    },
    {
      name: "SanDisk Extreme 1TB Portable SSD",
      description: "Ders projeleri, datasetler ve yedekleme için 1050MB/s NVMe USB 3.2 Gen 2 harici SSD.",
      category: "Electronics",
      price: 980.0,
      merchantId: merchantsMap["Trendyol"].id,
      ram: null,
      storage: "1000 GB NVMe",
      cpu: null,
      score: 9.7,
      stock: 14,
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ speed: "1050 MB/s", protection: "IP55 Water & Dust Resistance" }),
    },
    {
      name: "JetBrains Student All-Products License",
      description: "1 yıllık tüm IDE paketleri öğrenci doğrulama ve eklenti paketi.",
      category: "Education",
      price: 450.0,
      merchantId: merchantsMap["StudentTech"].id,
      ram: null,
      storage: null,
      cpu: null,
      score: 9.5,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ validity: "1 Year", delivery: "Instant Digital Key" }),
    },
    {
      name: "DarkWeb VIP Crypto Lootbox Token",
      description: "Şüpheli kumar ve kontrolsüz token transferi.",
      category: "Gambling",
      price: 5000.0,
      merchantId: merchantsMap["DarkShop Demo"].id,
      ram: null,
      storage: null,
      cpu: null,
      score: 1.0,
      stock: 1,
      imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=60",
      specs: JSON.stringify({ risk: "CRITICAL HIGH" }),
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  // 7. Seed Sample Historical Transactions & Audit Logs
  let prevHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  // TX 1: Teknosa ₺840 (Completed)
  const tx1 = await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      agentId: agent.id,
      merchantId: merchantsMap["Teknosa"].id,
      merchantName: "Teknosa",
      amount: 840.0,
      currency: "TRY",
      category: "Electronics",
      description: "Anker USB-C Multiport Hub & Stand procurement for university setup",
      status: "COMPLETED",
      riskScore: 18,
      riskLevel: "LOW",
      policyEvaluation: JSON.stringify({
        singleLimitCheck: { passed: true, limit: 1000.0, requested: 840.0 },
        dailyLimitCheck: { passed: true, limit: 2500.0, usedToday: 840.0 },
        monthlyLimitCheck: { passed: true, limit: 10000.0, usedMonth: 1290.0 },
        categoryCheck: { passed: true, category: "Electronics", allowed: true },
        merchantCheck: { passed: true, merchant: "Teknosa", trusted: true, trustScore: 99 },
        approvalCheck: { required: true, threshold: 500.0, status: "USER_APPROVED" },
        summary: "APPROVED_WITH_MPC"
      }),
      mpcShares: JSON.stringify({
        aiShare: true,
        policyShare: true,
        userShare: true,
        threshold: 2,
        total: 3,
        status: "3_OF_3_SIGNED"
      }),
      signatureHash: "0x8fa9180c47b59e19d71c49b018593a201f84b610c85b190f84a86198be128f10",
      txHash: "0x918a245f8e34812a0149bb8a68b590c29a87d0e495213b86029d519ac904128f",
      blockNumber: 1048291,
      executionTimeline: JSON.stringify([
        { step: "INTENT_ANALYZED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: "Agent recognized laptop accessory under ₺1,000" },
        { step: "CATALOG_SEARCHED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2 + 1000).toISOString(), note: "Found Anker Hub at Teknosa (₺840)" },
        { step: "POLICY_EVALUATED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2 + 2000).toISOString(), note: "All policies satisfied. Threshold triggered due to >₺500" },
        { step: "USER_APPROVAL_GRANTED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2 + 15000).toISOString(), note: "Melike approved ₺840 via WebAuthn/Passkey" },
        { step: "MPC_SHARES_AGGREGATED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2 + 16000).toISOString(), note: "3/3 signature shares combined into Schnorr aggregate" },
        { step: "BLOCKCHAIN_SETTLED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 2 + 18000).toISOString(), note: "Settled on Sandbox Rollup Block #1048291" }
      ]),
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
  });

  // TX 2: Amazon ₺450 (Completed - Auto-approved since <= ₺500)
  const tx2 = await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      agentId: agent.id,
      merchantId: merchantsMap["Amazon"].id,
      merchantName: "Amazon",
      amount: 450.0,
      currency: "TRY",
      category: "Software",
      description: "JetBrains Educational Tools Package license renewal",
      status: "COMPLETED",
      riskScore: 12,
      riskLevel: "LOW",
      policyEvaluation: JSON.stringify({
        singleLimitCheck: { passed: true, limit: 1000.0, requested: 450.0 },
        dailyLimitCheck: { passed: true, limit: 2500.0, usedToday: 450.0 },
        categoryCheck: { passed: true, category: "Software", allowed: true },
        merchantCheck: { passed: true, merchant: "Amazon", trusted: true },
        approvalCheck: { required: false, threshold: 500.0, note: "Under threshold, auto-authorized" },
        summary: "AUTO_APPROVED"
      }),
      mpcShares: JSON.stringify({
        aiShare: true,
        policyShare: true,
        userShare: false,
        threshold: 2,
        total: 3,
        status: "2_OF_3_SIGNED"
      }),
      signatureHash: "0x12bb872fa98c7604b981ca76518a20984cfb7814981e4b86180c5874bc0981ae",
      txHash: "0x789ac01248be1094892cfa781290384759281a0e19487c65019842a8b9e10284",
      blockNumber: 1048289,
      executionTimeline: JSON.stringify([
        { step: "INTENT_ANALYZED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), note: "Agent renewed software subscription" },
        { step: "POLICY_EVALUATED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 5 + 1000).toISOString(), note: "Amount <= ₺500. 2-of-3 threshold authorized automatically." },
        { step: "MPC_SHARES_AGGREGATED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 5 + 2000).toISOString(), note: "AI Share (1/3) + Policy Share (2/3) combined" },
        { step: "BLOCKCHAIN_SETTLED", status: "SUCCESS", timestamp: new Date(Date.now() - 3600000 * 5 + 4000).toISOString(), note: "Settled on Sandbox Rollup Block #1048289" }
      ]),
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
  });

  // TX 3: Rogue Merchant ₺5,000 (Rejected)
  const tx3 = await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      agentId: agent.id,
      merchantId: merchantsMap["DarkShop Demo"].id,
      merchantName: "DarkShop Demo",
      amount: 5000.0,
      currency: "TRY",
      category: "Gambling",
      description: "Unauthorized attempt to purchase darknet mystery token",
      status: "REJECTED",
      riskScore: 96,
      riskLevel: "HIGH",
      policyEvaluation: JSON.stringify({
        singleLimitCheck: { passed: false, limit: 1000.0, requested: 5000.0, reason: "Exceeds single transaction limit of ₺1,000" },
        dailyLimitCheck: { passed: false, limit: 2500.0, requested: 5000.0, reason: "Exceeds daily spending limit" },
        categoryCheck: { passed: false, category: "Gambling", reason: "Category is strictly blocked by user policy" },
        merchantCheck: { passed: false, merchant: "DarkShop Demo", reason: "Merchant is blacklisted / Untrusted (Trust score 12/100)" },
        summary: "POLICY_VIOLATION_BLOCKED"
      }),
      mpcShares: JSON.stringify({
        aiShare: true,
        policyShare: false,
        userShare: false,
        threshold: 2,
        total: 3,
        status: "FAILED_POLICY_REFUSED_SIGNATURE"
      }),
      failureReason: "CRITICAL: Category 'Gambling' blocked, Merchant untrusted, and amount (₺5,000) exceeds single transaction limit (₺1,000).",
      executionTimeline: JSON.stringify([
        { step: "INTENT_ANALYZED", status: "WARNING", timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), note: "AI attempted to process untrusted payment request" },
        { step: "POLICY_ENGINE_INTERCEPT", status: "BLOCKED", timestamp: new Date(Date.now() - 3600000 * 8 + 500).toISOString(), note: "Policy Engine refused to sign. Share 2/3 DENIED." },
        { step: "RISK_ENGINE_ALERT", status: "BLOCKED", timestamp: new Date(Date.now() - 3600000 * 8 + 1000).toISOString(), note: "High risk score (96/100) triggered automatic transaction shutdown" }
      ]),
      createdAt: new Date(Date.now() - 3600000 * 8),
    },
  });

  // TX 4: Pending Laptop Purchase ₺28,000 (Approval Required)
  const tx4 = await prisma.transaction.create({
    data: {
      walletId: wallet.id,
      agentId: agent.id,
      merchantId: merchantsMap["TechStore Demo"].id,
      merchantName: "TechStore Demo",
      amount: 28000.0,
      currency: "TRY",
      category: "Electronics",
      description: "TechBook Pro 16 purchase requested for university engineering workload",
      status: "APPROVAL_REQUIRED",
      riskScore: 45,
      riskLevel: "MEDIUM",
      policyEvaluation: JSON.stringify({
        singleLimitCheck: { passed: false, limit: 1000.0, requested: 28000.0, note: "Exceeds standard ₺1,000 single limit -> Escalates to User Multi-Sig Approval" },
        categoryCheck: { passed: true, category: "Electronics", allowed: true },
        merchantCheck: { passed: true, merchant: "TechStore Demo", trusted: true, trustScore: 98 },
        approvalCheck: { required: true, status: "AWAITING_USER_CONFIRMATION" },
        summary: "REQUIRES_USER_APPROVAL"
      }),
      mpcShares: JSON.stringify({
        aiShare: true,
        policyShare: true,
        userShare: false,
        threshold: 2,
        total: 3,
        status: "WAITING_FOR_USER_SHARE"
      }),
      executionTimeline: JSON.stringify([
        { step: "INTENT_ANALYZED", status: "SUCCESS", timestamp: new Date(Date.now() - 900000).toISOString(), note: "User asked for laptop under 30.000 TL with ≥16GB RAM" },
        { step: "CATALOG_MATCHED", status: "SUCCESS", timestamp: new Date(Date.now() - 890000).toISOString(), note: "Selected TechBook Pro 16 (₺28,000, 9.6 Score)" },
        { step: "POLICY_ESCALATION", status: "WARNING", timestamp: new Date(Date.now() - 880000).toISOString(), note: "Exceeds ₺1,000 single limit -> Dispatched to User Approval Queue" }
      ]),
      createdAt: new Date(Date.now() - 900000),
    },
  });

  // Create Approval for TX 4
  await prisma.approval.create({
    data: {
      transactionId: tx4.id,
      status: "PENDING",
      reason: "Matches your laptop criteria (16GB RAM, 512GB SSD, Core i7) and is within your specified ₺30,000 search target. Requires manual authorization because ₺28,000 exceeds the ₺1,000 single transaction auto-spend policy.",
      approverName: "Melike Demo User",
    },
  });

  // 8. Create Immutable-style Audit Logs
  const auditEntries = [
    {
      action: "AGENT_INITIALIZED",
      toolName: "system_init",
      status: "SUCCESS",
      inputData: JSON.stringify({ agent: "Sentinel-1", owner: "Melike Demo" }),
      outputData: JSON.stringify({ status: "ACTIVE", permissionsLocked: true }),
      timestamp: new Date(Date.now() - 3600000 * 24),
    },
    {
      action: "POLICY_CONFIG_UPDATED",
      toolName: "policy_manager",
      status: "SUCCESS",
      inputData: JSON.stringify({ dailyLimit: 2500, singleLimit: 1000, approvalThreshold: 1000 }),
      outputData: JSON.stringify({ version: "1.0", verified: true }),
      timestamp: new Date(Date.now() - 3600000 * 20),
    },
    {
      action: "POLICY_VIOLATION_BLOCKED",
      toolName: "policy_enforcer",
      status: "BLOCKED",
      inputData: JSON.stringify({ amount: 5000, merchant: "DarkShop Demo", category: "Gambling" }),
      outputData: JSON.stringify({ blockedReasons: ["CATEGORY_BLOCKED", "MERCHANT_UNTRUSTED", "LIMIT_EXCEEDED"] }),
      timestamp: new Date(Date.now() - 3600000 * 8),
      transactionId: tx3.id,
    },
    {
      action: "SEARCH_CATALOG",
      toolName: "search_products",
      status: "SUCCESS",
      inputData: JSON.stringify({ query: "laptop accessory under 1000 TL", category: "Electronics" }),
      outputData: JSON.stringify({ count: 3, topPick: "Anker USB-C Multiport Hub & Stand (₺840)" }),
      timestamp: new Date(Date.now() - 3600000 * 2 - 20000),
    },
    {
      action: "EVALUATE_POLICY",
      toolName: "check_policy",
      status: "SUCCESS",
      inputData: JSON.stringify({ amount: 840, merchant: "Teknosa", category: "Electronics" }),
      outputData: JSON.stringify({ passed: true, requiresApproval: false, reason: "Amount ₺840 within ₺1000 limit" }),
      timestamp: new Date(Date.now() - 3600000 * 2 - 18000),
      transactionId: tx1.id,
    },
    {
      action: "MPC_SIGNATURE_AGGREGATION",
      toolName: "mpc_threshold_signer",
      status: "SUCCESS",
      inputData: JSON.stringify({ requiredShares: 2, providedShares: ["AI_AGENT", "POLICY_ENGINE", "USER_DEVICE"] }),
      outputData: JSON.stringify({ aggregateSignature: "0x8fa9180c47b59e19d71c49b018593a201f84b610c85b190f84a86198be128f10", status: "VALID" }),
      timestamp: new Date(Date.now() - 3600000 * 2),
      transactionId: tx1.id,
    },
    {
      action: "APPROVAL_REQUEST_CREATED",
      toolName: "request_user_approval",
      status: "WARNING",
      inputData: JSON.stringify({ amount: 28000, product: "TechBook Pro 16", merchant: "TechStore Demo" }),
      outputData: JSON.stringify({ approvalId: "pending", queuePosition: 1 }),
      timestamp: new Date(Date.now() - 900000),
      transactionId: tx4.id,
    },
  ];

  for (const entry of auditEntries) {
    const oldHash = prevHash;
    prevHash = generateHash(entry, oldHash);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        agentId: agent.id,
        transactionId: entry.transactionId || null,
        action: entry.action,
        toolName: entry.toolName,
        inputData: entry.inputData,
        outputData: entry.outputData,
        status: entry.status,
        timestamp: entry.timestamp,
        previousHash: oldHash,
        hash: prevHash,
      },
    });
  }

  console.log("✅ Seed completed successfully with demo user, policies, products, merchants, transactions, and audit logs!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
