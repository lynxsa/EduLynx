const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    // Test basic counts
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    const classCount = await prisma.class.count();
    const parentCount = await prisma.parent.count();

    console.log('🌟 COMPREHENSIVE LIVE DATA VERIFICATION 🌟');
    console.log('==============================================');
    console.log(`Total Students: ${studentCount}`);
    console.log(`Total Teachers: ${teacherCount}`);
    console.log(`Total Classes: ${classCount}`);
    console.log(`Total Parents: ${parentCount}`);
    console.log('==============================================');

    // Test if we have the correct student count from comprehensive seed
    if (studentCount >= 530) {
      console.log('✅ COMPREHENSIVE SEED SUCCESSFUL - Target reached!');
    } else {
      console.log('❌ Target not reached - need more students');
    }

    // Test recent attendance
    const recentAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
        },
      },
    });

    console.log(`Recent Attendance Records (30 days): ${recentAttendance}`);

    // Test results
    const resultCount = await prisma.result.count();
    console.log(`Total Results: ${resultCount}`);

    // Test assignments
    const assignmentCount = await prisma.assignment.count();
    console.log(`Total Assignments: ${assignmentCount}`);

    // Test lessons
    const lessonCount = await prisma.lesson.count();
    console.log(`Total Lessons: ${lessonCount}`);
  } catch (error) {
    console.error('Database Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
