const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const client = new Client({
  host: 'db.bnmybngyxxxwdrfnfqxw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'SkyHookCoffeee',
  ssl: { rejectUnauthorized: false }
})

async function run() {
  await client.connect()
  console.log('Connected to database')

  const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  for (const stmt of statements) {
    try {
      await client.query(stmt)
      console.log(`✓ ${stmt.substring(0, 80).replace(/\n/g, ' ')}...`)
    } catch (err) {
      console.log(`✗ ${err.message.substring(0, 120)}`)
    }
  }
  
  console.log('\n✅ Seed complete!')
  await client.end()
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
