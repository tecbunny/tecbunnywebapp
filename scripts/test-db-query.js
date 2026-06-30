import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', url);
console.log('Service Key Configured:', serviceKey ? 'Yes' : 'No');

async function run() {
  const supabase = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Postgres Query Error Message:', error.message);
    console.log('Postgres Query Error Code:', error.code);
    console.log('Postgres Query Error Details:', error.details);
  } else {
    console.log('Query succeeded, columns/keys:', data ? Object.keys(data[0] || {}) : 'none');
    console.log('Sample row:', data ? data[0] : 'none');
  }
}

run();
