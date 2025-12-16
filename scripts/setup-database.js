#!/usr/bin/env node

/**
 * Database setup script for VoiceForge
 * This script helps set up the Supabase database schema
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 VoiceForge Database Setup');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found!');
  console.log('Please create .env.local with your Supabase credentials first.\n');
  console.log('Required environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Read the schema file
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Error: schema.sql file not found!');
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

console.log('✅ Found database schema file');
console.log('📋 Schema includes:');
console.log('   - agents table with validation constraints');
console.log('   - calls table with foreign key relationships');
console.log('   - Performance indexes');
console.log('   - Row Level Security (RLS) policies');
console.log('   - Utility functions for validation');
console.log('   - Analytics views\n');

console.log('📝 Next steps:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to SQL Editor');
console.log('3. Copy and paste the contents of supabase/schema.sql');
console.log('4. Run the SQL to create all tables and functions');
console.log('5. Verify the setup by checking the Tables section\n');

console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('📖 Documentation: https://supabase.com/docs\n');

console.log('💡 Tip: You can also use the Supabase CLI to run migrations:');
console.log('   npx supabase db push\n');

console.log('✨ Once the database is set up, you can start the development server:');
console.log('   npm run dev\n');

// Validate environment variables
require('dotenv').config({ path: envPath });

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] || process.env[envVar].includes('your_')) {
    missingVars.push(envVar);
  }
}

if (missingVars.length > 0) {
  console.log('⚠️  Warning: The following environment variables need to be configured:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease update your .env.local file with actual values.\n');
} else {
  console.log('✅ Environment variables are configured');
}

console.log('🎉 Ready to build amazing voice agents with VoiceForge!');