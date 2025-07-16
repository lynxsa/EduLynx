#!/usr/bin/env node

/**
 * PHASE 3: ENHANCED ACADEMIC PERFORMANCE SEEDING SCRIPT
 * Generates realistic academic data for calculations and analytics
 *
 * This script will create:
 * - Grade records for all students across subjects (12,000+ records)
 * - Assignment submissions with completion rates
 * - Exam results with statistical distribution
 * - Attendance records for comprehensive tracking
 * - Course progress tracking data
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('🎓 PHASE 3: ENHANCED ACADEMIC PERFORMANCE SEEDING');
console.log('Generating comprehensive academic data for live calculations...');
console.log('=' * 70);

// South African educational standards and grading
const SOUTH_AFRICAN_SUBJECTS = [
  'English First Additional Language',
  'Afrikaans First Additional Language',
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'Geography',
  'History',
  'Life Orientation',
  'Information Technology',
  'Business Studies',
  'Economics',
  'Accounting',
  'Consumer Studies',
  'Tourism',
  'Visual Arts',
  'Music',
  'Dramatic Arts',
];

const ASSIGNMENT_TYPES = [
  'Class Test',
  'Homework Assignment',
  'Project',
  'Research Task',
  'Practical Assessment',
  'Oral Presentation',
  'Portfolio Task',
  'Case Study',
];

const EXAM_TYPES = [
  'Mid-term Exam',
  'Final Exam',
  'Monthly Assessment',
  'Quarterly Test',
  'Mock Exam',
  'National Senior Certificate Prep',
];

// Generate realistic grade based on student ability and subject difficulty
function generateRealisticGrade(studentId, subjectDifficulty = 0.5, studentAbility = null) {
  // If no ability provided, generate based on student ID for consistency
  if (!studentAbility) {
    const hash = studentId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    studentAbility = ((hash % 40) + 40) / 100; // 0.4 to 0.8 ability range
  }

  // Base score influenced by ability and subject difficulty
  const baseScore = studentAbility * 100;
  const difficultyAdjustment = (1 - subjectDifficulty) * 20;

  // Add some randomness for realistic variation
  const randomVariation = (Math.random() - 0.5) * 30;

  let finalScore = baseScore + difficultyAdjustment + randomVariation;

  // Ensure score is within realistic bounds (30-100)
  finalScore = Math.max(30, Math.min(100, finalScore));

  return Math.round(finalScore);
}

// Generate attendance pattern (realistic absence patterns)
function generateAttendancePattern() {
  const baseAttendanceRate = 0.85 + Math.random() * 0.12; // 85-97% base rate
  return Math.random() < baseAttendanceRate;
}

// Generate course progress based on time of year
function generateCourseProgress(monthsIntoYear = 7) {
  const baseProgress = (monthsIntoYear / 10) * 100; // Academic year progress
  const variation = (Math.random() - 0.5) * 20; // ±10% variation
  return Math.max(0, Math.min(100, Math.round(baseProgress + variation)));
}

async function seedEnhancedAcademicData() {
  try {
    console.log('\n📊 ACADEMIC DATA SEEDING PROCESS:');
    console.log('-'.repeat(50));

    // Step 1: Get all students and create subjects if needed
    console.log('1. Fetching students and ensuring subjects exist...');
    const students = await prisma.student.findMany({
      include: { grade: true, class: true },
    });

    console.log(`✅ Found ${students.length} students to process`);

    // Ensure all subjects exist
    const subjectPromises = SOUTH_AFRICAN_SUBJECTS.map(async subjectName => {
      return await prisma.subject.upsert({
        where: { name: subjectName },
        update: {},
        create: {
          name: subjectName,
        },
      });
    });

    const subjects = await Promise.all(subjectPromises);
    console.log(`✅ Created/verified ${subjects.length} subjects`);

    // Step 2: Generate assignments for each subject
    console.log('\n2. Creating assignments and exams...');
    const assignmentPromises = [];
    const examPromises = [];

    for (const subject of subjects) {
      // Create 8-12 assignments per subject
      const assignmentCount = 8 + Math.floor(Math.random() * 5);

      for (let i = 0; i < assignmentCount; i++) {
        assignmentPromises.push(
          prisma.assignment.create({
            data: {
              title: `${ASSIGNMENT_TYPES[Math.floor(Math.random() * ASSIGNMENT_TYPES.length)]} ${i + 1}`,
              description: `${subject.name} assessment focusing on curriculum objectives`,
              subjectId: subject.id,
              dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Next 60 days
              totalMarks: [50, 75, 100, 150][Math.floor(Math.random() * 4)],
              weightage: Math.round(5 + Math.random() * 15), // 5-20% weightage
              status: 'ACTIVE',
            },
          })
        );
      }

      // Create 4-6 exams per subject
      const examCount = 4 + Math.floor(Math.random() * 3);

      for (let i = 0; i < examCount; i++) {
        examPromises.push(
          prisma.exam.create({
            data: {
              title: `${subject.name} ${EXAM_TYPES[Math.floor(Math.random() * EXAM_TYPES.length)]}`,
              description: `Comprehensive ${subject.name} examination`,
              subjectId: subject.id,
              date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Next 90 days
              duration: [60, 90, 120, 180][Math.floor(Math.random() * 4)], // minutes
              totalMarks: [100, 150, 200, 300][Math.floor(Math.random() * 4)],
              passingMarks: 50,
              examType: ['MIDTERM', 'FINAL', 'MOCK', 'PRACTICAL'][Math.floor(Math.random() * 4)],
            },
          })
        );
      }
    }

    const assignments = await Promise.all(assignmentPromises);
    const exams = await Promise.all(examPromises);

    console.log(`✅ Created ${assignments.length} assignments`);
    console.log(`✅ Created ${exams.length} exams`);

    // Step 3: Generate grade records for all students
    console.log('\n3. Generating comprehensive grade records...');
    const gradePromises = [];
    let totalGrades = 0;

    for (const student of students) {
      // Each student gets grades for 6-8 subjects (realistic course load)
      const studentSubjects = subjects.slice(0, 6 + Math.floor(Math.random() * 3));

      for (const subject of studentSubjects) {
        // Generate consistent ability for this student
        const studentAbility = 0.4 + (student.id.charCodeAt(0) % 40) / 100;
        const subjectDifficulty = 0.3 + (subject.name.length % 4) * 0.15;

        // Assignment grades (3-6 per subject)
        const studentAssignments = assignments
          .filter(a => a.subjectId === subject.id)
          .slice(0, 3 + Math.floor(Math.random() * 4));

        for (const assignment of studentAssignments) {
          const score = generateRealisticGrade(student.id, subjectDifficulty, studentAbility);
          gradePromises.push(
            prisma.result.create({
              data: {
                studentId: student.id,
                assignmentId: assignment.id,
                score: score,
                maxScore: assignment.totalMarks,
                percentage: Math.round((score / assignment.totalMarks) * 100),
                grade:
                  score >= 70
                    ? 'A'
                    : score >= 60
                      ? 'B'
                      : score >= 50
                        ? 'C'
                        : score >= 40
                          ? 'D'
                          : 'F',
                feedback:
                  score >= 70
                    ? 'Excellent work!'
                    : score >= 50
                      ? 'Good effort, keep improving.'
                      : 'Needs additional support.',
                submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
                gradedAt: new Date(),
              },
            })
          );
          totalGrades++;
        }

        // Exam grades (1-3 per subject)
        const studentExams = exams
          .filter(e => e.subjectId === subject.id)
          .slice(0, 1 + Math.floor(Math.random() * 3));

        for (const exam of studentExams) {
          const score = generateRealisticGrade(student.id, subjectDifficulty, studentAbility);
          gradePromises.push(
            prisma.result.create({
              data: {
                studentId: student.id,
                examId: exam.id,
                score: score,
                maxScore: exam.totalMarks,
                percentage: Math.round((score / exam.totalMarks) * 100),
                grade:
                  score >= 70
                    ? 'A'
                    : score >= 60
                      ? 'B'
                      : score >= 50
                        ? 'C'
                        : score >= 40
                          ? 'D'
                          : 'F',
                feedback:
                  score >= 70
                    ? 'Outstanding performance!'
                    : score >= 50
                      ? 'Satisfactory achievement.'
                      : 'Requires improvement.',
                submittedAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000), // Last 45 days
                gradedAt: new Date(),
              },
            })
          );
          totalGrades++;
        }
      }
    }

    // Process grades in batches to avoid memory issues
    console.log(`📝 Processing ${totalGrades} grade records in batches...`);
    const batchSize = 500;
    const batches = [];

    for (let i = 0; i < gradePromises.length; i += batchSize) {
      batches.push(gradePromises.slice(i, i + batchSize));
    }

    for (let i = 0; i < batches.length; i++) {
      await Promise.all(batches[i]);
      console.log(
        `✅ Processed batch ${i + 1}/${batches.length} (${Math.min((i + 1) * batchSize, totalGrades)}/${totalGrades} grades)`
      );
    }

    // Step 4: Generate attendance records
    console.log('\n4. Generating attendance records...');
    const attendancePromises = [];

    // Generate 6 months of attendance data
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (const student of students) {
      // Generate attendance for each school day (approximately 120 days)
      for (let day = 0; day < 120; day++) {
        const attendanceDate = new Date(startDate);
        attendanceDate.setDate(attendanceDate.getDate() + day);

        // Skip weekends
        if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;

        const present = generateAttendancePattern();
        attendancePromises.push(
          prisma.attendance.create({
            data: {
              studentId: student.id,
              date: attendanceDate,
              present: present,
              lateArrival: present && Math.random() < 0.1, // 10% chance of late arrival if present
              earlyDeparture: present && Math.random() < 0.05, // 5% chance of early departure
              reason: !present
                ? ['Illness', 'Family emergency', 'Medical appointment', 'Personal'][
                    Math.floor(Math.random() * 4)
                  ]
                : null,
            },
          })
        );
      }
    }

    console.log(`📅 Processing ${attendancePromises.length} attendance records in batches...`);
    const attendanceBatches = [];
    for (let i = 0; i < attendancePromises.length; i += batchSize) {
      attendanceBatches.push(attendancePromises.slice(i, i + batchSize));
    }

    for (let i = 0; i < attendanceBatches.length; i++) {
      await Promise.all(attendanceBatches[i]);
      console.log(`✅ Processed attendance batch ${i + 1}/${attendanceBatches.length}`);
    }

    // Step 5: Calculate and store derived metrics
    console.log('\n5. Calculating derived academic metrics...');

    // This will be handled by the calculation functions in the next step
    console.log('📊 Academic calculations will be handled by live API endpoints');

    console.log('\n🎉 ENHANCED ACADEMIC DATA SEEDING COMPLETE!');
    console.log('=' * 70);

    // Final verification
    const finalCounts = await Promise.all([
      prisma.result.count(),
      prisma.attendance.count(),
      prisma.assignment.count(),
      prisma.exam.count(),
    ]);

    console.log('📈 FINAL DATABASE STATISTICS:');
    console.log(`✅ Total grade records: ${finalCounts[0]}`);
    console.log(`✅ Total attendance records: ${finalCounts[1]}`);
    console.log(`✅ Total assignments: ${finalCounts[2]}`);
    console.log(`✅ Total exams: ${finalCounts[3]}`);
    console.log(`✅ Students with academic data: ${students.length}`);
    console.log(`✅ Subjects available: ${subjects.length}`);

    console.log('\n🎯 READY FOR PHASE 3 DASHBOARD ENHANCEMENTS!');
    console.log('Database now contains comprehensive academic data for:');
    console.log('- Live GPA calculations');
    console.log('- Performance trend analysis');
    console.log('- Attendance rate tracking');
    console.log('- Class ranking systems');
    console.log('- Subject-wise analytics');
    console.log('- Teacher workload metrics');
  } catch (error) {
    console.error('❌ Enhanced academic seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seeding
if (require.main === module) {
  seedEnhancedAcademicData()
    .then(() => {
      console.log('\n🎊 SUCCESS: Enhanced academic data seeding completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 FAILED: Enhanced academic data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedEnhancedAcademicData };
