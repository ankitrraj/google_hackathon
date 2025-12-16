// Simple database test
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function test() {
  console.log('🗄️  Testing Database\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL found\n');

  // Create connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  
  // Create Prisma Client with adapter
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔌 Connecting...');
    await prisma.$connect();
    console.log('✅ Connected!\n');

    console.log('📊 Checking tables...');
    const agentCount = await prisma.agent.count();
    const callCount = await prisma.call.count();
    
    console.log(`✅ agents: ${agentCount} records`);
    console.log(`✅ calls: ${callCount} records`);

    await prisma.$disconnect();
    await pool.end();
    console.log('\n✅ Test complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

test();
