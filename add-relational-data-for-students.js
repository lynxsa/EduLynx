const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAttendanceAndResultsForNewStudents() {
  try {
    console.log('🔄 Adding attendance and results for students without these records...');

    // Find students without attendance records
    const studentsWithoutAttendance = await prisma.student.findMany({
      where: {
        attendances: {
          none: {},
        },
      },
      include: {
        class: true,
        grade: true,
      },
    });

    console.log(`📊 Found ${studentsWithoutAttendance.length} students without attendance records`);

    // Find students without results
    const studentsWithoutResults = await prisma.student.findMany({
      where: {
        results: {
          none: {},
        },
      },
    });

    console.log(`📊 Found ${studentsWithoutResults.length} students without results`);

    // Get lessons and subjects for creating records
    const lessons = await prisma.lesson.findMany({ take: 50 });
    const subjects = await prisma.subject.findMany({ take: 10 });

    // Create attendance records for students without them
    if (studentsWithoutAttendance.length > 0 && lessons.length > 0) {
      console.log('📅 Creating attendance records...');

      for (const student of studentsWithoutAttendance) {
        const classLessons = lessons.filter(l => l.classId === student.classId).slice(0, 5);

        if (classLessons.length > 0) {
          const attendanceRecords = [];

          // Create attendance for last 20 school days
          for (let day = 0; day < 20; day++) {
            const attendanceDate = new Date();
            attendanceDate.setDate(attendanceDate.getDate() - day);

            // Skip weekends
            if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;

            // Create attendance for 2-3 lessons per day
            const dailyLessons = classLessons.slice(0, Math.min(3, classLessons.length));
            for (const lesson of dailyLessons) {
              const isPresent = Math.random() > 0.05; // 95% attendance rate
              attendanceRecords.push({
                studentId: student.id,
                lessonId: lesson.id,
                date: attendanceDate,
                present: isPresent,
              });
            }
          }

          if (attendanceRecords.length > 0) {
            await prisma.attendance.createMany({
              data: attendanceRecords,
            });
            console.log(
              `✅ Created ${attendanceRecords.length} attendance records for ${student.name} ${student.surname}`
            );
          }
        }
      }
    }

    // Create exam records first, then results
    if (studentsWithoutResults.length > 0 && subjects.length > 0) {
      console.log('📝 Creating exam and result records...');

      // Create some basic exams if they don't exist
      const existingExams = await prisma.exam.findMany();
      let exams = existingExams;

      if (existingExams.length === 0) {
        console.log('📋 Creating basic exams...');
        const examData = [];
        for (const subject of subjects.slice(0, 6)) {
          examData.push({
            title: `${subject.name} Mid-Year Exam`,
            startTime: new Date('2025-05-15T09:00:00Z'),
            endTime: new Date('2025-05-15T12:00:00Z'),
            subjectId: subject.id,
          });
          examData.push({
            title: `${subject.name} Final Exam`,
            startTime: new Date('2025-11-15T09:00:00Z'),
            endTime: new Date('2025-11-15T12:00:00Z'),
            subjectId: subject.id,
          });
        }

        if (examData.length > 0) {
          await prisma.exam.createMany({ data: examData });
          exams = await prisma.exam.findMany();
        }
      }

      // Create results for students
      for (const student of studentsWithoutResults) {
        const resultRecords = [];

        // Create 2-3 results per subject
        for (const subject of subjects.slice(0, 6)) {
          const subjectExams = exams.filter(e => e.subjectId === subject.id);

          if (subjectExams.length > 0) {
            for (const exam of subjectExams.slice(0, 2)) {
              const score = Math.floor(Math.random() * 40) + 50; // 50-90% range
              resultRecords.push({
                score: score,
                studentId: student.id,
                examId: exam.id,
              });
            }
          }
        }

        if (resultRecords.length > 0) {
          await prisma.result.createMany({
            data: resultRecords,
          });
          console.log(
            `✅ Created ${resultRecords.length} results for ${student.name} ${student.surname}`
          );
        }
      }
    }

    // Final verification
    const finalAttendanceCount = await prisma.attendance.count();
    const finalResultCount = await prisma.result.count();
    const studentsWithAttendance = await prisma.student.count({
      where: {
        attendances: {
          some: {},
        },
      },
    });
    const studentsWithResults = await prisma.student.count({
      where: {
        results: {
          some: {},
        },
      },
    });
    const totalStudents = await prisma.student.count();

    console.log('\\n📈 Final Relational Data Summary:');
    console.log(`👧👦 Total students: ${totalStudents}`);
    console.log(`📅 Total attendance records: ${finalAttendanceCount}`);
    console.log(`📝 Total result records: ${finalResultCount}`);
    console.log(
      `✅ Students with attendance: ${studentsWithAttendance}/${totalStudents} (${(
        (studentsWithAttendance / totalStudents) *
        100
      ).toFixed(1)}%)`
    );
    console.log(
      `✅ Students with results: ${studentsWithResults}/${totalStudents} (${(
        (studentsWithResults / totalStudents) *
        100
      ).toFixed(1)}%)`
    );
  } catch (error) {
    console.error('❌ Error adding relational data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAttendanceAndResultsForNewStudents();
