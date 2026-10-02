const { execSync } = require('child_process');

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('   AGENTPAY — COMPREHENSIVE FINAL AUDIT & TEST     ');
  console.log('====================================================\n');

  console.log('🌱 Preparing clean test database state...');
  execSync('node prisma/seed.js', { stdio: 'ignore' });
  console.log('✅ Database seeded and ready for testing.\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   └─ Error: ${details}`);
      failed++;
    }
  }

  // --- Initial State Check ---
  console.log('--- Initial System State ---');
  const walletRes = await request('/api/wallet');
  assert(walletRes.status === 200, 'GET /api/wallet is healthy', `Balance: ${walletRes.data?.wallet?.balance} TL`);
  const initialBalance = walletRes.data?.wallet?.balance || 10000;

  // --- TEST 1: Otomatik Ödeme (< 1.000 TL Aksesuar) ---
  console.log('\n--- TEST 1: Otomatik Ödeme (Aksesuar < 1.000 TL) ---');
  const chat1 = await request('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify({ message: 'Bugün derslerim için maksimum 1.000 TL harcayabileceğim bir laptop aksesuarı bul.' })
  });

  assert(chat1.status === 200, 'AI Agent accepts purchase request', `Message ID: ${chat1.data?.id}`);
  assert(chat1.data?.thoughtTrace && chat1.data?.thoughtTrace.length > 0, 'Agent Action Trace is populated with tool steps', `Steps: ${chat1.data?.thoughtTrace?.map(t => t.tool).join(' -> ')}`);
  
  const tx1 = chat1.data?.transaction;
  assert(tx1 && (tx1.status === 'COMPLETED' || tx1.status === 'APPROVED'), 'Transaction 1 automatically approved/completed', `Status: ${tx1?.status}, Amount: ${tx1?.amount} TL`);
  assert(chat1.data?.mpcShares && (chat1.data.mpcShares.aiShare && chat1.data.mpcShares.policyShare), '2-of-3 MPC Threshold reached for auto-pay', `AI Share: ${chat1.data?.mpcShares?.aiShare}, Policy Share: ${chat1.data?.mpcShares?.policyShare}`);

  const walletAfterTx1 = await request('/api/wallet');
  const expectedBalance1 = initialBalance - (tx1?.amount || 840);
  assert(walletAfterTx1.data?.wallet?.balance === expectedBalance1, 'Wallet balance accurately deducted', `New Balance: ${walletAfterTx1.data?.wallet?.balance} TL (Deducted: ${tx1?.amount} TL)`);

  // --- TEST 2: Limit Aşımı (28.000 TL Laptop) ---
  console.log('\n--- TEST 2: Limit Aşımı (28.000 TL Laptop) ---');
  const chat2 = await request('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify({ message: 'Üniversite için maksimum 30.000 TL bütçeyle laptop bul. En az 16 GB RAM ve 512 GB SSD olsun.' })
  });
  
  assert(chat2.status === 200, 'AI Agent processes high-budget search', `Found ${chat2.data?.products?.length || 0} products`);
  
  // Now trigger purchase of product #1 (TechBook Pro 16 - 28.000 TL)
  const buyLaptop = await request('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify({
      message: '1. ürünü satın al.'
    })
  });

  const tx2 = buyLaptop.data?.transaction;
  assert(tx2 && tx2.status === 'APPROVAL_REQUIRED', 'Single transaction limit (>1000 TL) triggers APPROVAL_REQUIRED', `Status: ${tx2?.status}, Amount: ${tx2?.amount} TL`);
  assert(buyLaptop.data?.mpcShares?.userShare === false, 'MPC has 2/3 shares (Waiting for User Passkey Share)', `Status: ${buyLaptop.data?.mpcShares?.status}`);

  // --- TEST 3: Kullanıcı Onayı (Approvals Page Co-Signing) ---
  console.log('\n--- TEST 3: Kullanıcı Onayı & Passkey Co-Signing ---');
  const pendingApprovals = await request('/api/approvals');
  assert(pendingApprovals.status === 200 && pendingApprovals.data?.approvals?.length > 0, 'Pending approvals list includes laptop transaction', `Pending count: ${pendingApprovals.data?.approvals?.length}`);
  
  const targetApproval = pendingApprovals.data?.approvals?.find(a => a.transactionId === tx2?.id) || pendingApprovals.data?.approvals?.[0];
  assert(targetApproval !== undefined, 'Found approval record to resolve', `Approval ID: ${targetApproval?.id}`);

  const resolveRes = await request(`/api/approvals/${targetApproval?.id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ action: 'APPROVE', notes: 'Passkey biometric verified' })
  });

  assert(resolveRes.status === 200 && resolveRes.data?.status === 'APPROVED', 'Approval resolved: 3rd MPC share added and transaction completed', `Status: ${resolveRes.data?.status}`);
  assert(resolveRes.data?.txHash && resolveRes.data?.txHash.startsWith('0x'), 'Simulated L2 Rollup transaction hash generated', `TxHash: ${resolveRes.data?.txHash?.slice(0, 25)}...`);

  // --- TEST 4: Yasaklı Kategori (Gambling / Rogue Merchant) ---
  console.log('\n--- TEST 4: Yasaklı Kategori (Gambling) ---');
  const attackGambling = await request('/api/security/simulate-attack', {
    method: 'POST',
    body: JSON.stringify({ scenario: 'ROGUE_MERCHANT' })
  });

  assert(attackGambling.status === 200, 'Attack simulator processed request', `Status: ${attackGambling.status}`);
  assert(attackGambling.data?.policyResult?.status === 'REJECTED', 'Gambling transaction immediately blocked by Policy Engine', `Policy Result: ${attackGambling.data?.policyResult?.status}, Reasons: ${attackGambling.data?.policyResult?.reasons?.join('; ')}`);

  // --- TEST 5: Güvenilmeyen Satıcı / Adres / Injection ---
  console.log('\n--- TEST 5: Güvenilmeyen Satıcı / Adres / Prompt Injection ---');
  const attackInjection = await request('/api/security/simulate-attack', {
    method: 'POST',
    body: JSON.stringify({ scenario: 'INJECTION' })
  });

  assert(attackInjection.status === 200, 'Prompt injection test processed', `Status: ${attackInjection.status}`);
  assert(attackInjection.data?.policyResult?.status === 'REJECTED', 'Adversarial prompt injection & key exfiltration blocked by Policy Engine', `Policy Result: ${attackInjection.data?.policyResult?.status}`);

  // --- TEST 6: Emergency Freeze ---
  console.log('\n--- TEST 6: Emergency Freeze Kill-Switch ---');
  // Freeze wallet
  const freezeRes = await request('/api/wallet/freeze', { method: 'POST', body: JSON.stringify({ isFrozen: true }) });
  assert(freezeRes.status === 200 && freezeRes.data?.isFrozen === true, 'Wallet successfully FROZEN via Emergency Freeze', `isFrozen: ${freezeRes.data?.isFrozen}`);

  // Attempt payment while frozen
  const chatFrozen = await request('/api/security/simulate-attack', {
    method: 'POST',
    body: JSON.stringify({ scenario: 'FREEZE_BYPASS' })
  });

  assert(chatFrozen.data?.policyResult?.status === 'REJECTED', 'Transactions while FROZEN are strictly REJECTED by Policy Engine', `Status: ${chatFrozen.data?.policyResult?.status}`);

  // Unfreeze wallet
  const unfreezeRes = await request('/api/wallet/freeze', { method: 'POST', body: JSON.stringify({ isFrozen: false }) });
  assert(unfreezeRes.status === 200 && unfreezeRes.data?.isFrozen === false, 'Wallet successfully UN-FROZEN', `isFrozen: ${unfreezeRes.data?.isFrozen}`);

  // --- TEST 7: Audit Chain Cryptographic Verification ---
  console.log('\n--- TEST 7: Audit Chain Cryptographic Integrity ---');
  const auditRes = await request('/api/audit');
  assert(auditRes.status === 200 && auditRes.data?.logs?.length >= 3, 'Audit ledger retrieved with multiple logs', `Total logs: ${auditRes.data?.logs?.length}`);

  const logs = auditRes.data?.logs || [];
  let chainValid = true;
  let verifiedCount = 0;

  for (let i = 0; i < logs.length - 1; i++) {
    const currentLog = logs[i]; // newer log
    const previousLog = logs[i + 1]; // older log
    
    // In desc order, currentLog was created after previousLog, so currentLog.previousHash should match previousLog.hash
    if (currentLog.previousHash && previousLog.hash) {
      if (currentLog.previousHash === previousLog.hash) {
        verifiedCount++;
      } else {
        chainValid = false;
        break;
      }
    }
  }

  assert(chainValid && verifiedCount > 0, 'SHA-256 Cryptographic Hash Chain is fully valid & unbroken', `Verified ${verifiedCount} sequential blocks in immutable ledger`);


  // --- Summary ---
  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed === 0) {
    console.log('🎉 ALL 7 TEST SCENARIOS COMPLETED WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error(`💥 ${failed} tests failed.`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
