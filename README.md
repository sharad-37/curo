<div align="center">

<img src="public/logos/curo-primary.svg" alt="Curo Logo" width="200" />

# Curo

### Your money, understood.

**AI-powered financial intelligence for modern India.**

Transform messy UPI statements into calm, art-directed clarity.
Zero bank credentials. Zero ads. Evidence-based insights.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2-2D3748?logo=prisma)](https://www.prisma.io/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📸 Preview

> _Add screenshots here after taking them (see Part 5 below)_

|               Landing Page               |                  Dashboard                   |                  Analytics                   |
| :--------------------------------------: | :------------------------------------------: | :------------------------------------------: |
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Analytics](docs/screenshots/analytics.png) |

---

## ✨ What is Curo?

Most Indian finance apps are built around three bad ideas: ask for your bank password, spam you with credit card ads, or dump raw transaction data back at you without context.

**Curo takes a different approach.** It reads your bank statement CSV, cleanses cryptic UPI narrations (`UPI-SWIGGY-REST-PAY-BANGALORE-9912` → `Swiggy`), categorizes every transaction using a scikit-learn classifier, and surfaces evidence-based insights about your actual spending behavior — all without storing bank credentials.

### Core Capabilities

- 🧠 **ML Transaction Classification** — Python FastAPI service with scikit-learn TF-IDF + Logistic Regression, trained on Indian UPI/card patterns
- 🔐 **Zero Credential Storage** — CSV upload only. No bank login scraping, ever.
- 💰 **Precision Financial Math** — Decimal.js arithmetic (no floating-point errors on money)
- 📊 **Evidence-Based Insights** — Month-end expenditure forecasting with daily run-rate analysis
- 🔁 **Recurring Subscription Detection** — Automatically identifies Netflix, Spotify, Rent, Gym
- 🎨 **Editorial Design System** — Switzer typography, warm ivory palette, Noho-inspired aesthetic
- 🛡️ **DPDP Compliant** — 1-click JSON export, permanent data deletion, per-user data isolation
- 🧮 **Deterministic Calculations** — All totals derived from source transactions, never fabricated

---

## 🏗️ Architecture

┌───────────────────────────────────────────────────────────┐
│ USER (Browser) │
└────────────────────────┬──────────────────────────────────┘
│ HTTPS
┌────────────────────────▼──────────────────────────────────┐
│ NEXT.JS 15 (App Router + RSC) │
│ Marketing · Auth Pages · Dashboard · Transactions · API │
└──────┬────────────────────────────────────┬───────────────┘
│ │
│ Prisma 6 ORM │ HTTP (1.5s timeout)
▼ ▼
┌─────────────────┐ ┌────────────────────────┐
│ NEON POSTGRES │ │ PYTHON FASTAPI (ML) │
│ (Serverless) │ │ scikit-learn TF-IDF │
│ Per-user │ │ Logistic Regression │
│ isolation │ │ Confidence scoring │
└─────────────────┘ └────────────────────────┘

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 15.1 (App Router, Server Actions)
- **UI Library:** React 19
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 4.0 (CSS-first config)
- **Animations:** Framer Motion 12 (`motion` package)
- **Charts:** Recharts 2.15
- **Forms:** React Hook Form 7 + Zod validation
- **UI Primitives:** Radix UI
- **Icons:** Lucide React

### Backend & Database

- **Auth:** Auth.js v5 (NextAuth) with GitHub OAuth
- **ORM:** Prisma 6.2
- **Database:** Neon PostgreSQL (serverless)
- **Precision Math:** Decimal.js (zero floating-point errors)
- **CSV Parsing:** PapaParse

### Machine Learning

- **Service:** Python 3.12 + FastAPI 0.115
- **ML Library:** scikit-learn 1.6 (TF-IDF Vectorizer + Logistic Regression)
- **Validation:** Pydantic 2.10

### Testing & Quality

