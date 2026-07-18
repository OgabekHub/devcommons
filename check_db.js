const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ajkxauupprrmivwiaunx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa3hhdXVwcHJybWl2d2lhdW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzI0NDUsImV4cCI6MjA5OTYwODQ0NX0.lTNNxb5kzQpCqweofw9Qzbqwhjq9bo7ubWs-Prggq5g'
);

async function check() {
  const { data: users } = await supabase.from('users').select('*');
  console.log('Users:', users);

  const { data: snippets } = await supabase.from('snippets').select('id, title, author_id');
  console.log('Snippets:', snippets);
}

check();
