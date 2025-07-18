const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickSeed() {
  console.log('🌱 Starting quick database seeding...');

  try {
    // Create a few sample records to test
    console.log('📚 Creating grades...');
    const grade8 = await prisma.grade.create({ data: { level: 8 } });
    const grade9 = await prisma.grade.create({ data: { level: 9 } });

    console.log('📖 Creating subjects...');
    const math = await prisma.subject.create({ data: { name: 'Mathematics' } });
    const english = await prisma.subject.create({ data: { name: 'English' } });

    console.log('🏫 Creating classes...');
    const class8A = await prisma.class.create({
      data: {
        name: '8A',
        capacity: 30,
        gradeId: grade8.id,
      },
    });

    console.log('👩‍🏫 Creating teachers...');
    const teacherUser = await prisma.user.create({
      data: {
        email: 'teacher@lynxacademy.co.za',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'TEACHER',
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        id: teacherUser.id,
        username: 'sarah.johnson',
        name: 'Sarah',
        surname: 'Johnson',
        email: 'teacher@lynxacademy.co.za',
        phone: '+27123456789',
        address: '123 Teacher St',
        sex: 'FEMALE',
        classId: class8A.id,
        userId: teacherUser.id,
      },
    });

    console.log('👨‍👩‍👧‍👦 Creating students...');
    for (let i = 1; i <= 10; i++) {
      const studentUser = await prisma.user.create({
        data: {
          email: `student${i}@lynxacademy.co.za`,
          firstName: `Student${i}`,
          lastName: 'Learner',
          role: 'STUDENT',
        },
      });

      await prisma.student.create({
        data: {
          id: studentUser.id,
          username: `student${i}`,
          name: `Student${i}`,
          surname: 'Learner',
          email: `student${i}@lynxacademy.co.za`,
          phone: `+2712345678${i}`,
          address: `${i} Student Lane`,
          sex: i % 2 === 0 ? 'MALE' : 'FEMALE',
          classId: class8A.id,
          gradeId: grade8.id,
          userId: studentUser.id,
        },
      });
    }

    console.log('✅ Quick seed completed successfully!');
    console.log('📊 Created: 2 grades, 2 subjects, 1 class, 1 teacher, 10 students');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed().catch(e => {
  console.error(e);
  process.exit(1);
});
