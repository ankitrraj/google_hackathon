#!/usr/bin/env node

/**
 * Run Supabase schema using REST API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🚀 VoiceForge Database Schema Setup\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('your_')) {
  console.error('❌ Error: Supabase credentials not found');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

console.log(`📋 Project: ${projectRef}`);
console.log(`🔗 URL: ${supabaseUrl}\n`);

// Read schema
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('📝 Schema loaded');
console.log('⚠️  Note: Supabase JS client cannot execute raw SQL directly\n');
console.log('📋 To run the schema, please:');
console.log('');
console.log('1. Go to Supabase SQL Editor:');
console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
console.log('');
console.log('2. Copy the schema from:');
console.log(`   ${schemaPath}`);
console.log('');
console.log('3. Paste in SQL Editor and click "Run"');
console.log('');
console.log('OR');
console.log('');
console.log('Use Supabase CLI:');
console.log('   npm install -g supabase');
console.log('   supabase link --project-ref ' + projectRef);
console.log('   supabase db push');
console.log('');

// Open browser automatically
const url = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
console.log('🌐 Opening SQL Editor in browser...\n');

// Try to open browser
const { exec } = require('child_process');
const command = process.platform === 'win32' ? 'start' : 
                process.platform === 'darwin' ? 'open' : 'xdg-open';

exec(`${command} ${url}`, (error) => {
  if (error) {
    console.log('⚠️  Could not open browser automatically');
    console.log(`   Please open: ${url}\n`);
  } else {
    console.log('✅ Browser opened!');
    console.log('   Copy schema from: supabase/schema.sql');
    console.log('   Paste in SQL Editor and click "Run"\n');
  }
});
