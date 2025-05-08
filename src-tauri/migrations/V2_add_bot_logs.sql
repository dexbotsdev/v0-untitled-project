-- Migration: add_bot_logs
-- Version: 2

-- Create bot_logs table
CREATE TABLE IF NOT EXISTS bot_logs (
  id TEXT PRIMARY KEY,
  tokenId TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  metadata TEXT,
  FOREIGN KEY (tokenId) REFERENCES tokens(id) ON DELETE CASCADE
);

-- Create index for faster log retrieval
CREATE INDEX IF NOT EXISTS idx_bot_logs_tokenId ON bot_logs(tokenId);
CREATE INDEX IF NOT EXISTS idx_bot_logs_timestamp ON bot_logs(timestamp);

-- Add log retention setting to system_settings
ALTER TABLE system_settings ADD COLUMN logRetentionDays INTEGER NOT NULL DEFAULT 30;
