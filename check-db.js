const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    const studentCount = await prisma.student.count();
    const classCount = await prisma.class.count();
    const gradeCount = await prisma.grade.count();

    console.log('📊 Database Status:');
    console.log(`Students: ${studentCount}`);
    console.log(`Classes: ${classCount}`);
    console.log(`Grades: ${gradeCount}`);

    // Show distribution by grade
    const grades = await prisma.grade.findMany({
      include: {
        classes: {
          include: {
            students: true,
          },
        },
      },
    });

    console.log('\n📈 Student Distribution by Grade:');
    for (const grade of grades) {
      const totalStudents = grade.classes.reduce((sum, cls) => sum + cls.students.length, 0);
      console.log(
        `Grade ${grade.level}: ${totalStudents} students across ${grade.classes.length} classes`
      );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
