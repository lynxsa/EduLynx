const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUsers() {
  try {
    console.log('🧪 Testing database connection...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    });
    
    console.log('✅ Found users:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.role}) - ${user.email} - Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsers();
