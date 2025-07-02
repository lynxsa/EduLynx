// Comprehensive seed script for South African CAPS curriculum
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  console.log('🔧 Seeding LynxLearn LMS with comprehensive CAPS curriculum...');

  try {
    // Get the admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please run user seeding first.');
      process.exit(1);
    }

    console.log('✅ Found admin user:', adminUser.email);

    // Define comprehensive South African CAPS subjects
    console.log('📚 Creating comprehensive CAPS subjects...');

    const subjects = [
      // Core Subjects (All Grades)
      {
        name: 'Mathematics',
        code: 'MATH',
        description:
          'Foundation mathematics covering algebra, geometry, trigonometry, and calculus',
        grades: [8, 9, 10, 11, 12],
      },
      {
        name: 'English Home Language',
        code: 'EHL',
        description: 'English language and literature studies for home language speakers',
        grades: [8, 9, 10, 11, 12],
      },
      {
        name: 'English First Additional Language',
        code: 'EFAL',
        description: 'English as a first additional language',
        grades: [8, 9, 10, 11, 12],
      },
      {
        name: 'Afrikaans Home Language',
        code: 'AHL',
        description: 'Afrikaans language and literature for home language speakers',
        grades: [8, 9, 10, 11, 12],
      },
      {
        name: 'Afrikaans First Additional Language',
        code: 'AFAL',
        description: 'Afrikaans as a first additional language',
        grades: [8, 9, 10, 11, 12],
      },

      // Natural Sciences (Grades 8-9) / Sciences (Grades 10-12)
      {
        name: 'Natural Sciences',
        code: 'NS',
        description: 'Integrated physics, chemistry, and earth sciences for junior grades',
        grades: [8, 9],
      },
      {
        name: 'Physical Sciences',
        code: 'PHYS',
        description: 'Physics and chemistry for senior grades',
        grades: [10, 11, 12],
      },
      {
        name: 'Life Sciences',
        code: 'LIFE',
        description: 'Biology and life sciences studies',
        grades: [10, 11, 12],
      },

      // Social Sciences (Grades 8-9) / Human Sciences (Grades 10-12)
      {
        name: 'Social Sciences',
        code: 'SS',
        description: 'Integrated history and geography for junior grades',
        grades: [8, 9],
      },
      {
        name: 'History',
        code: 'HIST',
        description: 'South African and world history',
        grades: [10, 11, 12],
      },
      {
        name: 'Geography',
        code: 'GEOG',
        description: 'Physical and human geography',
        grades: [10, 11, 12],
      },

      // Life Orientation (All Grades)
      {
        name: 'Life Orientation',
        code: 'LO',
        description: 'Personal development, health, and citizenship education',
        grades: [8, 9, 10, 11, 12],
      },

      // Technology (Grades 8-9) / Technical Subjects (Grades 10-12)
      {
        name: 'Technology',
        code: 'TECH',
        description: 'Design process, structures, processing, and systems & control',
        grades: [8, 9],
      },
      {
        name: 'Information Technology',
        code: 'IT',
        description: 'Computer applications, programming, and digital literacy',
        grades: [10, 11, 12],
      },
      {
        name: 'Engineering Graphics and Design',
        code: 'EGD',
        description: 'Technical drawing, design principles, and engineering concepts',
        grades: [10, 11, 12],
      },

      // Economic and Management Sciences
      {
        name: 'Economic and Management Sciences',
        code: 'EMS',
        description: 'Basic economics, entrepreneurship, and business studies',
        grades: [8, 9],
      },
      {
        name: 'Business Studies',
        code: 'BS',
        description: 'Business management, entrepreneurship, and commercial studies',
        grades: [10, 11, 12],
      },
      {
        name: 'Economics',
        code: 'ECON',
        description: 'Macro and microeconomics principles',
        grades: [10, 11, 12],
      },
      {
        name: 'Accounting',
        code: 'ACC',
        description: 'Financial accounting, management accounting, and auditing',
        grades: [10, 11, 12],
      },

      // Arts and Culture
      {
        name: 'Arts and Culture',
        code: 'AC',
        description: 'Visual arts, performing arts, and cultural studies',
        grades: [8, 9],
      },
      {
        name: 'Visual Arts',
        code: 'VA',
        description: 'Drawing, painting, sculpture, and art history',
        grades: [10, 11, 12],
      },
      {
        name: 'Music',
        code: 'MUS',
        description: 'Music theory, performance, and appreciation',
        grades: [10, 11, 12],
      },
      {
        name: 'Dramatic Arts',
        code: 'DA',
        description: 'Theatre, performance, and dramatic literature',
        grades: [10, 11, 12],
      },

      // Additional Sciences
      {
        name: 'Agricultural Sciences',
        code: 'AGRI',
        description: 'Agricultural practices, animal science, and crop production',
        grades: [10, 11, 12],
      },

      // Additional Languages
      {
        name: 'isiZulu Home Language',
        code: 'ZHL',
        description: 'isiZulu language and literature for home language speakers',
        grades: [8, 9, 10, 11, 12],
      },
      {
        name: 'isiXhosa Home Language',
        code: 'XHL',
        description: 'isiXhosa language and literature for home language speakers',
        grades: [8, 9, 10, 11, 12],
      },
    ];

    const createdSubjects = [];
    for (const subject of subjects) {
      const existingSubject = await prisma.subject.findFirst({
        where: { code: subject.code },
      });

      if (existingSubject) {
        console.log(`📖 Subject ${subject.name} already exists`);
        createdSubjects.push({ ...existingSubject, grades: subject.grades });
      } else {
        const newSubject = await prisma.subject.create({
          data: {
            name: subject.name,
            code: subject.code,
            description: subject.description,
            grades: subject.grades,
          },
        });
        console.log(`✅ Created subject: ${newSubject.name} (Grades ${subject.grades.join(', ')})`);
        createdSubjects.push({ ...newSubject, grades: subject.grades });
      }
    }

    // Create courses for all grade/subject combinations
    console.log('🎓 Creating comprehensive courses...');

    const coursesToCreate = [];

    createdSubjects.forEach(subject => {
      subject.grades.forEach(grade => {
        const gradeText = `Grade ${grade}`;
        coursesToCreate.push({
          title: `${gradeText} ${subject.name}`,
          description: `${subject.description} - ${gradeText} level`,
          slug: `grade-${grade}-${subject.code.toLowerCase()}`,
          subjectId: subject.id,
          grade: grade,
          isPublished: true,
          status: 'PUBLISHED',
          createdById: adminUser.id,
          estimatedHours: getEstimatedHours(subject.code, grade),
          difficulty: getDifficulty(grade),
          language: 'english',
          credits: getCredits(subject.code, grade),
        });
      });
    });

    console.log(`📝 Creating ${coursesToCreate.length} courses...`);

    for (const course of coursesToCreate) {
      const existingCourse = await prisma.course.findFirst({
        where: { slug: course.slug },
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

    console.log('🎉 Comprehensive CAPS curriculum seeding completed!');
    console.log('📊 Final Summary:');

    const subjectCount = await prisma.subject.count();
    const courseCount = await prisma.course.count();

    console.log(`   - ${subjectCount} subjects`);
    console.log(`   - ${courseCount} courses`);
    console.log(`   - Covering grades 8-12`);
    console.log(`   - Full South African CAPS curriculum`);
  } catch (error) {
    console.error('❌ Error seeding comprehensive curriculum:', error);
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
