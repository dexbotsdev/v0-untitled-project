-- Migration: add_bot_logs (down)
-- Version: 2

-- Remove log retention setting from system_settings
-- SQLite doesn't support DROP COLUMN, so we need to recreate the table
CREATE TABLE system_settings_new (
  id TEXT PRIMARY KEY,
  antiBubblemap INTEGER NOT NULL DEFAULT 0,
  defaultPriorityFee REAL NOT NULL DEFAULT 1.5,
  updatedAt TEXT NOT NULL
);

-- Copy data from old table to new table
INSERT INTO system_settings_new (id, antiBubblemap, defaultPriorityFee, updatedAt)
SELECT id, antiBubblemap, defaultPriorityFee, updatedAt FROM system_settings;

-- Drop old table and rename new table
DROP TABLE system_settings;
ALTER TABLE system_settings_new RENAME TO system_settings;

-- Drop indexes
DROP INDEX IF EXISTS idx_bot_logs_timestamp;
DROP INDEX IF EXISTS idx_bot_logs_tokenId;

-- Drop bot_logs table
DROP TABLE IF EXISTS bot_logs;
