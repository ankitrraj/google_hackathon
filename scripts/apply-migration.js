// Helper script to apply database migration
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log('🗄️  VoiceForge Database Migration Helper\n');

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = projectUrl?.split('//')[1]?.split('.')[0];

if (!projectRef) {
  console.error('❌ Could not extract project ref from SUPABASE_URL');
  process.exit(1);
}

console.log(`📋 Project: ${projectRef}`);
console.log(`🔗 URL: ${projectUrl}\n`);

// Read migration file
const migrationPath = path.join(__dirname, '../supabase/migrations/20251216_initial_schema.sql');
const migration = fs.readFileSync(migrationPath, 'utf8');

console.log('📝 Migration file loaded');
console.log(`   Lines: ${migration.split('\n').length}`);
console.log(`   Size: ${(migration.length / 1024).toFixed(2)} KB\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 TO APPLY THIS MIGRATION:\n');
console.log('1️⃣  Open Supabase SQL Editor:');
console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
console.log('2️⃣  Copy the migration file:');
console.log(`   ${migrationPath}\n`);
console.log('3️⃣  Paste in SQL Editor and click "Run"\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('💡 TIP: After running, verify with:');
console.log('   SELECT * FROM agents LIMIT 1;');
console.log('   SELECT * FROM calls LIMIT 1;\n');

// Try to open browser
try {
  const { exec } = require('child_process');
  const url = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  
  console.log('🌐 Opening SQL Editor in browser...\n');
  
  const command = process.platform === 'win32' 
    ? `start ${url}` 
    : process.platform === 'darwin' 
    ? `open ${url}` 
    : `xdg-open ${url}`;
  
  exec(command, (error) => {
    if (error) {
      console.log('⚠️  Could not open browser automatically');
      console.log(`   Please open: ${url}`);
    } else {
      console.log('✅ Browser opened!');
      console.log(`   Copy migration from: ${migrationPath}`);
      console.log('   Paste in SQL Editor and click "Run"');
    }
  });
} catch (error) {
  console.log('⚠️  Could not open browser');
}
