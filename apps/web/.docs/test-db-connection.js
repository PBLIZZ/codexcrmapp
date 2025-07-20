// Quick test to verify database connection
const { prisma } = require('@codexcrm/db');

// Use the exported prisma instance

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test queries
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    const contactCount = await prisma.contact.count();
    console.log(`📊 Contacts in database: ${contactCount}`);
    
    const groupCount = await prisma.group.count();
    console.log(`📊 Groups in database: ${groupCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
