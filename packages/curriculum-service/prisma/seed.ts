import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  // CAPS-aligned subjects
  const CAPS_SUBJECTS = [
    'Mathematics',
    'English Home Language',
    'Afrikaans First Additional Language',
    'Physical Sciences',
    'Life Sciences',
    'History',
    'Geography',
    'Accounting',
    'Business Studies',
    'Economics',
    'Life Orientation',
    'Information Technology',
    'Consumer Studies',
    'Tourism',
    'Agricultural Sciences',
    'Mathematical Literacy',
    'Technical Mathematics',
    'Technical Sciences',
    'Engineering Graphics and Design',
  ];

  console.log('Seeding CurriculumService...');

  for (let grade = 8; grade <= 12; grade++) {
    for (const name of CAPS_SUBJECTS) {
      await prisma.curriculumSubject.upsert({
        where: { name_grade: { name, grade } },
        update: {},
        create: { name, grade, description: `CAPS subject for grade ${grade}` },
      });
    }
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
