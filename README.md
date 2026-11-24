# Trellis Finance

**Enterprise Treasury Management Platform**

Multi-currency global liquidity consolidation, immutable ledger, and AI-driven insights.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Java 17, Spring Security + JWT |
| Database | PostgreSQL 16 (via Docker), Flyway migrations |
| Frontend | Vite + React 18, Zustand, Recharts |
| FX Rates | Frankfurter.app (free, no API key) |
| AI | Mock mode by default; set `OPENAI_API_KEY` for live |

---

## Prerequisites

1. **Java 17+** — [Download](https://adoptium.net/)
2. **Maven** — included as `mvnw` wrapper (or install separately)
3. **Node.js 18+** — [Download](https://nodejs.org/)
4. **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/) — for PostgreSQL

---

## Quick Start

### Option A: Automated (Windows)

```bat
start.bat
```

### Option B: Manual (step-by-step)

**1. Start PostgreSQL**
```bash
docker compose up -d
```

**2. Install & start the backend**
```bash
cd trellis-finance-backend
./mvnw spring-boot:run
# or: mvn spring-boot:run
```

**3. Install & start the frontend**
```bash
cd trellis-finance-frontend
npm install
npm run dev
```

---

## Access

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Trellis Finance UI |
| http://localhost:8080/swagger-ui.html | API Explorer (Swagger) |
| http://localhost:8080/actuator/health | Backend health check |

---

## First-Time Setup

1. Open `http://localhost:5173/register`
2. Create an account with your organization name and base currency
3. Seed data loads automatically via Flyway — 3 entities, 7 accounts, 21 transactions

> **Note:** Seed data uses fixed UUIDs for `Trellis Global HQ`, `Trellis Europe GmbH`, and `Trellis UK Ltd`.
> To connect your new account to the seed org, update `users.organization_id` in PostgreSQL, or
> simply create accounts manually via the Entities page after registration.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | `MOCK` | Set to enable real GPT-4o AI insights |
| `APP_JWT_SECRET` | (dev key) | Base64-encoded 256-bit secret for JWT |

Set in PowerShell:
```powershell
$env:OPENAI_API_KEY="sk-..."
cd trellis-finance-backend
./mvnw spring-boot:run
```

---

## Architecture

```
trellis-finance-backend/
  src/main/java/com/trellisfinance/core/
    ├── config/          SecurityConfig, OpenApiConfig, RestTemplateConfig
    ├── controller/      Auth, Org, Account, Transaction, Ledger, AIInsight
    ├── dto/             request/ and response/ DTOs
    ├── exception/       GlobalExceptionHandler, typed exceptions
    ├── model/           UserEntity, OrganizationEntity, Account, Transaction
    ├── repository/      JPA repositories with aggregate queries
    ├── security/        JwtTokenProvider, JwtTokenFilter, UserDetailsService
    └── service/         Auth, Organization, Ledger, ExchangeRate, AIAgents

trellis-finance-frontend/
  src/
    ├── components/
    │   ├── charts/      CashFlow, SpendingBreakdown, LiquidityGauge, SubsidiaryBar
    │   └── layout/      Sidebar, Navbar, AppLayout
    ├── hooks/           useAuth, useLedger
    ├── pages/           Dashboard, Ledger, Insights, Entities, Auth
    ├── services/        apiClient, auth, ledger, transaction, ai
    ├── store/           authStore (Zustand), ledgerStore
    └── utils/           currencyFormatter, dateFormatter
```

---

## Key Features

- **Global Liquidity Consolidation** — Real-time FX conversion via Frankfurter API, aggregated across all subsidiaries
- **Immutable Ledger** — Transactions are never deleted; errors corrected by REVERSAL entries only
- **AI Spending Anomalies** — Detects MoM spending spikes with category and entity attribution
- **Investment Recommendations** — Idle-cash detection with yield opportunity suggestions
- **JWT Auth** — Stateless, BCrypt-hashed passwords, 24h token expiry
- **Swagger UI** — Full API documentation at `/swagger-ui.html` with try-it-out
