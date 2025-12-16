// Quick script to check if database tables exist
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking database tables...\n');
  
  try {
    // Try to query agents table
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('count')
      .limit(1);
    
    if (agentsError) {
      console.log('❌ agents table: NOT FOUND');
      console.log('   Error:', agentsError.message);
      console.log('\n⚠️  DATABASE SCHEMA NOT RUN YET!\n');
      console.log('📋 Follow these steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/sql/new');
      console.log('2. Copy content from: voiceforge/supabase/schema.sql');
      console.log('3. Paste in SQL Editor and click "Run"');
      console.log('4. Run this script again to verify\n');
      return false;
    }
    
    console.log('✅ agents table: EXISTS');
    
    // Try to query calls table
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('count')
      .limit(1);
    
    if (callsError) {
      console.log('❌ calls table: NOT FOUND');
      return false;
    }
    
    console.log('✅ calls table: EXISTS');
    
    // Check views
    const { data: stats, error: statsError } = await supabase
      .from('agent_stats')
      .select('*')
      .limit(1);
    
    if (!statsError) {
      console.log('✅ agent_stats view: EXISTS');
    }
    
    console.log('\n🎉 DATABASE SETUP COMPLETE!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Go to: http://localhost:3000/create');
    console.log('3. Create your first agent!\n');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    return false;
  }
}

checkDatabase();
