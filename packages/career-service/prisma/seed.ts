import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CareerService...');

  // Sample career profiles
  const profiles = [
    { userId: 'student1', interest: 'Engineering', skills: ['Math', 'Physics'] },
    { userId: 'student2', interest: 'Arts', skills: ['History', 'Literature'] },
    { userId: 'student3', interest: 'IT', skills: ['Programming', 'Databases'] },
  ];

  for (const p of profiles) {
    await prisma.careerProfile.upsert({
      where: { userId: p.userId },
      update: { interest: p.interest, skills: p.skills },
      create: { ...p, recommended: JSON.stringify(['Career Guide: Explore Options']) },
    });
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
