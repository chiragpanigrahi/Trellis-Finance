-- ============================================================
-- V1: Initial Schema — Trellis Finance
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Organizations (parent companies and subsidiaries)
-- ------------------------------------------------------------
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    base_currency   VARCHAR(3)      NOT NULL,
    parent_org_id   UUID            REFERENCES organizations(id) ON DELETE RESTRICT,
    description     TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(255)    NOT NULL,
    role            VARCHAR(20)     NOT NULL CHECK (role IN ('ADMIN', 'VIEWER')),
    organization_id UUID            REFERENCES organizations(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Accounts (bank accounts, credit lines, internal ledgers)
-- ------------------------------------------------------------
CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255)    NOT NULL,
    account_type    VARCHAR(20)     NOT NULL CHECK (account_type IN ('CHECKING', 'SAVINGS', 'CREDIT', 'INTERNAL')),
    currency        VARCHAR(3)      NOT NULL,
    current_balance NUMERIC(20, 4)  NOT NULL DEFAULT 0,
    organization_id UUID            NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    description     TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Transactions (immutable ledger — no deletes, use reversals)
-- ------------------------------------------------------------
CREATE TABLE transactions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id       UUID            NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    type             VARCHAR(20)     NOT NULL CHECK (type IN ('DEBIT', 'CREDIT', 'REVERSAL')),
    amount           NUMERIC(20, 4)  NOT NULL CHECK (amount > 0),
    currency         VARCHAR(3)      NOT NULL,
    category         VARCHAR(100),
    description      TEXT,
    reference_id     UUID            REFERENCES transactions(id),
    status           VARCHAR(20)     NOT NULL DEFAULT 'POSTED' CHECK (status IN ('POSTED', 'REVERSED')),
    transaction_date DATE            NOT NULL DEFAULT CURRENT_DATE,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Indexes for query performance
-- ------------------------------------------------------------
CREATE INDEX idx_orgs_parent_id              ON organizations(parent_org_id);
CREATE INDEX idx_accounts_org_id             ON accounts(organization_id);
CREATE INDEX idx_transactions_account_id     ON transactions(account_id);
CREATE INDEX idx_transactions_date           ON transactions(transaction_date);
CREATE INDEX idx_transactions_category       ON transactions(category);
CREATE INDEX idx_transactions_status         ON transactions(status);
CREATE INDEX idx_transactions_account_date   ON transactions(account_id, transaction_date DESC);