- **Unit Tests:** Vitest 2.1
- **Linting:** ESLint 9 (flat config)
- **Package Manager:** pnpm 9

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20.11+**
- pnpm **9.x** (`npm install -g pnpm`)
- Python **3.12+**
- A Neon PostgreSQL database (free tier works) — [neon.tech](https://neon.tech)
- A GitHub OAuth app — [github.com/settings/developers](https://github.com/settings/developers)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/curo.git
cd curo
pnpm install
```

2. Environment Setup
   Bash

cp .env.example .env
Fill in your .env with:

DATABASE_URL from Neon
AUTH_SECRET (generate: npx auth secret)
AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from your GitHub OAuth app
GitHub OAuth callback URL: http://localhost:3000/api/auth/callback/github

3. Database Setup
   Bash

pnpm exec prisma generate
pnpm exec prisma db push 4. Install Python ML Service
Bash

cd ml-service
python -m pip install --upgrade pip
pip install -r requirements.txt --prefer-binary
cd .. 5. Run the Application
Terminal 1 — Next.js App:

Bash

pnpm dev
Opens at: http://localhost:3000

Terminal 2 — Python ML Service:

Bash

cd ml-service
python main.py
Opens at: http://127.0.0.1:8000 (Swagger docs at /docs)

6. Test the Flow
   Visit http://localhost:3000
   Click "Get started" → Sign in with GitHub
   Go to Transactions → Import CSV
   Upload the sample CSV from docs/sample-statement.csv
   View your automatically categorized dashboard
   🧪 Testing
   Bash

# Run unit tests (financial math, normalization, hashing)

pnpm test

# Run tests once (CI mode)

pnpm test --run
Current coverage:

✅ Merchant normalization (Indian UPI patterns)
✅ SHA-256 deduplication hashing
✅ Decimal arithmetic (floating-point safety)
✅ Categorization engine baseline
✅ Financial overview calculations
📁 Project Structure
text

curo/
├── app/
│ ├── (marketing)/ # Public landing, privacy, terms
│ ├── (auth)/ # Login, signup
│ ├── (app)/ # Authenticated dashboard, transactions, analytics
│ ├── actions/ # Server Actions (import, budget, privacy)
│ ├── api/ # Auth.js API routes
│ ├── error.tsx # Global error boundary
│ ├── not-found.tsx # 404 page
│ ├── robots.ts # SEO
│ └── sitemap.ts # SEO
├── components/
│ ├── brand/ # Logo system
│ ├── marketing/ # Hero, Features, Footer
│ ├── app/ # Sidebar, dropdowns, modals
│ ├── charts/ # Recharts wrappers
│ ├── motion/ # Framer Motion primitives
│ └── ui/ # Reusable primitives
├── lib/
│ ├── auth/ # Auth helpers
│ ├── db/ # Prisma singleton
│ ├── finance/ # Normalizer, categorizer, forecasting, insights
│ ├── ml/ # Python ML HTTP client (with fallback)
│ └── utils/ # Formatters, cn helper
├── ml-service/ # Python FastAPI ML microservice
│ ├── main.py
│ ├── model_trainer.py
│ └── requirements.txt
├── prisma/
│ └── schema.prisma # 15+ models for financial domain
├── public/
│ ├── fonts/ # Switzer + JetBrains Mono
│ ├── logos/ # SVG brand assets
│ └── favicon.svg
├── tests/
│ └── finance.test.ts
├── types/ # TypeScript declarations
├── auth.ts # Auth.js configuration
├── auth.config.ts # Edge-safe auth config
├── middleware.ts # Route protection
└── vitest.config.mjs
🎨 Design System
Color Palette
Token Hex Usage
curo-primary #4A7057 Primary green, CTAs, positive states
curo-secondary #8CA68F Secondary green, highlights
curo-background #F1EEE9 Warm ivory background
curo-surface #FFFFFF Card surfaces
curo-text #3C3C3C Primary text (charcoal)
curo-warning #C4956A Warm amber warnings
curo-negative #B87070 Muted rose errors
Typography
Display & Body: Switzer by Indian Type Foundry (free commercial license)
Monospace: JetBrains Mono (tabular numerals for financial figures)
🔐 Security & Privacy
Curo is designed with India's Digital Personal Data Protection Act 2023 (DPDP) in mind:

No bank credentials — CSV uploads only
Per-user data isolation — Every Prisma query scoped by userId
SHA-256 idempotency hashes — Prevents duplicate transaction imports
1-click data export — Full JSON backup available in settings
1-click account wipe — Permanent deletion of all records
JWT sessions — HTTP-only, SameSite=Lax cookies
No PII to AI models — Only anonymized merchant strings sent to classifier
📊 Machine Learning Details
The ML microservice (ml-service/) uses a scikit-learn Pipeline:

Python

Pipeline([
('tfidf', TfidfVectorizer(ngram_range=(1, 3), lowercase=True, max_features=1000)),
('clf', LogisticRegression(C=10.0, max_iter=200, solver='lbfgs'))
])
Trained on 60+ real Indian bank narration patterns across 10 categories:

Food & Dining, Groceries, Transport, Housing, Utilities
Subscriptions, Shopping, Healthcare, Investments, Income
Fallback behavior: If the Python service is offline, Next.js automatically falls back to a deterministic rule-based categorizer (lib/finance/categorizer.ts).

🤝 Contributing
This is a portfolio project, but issues and discussions are welcome. Feel free to open an issue if you spot a bug or have architectural feedback.

📄 License
MIT License — see LICENSE for details.

🙏 Acknowledgments
Design inspiration: Noho.ink — for the editorial aesthetic
Typography: Switzer by Indian Type Foundry
Database hosting: Neon — serverless Postgres
Icons: Lucide

<div align="center">
Built with intention for modern India.

If this project helped you learn something, consider giving it a ⭐

</div> ```
