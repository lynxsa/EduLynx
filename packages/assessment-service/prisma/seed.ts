import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AssessmentService...');

  // Sample assessments for various courses
  const assessments = [
    {
      courseId: 1,
      title: 'Grade 8 Mathematics Quiz',
      description: 'Basic algebra and geometry',
      totalMarks: 100,
    },
    {
      courseId: 2,
      title: 'Grade 9 English Test',
      description: 'Literature comprehension',
      totalMarks: 150,
    },
    {
      courseId: 3,
      title: 'Grade 10 Science Exam',
      description: 'Physics and chemistry',
      totalMarks: 200,
    },
  ];

  for (const a of assessments) {
    await prisma.assessment.create({
      data: a,
    });
  }

  // Sample results
  const results = [
    { assessmentId: 1, studentId: 'student1', score: 85 },
    { assessmentId: 1, studentId: 'student2', score: 90 },
    { assessmentId: 2, studentId: 'student1', score: 120 },
    { assessmentId: 3, studentId: 'student3', score: 160 },
  ];

  for (const r of results) {
    await prisma.result.create({ data: r });
  }

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
