-- Add theme column to user_preferences table
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'system';
