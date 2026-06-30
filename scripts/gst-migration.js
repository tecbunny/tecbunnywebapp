import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import pg from 'pg';

const { Client } = pg;

async function tryConnect(host, port, user) {
  console.log(`Trying connection to ${host}:${port} for user ${user}...`);
  const client = new Client({
    host: host,
    port: port,
    user: user,
    password: process.env.SUPABASE_DB_PASSWORD || 'Bunny@6010#1',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });
  try {
    await client.connect();
    console.log(`SUCCESS connected to ${host}:${port} as ${user}!`);
    return client;
  } catch (err) {
    console.log(`FAILED for ${host}:${port} / ${user}:`, err.message);
    return null;
  }
}

async function run() {
  const hosts = [
    'aws-0-ap-northeast-2.pooler.supabase.com',
    'aws-0-ap-south-1.pooler.supabase.com'
  ];
  const users = [
    'postgres.yzrznydkqcacjiwalmlw',
    'postgres.ulpgnuiocjfrwpdediik'
  ];
  const ports = [5432, 6543];

  let client = null;
  for (const host of hosts) {
    for (const user of users) {
      for (const port of ports) {
        client = await tryConnect(host, port, user);
        if (client) break;
      }
      if (client) break;
    }
    if (client) break;
  }

  if (!client) {
    console.error('All connection attempts failed on port 5432 and 6543.');
    return;
  }

  try {
    console.log('Running GST database migration...');

    // 1. Add is_service column if not exists
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_service BOOLEAN DEFAULT false;
    `);
    console.log('- Checked/Added is_service column');

    // 2. Add sac_code column if not exists
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS sac_code VARCHAR(50);
    `);
    console.log('- Checked/Added sac_code column');

    // 3. Add constraint if not exists
    const constraintCheck = await client.query(`
      SELECT constraint_name 
      FROM information_schema.constraint_column_usage 
      WHERE table_name = 'products' AND constraint_name = 'check_hsn_sac_mutual_exclusion'
      LIMIT 1;
    `);

    if (constraintCheck.rows.length === 0) {
      await client.query(`
        ALTER TABLE products 
        ADD CONSTRAINT check_hsn_sac_mutual_exclusion 
        CHECK (NOT (hsn_code IS NOT NULL AND sac_code IS NOT NULL));
      `);
      console.log('- Added check_hsn_sac_mutual_exclusion constraint');
    } else {
      console.log('- Constraint check_hsn_sac_mutual_exclusion already exists');
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
