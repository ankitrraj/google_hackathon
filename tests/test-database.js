// Test database connection with Prisma
require('dotenv').config({ path: '.env.local' });

async function testDatabase() {
  console.log('🗄️  Testing Database Connection\n');

  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local');
    console.log('\n📋 To fix:');
    console.log('1. Get connection string from Supabase Dashboard');
    console.log('2. Add to .env.local:');
    console.log('   DATABASE_URL="postgresql://postgres:PASSWORD@db.vhmocttoecyeollvwurx.supabase.co:5432/postgres"');
    console.log('\n📖 See: docs/PRISMA_SETUP.md');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found\n');

  try {
    // Import Prisma Client from our lib
    const { prisma } = require('../src/lib/prisma.ts');

    console.log('🔌 Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected successfully!\n');

    // Check if tables exist
    console.log('📊 Checking tables...');
    
    try {
      const agentCount = await prisma.agent.count();
      console.log(`✅ agents table exists (${agentCount} records)`);
    } catch (error) {
      console.log('❌ agents table not found');
      console.log('   Run: npx prisma db push');
    }

    try {
      const callCount = await prisma.call.count();
      console.log(`✅ calls table exists (${callCount} records)`);
    } catch (error) {
      console.log('❌ calls table not found');
      console.log('   Run: npx prisma db push');
    }

    // Disconnect
    await prisma.$disconnect();
    console.log('\n✅ Database test complete!');

  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Check DATABASE_URL in .env.local');
    console.log('2. Verify password is correct');
    console.log('3. Check internet connection');
    console.log('4. See: docs/PRISMA_SETUP.md');
    process.exit(1);
  }
}

testDatabase();
