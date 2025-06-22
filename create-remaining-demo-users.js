const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createRemainingDemoUsers() {
  console.log('🚀 Creating remaining demo users...');

  try {
    const school = await prisma.school.findFirst();

    // Create demo teacher user
    const teacherPasswordHash = await bcrypt.hash('teacherpass', 10);
    const teacherUser = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: { password: teacherPasswordHash },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPasswordHash,
        role: 'TEACHER',
        firstName: 'Demo',
        lastName: 'Teacher',
        phone: '+27-11-234-5678',
        addressLine1: '456 Teaching Ave',
        city: 'Johannesburg',
        province: 'Gauteng',
        gender: 'Female',
        dateOfBirth: new Date('1985-05-15'),
        schoolId: school.id,
      },
    });
    console.log('✅ Demo teacher user created:', teacherUser.email);

    // Create demo parent user
    const parentPasswordHash = await bcrypt.hash('parentpass', 10);
    const parentUser = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: { password: parentPasswordHash },
      create: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPasswordHash,
        role: 'PARENT',
        firstName: 'Demo',
        lastName: 'Parent',
        phone: '+27-11-345-6789',
        addressLine1: '789 Family St',
        city: 'Johannesburg',
        province: 'Gauteng',
        gender: 'Male',
        dateOfBirth: new Date('1975-09-20'),
        schoolId: school.id,
      },
    });
    console.log('✅ Demo parent user created:', parentUser.email);

    // Create demo student user
    const studentPasswordHash = await bcrypt.hash('studentpass', 10);
    const studentUser = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: { password: studentPasswordHash },
      create: {
        email: 'student1@lynxacademy.co.za',
        password: studentPasswordHash,
        role: 'STUDENT',
        firstName: 'Demo',
        lastName: 'Student',
        phone: '+27-11-456-7890',
        addressLine1: '321 Student Lane',
        city: 'Johannesburg',
        province: 'Gauteng',
        gender: 'Female',
        dateOfBirth: new Date('2005-03-10'),
        schoolId: school.id,
      },
    });
    console.log('✅ Demo student user created:', studentUser.email);

    console.log('\n🎉 All demo users ready!');
    console.log('\n📋 Complete Login Credentials:');
    console.log('Admin:   admin@lynxacademy.co.za / adminpass → /admin');
    console.log('Teacher: teacher1@lynxacademy.co.za / teacherpass → /teacher');
    console.log('Parent:  parent1@lynxacademy.co.za / parentpass → /parent');
    console.log('Student: student1@lynxacademy.co.za / studentpass → /student');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRemainingDemoUsers();
