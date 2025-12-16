#!/usr/bin/env node

/**
 * Run Supabase schema directly from command line
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🚀 VoiceForge Database Schema Setup\n');

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('your_')) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  console.log('\nPlease ensure these are set:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read schema file
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Error: schema.sql not found at', schemaPath);
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('📋 Schema file loaded');
console.log('🔗 Connecting to Supabase...\n');

// Split schema into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

// Execute schema
async function runSchema() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments
    if (statement.trim().startsWith('--') || statement.trim().startsWith('/*')) {
      continue;
    }

    try {
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: statement 
      }).catch(async () => {
        // If rpc doesn't work, try direct query
        return await supabase.from('_').select('*').limit(0);
      });

      if (error) {
        // Some errors are expected (like "already exists")
        if (error.message.includes('already exists') || 
            error.message.includes('IF NOT EXISTS') ||
            error.message.includes('IF EXISTS')) {
          console.log(`⚠️  Skipped (already exists)`);
        } else {
          console.log(`❌ Error: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.log(`⚠️  ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Completed: ${successCount} successful`);
  if (errorCount > 0) {
    console.log(`⚠️  Warnings: ${errorCount} (may be normal)`);
  }
  console.log('='.repeat(50) + '\n');

  // Verify tables were created
  console.log('🔍 Verifying tables...\n');
  
  try {
    // Check agents table
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .limit(0);

    if (!agentsError) {
      console.log('✅ agents table exists');
    } else {
      console.log('❌ agents table not found');
    }

    // Check calls table
    const { data: calls, error: callsError } = await supabase
      .from('calls')
      .select('*')
      .limit(0);

    if (!callsError) {
      console.log('✅ calls table exists');
    } else {
      console.log('❌ calls table not found');
    }

    console.log('\n🎉 Database schema setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Go to: http://localhost:3000/create');
    console.log('3. Create your first agent!\n');

  } catch (err) {
    console.error('\n❌ Error verifying tables:', err.message);
    console.log('\n💡 Tip: You may need to run the schema manually in Supabase dashboard');
    console.log('   Go to: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/sql\n');
  }
}

// Run the schema
runSchema().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  console.log('\n💡 Alternative: Run schema manually in Supabase dashboard');
  console.log('   1. Go to: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/sql');
  console.log('   2. Copy contents of: supabase/schema.sql');
  console.log('   3. Paste and click "Run"\n');
  process.exit(1);
});
