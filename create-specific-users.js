// Create specific demo users for EduLynx main app
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Creating EduLynx users with specified credentials...');

  const users = [
    {
      email: 'admin@lynxacademy.co.za',
      password: 'adminpass',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
    {
      email: 'teacher1@lynxacademy.co.za',
      password: 'teacherpass',
      firstName: 'Teacher',
      lastName: 'One',
      role: 'TEACHER',
    },
    {
      email: 'parent1@lynxacademy.co.za',
      password: 'parentpass',
      firstName: 'Parent',
      lastName: 'One',
      role: 'PARENT',
    },
    {
      email: 'student1@lynxacademy.co.za',
      password: 'studentpass',
      firstName: 'Student',
      lastName: 'One',
      role: 'STUDENT',
    },
  ];
  try {
    console.log('� Creating/updating users...');
    for (const u of users) {
      console.log(`Creating user: ${u.email} (${u.role})`);
      const hash = await bcrypt.hash(u.password, 12);

      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {
          password: hash,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          isActive: true,
        },
        create: {
          email: u.email,
          password: hash,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          isActive: true,
        },
      });

      console.log(`✅ User created/updated: ${user.email}`);
    }

    console.log('🎉 EduLynx demo users created successfully!');
    console.log('\n📋 Demo Credentials for EduLynx (localhost:3000):');
    users.forEach(u => {
      console.log(`   ${u.role}: ${u.email} / ${u.password}`);
    });
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
