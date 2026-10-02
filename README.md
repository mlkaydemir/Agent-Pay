# AgentPay

> **"Give AI permission to spend, not permission to steal."**  
> *"AI ajanına harcama yetkisi verin, çalma yetkisi değil."*

---

**Languages / Diller:**  
🇬🇧 **[English Documentation](#english)** | 🇹🇷 **[Türkçe Dokümantasyon](#türkçe)**

---

<a name="english"></a>
# 🇬🇧 English Documentation

> [!IMPORTANT]
> ### ⚠️ SIMULATION & PROTOTYPE NOTICE
> AgentPay is a research, educational, and architectural prototype built for demonstration and academic evaluation.
> * **NO Real Banking / Card Transactions**: No real fiat bank accounts, credit cards, or live payment gateways are debited.
> * **NO Real Crypto / Blockchain Mainnet Transactions**: All wallet addresses, transaction hashes, and L2 rollups are simulated internally within a local sandbox.
> * **SIMULATED MPC & Account Abstraction**: Cryptographic Multi-Party Computation (2-of-3 threshold signing) and Smart Account state management are executed as an architectural software simulation, not a distributed Hardware Security Module (HSM) cluster or production custody network.

---

## 1. Project Overview

As Large Language Models (LLMs) and autonomous agents evolve from answering questions to acting on behalf of users in digital commerce, they need the ability to make financial commitments (purchasing hardware, reserving flights, provisioning cloud resources, ordering office supplies). 

However, giving an autonomous agent unrestricted financial credentials exposes users to prompt injection, supply chain manipulation, loop spending, and rogue transactions. **AgentPay** provides a non-custodial middleware and authorization layer that grants agents programmable, scoped spending authority governed by policy rules, risk scoring, and multi-party threshold signatures.

---

## 2. The 2026 Problem

In contemporary agentic software ecosystems (2024–2026), AI agents are increasingly tasked with end-to-end autonomous workflows. While reasoning capabilities have expanded, the underlying financial infrastructure remains fundamentally binary:

* **Binary Access Problem**: Traditional payment methods (credit card numbers, API secret keys, Web3 private keys) are all-or-nothing. If an agent holds the key, any malicious prompt injection or unhandled runtime loop can drain the entire account balance.
* **The High-Friction Dilemma**: Requiring human two-factor authorization for every single micro-transaction (e.g., ₺15 API call or ₺200 book) defeats the primary benefit of autonomous agent delegation.
* **Lack of Ephemeral Delegation**: Current financial protocols lack native primitives for sub-delegating limited spending budgets with granular category and merchant whitelists that automatically expire or freeze upon anomaly detection.

---

## 3. Why Agentic Commerce?

Agentic Commerce represents the paradigm shift where economic transactions are discovered, negotiated, evaluated, and executed autonomously by software agents:

* **Autonomous Procurement**: Agents compare multi-vendor catalogs based on objective technical criteria (RAM, CPU, storage, warranty, trust score).
* **Deterministic Policy Enforcement**: Software boundaries ensure agents operate strictly within predefined financial policies regardless of prompt manipulation.
* **Programmable Spending Guardrails**: Budgets are enforced per transaction, per day, and per month, with automatic kill-switches and human escalation for out-of-policy intents.

---

## 4. Research Basis

The architectural foundation of AgentPay draws upon three established computer science and cybersecurity disciplines:

1. **Threshold Cryptography & Multi-Party Computation (MPC)**: Distributing signing shares across isolated parties so that no single compromised entity can forge a valid transaction authorization.
2. **Account Abstraction (ERC-4337 & Smart Contract Wallets)**: Replacing raw private key ownership with programmable validation logic, custom authorization rules, and emergency session guardians.
3. **Defense-in-Depth for LLM Agents**: Mitigating prompt injection and adversarial goal hijacking through out-of-band policy engines and deterministic non-LLM verification layers.

---

## 5. Problem Statement

How can we allow autonomous AI agents to conduct authorized financial procurement on behalf of users while mathematically preventing unauthorized fund exfiltration, runaway budget exhaustion, and adversarial prompt exploitation?

---

## 6. Proposed Solution

AgentPay decouples financial intent from cryptographic execution through a **Three-Tier Security Architecture**:

1. **Tier 1 — Autonomous Intent Generation (AI Agent Share)**: The agent operates inside a sandboxed environment with scoped tools (`search_products`, `compare_products`, `check_budget`, `check_policy`). The agent generates transaction intent (Share 1 of 3) but has zero direct access to wallet funds.
2. **Tier 2 — Deterministic Policy Shield (Server HSM Share)**: An independent policy engine evaluates cumulative spending limits, merchant trust scores, and category blacklists. If all rules pass, the server contributes Share 2 of 3, achieving the 2-of-3 threshold for auto-spend under limit.
3. **Tier 3 — User Passkey Escalation (Device Share)**: If a transaction exceeds single limits (e.g., > ₺1,000) or targets an unapproved merchant, the Policy Shield withholds its share and escalates the transaction to the user's Approvals queue for biometric WebAuthn/Passkey co-signing (Share 3 of 3).

---

## 7. Core Features

* **AI Procurement Sentinel**: Multi-step natural language procurement with clear **Agent Action Trace** transparency.
* **Policy Engine**: Configurable single, daily, and monthly spending caps with strict category & merchant filtering.
* **Risk Engine**: Real-time 0–100 heuristic risk scoring factoring merchant trust scores, category flags, and spending velocity.
* **2-of-3 MPC Threshold Simulation**: Mathematical verification of signature share aggregation.
* **Approvals Multi-Sig Queue**: Human-in-the-loop review interface for limit-breaching transactions with 1-click Passkey co-signing.
* **Emergency Freeze Kill-Switch**: 1-click global lock halting all agentic transactions instantaneously.
* **Cryptographic SHA-256 Audit Chain**: Immutable, backward-referenced hash ledger recording every agent thought step, policy verdict, and transaction event.
* **Interactive Security Attack Simulator**: Live testing suite demonstrating defenses against Prompt Injection, Rogue Merchants, and Freeze Bypasses.

---

## 8. Architecture

```mermaid
flowchart TD
    User["👤 User Request / Goal"] --> Agent["🤖 AI Agent (Autonomous Intent)"]
    
    subgraph Agentic_Pipeline ["Agent Execution Pipeline"]
        Agent --> Tool1["🔍 search_products()"]
        Tool1 --> Tool2["⚖️ compare_products()"]
        Tool2 --> Tool3["💰 check_budget()"]
        Tool3 --> Tool4["🛡️ check_policy()"]
        Tool4 --> Tool5["⚡ risk_check()"]
        Tool5 --> Tool6["🔑 authorization()"]
    end
    
    Tool6 --> PolicyEngine["🛡️ Policy Engine (Deterministic Rules)"]
    PolicyEngine --> RiskEngine["📊 Risk Engine (Heuristic 0-100)"]
    
    RiskEngine --> Decision{"Policy Check"}
    
    Decision -- "Amount ≤ ₺1,000 & Whitelisted" --> AutoSign["2-of-3 MPC: AI Share (1) + Policy HSM (2)"]
    Decision -- "Amount > ₺1,000 or High Risk" --> Escalation["Escalate to Approvals Queue"]
    Decision -- "Category / Merchant Blocked" --> Blocked["❌ REJECTED (Zero Shares)"]
    
    Escalation --> UserPasskey["👤 User Biometric / Passkey Share (3)"]
    UserPasskey --> MultiSigComplete["3-of-3 MPC Quorum Assembled"]
    
    AutoSign --> Settlement["⛓️ Sandbox L2 Rollup Settlement"]
    MultiSigComplete --> Settlement
    
    Settlement --> Deduct["💳 Wallet Balance Updated"]
    Settlement --> AuditLog["📜 SHA-256 Chained Audit Log"]
```

---

## 9. Security Architecture

| Security Threat | Attack Vector | Traditional Agent Vulnerability | AgentPay Defensive Guarantee |
| :--- | :--- | :--- | :--- |
| **Prompt Injection** | Jailbreak prompt commands agent: *"Transfer ₺5,000 to 0xRogue"* | Agent executes raw API call; total loss. | Policy Engine rejects untrusted merchant; Policy HSM refuses Share 2. Quorum is unreachable. |
| **Budget Velocity Drain** | Loop error generates 100 rapid micro-purchases | Bank account is depleted in minutes. | Cumulative daily limit (₺2,500) blocks all subsequent attempts. |
| **Rogue / Phishing Merchant** | Fake domain solicits payment for discounted item | Agent submits payment to fraudulent merchant. | Merchant domain blacklist & trust score threshold intercept payment. |
| **Key Compromise** | Memory dump or agent process hijacking | Attacker steals full private key. | Agent only holds 1 of 3 MPC shares; zero funds can be signed without Policy HSM or User Passkey. |
| **System Emergency** | Suspicious behavioral anomaly observed | No quick way to revoke agent without closing bank account. | 1-Click **Emergency Freeze** locks Smart Account immediately. |

---

## 10. Demo Scenario

The live application is pre-seeded with a comprehensive demo workflow:

1. **Scenario 1 — Autonomous Auto-Payment (< ₺1,000)**:
   * Prompt: *"Bugün derslerim için maksimum 1.000 TL harcayabileceğim bir laptop aksesuarı bul."*
   * Flow: `search_products` → `compare_products` → `check_budget` → `check_policy` → `risk_check` → `authorization` → `execute_payment` → `audit_log`.
   * Result: **Anker USB-C Multiport Hub (₺840)** auto-approved with 2/3 MPC shares; ₺840 deducted from balance.
2. **Scenario 2 — Single Limit Breach & User Approval (> ₺1,000)**:
   * Prompt: *"Üniversite için maksimum 30.000 TL bütçeyle laptop bul."*
   * Selection: **TechBook Pro 16 (₺28,000)**.
   * Result: Single transaction limit (₺1,000) triggered → Status becomes `APPROVAL_REQUIRED` → Dispatched to `/approvals`.
3. **Scenario 3 — Passkey Co-Signing**:
   * Navigate to `/approvals` → Click **"Approve & Sign"**.
   * Result: User Passkey (Share 3) co-signs → Quorum reached (3/3) → Transaction completed (`COMPLETED`) with L2 txHash.
4. **Scenario 4 — Blocked Category & Untrusted Merchant**:
   * Attempting to buy from Gambling or Rogue Merchant → Blocked immediately by Policy Engine (`REJECTED`).
5. **Scenario 5 — Emergency Freeze**:
   * Activating Emergency Freeze halts all transactions until unfrozen.
6. **Scenario 6 — SHA-256 Audit Verification**:
   * Reviewing `/audit` displays backward-chained SHA-256 block hashes verifying unbroken ledger integrity.

---

## 11. Tech Stack

* **Framework**: Next.js 14 (App Router), React 18, TypeScript.
* **Styling**: Vanilla CSS, Tailwind CSS, Dark Cyber-Fintech Design System, Lucide React Icons, Framer Motion.
* **Backend & API**: Next.js Route Handlers, TypeScript Policy Engine, Heuristic Risk Engine, MPC Simulation Layer.
* **Database & ORM**: SQLite, Prisma ORM 5.
* **Security Primitives**: Node.js `crypto` (SHA-256 cryptographic hash chaining, ECDSA-simulated threshold state machine).

---

## 12. Project Structure

```
agentpay/
├── prisma/
│   ├── schema.prisma         # Database schema (User, Wallet, Policy, Merchant, Product, Transaction, Approval, AuditLog)
│   ├── seed.js               # Zero-config deterministic demo seed script
│   └── dev.db                # SQLite database
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Global cyber-fintech layout & sidebar navigation
│   │   ├── page.tsx          # Landing page with live metrics & quick launcher
│   │   ├── dashboard/        # Central command center & financial overview
│   │   ├── agent/            # Sentinel-1 AI Agent chat & Action Trace visualizer
│   │   ├── policies/         # Programmable spending policy configuration
│   │   ├── approvals/        # Multi-Sig Passkey approval & resolution queue
│   │   ├── transactions/     # Transaction ledger & detailed timeline inspector
│   │   │   └── [id]/         # Per-transaction MPC share & verification breakdown
│   │   ├── security/         # Live security attack simulator & telemetry
│   │   ├── audit/            # SHA-256 cryptographic immutable audit log ledger
│   │   ├── wallet/           # Smart Account balance, topup, & Emergency Freeze
│   │   └── api/              # Secure Next.js Route Handlers
│   ├── components/           # Reusable UI widgets (StatusBadge, Sidebar, Navbar)
│   └── lib/
│       ├── agent-engine.ts   # AI Agent procurement tools & autonomous planner
│       ├── policy-engine.ts  # Deterministic spending limits & whitelist rules
│       ├── risk-engine.ts    # 0-100 heuristic risk scoring model
│       ├── mpc-simulation.ts # 2-of-3 threshold signature aggregator
│       ├── prisma.ts         # Singleton Prisma client instance
│       ├── types.ts          # TypeScript interfaces & state definitions
│       └── utils.ts          # Formatting & cryptographic helper utilities
├── .env.example              # Sample environment variables
├── package.json              # Project metadata & npm scripts
├── test-e2e.js               # Comprehensive 7-scenario automated audit test suite
└── README.md                 # Complete project documentation
```

---

## 13. Installation & Quick Start

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/agentpay.git
cd agentpay

# 2. Install dependencies
npm install

# 3. Setup database schema & seed demo data
npm run db:push
npm run db:seed

# 4. Run type check & automated test suite
npm run lint
node test-e2e.js

# 5. Start development or production server
npm run dev
# or for production:
npm run build && npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 14. Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Database Connection (SQLite)
DATABASE_URL="file:./dev.db"

# AI Configuration (Optional - If omitted, AgentPay runs the built-in Intelligent Mock Engine without any API key)
AI_API_KEY=""
# GEMINI_API_KEY=""
# OPENAI_API_KEY=""

# Application Settings
NEXT_PUBLIC_APP_NAME="AgentPay"
NEXT_PUBLIC_DEMO_MODE="true"
```

---

## 15. Real vs Simulation

To maintain academic and technical honesty, the distinction between production components and simulated demonstration layers is explicitly outlined:

| Component | Status | Description |
| :--- | :--- | :--- |
| **Next.js Full-Stack App** | **REAL** | Fully functional React 18, App Router, TypeScript, and Prisma ORM database backend. |
| **Policy Engine** | **REAL** | Deterministic mathematical evaluation of budgets, velocities, categories, and merchant whitelists. |
| **Risk Scoring Engine** | **REAL** | Multi-factor heuristic scoring algorithm evaluating trust scores and anomaly vectors. |
| **SHA-256 Audit Chain** | **REAL** | Cryptographically chained SHA-256 hash ledger linking each event to the prior block hash. |
| **AI Agent Tool Pipeline** | **REAL** | Deterministic 8-tool execution planner executing catalog queries, budget checks, and policy evaluations. |
| **MPC Cryptography** | **SIMULATION** | 2-of-3 threshold signatures are simulated via software state machine rather than distributed Hardware Security Modules. |
| **Smart Account / Rollup** | **SIMULATION** | Account Abstraction state and L2 block settlements are simulated locally without mainnet gas costs. |
| **Banking / Card Network** | **SIMULATION** | Mock fiat balances (TRY) without live Visa/Mastercard/PSD2 gateway connections. |

---

## 16. Limitations

* **Simulated Custody**: Keys and shares are not stored in dedicated physical TPM/HSM chips or distributed MPC cloud enclaves (e.g. Fireblocks, Lit Protocol).
* **Local Transaction Settlement**: Transaction hashes are verifiable within the local database and audit log rather than an external Ethereum/Arbitrum block explorer.
* **Catalog Scale**: Product catalog is optimized for university and procurement demo scenarios rather than millions of live e-commerce SKUs.

---

## 17. Future Work

1. **Live MPC Enclave Integration**: Integrate with decentralized MPC key management protocols (e.g., Lit Protocol, Dfns, or Web3Auth).
2. **Production ERC-4337 Smart Accounts**: Deploy EVM Smart Contract Wallets with Biconomy/ZeroDev bundlers and paymasters on Base/Arbitrum.
3. **Open Banking & Virtual Card Issuance**: Connect to Stripe Issuing or Marqeta for dynamic, merchant-locked virtual debit cards with per-transaction spend limits.
4. **W3C Verifiable Credentials for Agents**: Issue verifiable credentials attesting to an agent's authorized budget envelope.

---

## 18. Research Sources

1. **Y Combinator Request for Startups (Agentic Commerce & AI Security)**:
   * URL: [https://www.ycombinator.com/rfs](https://www.ycombinator.com/rfs)
   * Focus: Autonomous agents managing financial workflows, authentication, and delegated purchasing authority.
2. **Ethereum Foundation — ERC-4337: Account Abstraction Using Alt Mempool**:
   * URL: [https://eips.ethereum.org/EIPS/eip-4337](https://eips.ethereum.org/EIPS/eip-4337)
   * Focus: Smart contract wallets, programmable validation rules, paymasters, and session keys.
3. **NIST Special Publication — IR 8214A: Threshold Schemes for Cryptographic Primitives**:
   * URL: [https://csrc.nist.gov/pubs/ir/8214/a/final](https://csrc.nist.gov/pubs/ir/8214/a/final)
   * Focus: Multi-party computation, threshold signing, and distributed cryptographic authorization.
4. **Hacker News Technical Discussions on AI Agent Security & Financial Delegation**:
   * URL: [https://news.ycombinator.com/item?id=38825838](https://news.ycombinator.com/item?id=38825838)
   * URL: [https://news.ycombinator.com/item?id=39682544](https://news.ycombinator.com/item?id=39682544)
   * Focus: Preventing prompt injection attacks in tool-calling LLMs and securing agent-held financial credentials.

---

<br />
<hr />
<br />

<a name="türkçe"></a>
# 🇹🇷 Türkçe Dokümantasyon

> [!IMPORTANT]
> ### ⚠️ SİMÜLASYON VE PROTOTİP BİLGİLENDİRMESİ
> AgentPay, akademik ve teknik değerlendirme amacıyla geliştirilmiş bir araştırma ve mimari prototipidir.
> * **Gerçek Banka / Kart İşlemi Yoktur**: Gerçek banka hesapları, kredi kartları veya canlı ödeme ağ geçitleri kullanılmaz.
> * **Gerçek Kripto / Blockchain Mainnet İşlemi Yoktur**: Cüzdan adresleri, işlem hash'leri ve L2 rollup kayıtları yerel sandbox içinde simüle edilir.
> * **SİMÜLE EDİLMİŞ MPC ve Smart Account**: 2-of-3 eşik imzaları (MPC) ve Account Abstraction süreçleri, fiziksel HSM veya harici saklama ağı yerine mimari bir yazılım simülasyonu olarak çalışmaktadır.

---

## 1. Proje Genel Bakışı

Büyük Dil Modelleri (LLM) ve otonom yapay zeka ajanları sadece metin üreten sistemlerden kullanıcı adına doğrudan dijital ticarette eylem alan aktörlere dönüşmektedir (donanım satın alma, uçak bileti rezervasyonu, bulut sunucu kiralama, ofis sarf malzemesi tedariği).

Ancak bir otonom ajana doğrudan kredi kartı bilgisi, banka şifresi veya blokzincir özel anahtarı (private key) vermek ciddi siber güvenlik açıklarına (prompt injection, yetkisiz döngü harcamaları, oltalama siteleri) yol açar. **AgentPay**, ajana doğrudan anahtar vermeden, programlanabilir harcama limitleri, kural motoru (Policy Engine), risk değerlendirmesi ve **2-of-3 MPC eşik imzaları** ile kontrollü finansal yetki devri sağlayan bir güvenlik katmanıdır.

---

## 2. 2026 Problemi

2024–2026 döneminde yapay zeka ajanlarının otonomi seviyesi hızla artarken, geleneksel finansal altyapılar ikili (binary) bir çıkmaz içindedir:

* **İkili Yetkilendirme Çıkmazı**: Geleneksel ödeme yöntemleri ya "tüm yetkiyi ver" ya da "hiçbir yetki verme" şeklinde çalışır. Ajanın belleğinde tutulan bir kart bilgisi veya özel anahtar, prompt injection ile kolayca çalınabilir veya sonsuz döngülerde bakiyeyi tüketebilir.
* **Yüksek Sürtünme Problemi**: Her ₺15'lik veya ₺200'lik mikro işlem için kullanıcıdan SMS/2FA onayı istemek, otonom ajanın getirdiği hız ve konfor avantajını tamamen ortadan kaldırır.
* **Geçici ve Kapsamlı Yetki Eksikliği**: Mevcut bankacılık protokolleri, belirli kategorilerde, belirli satıcılarda ve belirli bütçelerle geçerli olan geçici ve programlanabilir harcama yetkisi tanımlamayı yerel olarak desteklemez.

---

## 3. Neden Ajan Ticareti (Agentic Commerce)?

Ajan Ticareti (Agentic Commerce), finansal işlemlerin keşif, karşılaştırma, değerlendirme ve yürütme aşamalarının yazılım ajanları tarafından otonom olarak yürütüldüğü yeni bir ekonomik modeldir:

* **Otonom Tedarik**: Ajanlar çoklu satıcı kataloglarını teknik parametrelere (RAM, CPU, depolama, güvenilirlik puanı) göre nesnel olarak analiz eder.
* **Deterministik Kural Denetimi**: Ajanın zekası veya prompt girdisi ne olursa olsun, finansal sınırlar deterministik kod kuralları tarafından garanti altına alınır.
* **Programlanabilir Güvenlik Sınırları**: Tek işlem, günlük ve aylık harcama limitleri, anomali durumunda acil dondurma (Emergency Freeze) ve limit aşımında insan onayına iletim sağlanır.

---

## 4. Araştırma Temeli

AgentPay'in mimarisi, bilgisayar bilimleri ve siber güvenliğin üç temel disiplininden beslenir:

1. **Eşik Kriptografisi ve Çok Taraflı Hesaplama (MPC)**: İmza anahtarının parçalara (shares) bölünerek saklanması; tek bir parçanın ele geçirilmesiyle geçerli imza üretilmesini matematiksel olarak imkansız kılar.
2. **Account Abstraction (ERC-4337 ve Akıllı Sözleşme Cüzdanları)**: Sabit özel anahtar bağımlılığını kaldırarak programlanabilir harcama kuralları, oturum anahtarları ve acil durum dondurma mekanizmaları sunar.
3. **LLM Ajanları İçin Çok Katmanlı Güvenlik (Defense-in-Depth)**: Prompt injection ve hedef saptırma saldırılarını engellemek amacıyla, onay süreçlerinin modelin kendi iç düşüncesinden bağımsız dış kurallarla doğrulanması.

---

## 5. Problem Tanımı

Otonom yapay zeka ajanlarının kullanıcı adına güvenli tedarik ve ödeme yapmasını sağlarken, yetkisiz para transferlerini, bütçe tüketim döngülerini ve prompt injection saldırılarını matematiksel olarak nasıl engelleyebiliriz?

---

## 6. Önerilen Çözüm

AgentPay, finansal niyeti kriptografik uygulamadan ayıran **Üç Katmanlı Güvenlik Mimarisi** sunar:

1. **Katman 1 — Otonom Niyet Üretimi (AI Ajan İmzası)**: Ajan sandbox ortamında `search_products`, `compare_products`, `check_budget`, `check_policy` araçlarıyla çalışır ve niyetini (1. İmza Parçası) oluşturur. Ajanın doğrudan cüzdana erişimi yoktur.
2. **Katman 2 — Deterministik Kural Kalkanı (Sunucu HSM İmzası)**: Sunucu tarafındaki Policy Engine, bütçe limitlerini, satıcı güven skorunu ve kategori yasaklarını denetler. Kurallar uygunsa 2. İmza Parçasını verir ve limit altındaki işlemler için 2/3 eşik tamamlanarak otomatik ödeme gerçekleşir.
3. **Katman 3 — Kullanıcı Biyometrik Onayı (Cihaz İmzası)**: Limit üstü (örn. > ₺1,000) veya bilinmeyen satıcı işlemlerinde sunucu imza vermez; işlemi Kullanıcı Onay Kuyruğuna (`/approvals`) yönlendirir. Kullanıcı Passkey ile 3. imzayı atarak işlemi tamamlar.

---

## 7. Temel Özellikler

* **Sentinel AI Tedarik Ajanı**: Şeffaf **Agent Action Trace** adımlarıyla doğal dil üzerinden çok adımlı ürün araştırma ve satın alma.
* **Kural Motoru (Policy Engine)**: Tek işlem, günlük ve aylık harcama limitleri, izinli/yasaklı kategori ve satıcı filtreleri.
* **Dinamik Risk Motoru**: 0–100 arası anlık risk puanlaması ve anomali tespiti.
* **2-of-3 MPC Eşik İmza Simülasyonu**: İmza parçalarının matematiksel birleşiminin görsel doğrulaması.
* **Approvals Çoklu İmza Kuyruğu**: Limit aşımı durumunda Passkey / WebAuthn ile tek tıkla ortak imzalama.
* **Emergency Freeze Acil Durum Kilidi**: Şüpheli durumda tüm ajan işlemlerini anında durduran küresel anahtar.
* **SHA-256 Kriptografik Audit Zinciri**: Her ajan eylemini, kural kararını ve işlemi birbirine bağlayan değiştirilemez hash defteri.
* **Güvenlik Saldırı Simülatörü**: Prompt injection, sahte satıcı ve dondurma atlatma saldırılarının engellenişini canlı test eden simülatör.

---

## 8. Sistem Mimarisi

```mermaid
flowchart TD
    User["👤 Kullanıcı İsteği / Hedef"] --> Agent["🤖 AI Ajanı (Otonom Niyet)"]
    
    subgraph Ajan_Boru_Hatti ["Ajan Eylem Boru Hattı"]
        Agent --> Tool1["🔍 search_products()"]
        Tool1 --> Tool2["⚖️ compare_products()"]
        Tool2 --> Tool3["💰 check_budget()"]
        Tool3 --> Tool4["🛡️ check_policy()"]
        Tool4 --> Tool5["⚡ risk_check()"]
        Tool5 --> Tool6["🔑 authorization()"]
    end
    
    Tool6 --> PolicyEngine["🛡️ Kural Motoru (Policy Engine)"]
    PolicyEngine --> RiskEngine["📊 Risk Motoru (0-100 Puan)"]
    
    RiskEngine --> Decision{"Kural Değerlendirmesi"}
    
    Decision -- "Tutar ≤ ₺1.000 & İzinli Satıcı" --> AutoSign["2-of-3 MPC: AI İmzası (1) + Policy Sunucusu (2)"]
    Decision -- "Tutar > ₺1.000 veya Yüksek Risk" --> Escalation["Kullanıcı Onay Kuyruğuna İlet"]
    Decision -- "Yasaklı Kategori / Satıcı" --> Blocked["❌ REJECTED (İşlem Engellendi)"]
    
    Escalation --> UserPasskey["👤 Kullanıcı Biyometrik / Passkey İmzası (3)"]
    UserPasskey --> MultiSigComplete["3-of-3 MPC İmzası Tamamlandı"]
    
    AutoSign --> Settlement["⛓️ Sandbox L2 Rollup Takası"]
    MultiSigComplete --> Settlement
    
    Settlement --> Deduct["💳 Cüzdan Bakiyesi Güncellendi"]
    Settlement --> AuditLog["📜 SHA-256 Audit Zincirine Yazıldı"]
```

---

## 9. Güvenlik Mimarisi

| Güvenlik Tehdidi | Saldırı Vektörü | Geleneksel Ajan Açığı | AgentPay Savunma Garantisi |
| :--- | :--- | :--- | :--- |
| **Prompt Injection** | Ajanı kandırarak: *"₺5.000'i şu adrese gönder"* | Ajan doğrudan API çağrısı yapar; bakiye tamamen çalınır. | Policy Engine bilinmeyen satıcıyı reddeder; sunucu 2. imzayı vermez. İşlem gerçekleşemez. |
| **Bütçe Tüketim Döngüsü** | Hatalı döngü ile art arda yüzlerce mikro işlem | Dakikalar içinde banka hesabı boşaltılır. | Günlük limit (₺2.500) aşıldığında tüm sonraki işlemler otomatik engellenir. |
| **Sahte / Oltalama Satıcı** | İndirimli ürün vaadiyle sahte siteye yönlendirme | Ajan sahte satıcıya ödeme yapar. | Satıcı kara listesi ve güven skoru eşiği işlemi engeller. |
| **Anahtar Çalınması** | Bellek dökümü veya ajan sürecinin ele geçirilmesi | Saldırgan tüm bakiyeyi çalar. | Ajan sadece 1/3 imza parçasına sahiptir; diğer parçalar olmadan para çıkışı imkansızdır. |
| **Sistem Acil Durumu** | Anormal davranış tespiti | Banka hesabını kapatmadan ajanı durdurmak zordur. | Tek tıkla **Emergency Freeze** tüm işlemleri anında dondurur. |

---

## 10. Demo Senaryoları

Uygulama sunum ve ders kapsamında aşağıdaki hazır senaryolarla test edilebilir:

1. **Senaryo 1 — Otonom Otomatik Ödeme (< ₺1.000)**:
   * İstek: *"Bugün derslerim için maksimum 1.000 TL harcayabileceğim bir laptop aksesuarı bul."*
   * Akış: `search_products` → `compare_products` → `check_budget` → `check_policy` → `risk_check` → `authorization` → `execute_payment` → `audit_log`.
   * Sonuç: **Anker USB-C Çoklayıcı (₺840)** 2/3 MPC imzasıyla otomatik satın alınır; bakiye ₺840 düşer.
2. **Senaryo 2 — Limit Aşımı ve Kullanıcı Onayı (> ₺1.000)**:
   * İstek: *"Üniversite için maksimum 30.000 TL bütçeyle laptop bul."*
   * Seçim: **TechBook Pro 16 (₺28.000)**.
   * Sonuç: Tek işlem limiti (₺1.000) aşıldığı için durum `APPROVAL_REQUIRED` olur ve `/approvals` sayfasına iletilir.
3. **Senaryo 3 — Kullanıcı Passkey Ortak İmzası**:
   * `/approvals` sayfasına gidilir → **"Approve & Sign"** butonuna basılır.
   * Sonuç: Kullanıcı Passkey (3. İmza) eklenir → 3/3 çoğunluk sağlanır → İşlem L2 hash ile tamamlanır (`COMPLETED`).
4. **Senaryo 4 — Yasaklı Kategori & Güvenilmeyen Satıcı**:
   * Kumar veya kara listedeki satıcıdan ürün alma girişimi Policy Engine tarafından doğrudan reddedilir (`REJECTED`).
5. **Senaryo 5 — Acil Durum Dondurma (Emergency Freeze)**:
   * Dondurma aktifken hiçbir ödeme gerçekleşmez; dondurma kaldırıldığında sistem normale döner.
6. **Senaryo 6 — SHA-256 Audit Zinciri Doğrulaması**:
   * `/audit` sayfasında her kaydın bir önceki bloğun hash'ini referansladığı doğrulanır.

---

## 11. Teknoloji Yığını

* **Ön Yüz**: Next.js 14 (App Router), React 18, TypeScript, Vanilla CSS + Tailwind CSS, Lucide React İkonları, Framer Motion.
* **Arka Yüz & API**: Next.js Route Handlers, TypeScript Kural Motoru, Risk Puanlama Motoru, MPC Simülasyon Katmanı.
* **Veritabanı & ORM**: SQLite, Prisma ORM 5.
* **Kriptografik Temeller**: Node.js `crypto` modülü (SHA-256 zincirleme, ECDSA durum makinesi simülasyonu).

---

## 12. Proje Dosya Yapısı

```
agentpay/
├── prisma/
│   ├── schema.prisma         # Veritabanı şeması (User, Wallet, Policy, Merchant, Product, Transaction, Approval, AuditLog)
│   ├── seed.js               # Sıfır kurulum demo verisi tohumlama scripti
│   └── dev.db                # SQLite veritabanı dosyası
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Siber-fintech genel düzeni ve gezinme çubuğu
│   │   ├── page.tsx          # Karşılama ve metrik sayfası
│   │   ├── dashboard/        # Ana yönetim paneli ve bakiye özeti
│   │   ├── agent/            # Sentinel-1 AI Ajan sohbeti ve Action Trace paneli
│   │   ├── policies/         # Harcama kural ve limit yapılandırması
│   │   ├── approvals/        # Çoklu imza kullanıcı onay kuyruğu
│   │   ├── transactions/     # İşlem geçmişi ve zaman çizelgesi
│   │   │   └── [id]/         # İşlem detay ve MPC imza doğrulama sayfası
│   │   ├── security/         # Canlı saldırı simülatörü ve telemetri
│   │   ├── audit/            # SHA-256 değiştirilemez audit günlüğü
│   │   ├── wallet/           # Akıllı Cüzdan bakiyesi ve Emergency Freeze kontrolü
│   │   └── api/              # Güvenli API Route Handler servisleri
│   ├── components/           # Durum rozetleri, yan menü ve arayüz bileşenleri
│   └── lib/
│       ├── agent-engine.ts   # Ajan tedarik araçları ve otonom planlayıcı
│       ├── policy-engine.ts  # Deterministik harcama limitleri ve kural denetimi
│       ├── risk-engine.ts    # 0-100 sezgisel risk puanlama motoru
│       ├── mpc-simulation.ts # 2-of-3 eşik imza toplayıcı
│       ├── prisma.ts         # Prisma istemci örneği
│       ├── types.ts          # TypeScript tip tanımlamaları
│       └── utils.ts          # Biçimlendirme ve kriptografik yardımcılar
├── .env.example              # Örnek ortam değişkenleri
├── package.json              # Bağımlılıklar ve çalıştırma komutları
├── test-e2e.js               # 7 senaryolu kapsamlı otomatik test paketi
└── README.md                 # Çift dilli proje dokümantasyonu
```

---

## 13. Kurulum ve Hızlı Başlangıç

### Gereksinimler
* **Node.js**: v18.0.0 veya üzeri
* **npm**: v9.0.0 veya üzeri

### Adımlar

```bash
# 1. Projeyi klonlayın
git clone https://github.com/kullanici-adiniz/agentpay.git
cd agentpay

# 2. Bağımlılıkları yükleyin
npm install

# 3. Veritabanını oluşturun ve demo verilerini yükleyin
npm run db:push
npm run db:seed

# 4. Tip kontrolü ve otomatik testleri çalıştırın
npm run lint
node test-e2e.js

# 5. Geliştirme veya üretim sunucusunu başlatın
npm run dev
# veya üretim için:
npm run build && npm run start
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 14. Ortam Değişkenleri (.env)

Kök dizinde `.env` dosyası oluşturun (veya `.env.example` dosyasını kopyalayın):

```env
# Veritabanı Bağlantısı (SQLite)
DATABASE_URL="file:./dev.db"

# AI Yapılandırması (Opsiyonel - Boş bırakılırsa dahili Akıllı Mock Motoru API key olmadan çalışır)
AI_API_KEY=""
# GEMINI_API_KEY=""
# OPENAI_API_KEY=""

# Uygulama Ayarları
NEXT_PUBLIC_APP_NAME="AgentPay"
NEXT_PUBLIC_DEMO_MODE="true"
```

---

## 15. Gerçek vs Simülasyon

| Bileşen | Durum | Açıklama |
| :--- | :--- | :--- |
| **Next.js Full-Stack Uygulama** | **GERÇEK** | React 18, App Router, TypeScript ve Prisma ORM ile çalışan tam teşekküllü web uygulaması. |
| **Kural Motoru (Policy Engine)** | **GERÇEK** | Bütçe, limit, kategori ve satıcı kurallarını değerlendiren deterministik motor. |
| **Risk Değerlendirme Motoru** | **GERÇEK** | Satıcı güven puanı ve harcama hızını ölçen sezgisel puanlama algoritması. |
| **SHA-256 Audit Zinciri** | **GERÇEK** | Her kaydı bir önceki bloğun hash'ine bağlayan kriptografik SHA-256 zinciri. |
| **Ajan Eylem Boru Hattı** | **GERÇEK** | Katalog sorgulama, bütçe denetimi ve kural sorgularını yürüten 8 araçlı planlayıcı. |
| **MPC Eşik İmzası** | **SİMÜLASYON** | 2-of-3 eşik imzaları fiziksel HSM çipleri yerine yazılımsal durum makinesiyle simüle edilir. |
| **Smart Account / Rollup** | **SİMÜLASYON** | Hesap soyutlama ve L2 blok kayıtları gaz ücreti olmadan yerel sandbox'ta işletilir. |
| **Banka / Kart Ağı** | **SİMÜLASYON** | Canlı Visa/Mastercard/PSD2 bağlantısı olmaksızın yerel bakiye (TRY) kullanılır. |

---

## 16. Kısıtlamalar

* **Simüle Edilmiş Saklama**: Anahtarlar fiziksel TPM/HSM donanımlarında veya harici dağıtık MPC ağlarında (örn. Fireblocks, Lit Protocol) tutulmaz.
* **Yerel Blok Kayıtları**: İşlem hash'leri genel Ethereum/Arbitrum blok gezgini yerine yerel veritabanı ve audit defterinde takip edilir.
* **Katalog Ölçeği**: Ürün kataloğu üniversite ve donanım tedarik demosu için optimize edilmiştir.

---

## 17. Gelecek Çalışmalar ve Yol Haritası

1. **Canlı MPC Entegrasyonu**: Lit Protocol, Dfns veya Web3Auth gibi merkeziyetsiz MPC anahtar yönetim ağlarına bağlanma.
2. **Üretim Düzeyi ERC-4337 Akıllı Hesaplar**: Base veya Arbitrum üzerinde Biconomy/ZeroDev bundler ve paymaster sözleşmeleri ile dağıtım.
3. **Açık Bankacılık ve Sanal Kart Üretimi**: Stripe Issuing veya Marqeta API'leri ile dinamik, satıcı kilitli sanal banka kartları basma.
4. **W3C Doğrulanabilir Ajan Kimlikleri (DID)**: Otonom ajanlara bütçe limitlerini kanıtlayan doğrulanabilir dijital kimlikler çıkarma.

---

## 18. Araştırma Kaynakları

1. **Y Combinator Request for Startups (Agentic Commerce & AI Security)**:
   * URL: [https://www.ycombinator.com/rfs](https://www.ycombinator.com/rfs)
   * Kapsam: Otonom ajanların finansal iş akışlarını yönetmesi, kimlik doğrulama ve yetkilendirilmiş satın alma altyapıları.
2. **Ethereum Foundation — ERC-4337: Account Abstraction Using Alt Mempool**:
   * URL: [https://eips.ethereum.org/EIPS/eip-4337](https://eips.ethereum.org/EIPS/eip-4337)
   * Kapsam: Akıllı sözleşme cüzdanları, programlanabilir doğrulama kuralları, paymaster mekanizmaları ve oturum anahtarları.
3. **NIST Special Publication — IR 8214A: Threshold Schemes for Cryptographic Primitives**:
   * URL: [https://csrc.nist.gov/pubs/ir/8214/a/final](https://csrc.nist.gov/pubs/ir/8214/a/final)
   * Kapsam: Çok taraflı hesaplama (MPC), eşik imza şemaları ve dağıtık kriptografik yetkilendirme.
4. **Hacker News Technical Discussions on AI Agent Security & Financial Delegation**:
   * URL: [https://news.ycombinator.com/item?id=38825838](https://news.ycombinator.com/item?id=38825838)
   * URL: [https://news.ycombinator.com/item?id=39682544](https://news.ycombinator.com/item?id=39682544)
   * Kapsam: Tool-calling LLM sistemlerinde prompt injection saldırılarının önlenmesi ve finansal yetki güvenliği.
#   A g e n t - P a y  
 