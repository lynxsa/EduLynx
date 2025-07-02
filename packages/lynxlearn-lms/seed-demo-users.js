// seeds four demo users into the LMS database
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding LMS demo users...');

  const users = [
    { email: 'admin@lynxacademy.co.za', password: 'adminpass', role: 'ADMIN' },
    { email: 'teacher1@lynxacademy.co.za', password: 'teacherpass', role: 'TEACHER' },
    { email: 'parent1@lynxacademy.co.za', password: 'parentpass', role: 'STUDENT' }, // Using STUDENT as parent role doesn't exist
    { email: 'student1@lynxacademy.co.za', password: 'studentpass', role: 'STUDENT' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { hashedPassword: hash, role: u.role },
      create: {
        email: u.email,
        hashedPassword: hash,
        name: `${u.role.charAt(0) + u.role.slice(1).toLowerCase()} User`,
        role: u.role,
      },
    });
    console.log(`✅ Seeded ${u.role.toLowerCase()} (${u.email})`);
  }

  await prisma.$disconnect();
  console.log('🎉 LMS demo users seeded!');
}

main().catch(e => {
  console.error('❌ Error seeding LMS users:', e);
  process.exit(1);
});
