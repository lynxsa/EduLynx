// seeds original demo users into the main EduLynx database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding main EduLynx demo users...');

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
    // Additional demo users for testing
    {
      email: 'principal@lynxacademy.co.za',
      password: 'principal123',
      firstName: 'Linda',
      lastName: 'Martinez',
      role: 'ADMIN',
    },
    {
      email: 'teacher2@lynxacademy.co.za',
      password: 'teacher123',
      firstName: 'James',
      lastName: 'Brown',
      role: 'TEACHER',
    },
  ];

  console.log(`Creating ${users.length} demo users...`);

  for (const u of users) {
    try {
      console.log(`Creating user: ${u.email} (${u.role})`);
      const hash = await bcrypt.hash(u.password, 12);

      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          password: hash,
          role: u.role,
          firstName: u.firstName,
          lastName: u.lastName,
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
      console.log(`✅ Successfully created/updated: ${u.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${u.email}:`, error.message);
    }
  }

  await prisma.$disconnect();
  console.log('🎉 Main EduLynx demo users seeded successfully!');
  console.log('\n📋 Demo Credentials:');
  users.forEach(u => {
    console.log(`   ${u.role}: ${u.email} / ${u.password}`);
  });
}

main().catch(e => {
  console.error('❌ Error seeding main users:', e);
  process.exit(1);
});
