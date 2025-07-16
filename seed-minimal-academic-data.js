/**
 * MINIMAL ACADEMIC DATA SEEDING
 * Uses existing lessons/assignments/exams and creates Results + Attendance only
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate realistic grade distribution
function generateRealisticScore(maxScore = 100, difficulty = 0.5) {
  // Create bell curve distribution
  const random1 = Math.random();
  const random2 = Math.random();

  // Box-Muller transformation for normal distribution
  const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);

  // Center around 65% with standard deviation of 15%
  const baseScore = 65 + normalRandom * 15 * (1 - difficulty);

  // Clamp to realistic range (20% to 95%)
  const clampedScore = Math.max(20, Math.min(95, baseScore));

  // Convert to actual score based on maxScore
  return Math.round((clampedScore / 100) * maxScore);
}

async function createMinimalAcademicData() {
  try {
    console.log('🎓 MINIMAL ACADEMIC DATA SEEDING');
    console.log('Working with existing structure to create Results and Attendance...');

    // Get all existing data
    const [students, assignments, exams] = await Promise.all([
      prisma.student.findMany(),
      prisma.assignment.findMany(),
      prisma.exam.findMany(),
    ]);

    console.log(`✅ Found ${students.length} students`);
    console.log(`✅ Found ${assignments.length} assignments`);
    console.log(`✅ Found ${exams.length} exams`);

    if (assignments.length === 0 && exams.length === 0) {
      console.log('ℹ️  No assignments or exams found. Creating minimal test data...');

      // Get subjects to create basic lessons, assignments, and exams
      const subjects = await prisma.subject.findMany({ take: 5 }); // Just use first 5 subjects
      const classes = await prisma.class.findMany({ take: 5 }); // First 5 classes
      const teachers = await prisma.teacher.findMany({ take: 5 }); // First 5 teachers

      if (subjects.length > 0 && classes.length > 0 && teachers.length > 0) {
        console.log('📚 Creating minimal lessons, assignments, and exams...');

        // Create one lesson per subject
        const lessonPromises = subjects.map((subject, index) => {
          const classId = classes[index % classes.length].id;
          const teacherId = teachers[index % teachers.length].id;

          return prisma.lesson.create({
            data: {
              name: `${subject.name} Lesson`,
              day: 'MONDAY', // Simple day
              startTime: new Date('2024-01-15T09:00:00Z'),
              endTime: new Date('2024-01-15T10:00:00Z'),
              subjectId: subject.id,
              classId: classId,
              teacherId: teacherId,
            },
          });
        });

        const lessons = await Promise.all(lessonPromises);
        console.log(`✅ Created ${lessons.length} lessons`);

        // Create assignments for each lesson
        const assignmentPromises = lessons.map(lesson => {
          return prisma.assignment.create({
            data: {
              title: `${lesson.name} Assignment`,
              startDate: new Date('2024-01-15T09:00:00Z'),
              dueDate: new Date('2024-01-22T17:00:00Z'),
              lessonId: lesson.id,
            },
          });
        });

        const newAssignments = await Promise.all(assignmentPromises);
        console.log(`✅ Created ${newAssignments.length} assignments`);

        // Create exams for each subject
        const examPromises = subjects.map(subject => {
          return prisma.exam.create({
            data: {
              title: `${subject.name} Test`,
              startTime: new Date('2024-02-15T09:00:00Z'),
              endTime: new Date('2024-02-15T11:00:00Z'),
              subjectId: subject.id,
            },
          });
        });

        const newExams = await Promise.all(examPromises);
        console.log(`✅ Created ${newExams.length} exams`);

        // Update our arrays with new data
        assignments.push(...newAssignments);
        exams.push(...newExams);
      }
    }

    // Create Results for assignments and exams
    console.log('🎯 Creating comprehensive Results data...');
    const resultPromises = [];
    let totalResults = 0;

    // Create results for assignments (80% completion rate)
    for (const student of students) {
      for (const assignment of assignments) {
        if (Math.random() < 0.8) {
          // 80% completion rate
          const maxScore = 50 + Math.floor(Math.random() * 51); // 50-100 points
          const score = generateRealisticScore(maxScore, 0.3); // Assignments are easier

          resultPromises.push(
            prisma.result.create({
              data: {
                score: score,
                assignmentId: assignment.id,
                studentId: student.id,
              },
            })
          );
          totalResults++;
        }
      }

      // Create results for exams (95% participation)
      for (const exam of exams) {
        if (Math.random() < 0.95) {
          // 95% take exams
          const maxScore = 100 + Math.floor(Math.random() * 101); // 100-200 points
          const score = generateRealisticScore(maxScore, 0.6); // Exams are harder

          resultPromises.push(
            prisma.result.create({
              data: {
                score: score,
                examId: exam.id,
                studentId: student.id,
              },
            })
          );
          totalResults++;
        }
      }
    }

    // Process results in batches
    const batchSize = 500;
    let processedResults = 0;

    console.log(`⏳ Processing ${totalResults} results in batches...`);
    for (let i = 0; i < resultPromises.length; i += batchSize) {
      const batch = resultPromises.slice(i, i + batchSize);
      await Promise.all(batch);
      processedResults += batch.length;
      console.log(`  📊 Processed ${processedResults}/${resultPromises.length} results...`);
    }

    console.log(`✅ Created ${totalResults} academic results`);

    // Create attendance records for the last 60 school days
    console.log('📅 Creating attendance records...');
    const attendancePromises = [];

    // Generate 60 school days (excluding weekends)
    const schoolDays = [];
    const today = new Date();
    let daysAdded = 0;
    const currentDate = new Date(today);

    while (daysAdded < 60) {
      currentDate.setDate(currentDate.getDate() - 1);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        schoolDays.push(new Date(currentDate));
        daysAdded++;
      }
    }

    // Create attendance for each student for each school day
    for (const student of students) {
      for (const date of schoolDays) {
        // Realistic attendance pattern: most students attend most days
        // Some students have better attendance than others
        const studentAttendanceRate = 0.85 + Math.random() * 0.15; // 85-100%
        const isPresent = Math.random() < studentAttendanceRate;

        attendancePromises.push(
          prisma.attendance.create({
            data: {
              studentId: student.id,
              date: date,
              present: isPresent,
            },
          })
        );
      }
    }

    // Process attendance in batches
    console.log(`⏳ Processing ${attendancePromises.length} attendance records in batches...`);
    let processedAttendance = 0;

    for (let i = 0; i < attendancePromises.length; i += batchSize) {
      const batch = attendancePromises.slice(i, i + batchSize);
      await Promise.all(batch);
      processedAttendance += batch.length;
      console.log(
        `  📅 Processed ${processedAttendance}/${attendancePromises.length} attendance records...`
      );
    }

    console.log(`✅ Created ${attendancePromises.length} attendance records`);

    // Summary
    console.log('\\n🎉 MINIMAL ACADEMIC DATA SEEDING COMPLETE!');
    console.log('===============================================');
    console.log(`📝 Assignments available: ${assignments.length}`);
    console.log(`📊 Exams available: ${exams.length}`);
    console.log(`🎯 Results created: ${totalResults}`);
    console.log(`📅 Attendance records: ${attendancePromises.length}`);
    console.log(`👥 Students with data: ${students.length}`);
    console.log('\\n✅ Database is ready for academic calculations!');
  } catch (error) {
    console.error('❌ Minimal academic seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
createMinimalAcademicData()
  .then(() => {
    console.log('🎓 Minimal academic data seeding completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FAILED:', error);
    process.exit(1);
  });
