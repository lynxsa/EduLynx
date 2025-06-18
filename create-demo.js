const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsersSimple() {
  try {
    console.log('🚀 Creating demo users for SQLite...');

    // Hash passwords
    const adminPass = await bcrypt.hash('adminpass', 12);
    const teacherPass = await bcrypt.hash('teacherpass', 12);
    const parentPass = await bcrypt.hash('parentpass', 12);
    const studentPass = await bcrypt.hash('studentpass', 12);

    // Delete existing users first
    await prisma.user.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Create admin user
    await prisma.user.create({
      data: {
        email: 'admin@lynxacademy.co.za',
        password: adminPass,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
      },
    });

    // Create teacher user
    await prisma.user.create({
      data: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPass,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'TEACHER',
        isActive: true,
      },
    });

    // Create parent user
    await prisma.user.create({
      data: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPass,
        firstName: 'Michael',
        lastName: 'Smith',
        role: 'PARENT',
        isActive: true,
      },
    });

    // Create student user
    await prisma.user.create({
      data: {
        email: 'student1@lynxacademy.co.za',
        password: studentPass,
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'STUDENT',
        isActive: true,
      },
    });

    console.log('✅ Demo users created successfully!');
    console.log('📧 Admin: admin@lynxacademy.co.za / adminpass');
    console.log('📧 Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('📧 Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('📧 Student: student1@lynxacademy.co.za / studentpass');

    // Verify users exist
    const count = await prisma.user.count();
    console.log(`🎯 Total users in database: ${count}`);

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsersSimple();
