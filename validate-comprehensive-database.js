const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validateComprehensiveDatabase() {
  console.log('🔍 Comprehensive Database Validation Report');
  console.log('==========================================\n');

  try {
    // 1. Check Students (target: 530+)
    const totalStudents = await prisma.student.count();
    console.log(
      `✅ Students: ${totalStudents} (Target: 530+) - ${totalStudents >= 530 ? 'PASSED' : 'FAILED'}`
    );

    // 2. Check Teachers (target: 40+)
    const totalTeachers = await prisma.teacher.count();
    console.log(
      `✅ Teachers: ${totalTeachers} (Target: 40+) - ${totalTeachers >= 40 ? 'PASSED' : 'FAILED'}`
    );

    // 3. Check Classes (target: 5 per grade)
    const totalClasses = await prisma.class.count();
    const classesPerGrade = await prisma.class.groupBy({
      by: ['gradeId'],
      _count: true,
    });
    console.log(
      `✅ Classes: ${totalClasses} total (25 expected - 5 per grade) - ${totalClasses === 25 ? 'PASSED' : 'FAILED'}`
    );

    for (const gradeClass of classesPerGrade) {
      const grade = await prisma.grade.findUnique({ where: { id: gradeClass.gradeId } });
      console.log(`   Grade ${grade.level}: ${gradeClass._count} classes`);
    }

    // 4. Check Student-to-Parent Ratio (target: 2.2:1)
    const totalParents = await prisma.parent.count();
    const ratio = (totalStudents / totalParents).toFixed(2);
    console.log(
      `✅ Student-to-Parent Ratio: ${ratio}:1 (Target: ~2.2:1) - ${ratio >= 1.8 && ratio <= 2.5 ? 'PASSED' : 'NEEDS ADJUSTMENT'}`
    );

    // 5. Check Grade Distribution
    console.log('\n📊 Student Distribution by Grade:');
    const studentsByGrade = await prisma.student.groupBy({
      by: ['gradeId'],
      _count: true,
    });

    for (const gradeData of studentsByGrade) {
      const grade = await prisma.grade.findUnique({ where: { id: gradeData.gradeId } });
      const studentsInGrade = gradeData._count;
      const classesInGrade =
        classesPerGrade.find(c => c.gradeId === gradeData.gradeId)?._count || 0;
      const avgPerClass = (studentsInGrade / classesInGrade).toFixed(1);
      console.log(
        `   Grade ${grade.level}: ${studentsInGrade} students across ${classesInGrade} classes (${avgPerClass} avg per class)`
      );
    }

    // 6. Check Teacher Departments
    console.log('\n👩‍🏫 Teacher Distribution by Subject:');
    const teacherSubjects = await prisma.subjectToTeacher.groupBy({
      by: ['subjectId'],
      _count: true,
    });

    for (const teacherSubject of teacherSubjects) {
      const subject = await prisma.subject.findUnique({ where: { id: teacherSubject.subjectId } });
      console.log(`   ${subject.name}: ${teacherSubject._count} teachers`);
    }

    // 7. Check Lessons
    const totalLessons = await prisma.lesson.count();
    console.log(`\n📅 Lessons: ${totalLessons} total`);

    // 8. Check Assignments
    const totalAssignments = await prisma.assignment.count();
    console.log(`📝 Assignments: ${totalAssignments} total`);

    // 9. Check Attendance Records
    const totalAttendance = await prisma.attendance.count();
    console.log(`📊 Attendance Records: ${totalAttendance} total`);

    // 10. Check Exams and Results
    const totalExams = await prisma.exam.count();
    const totalResults = await prisma.result.count();
    console.log(`🎓 Exams: ${totalExams} total`);
    console.log(`📋 Results: ${totalResults} total`);

    // 11. Check Announcements and Events
    const totalAnnouncements = await prisma.announcement.count();
    const totalEvents = await prisma.event.count();
    console.log(`📢 Announcements: ${totalAnnouncements} total`);
    console.log(`🎉 Events: ${totalEvents} total`);

    // 12. Check Projects
    const totalProjects = await prisma.project.count();
    console.log(`🚀 Projects: ${totalProjects} total`);

    // Summary
    console.log('\n🎯 Requirements Summary:');
    console.log(
      `   Students: ${totalStudents >= 530 ? '✅' : '❌'} ${totalStudents}/530+ required`
    );
    console.log(`   Teachers: ${totalTeachers >= 40 ? '✅' : '❌'} ${totalTeachers}/40+ required`);
    console.log(
      `   Classes: ${totalClasses === 25 ? '✅' : '❌'} ${totalClasses}/25 expected (5 per grade)`
    );
    console.log(
      `   Ratio: ${ratio >= 1.8 && ratio <= 2.5 ? '✅' : '❌'} ${ratio}:1 student-to-parent ratio`
    );
    console.log(
      `   Realistic Structure: ${totalLessons > 0 && totalAssignments > 0 && totalAttendance > 0 ? '✅' : '❌'} Comprehensive relational data`
    );

    console.log('\n🎉 Database validation completed!');
  } catch (error) {
    console.error('❌ Error during validation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

validateComprehensiveDatabase();
