// Create specific demo users for LynxLearn LMS
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Creating LynxLearn LMS users with specified credentials...');

  const users = [
    {
      email: 'admin@lynxacademy.co.za',
      password: 'adminpass',
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'teacher1@lynxacademy.co.za',
      password: 'teacherpass',
      name: 'Teacher One',
      role: 'TEACHER',
    },
    {
      email: 'parent1@lynxacademy.co.za',
      password: 'parentpass',
      name: 'Parent One',
      role: 'STUDENT', // LMS doesn't have PARENT role, using STUDENT
    },
    {
      email: 'student1@lynxacademy.co.za',
      password: 'studentpass',
      name: 'Student One',
      role: 'STUDENT',
    },
  ];
  try {
    console.log('� Creating/updating LMS users...');
    for (const u of users) {
      console.log(`Creating LMS user: ${u.email} (${u.role})`);
      const hash = await bcrypt.hash(u.password, 12);

      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {
          hashedPassword: hash,
          name: u.name,
          role: u.role,
          isActive: true,
        },
        create: {
          email: u.email,
          hashedPassword: hash,
          name: u.name,
          role: u.role,
          isActive: true,
        },
      });

      console.log(`✅ LMS User created/updated: ${user.email}`);
    }

    console.log('🎉 LynxLearn LMS demo users created successfully!');
    console.log('\n📋 Demo Credentials for LynxLearn LMS (localhost:3001):');
    users.forEach(u => {
      console.log(`   ${u.role}: ${u.email} / ${u.password}`);
    });
  } catch (error) {
    console.error('❌ Error creating LMS users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('❌ LMS Seeding failed:', e);
  process.exit(1);
});
