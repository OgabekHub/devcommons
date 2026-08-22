/**
 * Database check utility script.
 * Uses environment variables for Supabase credentials.
 * 
 * Usage: node check_db.js
 * Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users, error: usersError } = await supabase.from('users').select('*');
  if (usersError) {
    console.error('Users query error:', usersError.message);
  } else {
    console.log('Users:', users);
  }

  const { data: snippets, error: snippetsError } = await supabase.from('snippets').select('id, title, author_id');
  if (snippetsError) {
    console.error('Snippets query error:', snippetsError.message);
  } else {
    console.log('Snippets:', snippets);
  }
}

check();
