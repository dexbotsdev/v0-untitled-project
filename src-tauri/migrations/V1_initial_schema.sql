-- Migration: initial_schema
-- Version: 1

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  address TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  price REAL,
  priceChange REAL,
  marketCap REAL,
  holders INTEGER,
  liquidity REAL,
  status TEXT NOT NULL DEFAULT 'paused',
  progress REAL NOT NULL DEFAULT 0,
  volumeTarget REAL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Create bot_settings table
CREATE TABLE IF NOT EXISTS bot_settings (
  id TEXT PRIMARY KEY,
  tokenId TEXT UNIQUE NOT NULL,
  minTradeAmount REAL NOT NULL,
  maxTradeAmount REAL NOT NULL,
  duration INTEGER NOT NULL,
  strategy TEXT NOT NULL,
  tradesPerMinute INTEGER NOT NULL,
  numberOfWallets INTEGER NOT NULL,
  useAntiMev INTEGER NOT NULL DEFAULT 0,
  tipAmount INTEGER NOT NULL DEFAULT 10000,
  priorityFees INTEGER NOT NULL DEFAULT 10000,
  slippage REAL NOT NULL DEFAULT 5,
  startTime TEXT,
  endTime TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE CASCADE
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY,
  address TEXT UNIQUE NOT NULL,
  privateKey TEXT,
  solBalance REAL NOT NULL DEFAULT 0,
  tokenBalance REAL NOT NULL DEFAULT 0,
  tradesCount INTEGER NOT NULL DEFAULT 0,
  lastTrade TEXT,
  isDevWallet INTEGER NOT NULL DEFAULT 0,
  isFundingWallet INTEGER NOT NULL DEFAULT 0,
  tokenId TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE SET NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  tokenAmount REAL NOT NULL,
  price REAL NOT NULL,
  txHash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  fee REAL,
  priorityFee INTEGER,
  walletId TEXT NOT NULL,
  tokenId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  completedAt TEXT,
  FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
  FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE CASCADE
);

-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  isActive INTEGER NOT NULL DEFAULT 1,
  activatedAt TEXT,
  expiresAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  antiBubblemap INTEGER NOT NULL DEFAULT 0,
  defaultPriorityFee REAL NOT NULL DEFAULT 1.5,
  updatedAt TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallets_tokenId ON wallets(tokenId);
CREATE INDEX IF NOT EXISTS idx_transactions_walletId ON transactions(walletId);
CREATE INDEX IF NOT EXISTS idx_transactions_tokenId ON transactions(tokenId);
