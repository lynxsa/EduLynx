const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('🔍 Checking database connection...');

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    console.log('Admin user found:', !!admin);
    if (admin) {
      console.log('Admin details:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        passwordLength: admin.password.length,
      });
    }

    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);

    // Check all user roles
    const roleCounts = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'PARENT' } }),
    ]);

    console.log('User counts by role:', {
      ADMIN: roleCounts[0],
      TEACHER: roleCounts[1],
      STUDENT: roleCounts[2],
      PARENT: roleCounts[3],
    });
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
