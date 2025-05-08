-- Migration: initial_schema (down)
-- Version: 1

-- Drop indexes
DROP INDEX IF EXISTS idx_transactions_tokenId;
DROP INDEX IF EXISTS idx_transactions_walletId;
DROP INDEX IF EXISTS idx_wallets_tokenId;

-- Drop tables in reverse order of creation (to respect foreign keys)
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS bot_settings;
DROP TABLE IF EXISTS tokens;
