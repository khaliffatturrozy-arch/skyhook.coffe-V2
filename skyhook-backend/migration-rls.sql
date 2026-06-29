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

-- ==================================================
-- Staff table RLS (added to fix admin Access Denied bug)
-- WARNING: Do NOT use a single ALL policy with a recursive subquery
-- that reads the same table — that creates a circular dependency.
-- Use separate policies per command type instead.
-- ==================================================

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_staff" ON staff;
DROP POLICY IF EXISTS "users_read_own_staff" ON staff;
DROP POLICY IF EXISTS "authenticated_insert_staff" ON staff;
DROP POLICY IF EXISTS "admins_update_staff" ON staff;
DROP POLICY IF EXISTS "admins_delete_staff" ON staff;
DROP POLICY IF EXISTS "admins_insert_staff" ON staff;

-- Users can always read their own staff record (no circular dependency)
CREATE POLICY "users_read_own_staff" ON staff
  FOR SELECT USING (user_id = auth.uid());

-- Any authenticated user can register as staff (needed for first admin flow)
CREATE POLICY "authenticated_insert_staff" ON staff
  FOR INSERT WITH CHECK (true);

-- Admin/manager can update staff records
CREATE POLICY "admins_update_staff" ON staff
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
      AND s.role IN ('admin', 'manager'))
  );

-- Admin/manager can delete staff records
CREATE POLICY "admins_delete_staff" ON staff
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
      AND s.role IN ('admin', 'manager'))
  );

-- Admin/manager can insert staff records (admins creating new staff)
CREATE POLICY "admins_insert_staff" ON staff
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
      AND s.role IN ('admin', 'manager'))
  );
