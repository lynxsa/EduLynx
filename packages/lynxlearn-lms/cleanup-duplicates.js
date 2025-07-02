// Script to remove duplicate courses and clean up data
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  console.log('🧹 Cleaning up duplicate courses...');

  try {
    // Find all courses grouped by title
    const duplicateGroups = await prisma.course.groupBy({
      by: ['title'],
      having: {
        title: {
          _count: {
            gt: 1,
          },
        },
      },
      _count: {
        title: true,
      },
    });

    console.log(`🔍 Found ${duplicateGroups.length} groups with duplicates`);

    let deletedCount = 0;

    for (const group of duplicateGroups) {
      // Get all courses with this title
      const courses = await prisma.course.findMany({
        where: { title: group.title },
        orderBy: { createdAt: 'asc' }, // Keep the oldest one
      });

      console.log(`📝 Processing "${group.title}" - ${courses.length} duplicates`);

      // Delete all but the first (oldest) course
      for (let i = 1; i < courses.length; i++) {
        await prisma.course.delete({
          where: { id: courses[i].id },
        });
        console.log(`   ❌ Deleted duplicate: ${courses[i].id}`);
        deletedCount++;
      }
    }

    console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} duplicate courses`);

    // Verify final counts
    const finalCounts = await prisma.course.groupBy({
      by: ['grade'],
      _count: {
        id: true,
      },
      orderBy: {
        grade: 'asc',
      },
    });

    console.log('\n📊 Final course distribution:');
    finalCounts.forEach(count => {
      console.log(`   - Grade ${count.grade}: ${count._count.id} courses`);
    });

    const totalCourses = await prisma.course.count();
    const totalSubjects = await prisma.subject.count();
    console.log(`\n🎯 Total: ${totalCourses} courses across ${totalSubjects} subjects`);
    console.log(`📐 Expected: ${totalSubjects * 5} courses (${totalSubjects} subjects × 5 grades)`);
  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
