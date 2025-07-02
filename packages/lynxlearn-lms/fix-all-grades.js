// Fix to ensure all subjects are available for all grades 8-12
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Fixing curriculum to ensure all subjects for all grades 8-12...');

  try {
    // Get the admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found.');
      process.exit(1);
    }

    console.log('✅ Found admin user:', adminUser.email);

    // Get all existing subjects
    const allSubjects = await prisma.subject.findMany();
    console.log(`📚 Found ${allSubjects.length} subjects`);

    // Ensure all subjects have courses for all grades 8-12
    const grades = [8, 9, 10, 11, 12];

    console.log('🎓 Creating missing courses for all subjects across all grades...');

    let createdCount = 0;
    let existingCount = 0;

    for (const subject of allSubjects) {
      for (const grade of grades) {
        const slug = `grade-${grade}-${subject.code.toLowerCase()}`;

        // Check if course already exists
        const existingCourse = await prisma.course.findFirst({
          where: { slug: slug },
        });

        if (existingCourse) {
          existingCount++;
          continue;
        }

        // Create the missing course
        const courseData = {
          title: `Grade ${grade} ${subject.name}`,
          description: `${subject.description} - Grade ${grade} level`,
          slug: slug,
          subjectId: subject.id,
          grade: grade,
          isPublished: true,
          status: 'PUBLISHED',
          createdById: adminUser.id,
          estimatedHours: getEstimatedHours(subject.code, grade),
          difficulty: getDifficulty(grade),
          language: 'english',
          credits: getCredits(subject.code, grade),
        };

        try {
          const newCourse = await prisma.course.create({
            data: courseData,
          });
          console.log(`✅ Created: ${newCourse.title}`);
          createdCount++;
        } catch (error) {
          console.log(`⚠️ Skipped ${courseData.title}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Course creation complete!');
    console.log(`📊 Summary:`);
    console.log(`   - ${existingCount} courses already existed`);
    console.log(`   - ${createdCount} new courses created`);

    // Final verification
    const finalCounts = await prisma.course.groupBy({
      by: ['grade'],
      _count: {
        id: true,
      },
      orderBy: {
        grade: 'asc',
      },
    });

    console.log('\n📈 Final course distribution:');
    finalCounts.forEach(count => {
      console.log(`   - Grade ${count.grade}: ${count._count.id} courses`);
    });

    const totalCourses = await prisma.course.count();
    const totalSubjects = await prisma.subject.count();
    console.log(`\n🎯 Total: ${totalCourses} courses across ${totalSubjects} subjects`);
  } catch (error) {
    console.error('❌ Error fixing curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function getEstimatedHours(subjectCode, grade) {
  const baseHours = {
    MATH: 160,
    EHL: 120,
    EFAL: 100,
    AHL: 120,
    AFAL: 100,
    NS: 120,
    PHYS: 150,
    LIFE: 140,
    SS: 100,
    HIST: 120,
    GEOG: 120,
    LO: 80,
    TECH: 100,
    IT: 120,
    EGD: 140,
    EMS: 100,
    BS: 120,
    ECON: 130,
    ACC: 150,
    AC: 80,
    VA: 100,
    MUS: 100,
    DA: 100,
    AGRI: 140,
    ZHL: 120,
    XHL: 120,
  };

  const hours = baseHours[subjectCode] || 100;
  // Increase hours for higher grades
  return Math.round(hours * (0.8 + (grade - 8) * 0.05));
}

function getDifficulty(grade) {
  if (grade <= 9) return 'BEGINNER';
  if (grade <= 11) return 'INTERMEDIATE';
  return 'ADVANCED';
}

function getCredits(subjectCode, grade) {
  const coreSubjects = ['MATH', 'EHL', 'EFAL', 'AHL', 'AFAL'];
  const scienceSubjects = ['NS', 'PHYS', 'LIFE'];

  if (coreSubjects.includes(subjectCode)) return 20;
  if (scienceSubjects.includes(subjectCode)) return 20;
  if (grade >= 10) return 20; // All Grade 10-12 subjects are 20 credits
  return 15; // Grade 8-9 subjects
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
