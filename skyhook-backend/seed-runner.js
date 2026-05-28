const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bnmybngyxxxwdrfnfqxw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubXlibmd5eHh4d2RyZm5mcXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDY3NjEsImV4cCI6MjA5NTQ4Mjc2MX0.whVcIEhYvMDUdAPTq-AUhSt7MjBdF1QtpJ7Sq9KcbPc'
)

async function run() {
  // Clear existing data in FK-safe order
  for (const table of ['events', 'tables', 'menu', 'achievements', 'categories', 'outlets']) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) console.log(`Delete ${table}:`, error.message)
    else console.log(`Cleared ${table}`)
  }

  // Insert outlets
  const { error: e1 } = await supabase.from('outlets').insert({
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Skyhook Coffee Rooftop House and Kitchen — Jakarta',
    slug: 'skyhook-jakarta',
    address: 'Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti, Kec. Makasar',
    city: 'Jakarta Timur',
    country: 'Indonesia',
    phone: '081774934980',
    opening_hours: '15:00',
    closing_hours: '23:00',
    is_active: true,
    latitude: -6.284886,
    longitude: 106.879301,
    description: 'Rooftop house and kitchen di Jakarta Timur — didepan SPBU Kampung Makasar'
  })
  if (e1) { console.error('Outlet insert error:', e1.message); return }
  console.log('Outlet inserted')

  // Insert categories
  const { error: e2 } = await supabase.from('categories').insert([
    {
      id: 'b2000000-0000-0000-0000-000000000001',
      name: 'Signature',
      slug: 'signature',
      description: 'Signature coffee creations — spesial dari Skyhook',
      sort_order: 1
    },
    {
      id: 'b2000000-0000-0000-0000-000000000002',
      name: 'Non Coffee',
      slug: 'non-coffee',
      description: 'Minuman segar non-kopi untuk semua',
      sort_order: 2
    }
  ])
  if (e2) { console.error('Categories insert error:', e2.message); return }
  console.log('Categories inserted')

  // Insert menu items - SIGNATURE
  const signatureCat = 'b2000000-0000-0000-0000-000000000001'
  const nonCoffeeCat = 'b2000000-0000-0000-0000-000000000002'

  const menuSignature = [
    { name: 'Americano Coffee + Cream + Fresh Milk', slug: 'americano-cream-fresh-milk', description: 'American coffee with cream and fresh milk', price: 23000, is_featured: true, preparation_time: 3 },
    { name: 'Es Kopi Susu SKY', slug: 'es-kopi-susu-sky', description: 'Kopi susu dengan basis espresso dan gula aren', price: 23000, is_featured: true, preparation_time: 3 },
    { name: 'Es Kopi Susu ALAM', slug: 'es-kopi-susu-alam', description: 'Kopi susu dengan basis espresso dan syrup pandan', price: 25000, is_featured: false, preparation_time: 3 },
    { name: 'Es Kopi Susu FLYING', slug: 'es-kopi-susu-flying', description: 'Kopi susu dengan basis espresso dan salted caramel / roasted almond', price: 25000, is_featured: false, preparation_time: 4 },
    { name: 'Es Kopi Susu Coklat', slug: 'es-kopi-susu-coklat', description: 'Kopi susu dengan basis espresso dan perasa coklat', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Es Kopi Susu Pisang', slug: 'es-kopi-susu-pisang', description: 'Kopi susu dengan basis espresso dan syrup pisang', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Es Kopi Susu Cream Vanilla', slug: 'es-kopi-susu-cream-vanilla', description: 'Kopi susu dengan basis espresso dan ice cream vanilla', price: 28000, is_featured: true, preparation_time: 4 },
    { name: 'Ice Creambrulee', slug: 'ice-creambrulee', description: 'Espresso dengan paduan white chocolate dan syrup caramel', price: 28000, is_featured: false, preparation_time: 5 },
    { name: 'Ice Mocca Rum', slug: 'ice-mocca-rum', description: 'Espresso dengan paduan coklat dan syrup caramel', price: 28000, is_featured: false, preparation_time: 5 },
  ]

  const menuNonCoffee = [
    { name: 'Chocolate Ice', slug: 'chocolate-ice', description: 'Chocolate dengan fresh milk', price: 25000, is_featured: true, preparation_time: 3 },
    { name: 'Coffee Beer', slug: 'coffee-beer', description: 'Kopi dengan soda — unik dan menyegarkan', price: 28000, is_featured: false, preparation_time: 3 },
    { name: 'Soda Yakult Strawberry', slug: 'soda-yakult-strawberry', description: 'Yakult bersoda dengan campuran perasa strawberry', price: 23000, is_featured: false, preparation_time: 3 },
    { name: 'Soda Yakult Lychee', slug: 'soda-yakult-lychee', description: 'Yakult bersoda dengan campuran perasa lychee', price: 23000, is_featured: false, preparation_time: 3 },
    { name: 'Soda Yakult Banana', slug: 'soda-yakult-banana', description: 'Yakult bersoda dengan campuran perasa pisang', price: 23000, is_featured: false, preparation_time: 3 },
    { name: 'Choco Banana', slug: 'choco-banana', description: 'Perpaduan coklat dan pisang yang creamy', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Choco Hazelnut', slug: 'choco-hazelnut', description: 'Coklat dengan hazelnut yang kaya rasa', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Choco Rum', slug: 'choco-rum', description: 'Coklat dengan aroma rum yang khas', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Greentea', slug: 'greentea', description: 'Green tea segar pilihan', price: 25000, is_featured: false, preparation_time: 3 },
    { name: 'Taro', slug: 'taro', description: 'Minuman taro creamy dan manis', price: 25000, is_featured: false, preparation_time: 3 },
    { name: 'Lemon Tea', slug: 'lemon-tea', description: 'Teh lemon segar', price: 20000, is_featured: false, preparation_time: 2 },
    { name: 'Red Velvet', slug: 'red-velvet', description: 'Minuman red velvet yang lembut', price: 25000, is_featured: false, preparation_time: 4 },
    { name: 'Ice Tea', slug: 'ice-tea', description: 'Teh manis segar dengan es batu', price: 15000, is_featured: true, preparation_time: 2 },
    { name: 'Lychee Tea', slug: 'lychee-tea', description: 'Teh dengan perasa lychee yang segar', price: 20000, is_featured: false, preparation_time: 3 },
    { name: 'Grenadine Tea', slug: 'grenadine-tea', description: 'Teh dengan syrup grenadine khas', price: 22000, is_featured: false, preparation_time: 3 },
    { name: 'Choco Oreo', slug: 'choco-oreo', description: 'Coklat dengan campuran oreo', price: 28000, is_featured: true, preparation_time: 4 },
    { name: 'Avocado', slug: 'avocado', description: 'Minuman alpukat segar dan creamy', price: 25000, is_featured: false, preparation_time: 4 },
    { name: 'Grenadine Rum', slug: 'grenadine-rum', description: 'Perpaduan grenadine dan aroma rum', price: 28000, is_featured: false, preparation_time: 4 },
    { name: 'Coffee Beer Sarsaparilla', slug: 'coffee-beer-sarsaparilla', description: 'Kopi dengan soda sarsaparilla yang unik', price: 28000, is_featured: false, preparation_time: 3 },
    { name: 'Indo Saparella', slug: 'indo-saparella', description: 'Minuman soda sarsaparilla khas', price: 30000, is_featured: false, preparation_time: 3 },
  ]

  let idx = 1
  for (const item of menuSignature) {
    const { error } = await supabase.from('menu').insert({
      id: `c3000000-0000-0000-0000-${String(idx).padStart(12, '0')}`,
      category_id: signatureCat,
      ...item,
      is_available: true
    })
    if (error) { console.error(`Menu item ${item.name}:`, error.message); return }
    idx++
  }

  for (const item of menuNonCoffee) {
    const { error } = await supabase.from('menu').insert({
      id: `c3000000-0000-0000-0000-${String(idx).padStart(12, '0')}`,
      category_id: nonCoffeeCat,
      ...item,
      is_available: true
    })
    if (error) { console.error(`Menu item ${item.name}:`, error.message); return }
    idx++
  }
  console.log(`${menuSignature.length + menuNonCoffee.length} menu items inserted`)

  // Insert tables (20 rooftop + 6 VIP + 10 garden)
  for (let n = 1; n <= 20; n++) {
    await supabase.from('tables').insert({ outlet_id: 'a1000000-0000-0000-0000-000000000001', table_number: 'R' + n, capacity: 2, status: 'available', section: 'Rooftop Main' })
  }
  for (let n = 1; n <= 6; n++) {
    await supabase.from('tables').insert({ outlet_id: 'a1000000-0000-0000-0000-000000000001', table_number: 'V' + n, capacity: 4, status: 'available', section: 'VIP Lounge' })
  }
  for (let n = 1; n <= 10; n++) {
    await supabase.from('tables').insert({ outlet_id: 'a1000000-0000-0000-0000-000000000001', table_number: 'G' + n, capacity: 2, status: 'available', section: 'Garden Terrace' })
  }
  console.log('36 tables inserted')

  // Insert achievements
  const achievements = [
    { id: 'd4000000-0000-0000-0000-000000000001', name: 'First Sip', description: 'Place your first order', icon: 'coffee', category: 'orders', points_required: 50 },
    { id: 'd4000000-0000-0000-0000-000000000002', name: 'Regular', description: 'Place 10 orders', icon: 'star', category: 'orders', points_required: 500 },
    { id: 'd4000000-0000-0000-0000-000000000003', name: 'Rooftop Lover', description: 'Make 5 reservations', icon: 'calendar', category: 'loyalty', points_required: 500 },
    { id: 'd4000000-0000-0000-0000-000000000004', name: 'Night Owl', description: 'Attend 3 night events', icon: 'moon', category: 'events', points_required: 600 },
    { id: 'd4000000-0000-0000-0000-000000000005', name: 'Social Butterfly', description: 'Join 2 community groups', icon: 'users', category: 'social', points_required: 300 },
    { id: 'd4000000-0000-0000-0000-000000000006', name: 'VIP Status', description: 'Reach VIP Elite tier', icon: 'crown', category: 'special', points_required: 5000 },
    { id: 'd4000000-0000-0000-0000-000000000007', name: 'Royalty', description: 'Reach Skyhook Royalty tier', icon: 'crown', category: 'special', points_required: 10000 },
    { id: 'd4000000-0000-0000-0000-000000000008', name: 'Foodie', description: 'Try 5 different menu items', icon: 'utensils', category: 'orders', points_required: 250 },
  ]
  const { error: e4 } = await supabase.from('achievements').insert(achievements)
  if (e4) { console.error('Achievements error:', e4.message); return }
  console.log('8 achievements inserted')

  // Insert events
  const today = new Date()
  function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r.toISOString().split('T')[0] }

  const events = [
    { id: 'e5000000-0000-0000-0000-000000000001', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'Neon Nights', slug: 'neon-nights', description: 'Curated electronic music under the stars with world-class DJs', date: addDays(today, 1), time: '21:00', venue: 'Main Rooftop', type: 'dj_night', price: 150000, capacity: 60, is_featured: true, status: 'upcoming' },
    { id: 'e5000000-0000-0000-0000-000000000002', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'Acoustic Sessions', slug: 'acoustic-sessions', description: 'Intimate acoustic performances with premium cocktails', date: addDays(today, 2), time: '19:00', venue: 'Garden Lounge', type: 'live_music', price: 100000, capacity: 40, is_featured: true, status: 'upcoming' },
    { id: 'e5000000-0000-0000-0000-000000000003', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'Sunset Vibes', slug: 'sunset-vibes', description: 'Wind down with smooth jazz and golden hour views', date: addDays(today, 3), time: '17:00', venue: 'Sunset Deck', type: 'live_music', price: 75000, capacity: 35, is_featured: true, status: 'upcoming' },
    { id: 'e5000000-0000-0000-0000-000000000004', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'Skyhook Social', slug: 'skyhook-social', description: 'Exclusive networking for premium members', date: addDays(today, 7), time: '20:00', venue: 'VIP Lounge', type: 'community', price: 0, capacity: 30, is_featured: true, status: 'upcoming' },
    { id: 'e5000000-0000-0000-0000-000000000005', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'Jazz & Brews', slug: 'jazz-and-brews', description: 'Smooth jazz, craft cocktails, and premium coffee', date: addDays(today, 4), time: '20:00', venue: 'Main Rooftop', type: 'live_music', price: 125000, capacity: 50, is_featured: false, status: 'upcoming' },
    { id: 'e5000000-0000-0000-0000-000000000006', outlet_id: 'a1000000-0000-0000-0000-000000000001', title: 'VIP Royal Dinner', slug: 'vip-royal-dinner', description: '6-course degustation dinner with wine pairing', date: addDays(today, 14), time: '19:00', venue: 'Private Lounge', type: 'vip', price: 500000, capacity: 12, is_featured: true, status: 'upcoming' },
  ]
  const { error: e5 } = await supabase.from('events').insert(events)
  if (e5) { console.error('Events error:', e5.message); return }
  console.log('6 events inserted')

  console.log('\n✅ Seed data inserted successfully!')
}

run().catch(console.error)
