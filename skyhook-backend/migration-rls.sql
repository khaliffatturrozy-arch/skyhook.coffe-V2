-- ==================================================
-- SKYHOOK COFFEE — RLS Migration
-- Add RLS policies for public tables
-- Run this if you get "violates row-level security" errors
-- ==================================================

-- Enable RLS on public tables (safe to re-run)
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to allow re-runs
DROP POLICY IF EXISTS outlets_public ON outlets;
DROP POLICY IF EXISTS categories_public ON categories;
DROP POLICY IF EXISTS menu_public ON menu;
DROP POLICY IF EXISTS tables_public ON tables;
DROP POLICY IF EXISTS events_public ON events;
DROP POLICY IF EXISTS achievements_public ON achievements;
DROP POLICY IF EXISTS user_achievements_public ON user_achievements;

-- Allow full access to public tables (required for seed data + public reads)
CREATE POLICY outlets_public ON outlets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY categories_public ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY menu_public ON menu FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY tables_public ON tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY events_public ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY achievements_public ON achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY user_achievements_public ON user_achievements FOR ALL USING (true) WITH CHECK (true);
