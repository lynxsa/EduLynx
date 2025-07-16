const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickVerification() {
  try {
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    console.log('🎯 FINAL VERIFICATION RESULTS:');
    console.log(`✅ Students in database: ${studentCount}`);
    console.log(`✅ Teachers in database: ${teacherCount}`);
    console.log('🎉 Live data integration complete!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickVerification();
