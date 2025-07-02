const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'student1@lynxacademy.co.za' },
    });

    console.log('User found:', user ? user.email : 'Not found');

    if (user) {
      console.log('Password field exists:', !!user.password);
      console.log('User role:', user.role);
      console.log('First name:', user.firstName);
      console.log('Last name:', user.lastName);
    }
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUser();
