AgentPay

Give AI permission to spend, not permission to steal.

AI ajanlarının kullanıcı adına kontrollü finansal işlemler yapmasını amaçlayan, güvenlik ve yetkilendirme odaklı bir agentic commerce prototipidir.

⚠️ Demo / Simulation: AgentPay eğitim ve proje sunumu amacıyla geliştirilmiştir. Gerçek para, banka hesabı, kart veya gerçek blockchain işlemi kullanılmaz. MPC, Smart Account ve ödeme altyapısı simüle edilmektedir.

🔎 Neden 2026? — Araştırma Temeli

AgentPay fikri, 2026 yılında AI ajanlarının yalnızca cevap veren sistemlerden çıkıp kullanıcı adına işlem gerçekleştiren aktörlere dönüşmesiyle ortaya çıkan yeni yetkilendirme ve ödeme problemlerinden yola çıkmaktadır.

Y Combinator — Requests for Startups

Y Combinator'ın 2026 RFS içeriklerinde AI ajanları, agentic commerce, ödeme altyapıları ve scalable / private blockchains gelecek fırsat alanları arasında ele alınıyor. Bu da AI ajanlarının ekonomik işlemlerde daha aktif rol alacağı bir altyapı ihtiyacını destekliyor.

Hacker News — 2026 Tartışmaları

Hacker News'te 2026 yılında AI ajanlarının gerçek para harcaması ve ajan ödemelerinin nasıl yönetileceği üzerine tartışmalar bulunuyor. Tartışmalarda özellikle harcama limitleri, insan onayı, ödeme yetkilendirmesi ve ajanların güvenli biçimde para kullanması gibi problemler öne çıkıyor.

Bu noktadan hareketle AgentPay, AI ajanının doğrudan sınırsız ödeme yetkisine sahip olması yerine limit, politika, risk kontrolü ve kullanıcı onayı üzerinden çalışan bir güvenlik katmanı olarak tasarlanmıştır.

Araştırma Kaynakları

Y Combinator — Requests for Startups

Hacker News — AI agent that spends real money?

Hacker News — Payments for AI agents

Hacker News — AI agents and real purchases

🎯 Proje Fikri

AI ajanları yalnızca bilgi üretmek yerine kullanıcı adına ürün araştırabilir, karşılaştırabilir ve satın alma işlemi başlatabilir. Ancak ajana doğrudan finansal erişim vermek; prompt injection, hatalı işlemler veya kontrolsüz harcama gibi riskler oluşturur.

AgentPay, AI ajanına doğrudan sınırsız finansal erişim vermek yerine kurallarla sınırlandırılmış harcama yetkisi sağlar.

Örneğin kullanıcı:

"30.000 TL altında, 16 GB RAM ve 512 GB SSD'li bir laptop bul."

dediğinde sistem:

Ajan → Ürün Arama → Bütçe Kontrolü → Politika Kontrolü → Risk Kontrolü → Onay → Ödeme Simülasyonu → Audit Log

akışını izler.

🔐 Temel Güvenlik Yaklaşımı

AgentPay'de ödeme kararı yalnızca AI ajanına bırakılmaz.

Spending Policies: İşlem ve günlük harcama limitleri

Merchant Control: Güvenilen / engellenen satıcılar

Category Rules: Belirli ürün kategorilerini sınırlandırma

Risk Engine: İşlem için risk puanı oluşturma

User Approval: Limit veya risk aşımında kullanıcı onayı

Emergency Freeze: Tüm ajan işlemlerini tek tıkla durdurma

Audit Log: İşlem ve ajan eylemlerinin kayıt altına alınması

Threshold Authorization Simulation: Yetkilendirmenin birden fazla parçaya bölünmesini simüle eden yapı

🏗️ Sistem Mimarisi

┌──────────────┐
│    Kullanıcı │
└──────┬───────┘
       ↓
┌──────────────┐
│   AI Agent   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Policy Engine│  ← Limit / kategori / satıcı
└──────┬───────┘
       ↓
┌──────────────┐
│ Risk Engine  │  ← Risk değerlendirmesi
└──────┬───────┘
       ↓
   ┌───┴───────────────┐
   ↓                   ↓
Otomatik            Kullanıcı
Onay                Onayı
   │                   │
   └────────┬──────────┘
            ↓
┌──────────────────────┐
│ Ödeme / Cüzdan       │
│ Simülasyonu           │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Audit Log             │
└──────────────────────┘

✨ Temel Özellikler

🤖 AI Agent

Kullanıcı isteğini işlem adımlarına dönüştürür.

Ürünleri arar ve karşılaştırır.

