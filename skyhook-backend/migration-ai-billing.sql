-- ==================================================
-- SKYHOOK COFFEE
-- AI Usage Billing Migration
-- Each AI query deducts from user's wallet balance
-- ==================================================

-- AI Usage Log
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
  query_type VARCHAR(50) NOT NULL,
  tokens_prompt INT DEFAULT 0,
  tokens_completion INT DEFAULT 0,
  cost DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(12, 2) NOT NULL,
  balance_after DECIMAL(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_type ON ai_usage_log(query_type);

-- RLS: allow insert for service role, select for own user
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI usage" ON ai_usage_log;
CREATE POLICY "Users can view own AI usage" ON ai_usage_log
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert AI usage" ON ai_usage_log;
CREATE POLICY "Service role can insert AI usage" ON ai_usage_log
  FOR INSERT
  WITH CHECK (true);

-- Add ai_credits column to wallets (alternative to using balance directly)
-- We'll use the existing `balance` field for simplicity
-- Add a view for easy AI balance checking
CREATE OR REPLACE VIEW ai_credit_balance AS
SELECT
  w.user_id,
  w.balance AS ai_credits,
  COALESCE(SUM(CASE WHEN aul.status = 'success' THEN aul.cost ELSE 0 END), 0) AS total_ai_spent,
  COUNT(CASE WHEN aul.status = 'success' THEN 1 END) AS total_ai_queries
FROM wallets w
LEFT JOIN ai_usage_log aul ON aul.wallet_id = w.id
GROUP BY w.user_id, w.balance;
