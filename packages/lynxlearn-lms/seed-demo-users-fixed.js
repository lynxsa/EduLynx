// seeds four demo users into the LMS database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding LynxLearn LMS demo users...');

  const users = [
    {
      email: 'admin@lynxacademy.co.za',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN',
    },
    {
      email: 'teacher@lynxacademy.co.za',
      password: 'teacher123',
      name: 'Sarah Johnson',
      role: 'TEACHER',
    },
    {
      email: 'parent@lynxacademy.co.za',
      password: 'parent123',
      name: 'Michael Smith',
      role: 'STUDENT', // Using STUDENT role as parent role might not exist in LMS
    },
    {
      email: 'student@lynxacademy.co.za',
      password: 'student123',
      name: 'David Wilson',
      role: 'STUDENT',
    },
    // Additional demo users
    {
      email: 'principal@lynxacademy.co.za',
      password: 'principal123',
      name: 'Linda Martinez',
      role: 'ADMIN',
    },
    {
      email: 'teacher2@lynxacademy.co.za',
      password: 'teacher123',
      name: 'James Brown',
      role: 'TEACHER',
    },
    {
      email: 'student2@lynxacademy.co.za',
      password: 'student123',
      name: 'Emily Davis',
      role: 'STUDENT',
    },
  ];

  console.log(`Creating ${users.length} demo users for LMS...`);

  for (const u of users) {
    try {
      console.log(`Creating LMS user: ${u.email} (${u.role})`);
      const hash = await bcrypt.hash(u.password, 12);

      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          hashedPassword: hash,
          role: u.role,
          name: u.name,
          isActive: true,
          emailVerified: new Date(),
        },
        create: {
          email: u.email,
          hashedPassword: hash,
          name: u.name,
          role: u.role,
          isActive: true,
          emailVerified: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Successfully created/updated LMS user: ${u.email}`);
    } catch (error) {
      console.error(`❌ Error creating LMS user ${u.email}:`, error.message);
    }
  }

  await prisma.$disconnect();
  console.log('🎉 LynxLearn LMS demo users seeded successfully!');
  console.log('\n📋 LMS Demo Credentials:');
  users.forEach(u => {
    console.log(`   ${u.role}: ${u.email} / ${u.password}`);
  });
}

main().catch(e => {
  console.error('❌ Error seeding LMS users:', e);
  process.exit(1);
});