Bütçe ve politika kontrollerini kullanır.

İşlem sonucunu kullanıcıya gösterir.

🛡️ Policy & Risk Engine

İşlem limiti

Günlük harcama limiti

Satıcı kontrolü

Kategori kısıtlaması

Risk puanı

Onay gerektiren işlemler

💳 Mock Wallet

Demo bakiyesi

Harcama geçmişi

Ödeme simülasyonu

Emergency Freeze

🔏 Authorization Simulation

2-of-3 threshold authorization mantığının demo simülasyonu

Yüksek tutarlı işlemlerde kullanıcı onayı

Yetkilendirme durumunun işlem detaylarında gösterilmesi

📜 Audit Log

İşlem, politika sonucu ve sistem eylemleri kayıt altına alınır. Kayıtlar SHA-256 hash bağlantısı kullanılarak zincirlenir.

🧪 Security Simulator

Prompt injection, güvenilmeyen satıcı ve limit aşımı gibi senaryoların proje kapsamında test edilmesini sağlar.

🖥️ Uygulama Sayfaları

Sayfa

Açıklama

/

Proje tanıtımı

/dashboard

Bakiye ve genel durum

/agent

AI Agent ve Action Trace

/policies

Harcama kuralları

/approvals

Kullanıcı onayları

/transactions

İşlem geçmişi

/transactions/[id]

İşlem detayları

/security

Güvenlik ve saldırı simülasyonu

/audit

Audit kayıtları

/wallet

Demo cüzdanı ve Emergency Freeze

🛠️ Teknolojiler

Next.js 14

React + TypeScript

Tailwind CSS

Prisma ORM

SQLite

Node.js

SHA-256

MPC / Threshold Authorization Simulation

Proje, gerçek ödeme veya gerçek blockchain altyapısı yerine yerel demo ortamı kullanır.

📁 Proje Yapısı

app/
├── dashboard/
├── agent/
├── policies/
├── approvals/
├── transactions/
├── security/
├── audit/
├── wallet/
└── api/

components/
lib/
├── agent-engine.ts
├── policy-engine.ts
├── risk-engine.ts
├── mpc-simulation.ts
├── prisma.ts
└── utils.ts

prisma/
└── schema.prisma

README.md

🚀 Kurulum

Gereksinimler

Node.js 18+

npm 9+

Çalıştırma

git clone https://github.com/mlkaydemir/Agent-Pay.git
cd Agent-Pay
npm install
npm run db:push
npm run db:seed
npm run dev

Uygulama varsayılan olarak http://localhost:3000 adresinde çalışır.

Test

npm run lint
node test-e2e.js
npm run build

🔬 Gerçek ve Simülasyon Ayrımı

Bileşen

Durum

Web uygulaması

✅ Gerçek çalışan prototip

Policy Engine

✅ Gerçek çalışan uygulama mantığı

Risk Engine

✅ Gerçek çalışan uygulama mantığı

Audit Log

✅ Gerçek çalışan uygulama mantığı

Mock Wallet

✅ Gerçek çalışan demo sistemi

MPC / Threshold Authorization

🧪 Simülasyon

Smart Account / Blockchain

🧪 Simülasyon

Banka / Kart ödemesi

🧪 Simülasyon

⚠️ Kısıtlamalar

AgentPay bir üretim finans uygulaması değildir. Gerçek para transferi, gerçek banka/kart bağlantısı veya gerçek blockchain işlemi gerçekleştirmez.

MPC ve Smart Account bölümleri, gerçek sistemlerin çalışma mantığını göstermek amacıyla prototip seviyesinde simüle edilmiştir.

🔮 Gelecek Çalışmalar

Gerçek threshold signature altyapısı

Gerçek Smart Account entegrasyonu

Gerçek ödeme sağlayıcılarıyla entegrasyon

Daha gelişmiş risk analizi

WebAuthn / Passkey tabanlı gerçek kullanıcı doğrulaması

Bölgesel ödeme sistemleri ve yerel satıcı entegrasyonları

📌 Proje Özeti

AgentPay, AI ajanlarının finansal işlemler gerçekleştirmesinde güvenlik ve kontrol katmanı oluşturmayı hedefleyen bir prototiptir.

Temel yaklaşım:

AI karar verebilir, ancak harcama yetkisi kurallara bağlı olmalıdır.

📚 Araştırma Temeli

Proje fikri; agentic commerce, threshold cryptography, account abstraction ve AI agent security alanlarındaki güncel teknolojik gelişmeler incelenerek oluşturulmuştur.

Detaylı kaynak ve araştırma notları proje dokümantasyonunda yer almaktadır.
