const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:SkyHookCoffeee@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL');

  const sqlPath = path.join(__dirname, '..', '..', 'skyhook-backend', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  const statements = sql.split(';').filter(s => s.trim().length > 0);
  let success = 0;
  let errors = [];

  for (const stmt of statements) {
    try {
      await client.query(stmt + ';');
      success++;
    } catch (e) {
      if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
        errors.push(e.message.slice(0, 150));
      } else {
        success++;
      }
    }
  }

  console.log(`Executed ${success}/${statements.length} statements successfully`);
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    errors.forEach(e => console.log('  -', e));
  }

  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables 
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );
  console.log('\nTables created:');
  tables.rows.forEach(r => console.log('  -', r.table_name));

  await client.end();
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
