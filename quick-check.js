const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickCheck() {
  try {
    console.log('🔍 Checking current users in database...\n');

    const users = await prisma.user.findMany({
      select: { email: true, firstName: true, lastName: true, role: true, isActive: true },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log('📋 Current users:');
      users.forEach(user => {
        console.log(
          `- ${user.role}: ${user.firstName} ${user.lastName} (${user.email}) - Active: ${user.isActive}`
        );
      });
    }

    console.log(`\n✅ Total users: ${users.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickCheck();
