// Simple seed script for LMS users
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding LynxLearn LMS demo users (simple)...');

  const users = [
    {
      email: 'admin@lynxacademy.co.za',
      password: 'admin123',
      name: 'Admin User',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
    {
      email: 'teacher@lynxacademy.co.za',
      password: 'teacher123',
      name: 'Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'TEACHER',
    },
    {
      email: 'parent@lynxacademy.co.za',
      password: 'parent123',
      name: 'Michael Smith',
      firstName: 'Michael',
      lastName: 'Smith',
      role: 'STUDENT', // Using STUDENT role as parent role might not exist in LMS
    },
    {
      email: 'student@lynxacademy.co.za',
      password: 'student123',
      name: 'David Wilson',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'STUDENT',
    },
  ];

  try {
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

      // Create or update user profile
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          firstName: u.firstName,
          lastName: u.lastName,
        },
        create: {
          userId: user.id,
          firstName: u.firstName,
          lastName: u.lastName,
        },
      });

      console.log(`✅ LMS User created/updated: ${user.email} with profile`);
    }

    console.log('🎉 LynxLearn LMS demo users seeded successfully!');
    console.log('\n📋 LMS Demo Credentials:');
    users.forEach(u => {
      console.log(`   ${u.role}: ${u.email} / ${u.password}`);
    });
  } catch (error) {
    console.error('❌ Error seeding LMS users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('❌ LMS Seeding failed:', e);
  process.exit(1);
});
