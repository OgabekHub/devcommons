const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOrphans() {
  console.log("Deleting orphaned snippets...");
  const { data: snippets, error: snippetsError } = await supabase
    .from('snippets')
    .delete()
    .is('author_id', null);
  
  if (snippetsError) {
    console.error("Error deleting snippets:", snippetsError);
  } else {
    console.log("Deleted orphaned snippets.");
  }

  console.log("Deleting orphaned prompts...");
  const { data: prompts, error: promptsError } = await supabase
    .from('prompts')
    .delete()
    .is('author_id', null);
  
  if (promptsError) {
    console.error("Error deleting prompts:", promptsError);
  } else {
    console.log("Deleted orphaned prompts.");
  }
}

deleteOrphans();
