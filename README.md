# Trellis Finance

**Enterprise Treasury Management Platform**

Multi-currency global liquidity consolidation, immutable ledger, and AI-driven insights.

Trellis Finance is a multi-entity treasury management platform designed to help organizations manage financial accounts across subsidiaries, consolidate global liquidity into a common base currency, maintain an immutable transaction ledger, and gain actionable financial insights.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2, Java 17, Spring Security + JWT |
| Database | PostgreSQL 16, Docker, Flyway migrations |
| Frontend | React 18, Vite, Zustand, Recharts |
| Authentication | Spring Security, JWT, BCrypt |
| FX Rates | Frankfurter.app (free, no API key required) |
| AI | Mock mode by default; OpenAI API integration through `OPENAI_API_KEY` |
| API Documentation | Springdoc OpenAPI, Swagger UI |
| Infrastructure | Docker Compose |

---

## Key Features

### 1. Multi-Entity Treasury Management
- Manage a parent organization and multiple subsidiaries.
- Maintain financial accounts across different entities.
- Support multiple account currencies.
- Consolidate financial information across the organization.

### 2. Global Liquidity Consolidation
- Aggregate balances across multiple subsidiaries.
- Convert foreign currency balances into a common base currency.
- Retrieve live exchange rates through the Frankfurter API.
- Provide a consolidated view of organizational liquidity.

### 3. Immutable Financial Ledger
- Maintain a transaction history that cannot be directly deleted.
- Correct erroneous transactions through reversal entries.
- Preserve financial auditability and transaction integrity.
- Track transaction activity across accounts and entities.

### 4. AI-Driven Financial Insights
- Identify month-over-month spending anomalies.
- Highlight unusual spending patterns by category and entity.
- Detect idle cash and suggest potential yield opportunities.
- Support mock AI mode by default, with optional OpenAI API integration.

### 5. Secure Authentication
- JWT-based stateless authentication.
- Password hashing using BCrypt.
- Protected backend endpoints.
- Configurable token expiration.

### 6. Financial Dashboard
- Consolidated liquidity overview.
- Cash flow visualization.
- Spending breakdown charts.
- Subsidiary-level financial comparisons.
- Liquidity gauge visualization.

---

## Project Architecture

```text
Trellis-Finance/
│
├── trellis-finance-backend/
│   ├── src/main/java/com/trellisfinance/core/
│   │   ├── config/
│   │   │   ├── SecurityConfig
│   │   │   ├── OpenApiConfig
│   │   │   └── RestTemplateConfig
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController
│   │   │   ├── OrganizationController
│   │   │   ├── AccountController
│   │   │   ├── TransactionController
│   │   │   ├── LedgerController
│   │   │   └── AIInsightController
│   │   │
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   └── response/
│   │   │
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler
│   │   │
│   │   ├── model/
│   │   │   ├── UserEntity
│   │   │   ├── OrganizationEntity
│   │   │   ├── Account
│   │   │   └── Transaction
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository
│   │   │   ├── OrganizationRepository
│   │   │   ├── AccountRepository
│   │   │   └── TransactionRepository
│   │   │
│   │   ├── security/
│   │   │   ├── JwtTokenProvider
│   │   │   ├── JwtTokenFilter
│   │   │   └── CustomUserDetailsService
│   │   │
│   │   └── service/
│   │       ├── AuthService
│   │       ├── OrganizationService
│   │       ├── LedgerService
│   │       ├── ExchangeRateService
│   │       └── AIAgentsService
│   │
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/
│           ├── V1__init_schema.sql
│           └── V2__seed_data.sql
│
├── trellis-finance-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Entities/
│   │   │   ├── Insights/
│   │   │   └── Ledger/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── start.bat
├── .gitignore
└── README.md
```

---

## Prerequisites

Install the following before running the project:

