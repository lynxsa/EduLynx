/**
 * SIMPLIFIED ACADEMIC DATA SEEDING
 * Creates only Results data using existing database structure
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// South African curriculum subjects
const SOUTH_AFRICAN_SUBJECTS = [
  'English First Additional Language',
  'English Home Language',
  'Afrikaans First Additional Language',
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Business Studies',
  'Economics',
  'Geography',
  'History',
  'Life Orientation',
  'Information Technology',
  'Computer Applications Technology',
  'Visual Arts',
  'Dramatic Arts',
  'Music',
];

// Generate realistic grade distribution
function generateRealisticScore(maxScore = 100, subjectDifficulty = 0.5) {
  // Use normal distribution centered around 65%
  const random1 = Math.random();
  const random2 = Math.random();

  // Box-Muller transformation for normal distribution
  const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);

  // Adjust for subject difficulty and scale to percentage
  const baseScore = 65 + normalRandom * 15 * (1 - subjectDifficulty);

  // Clamp to realistic range (20% to 95%)
  const clampedScore = Math.max(20, Math.min(95, baseScore));

  // Convert to actual score based on maxScore
  return Math.round((clampedScore / 100) * maxScore);
}

async function createSimplifiedAcademicData() {
  try {
    console.log('🎓 SIMPLIFIED ACADEMIC DATA SEEDING');
    console.log('Creating basic Results data for comprehensive calculations...');

    // Get all students
    const students = await prisma.student.findMany();
    console.log(`✅ Found ${students.length} students`);

    // Ensure subjects exist
    const subjectPromises = SOUTH_AFRICAN_SUBJECTS.map(async subjectName => {
      return await prisma.subject.upsert({
        where: { name: subjectName },
        update: {},
        create: { name: subjectName },
      });
    });

    const subjects = await Promise.all(subjectPromises);
    console.log(`✅ Created/verified ${subjects.length} subjects`);

    // Create lessons for assignments to reference
    console.log('📚 Creating basic lessons for assignment structure...');
    const lessonPromises = [];

    for (const subject of subjects) {
      // Create 4 lessons per subject (one per term)
      for (let term = 1; term <= 4; term++) {
        lessonPromises.push(
          prisma.lesson.create({
            data: {
              title: `${subject.name} - Term ${term} Lessons`,
              description: `Academic content for ${subject.name} Term ${term}`,
              subjectId: subject.id,
              startTime: new Date(`2024-0${Math.ceil(term * 3 - 2)}-01`),
              endTime: new Date(`2024-0${Math.ceil(term * 3)}-30`),
            },
          })
        );
      }
    }

    const lessons = await Promise.all(lessonPromises);
    console.log(`✅ Created ${lessons.length} lessons`);

    // Create assignments linked to lessons
    console.log('📝 Creating assignments...');
    const assignmentPromises = [];

    for (const lesson of lessons) {
      // Create 2-3 assignments per lesson
      const assignmentCount = 2 + Math.floor(Math.random() * 2);

      for (let i = 0; i < assignmentCount; i++) {
        const dueDate = new Date(lesson.endTime);
        dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 20)); // Due within lesson period

        assignmentPromises.push(
          prisma.assignment.create({
            data: {
              title: `Assessment ${i + 1}`,
              startDate: lesson.startTime,
              dueDate: dueDate,
              lessonId: lesson.id,
            },
          })
        );
      }
    }

    const assignments = await Promise.all(assignmentPromises);
    console.log(`✅ Created ${assignments.length} assignments`);

    // Create exams
    console.log('📊 Creating exams...');
    const examPromises = [];

    for (const subject of subjects) {
      // Create 2 exams per subject (mid-year and final)
      for (let examNum = 1; examNum <= 2; examNum++) {
        const examDate = new Date(`2024-0${examNum === 1 ? '6' : '11'}-15`);

        examPromises.push(
          prisma.exam.create({
            data: {
              title: `${subject.name} ${examNum === 1 ? 'Mid-Year' : 'Final'} Exam`,
              startTime: examDate,
              endTime: new Date(examDate.getTime() + 3 * 60 * 60 * 1000), // 3 hours
              subjectId: subject.id,
            },
          })
        );
      }
    }

    const exams = await Promise.all(examPromises);
    console.log(`✅ Created ${exams.length} exams`);

    // Create Results for comprehensive academic data
    console.log('🎯 Creating comprehensive Results data...');
    const resultPromises = [];
    let resultCount = 0;

    for (const student of students) {
      // Create results for assignments (75% completion rate)
      for (const assignment of assignments) {
        if (Math.random() < 0.75) {
          // 75% completion rate
          const maxScore = 50 + Math.floor(Math.random() * 51); // 50-100 max score
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
          resultCount++;
        }
      }

      // Create results for exams (95% participation rate)
      for (const exam of exams) {
        if (Math.random() < 0.95) {
          // 95% participation rate
          const maxScore = 150 + Math.floor(Math.random() * 51); // 150-200 max score
          const score = generateRealisticScore(maxScore, 0.7); // Exams are harder

          resultPromises.push(
            prisma.result.create({
              data: {
                score: score,
                examId: exam.id,
                studentId: student.id,
              },
            })
          );
          resultCount++;
        }
      }
    }

    // Process results in batches of 500 to avoid memory issues
    const batchSize = 500;
    let processedResults = 0;

    for (let i = 0; i < resultPromises.length; i += batchSize) {
      const batch = resultPromises.slice(i, i + batchSize);
      await Promise.all(batch);
      processedResults += batch.length;
      console.log(`  ⏳ Processed ${processedResults}/${resultPromises.length} results...`);
    }

    console.log(`✅ Created ${resultCount} academic results`);

    // Create attendance records
    console.log('📅 Creating attendance records...');
    const attendancePromises = [];

    // Create attendance for last 60 school days
    const schoolDays = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        schoolDays.push(date);
      }
    }

    for (const student of students) {
      for (const date of schoolDays) {
        // 90% attendance rate with some variation
        const baseAttendanceRate = 0.85 + Math.random() * 0.15; // 85-100%
        const isPresent = Math.random() < baseAttendanceRate;

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
    for (let i = 0; i < attendancePromises.length; i += batchSize) {
      const batch = attendancePromises.slice(i, i + batchSize);
      await Promise.all(batch);
      console.log(
        `  ⏳ Processed ${i + batch.length}/${attendancePromises.length} attendance records...`
      );
    }

    console.log(`✅ Created ${attendancePromises.length} attendance records`);

    // Summary
    console.log('\\n🎉 SIMPLIFIED ACADEMIC DATA SEEDING COMPLETE!');
    console.log('================================================');
    console.log(`📚 Subjects: ${subjects.length}`);
    console.log(`📖 Lessons: ${lessons.length}`);
    console.log(`📝 Assignments: ${assignments.length}`);
    console.log(`📊 Exams: ${exams.length}`);
    console.log(`🎯 Results: ${resultCount}`);
    console.log(`📅 Attendance records: ${attendancePromises.length}`);
    console.log('\\n✅ Database is now ready for advanced academic calculations!');
  } catch (error) {
    console.error('❌ Simplified academic seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
createSimplifiedAcademicData()
  .then(() => {
    console.log('🎓 Academic data seeding completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FAILED:', error);
    process.exit(1);
  });
