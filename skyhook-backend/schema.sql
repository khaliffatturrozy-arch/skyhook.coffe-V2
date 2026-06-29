-- ==================================================
-- SKYHOOK COFFEE
-- Enterprise PostgreSQL Database Schema
-- ==================================================

-- Enable UUID & Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables for clean migration
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS event_tickets CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP MATERIALIZED VIEW IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS outlets CASCADE;

-- ==================================================
-- OUTLETS
-- ==================================================
CREATE TABLE outlets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Indonesia',
  phone VARCHAR(50),
  email VARCHAR(255),
  opening_hours TIME NOT NULL,
  closing_hours TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outlets_city ON outlets(city);
CREATE INDEX idx_outlets_active ON outlets(is_active);

-- ==================================================
-- USERS
-- ==================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  membership_tier VARCHAR(50) DEFAULT 'Member',
  loyalty_points BIGINT DEFAULT 0,
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  last_visit TIMESTAMPTZ,
  preferences JSONB DEFAULT '{}',
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(membership_tier);
CREATE INDEX idx_users_points ON users(loyalty_points DESC);

-- ==================================================
-- MEMBERSHIPS
-- ==================================================
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL DEFAULT 'Member',
  points BIGINT DEFAULT 0,
  lifetime_points BIGINT DEFAULT 0,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_tier ON memberships(tier);
CREATE INDEX idx_memberships_points ON memberships(points DESC);

-- ==================================================
-- CATEGORIES
-- ==================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_sort ON categories(sort_order);

-- ==================================================
-- MENU
-- ==================================================
CREATE TABLE menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  preparation_time INT DEFAULT 5,
  ingredients JSONB DEFAULT '[]',
  nutritional_info JSONB DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_category ON menu(category_id);
CREATE INDEX idx_menu_available ON menu(is_available);
CREATE INDEX idx_menu_featured ON menu(is_featured) WHERE is_featured = true;

-- ==================================================
-- TABLES
-- ==================================================
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID REFERENCES outlets(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  capacity INT NOT NULL DEFAULT 2,
  status VARCHAR(20) DEFAULT 'available',
  section VARCHAR(100),
  qr_code TEXT,
  is_vip BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(outlet_id, table_number)
);

CREATE INDEX idx_tables_outlet ON tables(outlet_id);
CREATE INDEX idx_tables_status ON tables(status);

-- ==================================================
-- ORDERS
-- ==================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  subtotal DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  service_charge DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  payment_id TEXT,
  notes TEXT,
  is_split_bill BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_outlet ON orders(outlet_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ==================================================
-- ORDER ITEMS
-- ==================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu(id) ON DELETE SET NULL,
  menu_item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_status ON order_items(status);

-- ==================================================
-- RESERVATIONS
-- ==================================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- ==================================================
-- EVENTS
-- ==================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  venue VARCHAR(255),
  image_url TEXT,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2),
  capacity INT,
  tickets_sold INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;

-- ==================================================
-- EVENT TICKETS
-- ==================================================
CREATE TABLE event_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  total_paid DECIMAL(10, 2) NOT NULL,
  qr_code TEXT,
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_tickets_event ON event_tickets(event_id);
CREATE INDEX idx_event_tickets_user ON event_tickets(user_id);

-- ==================================================
-- WALLETS
-- ==================================================
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12, 2) DEFAULT 0,
  cashback_balance DECIMAL(12, 2) DEFAULT 0,
  reward_points BIGINT DEFAULT 0,
  promo_credits DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

-- ==================================================
-- WALLET TRANSACTIONS
-- ==================================================
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wallet_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_tx_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_tx_created ON wallet_transactions(created_at DESC);

-- ==================================================
-- LEADERBOARD (Materialized View)
-- ==================================================
CREATE MATERIALIZED VIEW leaderboard AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.avatar_url,
  u.membership_tier,
  u.loyalty_points AS total_points,
  ROW_NUMBER() OVER (ORDER BY u.loyalty_points DESC) AS rank
FROM users u
WHERE u.loyalty_points > 0
ORDER BY u.loyalty_points DESC;

CREATE UNIQUE INDEX idx_leaderboard_user ON leaderboard(user_id);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);

-- ==================================================
-- ACHIEVEMENTS
-- ==================================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(50) NOT NULL,
  points_required INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================================================
-- USER ACHIEVEMENTS
-- ==================================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ==================================================
-- NOTIFICATIONS
-- ==================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ==================================================
-- STAFF
-- ==================================================
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  outlet_id UUID REFERENCES outlets(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  shift VARCHAR(20),
  pin_code VARCHAR(6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, outlet_id)
);

CREATE INDEX idx_staff_outlet ON staff(outlet_id);
CREATE INDEX idx_staff_role ON staff(role);

-- ==================================================
-- INVENTORY
-- ==================================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID REFERENCES outlets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  min_stock DECIMAL(10, 2) DEFAULT 0,
  max_stock DECIMAL(10, 2),
  supplier VARCHAR(255),
  cost_per_unit DECIMAL(10, 2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_outlet ON inventory(outlet_id);
CREATE INDEX idx_inventory_low ON inventory(outlet_id) WHERE quantity <= min_stock;

-- ==================================================
-- ANALYTICS
-- ==================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ==================================================
-- ROW LEVEL SECURITY
-- ==================================================
-- Public tables (read-only for anon, full access for service_role)
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- User-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tickets ENABLE ROW LEVEL SECURITY;

-- Public table policies (anon read + service_role full access)
CREATE POLICY outlets_public ON outlets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY categories_public ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY menu_public ON menu FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY tables_public ON tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY events_public ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY achievements_public ON achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY user_achievements_public ON user_achievements FOR ALL USING (true) WITH CHECK (true);

-- User Policies
CREATE POLICY users_self ON users
  FOR ALL USING (auth.uid() = id);

-- Order Policies
CREATE POLICY orders_self ON orders
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY orders_staff ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid() AND outlet_id = orders.outlet_id)
  );

-- Wallet Policies
CREATE POLICY wallets_self ON wallets
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY wallet_tx_self ON wallet_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM wallets WHERE id = wallet_id AND user_id = auth.uid())
  );

-- Notification Policies
CREATE POLICY notifications_self ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- ==================================================
-- FUNCTIONS & TRIGGERS
-- ==================================================

-- Update leaderboard on points change
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_leaderboard
  AFTER INSERT OR UPDATE OF loyalty_points ON users
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_leaderboard();

-- Auto-create wallet on user creation
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallet
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();

-- Update order total
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders SET
    subtotal = (SELECT COALESCE(SUM(subtotal), 0) FROM order_items WHERE order_id = NEW.order_id),
    total = (SELECT COALESCE(SUM(subtotal), 0) * 1.11 FROM order_items WHERE order_id = NEW.order_id)
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_total
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_total();

-- Check if any admin/manager exists (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.staff WHERE role IN ('admin', 'manager'));
$$;

-- Check a specific user's staff role (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.check_staff_role(p_user_id uuid)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT role FROM public.staff
  WHERE user_id = p_user_id
    AND role IN ('admin', 'manager')
    AND is_active = true
  LIMIT 1;
$$;

-- Update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_orders_timestamp BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_menu_timestamp BEFORE UPDATE ON menu
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_outlets_timestamp BEFORE UPDATE ON outlets
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_wallets_timestamp BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
