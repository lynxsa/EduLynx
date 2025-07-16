const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCurrentCounts() {
  try {
    const students = await prisma.user.count({ where: { role: 'STUDENT' } });
    const teachers = await prisma.user.count({ where: { role: 'TEACHER' } });
    const parents = await prisma.user.count({ where: { role: 'PARENT' } });
    const classes = await prisma.class.count();
    const maleStudents = await prisma.user.count({ where: { role: 'STUDENT', gender: 'Male' } });
    const femaleStudents = await prisma.user.count({
      where: { role: 'STUDENT', gender: 'Female' },
    });

    console.log('📊 Current Database Counts:');
    console.log('Students:', students);
    console.log('Teachers:', teachers);
    console.log('Parents:', parents);
    console.log('Classes:', classes);
    console.log('Male Students:', maleStudents);
    console.log('Female Students:', femaleStudents);

    // Check teachers by subject
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            teachers: true,
          },
        },
      },
    });

    console.log('\n📚 Teachers by Subject:');
    subjects.forEach(subject => {
      console.log(`${subject.name}: ${subject._count.teachers} teachers`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getCurrentCounts();