1. **Java 17 or higher** – [Download](https://adoptium.net/)
2. **Node.js 18 or higher** – [Download](https://nodejs.org/)
3. **Docker Desktop** – [Download](https://www.docker.com/products/docker-desktop/)
4. **Git** – [Download](https://git-scm.com/)

The backend includes a Maven wrapper (`mvnw`), so a separate Maven installation is generally unnecessary.

---

## Getting Started

### Option A: Automated Setup (Windows)

Run the startup script from the project root:

```bat
start.bat
```

### Option B: Manual Setup

**Step 1: Start PostgreSQL**

From the project root:

```bash
docker compose up -d
```

**Step 2: Configure environment variables**

Configure the following variables before starting the backend:

| Variable | Required | Description |
|---|---|---|
| `DB_PASSWORD` | Yes | PostgreSQL database password |
| `APP_JWT_SECRET` | Yes | Base64-encoded 256-bit JWT secret |
| `OPENAI_API_KEY` | No | OpenAI API key; defaults to mock mode |

For example, in PowerShell:

```powershell
$env:DB_PASSWORD="your_database_password"
$env:APP_JWT_SECRET="your_base64_encoded_256_bit_secret"
$env:OPENAI_API_KEY="your_openai_api_key"
```

For local development, the database configuration provides a fallback password. Configure matching credentials for PostgreSQL and the backend.

**Step 3: Start the backend**

```bash
cd trellis-finance-backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

**Step 4: Start the frontend**

Open another terminal:

```bash
cd trellis-finance-frontend
npm install
npm run dev
```

---

## Application Access

| URL | Description |
|---|---|
| http://localhost:5173 | Trellis Finance frontend |
| http://localhost:8080/swagger-ui.html | Swagger API documentation |
| http://localhost:8080/v3/api-docs | OpenAPI specification |
| http://localhost:8080/actuator/health | Backend health check |

---

## First-Time Setup

1. Start PostgreSQL, the backend, and the frontend.
2. Open `http://localhost:5173/register`.
3. Register an account with your organization name and base currency.
4. Access the dashboard and explore the available treasury features.

The Flyway migrations initialize the database schema and seed demonstration data.

**Note:** The seed data uses fixed UUIDs for `Trellis Global HQ`, `Trellis Europe GmbH`, and `Trellis UK Ltd`. Follow the application's database relationship requirements when connecting a newly registered user to the seeded organization.

---

## Environment Configuration

The backend reads configuration from environment variables.

Example PowerShell configuration:

```powershell
$env:DB_PASSWORD="your_database_password"
$env:APP_JWT_SECRET="your_base64_encoded_256_bit_secret"
$env:OPENAI_API_KEY="your_openai_api_key"

cd trellis-finance-backend
.\mvnw.cmd spring-boot:run
```

**Security recommendations:**
- Never commit real API keys, passwords, or production JWT secrets.
- Use a newly generated, cryptographically secure JWT secret.
- Keep local environment files excluded through `.gitignore`.
- Change development credentials before deployment.
- Ensure the database and backend use matching credentials.

---

## Database Management

Trellis Finance uses PostgreSQL 16 with Flyway database migrations.

Migration files:

```text
src/main/resources/db/migration/
├── V1__init_schema.sql
└── V2__seed_data.sql
```

Flyway automatically applies the migrations when the backend starts.

The database uses Hibernate schema validation rather than automatic schema creation.

---

## API Documentation

The backend integrates Springdoc OpenAPI.

Once the backend is running, access:

```text
http://localhost:8080/swagger-ui.html
```

Swagger UI provides an interactive interface for exploring and testing the available REST API endpoints.

---

## Design Principles

- **Financial Integrity:** Preserve transaction history through an immutable ledger and reversal-based corrections.
- **Multi-Entity Architecture:** Support parent organizations, subsidiaries, and their financial accounts.
- **Currency Consolidation:** Convert multi-currency balances into a common reporting currency.
- **Security:** Use JWT authentication and BCrypt password hashing.
- **Scalability:** Separate frontend, backend, and database responsibilities.
- **Extensibility:** Keep financial services modular to support future integrations and capabilities.

---

## Future Scope

- Integration with additional banking and financial data providers.
- Advanced treasury forecasting and cash-flow prediction.
- Expanded AI-assisted financial analysis.
- Role-based access control for multi-entity organizations.
- Automated financial reporting and reconciliation.
- Cloud deployment and production-grade observability.

---

## Author

**Chirag Panigrahi**

Software Engineer | Java | Spring Boot | Enterprise Backend Systems

---

## License

This project is available for educational and portfolio demonstration purposes. Add an appropriate open-source license if you intend to permit public reuse and redistribution.
