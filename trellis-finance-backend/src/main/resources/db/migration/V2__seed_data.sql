-- ============================================================
-- V2: Seed Data — Demo Organizations, Accounts, Transactions
-- ============================================================

-- ------------------------------------------------------------
-- Parent Organization: Trellis Global HQ (USD)
-- ------------------------------------------------------------
INSERT INTO organizations (id, name, base_currency, description, created_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Trellis Global HQ', 'USD',
 'Parent company and global treasury headquarters', NOW() - INTERVAL '365 days');

-- ------------------------------------------------------------
-- Subsidiaries
-- ------------------------------------------------------------
INSERT INTO organizations (id, name, base_currency, parent_org_id, description, created_at) VALUES
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Trellis Europe GmbH', 'EUR',
 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'European operations headquartered in Frankfurt', NOW() - INTERVAL '300 days'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Trellis UK Ltd', 'GBP',
 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'UK operations based in London', NOW() - INTERVAL '280 days');

-- ------------------------------------------------------------
-- Accounts — Global HQ (USD)
-- ------------------------------------------------------------
INSERT INTO accounts (id, name, account_type, currency, current_balance, organization_id, description, created_at) VALUES
('d4e5f6a7-b8c9-0123-def0-234567890123', 'Trellis Main Checking',   'CHECKING', 'USD', 4250000.00,
 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Primary USD operating account', NOW() - INTERVAL '365 days'),
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'Trellis Reserve Savings',  'SAVINGS',  'USD', 8750000.00,
 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Strategic reserve and capital buffer', NOW() - INTERVAL '365 days'),
('f6a7b8c9-d0e1-2345-f012-456789012345', 'Trellis Credit Facility',  'CREDIT',   'USD', 0.00,
 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '$5M revolving credit line — undrawn', NOW() - INTERVAL '200 days');

-- Accounts — Trellis Europe (EUR)
INSERT INTO accounts (id, name, account_type, currency, current_balance, organization_id, description, created_at) VALUES
('a7b8c9d0-e1f2-3456-0123-567890123456', 'Europe Operating Account', 'CHECKING', 'EUR', 1870000.00,
 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'EUR primary operations account', NOW() - INTERVAL '300 days'),
('b8c9d0e1-f2a3-4567-1234-678901234567', 'Europe VAT Reserve',       'SAVINGS',  'EUR', 450000.00,
 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'VAT obligations reserve account', NOW() - INTERVAL '300 days');

-- Accounts — Trellis UK (GBP)
INSERT INTO accounts (id, name, account_type, currency, current_balance, organization_id, description, created_at) VALUES
('c9d0e1f2-a3b4-5678-2345-789012345678', 'UK Primary Account',   'CHECKING', 'GBP', 925000.00,
 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'GBP primary operating account', NOW() - INTERVAL '280 days'),
('d0e1f2a3-b4c5-6789-3456-890123456789', 'UK Payroll Account',   'CHECKING', 'GBP', 380000.00,
 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'Dedicated payroll disbursement account', NOW() - INTERVAL '280 days');

-- ------------------------------------------------------------
-- Transactions — Global HQ (USD)
-- ------------------------------------------------------------
INSERT INTO transactions (account_id, type, amount, currency, category, description, transaction_date) VALUES
('d4e5f6a7-b8c9-0123-def0-234567890123', 'CREDIT', 2500000.00, 'USD', 'Revenue',             'Q1 Enterprise License Revenue — Batch A',           NOW() - INTERVAL '89 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',   185000.00, 'USD', 'Payroll',             'March 2026 US Payroll — Engineering & Product',      NOW() - INTERVAL '75 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',    42000.00, 'USD', 'Cloud Infrastructure','AWS Monthly Invoice — us-east-1',                   NOW() - INTERVAL '60 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',    18500.00, 'USD', 'SaaS Subscriptions', 'Salesforce Enterprise — Annual renewal',             NOW() - INTERVAL '55 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',    32000.00, 'USD', 'SaaS Subscriptions', 'GitHub + Datadog + PagerDuty + Notion seats',        NOW() - INTERVAL '50 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'CREDIT', 1800000.00, 'USD', 'Revenue',             'Q1 Enterprise License Revenue — Batch B',           NOW() - INTERVAL '30 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',    95000.00, 'USD', 'Legal & Compliance',  'Q1 Legal Retainer — Skadden LLP',                   NOW() - INTERVAL '20 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',   185000.00, 'USD', 'Payroll',             'April 2026 US Payroll — Engineering & Product',     NOW() - INTERVAL '15 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'DEBIT',    55200.00, 'USD', 'Cloud Infrastructure','AWS Monthly Invoice — us-east-1 (+31% MoM spike)',  NOW() - INTERVAL '5 days'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'CREDIT',  650000.00, 'USD', 'Revenue',             'Q2 SaaS Renewal Cohort — North America',            NOW() - INTERVAL '2 days');

-- Transactions — Trellis Europe (EUR)
INSERT INTO transactions (account_id, type, amount, currency, category, description, transaction_date) VALUES
('a7b8c9d0-e1f2-3456-0123-567890123456', 'CREDIT',  950000.00, 'EUR', 'Revenue',             'Q1 EU Partner Revenue — DACH Region',               NOW() - INTERVAL '85 days'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'DEBIT',   125000.00, 'EUR', 'Payroll',             'March 2026 EU Payroll',                             NOW() - INTERVAL '72 days'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'DEBIT',    38000.00, 'EUR', 'Cloud Infrastructure','AWS eu-west-1 + Azure Germany North',               NOW() - INTERVAL '58 days'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'DEBIT',    12500.00, 'EUR', 'SaaS Subscriptions', 'Figma + Slack + Notion EU seats',                   NOW() - INTERVAL '40 days'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'CREDIT',  720000.00, 'EUR', 'Revenue',             'Q1 EU Partner Revenue — Nordics & Benelux',        NOW() - INTERVAL '25 days'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'DEBIT',    49800.00, 'EUR', 'Cloud Infrastructure','AWS eu-west-1 May invoice (+31% — anomaly flagged)', NOW() - INTERVAL '3 days');

-- Transactions — Trellis UK (GBP)
INSERT INTO transactions (account_id, type, amount, currency, category, description, transaction_date) VALUES
('c9d0e1f2-a3b4-5678-2345-789012345678', 'CREDIT',  680000.00, 'GBP', 'Revenue',            'Q1 UK Government Contracts — MOD + HMRC',          NOW() - INTERVAL '80 days'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'DEBIT',    95000.00, 'GBP', 'Payroll',            'March 2026 UK Payroll',                            NOW() - INTERVAL '70 days'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'DEBIT',    15200.00, 'GBP', 'SaaS Subscriptions','Salesforce UK + Jira + Confluence seats',           NOW() - INTERVAL '42 days'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'CREDIT',  520000.00, 'GBP', 'Revenue',            'Q2 UK Enterprise Renewals',                        NOW() - INTERVAL '10 days'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'DEBIT',    95000.00, 'GBP', 'Payroll',            'April 2026 UK Payroll',                            NOW() - INTERVAL '7 days');
