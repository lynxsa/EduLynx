const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Creating your original demo users...');

    // Admin user
    const adminPassword = await bcrypt.hash('adminpass', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {},
      create: {
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created:', admin.email);

    // Teacher user
    const teacherPassword = await bcrypt.hash('teacherpass', 10);
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {},
      create: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'Teacher',
        lastName: 'One',
        role: 'TEACHER',
      },
    });
    console.log('✅ Teacher user created:', teacher.email);

    // Parent user
    const parentPassword = await bcrypt.hash('parentpass', 10);
    const parent = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {},
      create: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPassword,
        firstName: 'Parent',
        lastName: 'One',
        role: 'PARENT',
      },
    });
    console.log('✅ Parent user created:', parent.email);

    // Student user
    const studentPassword = await bcrypt.hash('studentpass', 10);
    const student = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {},
      create: {
        email: 'student1@lynxacademy.co.za',
        password: studentPassword,
        firstName: 'Student',
        lastName: 'One',
        role: 'STUDENT',
      },
    });
    console.log('✅ Student user created:', student.email);

    console.log('\n🎉 All original demo users restored!');
    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@lynxacademy.co.za / adminpass');
    console.log('   Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('   Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('   Student: student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
