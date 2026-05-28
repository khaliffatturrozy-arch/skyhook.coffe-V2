-- ==================================================
-- SKYHOOK COFFEE — Seed Data
-- ==================================================

-- Clear existing seed data (order matters for FK constraints)
DELETE FROM events;
DELETE FROM tables;
DELETE FROM menu;
DELETE FROM achievements;
DELETE FROM categories;
DELETE FROM outlets;

-- OUTLETS
INSERT INTO outlets (id, name, slug, address, city, country, phone, opening_hours, closing_hours, is_active, latitude, longitude, description)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Skyhook Coffee Rooftop House and Kitchen — Jakarta', 'skyhook-jakarta', 'Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti, Kec. Makasar', 'Jakarta Timur', 'Indonesia', '081774934980', '15:00', '23:00', true, -6.284886, 106.879301, 'Rooftop house and kitchen di Jakarta Timur — didepan SPBU Kampung Makasar');

-- CATEGORIES
INSERT INTO categories (id, name, slug, description, sort_order)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'Signature', 'signature', 'Signature coffee creations — spesial dari Skyhook', 1),
  ('b2000000-0000-0000-0000-000000000002', 'Non Coffee', 'non-coffee', 'Minuman segar non-kopi untuk semua', 2);

-- MENU ITEMS (real data from skyhookcoffee.com menu)
-- SIGNATURE
INSERT INTO menu (id, category_id, name, slug, description, price, is_available, is_featured, preparation_time)
VALUES
  ('c3000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'Americano Coffee + Cream + Fresh Milk', 'americano-cream-fresh-milk', 'American coffee with cream and fresh milk', 23000, true, true, 3),
  ('c3000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu SKY', 'es-kopi-susu-sky', 'Kopi susu dengan basis espresso dan gula aren', 23000, true, true, 3),
  ('c3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu ALAM', 'es-kopi-susu-alam', 'Kopi susu dengan basis espresso dan syrup pandan', 25000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu FLYING', 'es-kopi-susu-flying', 'Kopi susu dengan basis espresso dan salted caramel / roasted almond', 25000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu Coklat', 'es-kopi-susu-coklat', 'Kopi susu dengan basis espresso dan perasa coklat', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu Pisang', 'es-kopi-susu-pisang', 'Kopi susu dengan basis espresso dan syrup pisang', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000007', 'b2000000-0000-0000-0000-000000000001', 'Es Kopi Susu Cream Vanilla', 'es-kopi-susu-cream-vanilla', 'Kopi susu dengan basis espresso dan ice cream vanilla', 28000, true, true, 4),
  ('c3000000-0000-0000-0000-000000000008', 'b2000000-0000-0000-0000-000000000001', 'Ice Creambrulee', 'ice-creambrulee', 'Espresso dengan paduan white chocolate dan syrup caramel', 28000, true, false, 5),
  ('c3000000-0000-0000-0000-000000000009', 'b2000000-0000-0000-0000-000000000001', 'Ice Mocca Rum', 'ice-mocca-rum', 'Espresso dengan paduan coklat dan syrup caramel', 28000, true, false, 5);

-- NON COFFEE
INSERT INTO menu (id, category_id, name, slug, description, price, is_available, is_featured, preparation_time)
VALUES
  ('c3000000-0000-0000-0000-000000000010', 'b2000000-0000-0000-0000-000000000002', 'Chocolate Ice', 'chocolate-ice', 'Chocolate dengan fresh milk', 25000, true, true, 3),
  ('c3000000-0000-0000-0000-000000000011', 'b2000000-0000-0000-0000-000000000002', 'Coffee Beer', 'coffee-beer', 'Kopi dengan soda — unik dan menyegarkan', 28000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000012', 'b2000000-0000-0000-0000-000000000002', 'Soda Yakult Strawberry', 'soda-yakult-strawberry', 'Yakult bersoda dengan campuran perasa strawberry', 23000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000013', 'b2000000-0000-0000-0000-000000000002', 'Soda Yakult Lychee', 'soda-yakult-lychee', 'Yakult bersoda dengan campuran perasa lychee', 23000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000014', 'b2000000-0000-0000-0000-000000000002', 'Soda Yakult Banana', 'soda-yakult-banana', 'Yakult bersoda dengan campuran perasa pisang', 23000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000015', 'b2000000-0000-0000-0000-000000000002', 'Choco Banana', 'choco-banana', 'Perpaduan coklat dan pisang yang creamy', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000016', 'b2000000-0000-0000-0000-000000000002', 'Choco Hazelnut', 'choco-hazelnut', 'Coklat dengan hazelnut yang kaya rasa', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000017', 'b2000000-0000-0000-0000-000000000002', 'Choco Rum', 'choco-rum', 'Coklat dengan aroma rum yang khas', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000018', 'b2000000-0000-0000-0000-000000000002', 'Greentea', 'greentea', 'Green tea segar pilihan', 25000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000019', 'b2000000-0000-0000-0000-000000000002', 'Taro', 'taro', 'Minuman taro creamy dan manis', 25000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000020', 'b2000000-0000-0000-0000-000000000002', 'Lemon Tea', 'lemon-tea', 'Teh lemon segar', 20000, true, false, 2),
  ('c3000000-0000-0000-0000-000000000021', 'b2000000-0000-0000-0000-000000000002', 'Red Velvet', 'red-velvet', 'Minuman red velvet yang lembut', 25000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000022', 'b2000000-0000-0000-0000-000000000002', 'Ice Tea', 'ice-tea', 'Teh manis segar dengan es batu', 15000, true, true, 2),
  ('c3000000-0000-0000-0000-000000000023', 'b2000000-0000-0000-0000-000000000002', 'Lychee Tea', 'lychee-tea', 'Teh dengan perasa lychee yang segar', 20000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000024', 'b2000000-0000-0000-0000-000000000002', 'Grenadine Tea', 'grenadine-tea', 'Teh dengan syrup grenadine khas', 22000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000025', 'b2000000-0000-0000-0000-000000000002', 'Choco Oreo', 'choco-oreo', 'Coklat dengan campuran oreo', 28000, true, true, 4),
  ('c3000000-0000-0000-0000-000000000026', 'b2000000-0000-0000-0000-000000000002', 'Avocado', 'avocado', 'Minuman alpukat segar dan creamy', 25000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000027', 'b2000000-0000-0000-0000-000000000002', 'Grenadine Rum', 'grenadine-rum', 'Perpaduan grenadine dan aroma rum', 28000, true, false, 4),
  ('c3000000-0000-0000-0000-000000000028', 'b2000000-0000-0000-0000-000000000002', 'Coffee Beer Sarsaparilla', 'coffee-beer-sarsaparilla', 'Kopi dengan soda sarsaparilla yang unik', 28000, true, false, 3),
  ('c3000000-0000-0000-0000-000000000029', 'b2000000-0000-0000-0000-000000000002', 'Indo Saparella', 'indo-saparella', 'Minuman soda sarsaparilla khas', 30000, true, false, 3);

-- TABLES for Jakarta outlet
INSERT INTO tables (outlet_id, table_number, capacity, status, section)
SELECT 'a1000000-0000-0000-0000-000000000001', 'R' || n, 2, 'available', 'Rooftop Main' FROM generate_series(1, 20) n;
INSERT INTO tables (outlet_id, table_number, capacity, status, section)
SELECT 'a1000000-0000-0000-0000-000000000001', 'V' || n, 4, 'available', 'VIP Lounge' FROM generate_series(1, 6) n;
INSERT INTO tables (outlet_id, table_number, capacity, status, section)
SELECT 'a1000000-0000-0000-0000-000000000001', 'G' || n, 2, 'available', 'Garden Terrace' FROM generate_series(1, 10) n;

-- ACHIEVEMENTS
INSERT INTO achievements (id, name, description, icon, category, points_required)
VALUES
  ('d4000000-0000-0000-0000-000000000001', 'First Sip', 'Place your first order', 'coffee', 'orders', 50),
  ('d4000000-0000-0000-0000-000000000002', 'Regular', 'Place 10 orders', 'star', 'orders', 500),
  ('d4000000-0000-0000-0000-000000000003', 'Rooftop Lover', 'Make 5 reservations', 'calendar', 'loyalty', 500),
  ('d4000000-0000-0000-0000-000000000004', 'Night Owl', 'Attend 3 night events', 'moon', 'events', 600),
  ('d4000000-0000-0000-0000-000000000005', 'Social Butterfly', 'Join 2 community groups', 'users', 'social', 300),
  ('d4000000-0000-0000-0000-000000000006', 'VIP Status', 'Reach VIP Elite tier', 'crown', 'special', 5000),
  ('d4000000-0000-0000-0000-000000000007', 'Royalty', 'Reach Skyhook Royalty tier', 'crown', 'special', 10000),
  ('d4000000-0000-0000-0000-000000000008', 'Foodie', 'Try 5 different menu items', 'utensils', 'orders', 250);

-- EVENTS
INSERT INTO events (id, outlet_id, title, slug, description, date, time, venue, type, price, capacity, is_featured, status)
VALUES
  ('e5000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Neon Nights', 'neon-nights', 'Curated electronic music under the stars with world-class DJs', CURRENT_DATE + 1, '21:00', 'Main Rooftop', 'dj_night', 150000, 60, true, 'upcoming'),
  ('e5000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Acoustic Sessions', 'acoustic-sessions', 'Intimate acoustic performances with premium cocktails', CURRENT_DATE + 2, '19:00', 'Garden Lounge', 'live_music', 100000, 40, true, 'upcoming'),
  ('e5000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Sunset Vibes', 'sunset-vibes', 'Wind down with smooth jazz and golden hour views', CURRENT_DATE + 3, '17:00', 'Sunset Deck', 'live_music', 75000, 35, true, 'upcoming'),
  ('e5000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Skyhook Social', 'skyhook-social', 'Exclusive networking for premium members', CURRENT_DATE + 7, '20:00', 'VIP Lounge', 'community', 0, 30, true, 'upcoming'),
  ('e5000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Jazz & Brews', 'jazz-and-brews', 'Smooth jazz, craft cocktails, and premium coffee', CURRENT_DATE + 4, '20:00', 'Main Rooftop', 'live_music', 125000, 50, false, 'upcoming'),
  ('e5000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'VIP Royal Dinner', 'vip-royal-dinner', '6-course degustation dinner with wine pairing', CURRENT_DATE + 14, '19:00', 'Private Lounge', 'vip', 500000, 12, true, 'upcoming');
