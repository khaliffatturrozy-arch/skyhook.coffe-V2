const { Client } = require('pg')

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

  // Read and execute seed.sql
  const fs = require('fs')
  const sql = fs.readFileSync('./seed.sql', 'utf8')
  
  // Split by semicolons and execute each statement
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0)
  
  for (const stmt of statements) {
    try {
      await client.query(stmt)
      console.log(`✓ ${stmt.substring(0, 60)}...`)
    } catch (err) {
      // Skip "0 rows affected" etc
      if (!err.message.includes('already exists')) {
        console.log(`✗ ${err.message.substring(0, 100)}`)
      }
    }
  }
  
  console.log('\n✅ Seed complete!')
  await client.end()
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
