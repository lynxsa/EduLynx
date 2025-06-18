const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const demoUsers = [
  { email: 'admin@lynxacademy.co.za', role: 'ADMIN' },
  { email: 'teacher1@lynxacademy.co.za', role: 'TEACHER' },
  { email: 'parent1@lynxacademy.co.za', role: 'PARENT' },
  { email: 'student1@lynxacademy.co.za', role: 'STUDENT' },
];

async function main() {
  try {
    for (const { email, role } of demoUsers) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        console.log(`✅ Found: ${email} (role: ${user.role})`);
      } else {
        console.error(`❌ MISSING: ${email} (role: ${role})`);
      }
    }
  } catch (err) {
    console.error('DB ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
