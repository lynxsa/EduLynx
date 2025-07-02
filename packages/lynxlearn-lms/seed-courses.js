// Simple seed script to create demo courses for LMS
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding LynxLearn LMS with demo courses...');

  try {
    // Get the admin user (should exist from our previous seeding)
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please run user seeding first.');
      process.exit(1);
    }

    console.log('✅ Found admin user:', adminUser.email);

    // Create subjects first
    console.log('📚 Creating subjects...');

    const subjects = [
      {
        name: 'Mathematics',
        code: 'MATH',
        description: 'Foundation mathematics for secondary education',
      },
      {
        name: 'English Home Language',
        code: 'EHL',
        description: 'English language and literature studies',
      },
      {
        name: 'Physical Sciences',
        code: 'PHYS',
        description: 'Physics and Chemistry combined',
      },
      {
        name: 'Life Sciences',
        code: 'LIFE',
        description: 'Biology and life sciences studies',
      },
      {
        name: 'History',
        code: 'HIST',
        description: 'South African and world history',
      },
    ];

    const createdSubjects = [];
    for (const subject of subjects) {
      const existingSubject = await prisma.subject.findFirst({
        where: { code: subject.code },
      });

      if (existingSubject) {
        console.log(`📖 Subject ${subject.name} already exists`);
        createdSubjects.push(existingSubject);
      } else {
        const newSubject = await prisma.subject.create({
          data: subject,
        });
        console.log(`✅ Created subject: ${newSubject.name}`);
        createdSubjects.push(newSubject);
      }
    }

    // Create courses
    console.log('🎓 Creating courses...');

    const courses = [
      {
        title: 'Grade 10 Mathematics',
        description: 'Introduction to algebraic thinking, geometry, and basic calculus concepts.',
        slug: 'grade-10-mathematics',
        subjectId: createdSubjects.find(s => s.code === 'MATH')?.id,
        grade: 10,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 120,
      },
      {
        title: 'Grade 11 Mathematics',
        description: 'Advanced algebra, trigonometry, and analytical geometry.',
        slug: 'grade-11-mathematics',
        subjectId: createdSubjects.find(s => s.code === 'MATH')?.id,
        grade: 11,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 140,
      },
      {
        title: 'Grade 12 Mathematics',
        description: 'Calculus, statistics, and exam preparation for matric.',
        slug: 'grade-12-mathematics',
        subjectId: createdSubjects.find(s => s.code === 'MATH')?.id,
        grade: 12,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 160,
      },
      {
        title: 'Grade 10 English Home Language',
        description: 'Reading comprehension, essay writing, and literature analysis.',
        slug: 'grade-10-english-home-language',
        subjectId: createdSubjects.find(s => s.code === 'EHL')?.id,
        grade: 10,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 100,
      },
      {
        title: 'Grade 11 Physical Sciences',
        description: 'Introduction to physics concepts and basic chemistry.',
        slug: 'grade-11-physical-sciences',
        subjectId: createdSubjects.find(s => s.code === 'PHYS')?.id,
        grade: 11,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 150,
      },
      {
        title: 'Grade 12 Life Sciences',
        description: 'Advanced biology concepts and exam preparation.',
        slug: 'grade-12-life-sciences',
        subjectId: createdSubjects.find(s => s.code === 'LIFE')?.id,
        grade: 12,
        isPublished: true,
        status: 'PUBLISHED',
        createdById: adminUser.id,
        estimatedHours: 140,
      },
    ];

    for (const course of courses) {
      if (!course.subjectId) {
        console.log(`⚠️ Skipping course ${course.title} - subject not found`);
        continue;
      }

      const existingCourse = await prisma.course.findFirst({
        where: { title: course.title },
      });

      if (existingCourse) {
        console.log(`🎓 Course ${course.title} already exists`);
      } else {
        const newCourse = await prisma.course.create({
          data: course,
        });
        console.log(`✅ Created course: ${newCourse.title}`);
      }
    }

    console.log('🎉 LMS seeding completed successfully!');
    console.log('📊 Summary:');

    const subjectCount = await prisma.subject.count();
    const courseCount = await prisma.course.count();

    console.log(`   - ${subjectCount} subjects`);
    console.log(`   - ${courseCount} courses`);
  } catch (error) {
    console.error('❌ Error seeding LMS:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
