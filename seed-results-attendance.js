/**
 * RESULTS AND ATTENDANCE ONLY SEEDING
 * Creates only Results (if assignments/exams exist) and Attendance data
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate realistic grade distribution
function generateRealisticScore(maxScore = 100, difficulty = 0.5) {
  const random1 = Math.random();
  const random2 = Math.random();

  // Box-Muller transformation for normal distribution
  const normalRandom = Math.sqrt(-2 * Math.log(random1)) * Math.cos(2 * Math.PI * random2);

  // Center around 65% with standard deviation of 15%
  const baseScore = 65 + normalRandom * 15 * (1 - difficulty);

  // Clamp to realistic range (25% to 95%)
  const clampedScore = Math.max(25, Math.min(95, baseScore));

  // Convert to actual score based on maxScore
  return Math.round((clampedScore / 100) * maxScore);
}

async function createResultsAndAttendance() {
  try {
    console.log('🎓 RESULTS AND ATTENDANCE SEEDING');
    console.log('Creating academic Results and Attendance data...');

    // Get all existing data
    const [students, assignments, exams] = await Promise.all([
      prisma.student.findMany(),
      prisma.assignment.findMany(),
      prisma.exam.findMany(),
    ]);

    console.log(`✅ Found ${students.length} students`);
    console.log(`✅ Found ${assignments.length} assignments`);
    console.log(`✅ Found ${exams.length} exams`);

    let totalResults = 0;

    // Only create results if we have assignments or exams
    if (assignments.length > 0 || exams.length > 0) {
      console.log('🎯 Creating Results data...');
      const resultPromises = [];

      // Create results for assignments
      if (assignments.length > 0) {
        for (const student of students) {
          for (const assignment of assignments) {
            if (Math.random() < 0.8) {
              // 80% completion rate
              const maxScore = 50 + Math.floor(Math.random() * 51); // 50-100 points
              const score = generateRealisticScore(maxScore, 0.3);

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
        }
      }

      // Create results for exams
      if (exams.length > 0) {
        for (const student of students) {
          for (const exam of exams) {
            if (Math.random() < 0.95) {
              // 95% participation
              const maxScore = 100 + Math.floor(Math.random() * 101); // 100-200 points
              const score = generateRealisticScore(maxScore, 0.6);

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
      }

      // Process results in batches
      const batchSize = 500;
      console.log(`⏳ Processing ${totalResults} results in batches...`);

      for (let i = 0; i < resultPromises.length; i += batchSize) {
        const batch = resultPromises.slice(i, i + batchSize);
        await Promise.all(batch);
        console.log(`  📊 Processed ${i + batch.length}/${resultPromises.length} results...`);
      }

      console.log(`✅ Created ${totalResults} academic results`);
    } else {
      console.log('ℹ️  No assignments or exams found. Skipping Results creation.');
    }

    // Create attendance records for the last 60 school days
    console.log('📅 Creating attendance records...');

    // Generate 60 school days (excluding weekends)
    const schoolDays = [];
    const today = new Date();
    let currentDate = new Date(today);

    for (let i = 0; i < 100; i++) {
      // Look back 100 days to get 60 school days
      currentDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        schoolDays.push(new Date(currentDate));

        if (schoolDays.length >= 60) break; // Stop when we have 60 school days
      }
    }

    console.log(`📅 Generated ${schoolDays.length} school days for attendance`);

    // Create attendance for each student for each school day
    const attendancePromises = [];

    for (const student of students) {
      // Each student has a base attendance rate (varies by student)
      const baseAttendanceRate = 0.82 + Math.random() * 0.18; // 82-100%

      for (const date of schoolDays) {
        // Some daily variation in attendance
        const dailyVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const finalRate = Math.max(0, Math.min(1, baseAttendanceRate + dailyVariation));
        const isPresent = Math.random() < finalRate;

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
    const batchSize = 1000;
    console.log(`⏳ Processing ${attendancePromises.length} attendance records in batches...`);

    for (let i = 0; i < attendancePromises.length; i += batchSize) {
      const batch = attendancePromises.slice(i, i + batchSize);
      await Promise.all(batch);
      console.log(
        `  📅 Processed ${i + batch.length}/${attendancePromises.length} attendance records...`
      );
    }

    console.log(`✅ Created ${attendancePromises.length} attendance records`);

    // Summary
    console.log('\\n🎉 RESULTS AND ATTENDANCE SEEDING COMPLETE!');
    console.log('=============================================');
    console.log(`📝 Assignments processed: ${assignments.length}`);
    console.log(`📊 Exams processed: ${exams.length}`);
    console.log(`🎯 Results created: ${totalResults}`);
    console.log(`📅 Attendance records: ${attendancePromises.length}`);
    console.log(`👥 Students with data: ${students.length}`);
    console.log(`📆 School days covered: ${schoolDays.length}`);
    console.log('\\n✅ Database now has academic performance data for calculations!');
  } catch (error) {
    console.error('❌ Results and attendance seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
createResultsAndAttendance()
  .then(() => {
    console.log('🎓 Results and attendance seeding completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 FAILED:', error);
    process.exit(1);
  });
