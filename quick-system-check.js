const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickSystemCheck() {
  try {
    console.log('🔍 Quick system health check...');

    // Basic counts
    const totalParents = await prisma.parent.count();
    const totalStudents = await prisma.student.count();
    const studentsWithParents = await prisma.student.count({
      where: { parentId: { not: null } },
    });

    console.log(`👨‍👩 Parents: ${totalParents}`);
    console.log(`👧👦 Students: ${totalStudents}`);
    console.log(
      `🔗 Students with parents: ${studentsWithParents} (${(
        (studentsWithParents / totalStudents) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`📊 Average students per parent: ${(totalStudents / totalParents).toFixed(2)}`);

    // Check if demo parent can access their children
    const demoParent = await prisma.parent.findUnique({
      where: { email: 'parent1@lynxacademy.co.za' },
      include: { students: true },
    });

    if (demoParent) {
      console.log(
        `✅ Demo parent "${demoParent.name} ${demoParent.surname}" has ${demoParent.students.length} children`
      );
      demoParent.students.forEach(student => {
        console.log(`   - ${student.name} ${student.surname} (Grade ${student.gradeId})`);
      });
    }

    console.log('🎉 System is ready for testing!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickSystemCheck();
