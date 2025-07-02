// Simple seed script for main EduLynx users
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding main EduLynx demo users (simple)...');

  const users = [
    {
      email: 'admin@lynxacademy.co.za',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
    {
      email: 'teacher@lynxacademy.co.za',
      password: 'teacher123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'TEACHER',
    },
    {
      email: 'parent@lynxacademy.co.za',
      password: 'parent123',
      firstName: 'Michael',
      lastName: 'Smith',
      role: 'PARENT',
    },
    {
      email: 'student@lynxacademy.co.za',
      password: 'student123',
      firstName: 'David',
      lastName: 'Wilson',
      role: 'STUDENT',
    },
  ];

  try {
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

    console.log('🎉 Main EduLynx demo users seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    users.forEach(u => {
      console.log(`   ${u.role}: ${u.email} / ${u.password}`);
    });
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error('❌ Seeding failed:', e);
  process.exit(1);
});
