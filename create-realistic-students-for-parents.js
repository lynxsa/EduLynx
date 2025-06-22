const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// South African student names that complement family structures
const SOUTH_AFRICAN_FIRST_NAMES = {
  male: [
    'Thabo',
    'Sipho',
    'John',
    'Michael',
    'David',
    'James',
    'Robert',
    'William',
    'Richard',
    'Charles',
    'Joseph',
    'Thomas',
    'Christopher',
    'Daniel',
    'Paul',
    'Mark',
    'Donald',
    'Mandla',
    'Lucky',
    'Gift',
    'Blessing',
    'Prince',
    'King',
    'Junior',
    'Sibusiso',
    'Themba',
    'Sello',
    'Tshepo',
    'Kagiso',
    'Lebohang',
    'Lerato',
    'Tebogo',
    'Neo',
    'Arjun',
    'Anil',
    'Raj',
    'Sunil',
    'Vikram',
    'Rohit',
    'Ahmed',
    'Hassan',
    'Omar',
    'Joshua',
    'Matthew',
    'Luke',
    'Nathan',
    'Benjamin',
    'Samuel',
    'Isaac',
    'Jacob',
    'Ethan',
    'Noah',
    'Liam',
    'Mason',
    'Logan',
    'Alexander',
    'Oliver',
    'Sebastian',
  ],
  female: [
    'Nomsa',
    'Thandi',
    'Mary',
    'Patricia',
    'Jennifer',
    'Linda',
    'Susan',
    'Karen',
    'Nancy',
    'Lisa',
    'Betty',
    'Dorothy',
    'Sandra',
    'Ashley',
    'Kimberly',
    'Emily',
    'Precious',
    'Faith',
    'Hope',
    'Grace',
    'Mercy',
    'Joy',
    'Peace',
    'Patience',
    'Lerato',
    'Naledi',
    'Boitumelo',
    'Lesego',
    'Katlego',
    'Keabetswe',
    'Mmabatho',
    'Priya',
    'Anita',
    'Kavitha',
    'Meera',
    'Sunita',
    'Fatima',
    'Aisha',
    'Khadija',
    'Sarah',
    'Hannah',
    'Rebecca',
    'Rachel',
    'Esther',
    'Ruth',
    'Naomi',
    'Abigail',
    'Elizabeth',
    'Catherine',
    'Margaret',
    'Helen',
    'Victoria',
    'Stephanie',
    'Michelle',
  ],
};

const HOME_LANGUAGES = [
  'English',
  'Afrikaans',
  'isiZulu',
  'isiXhosa',
  'Sepedi',
  'Setswana',
  'Sesotho',
  'Xitsonga',
  'siSwati',
  'Tshivenda',
  'isiNdebele',
  'Hindi',
  'Tamil',
  'Gujarati',
  'Telugu',
  'Arabic',
  'Portuguese',
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Shellfish',
  'Fish',
  'Milk',
  'Eggs',
  'Soy',
  'Wheat',
  'Pollen',
  'Dust mites',
  'Pet dander',
  'Latex',
  'Penicillin',
  'Aspirin',
];

const MEDICAL_CONDITIONS = [
  'Asthma',
  'Diabetes Type 1',
  'Epilepsy',
  'ADHD',
  'Allergic rhinitis',
  'Eczema',
  'Migraine',
  'Anxiety disorder',
  'Depression',
  'None',
];

const EXTRACURRICULARS = [
  'Soccer',
  'Rugby',
  'Netball',
  'Cricket',
  'Athletics',
  'Swimming',
  'Tennis',
  'Basketball',
  'Volleyball',
  'Chess',
  'Debating',
  'Drama',
  'Choir',
  'Band',
  'Art Club',
  'Science Club',
  'Computer Club',
  'Photography',
  'Dance',
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePhoneNumber() {
  const prefixes = ['082', '083', '084', '072', '073', '074', '076', '078', '079'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+27 ${prefix} ${number.toString().slice(0, 3)} ${number.toString().slice(3)}`;
}

function generateSAIdNumber(birthDate, gender) {
  const year = birthDate.getFullYear().toString().slice(-2);
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const day = birthDate.getDate().toString().padStart(2, '0');
  const genderDigit =
    gender === 'MALE' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5);
  const citizenship = '0'; // SA citizen
  const race = '8'; // Not classified
  const checksum = Math.floor(Math.random() * 10);

  return `${year}${month}${day}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}${genderDigit}${citizenship}${race}${checksum}`;
}

// Generate age-appropriate birth date for students (ages 5-18)
function generateStudentBirthDate() {
  const currentYear = new Date().getFullYear();
  const age = Math.floor(Math.random() * 14) + 5; // 5-18 years old
  const birthYear = currentYear - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, month, day);
}

async function createRealisticStudentsForParents() {
  try {
    console.log('🔄 Creating realistic students for parents without children...');

    // Get all necessary data
    const school = await prisma.school.findFirst();
    const grades = await prisma.grade.findMany();
    const classes = await prisma.class.findMany();

    // Find parents without students
    const parentsWithoutStudents = await prisma.parent.findMany({
      where: {
        students: {
          none: {},
        },
      },
      include: {
        students: true,
      },
    });

    console.log(`👨‍👩‍👧‍👦 Found ${parentsWithoutStudents.length} parents without students`);

    const studentPassword = await bcrypt.hash('student123', 10);
    let studentsCreated = 0;

    for (const parent of parentsWithoutStudents) {
      // Determine how many children this parent should have (1-3 for balance)
      const childrenCount = Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 2 : 3;

      console.log(`👨‍👩‍👧‍👦 Creating ${childrenCount} student(s) for ${parent.name} ${parent.surname}`);

      for (let i = 0; i < childrenCount; i++) {
        // Generate student details
        const studentGender = Math.random() > 0.5 ? 'FEMALE' : 'MALE';
        const studentFirstName = getRandomElement(
          SOUTH_AFRICAN_FIRST_NAMES[studentGender.toLowerCase()]
        );
        const studentBirthDate = generateStudentBirthDate();
        const homeLanguage = getRandomElement(HOME_LANGUAGES);
        const bloodType = getRandomElement(BLOOD_TYPES);

        // Select appropriate grade and class based on age
        const studentAge = new Date().getFullYear() - studentBirthDate.getFullYear();
        let assignedGrade;
        if (studentAge <= 7) {
          assignedGrade = grades.find(g => g.level === 1) || grades[0];
        } else if (studentAge <= 8) {
          assignedGrade = grades.find(g => g.level === 2) || grades[1];
        } else if (studentAge <= 9) {
          assignedGrade = grades.find(g => g.level === 3) || grades[2];
        } else if (studentAge <= 10) {
          assignedGrade = grades.find(g => g.level === 4) || grades[3];
        } else if (studentAge <= 11) {
          assignedGrade = grades.find(g => g.level === 5) || grades[4];
        } else if (studentAge <= 12) {
          assignedGrade = grades.find(g => g.level === 6) || grades[5];
        } else if (studentAge <= 13) {
          assignedGrade = grades.find(g => g.level === 7) || grades[6];
        } else if (studentAge <= 14) {
          assignedGrade = grades.find(g => g.level === 8) || grades[7];
        } else if (studentAge <= 15) {
          assignedGrade = grades.find(g => g.level === 9) || grades[8];
        } else if (studentAge <= 16) {
          assignedGrade = grades.find(g => g.level === 10) || grades[9];
        } else if (studentAge <= 17) {
          assignedGrade = grades.find(g => g.level === 11) || grades[10];
        } else {
          assignedGrade = grades.find(g => g.level === 12) || grades[11];
        }

        const assignedClass = classes.find(c => c.gradeId === assignedGrade.id) || classes[0];

        // Generate allergies and medical info
        const hasAllergies = Math.random() > 0.7;
        const allergies = hasAllergies
          ? getRandomElements(ALLERGIES, Math.floor(Math.random() * 3) + 1).join(', ')
          : null;
        const hasMedicalCondition = Math.random() > 0.9;
        const medicalInfo = hasMedicalCondition
          ? getRandomElement(MEDICAL_CONDITIONS.filter(c => c !== 'None'))
          : null;

        // Generate extracurriculars
        const hasExtracurriculars = Math.random() > 0.4;
        const extracurriculars = hasExtracurriculars
          ? getRandomElements(EXTRACURRICULARS, Math.floor(Math.random() * 3) + 1).join(', ')
          : null;

        // Create unique email and username
        const emailSuffix = `${Date.now()}${i}`;
        const studentEmail = `${studentFirstName.toLowerCase()}.${parent.surname
          .toLowerCase()
          .replace(/\\s+/g, '')}${emailSuffix}@student.lynxhigh.edu.za`;
        const username = `${studentFirstName.toLowerCase()}${parent.surname
          .toLowerCase()
          .replace(/\\s+/g, '')}${emailSuffix}`;

        // Create user account
        const studentUser = await prisma.user.create({
          data: {
            email: studentEmail,
            password: studentPassword,
            firstName: studentFirstName,
            lastName: parent.surname, // Same surname as parent
            dateOfBirth: studentBirthDate,
            gender: studentGender.toLowerCase(),
            phone: generatePhoneNumber(),
            addressLine1: parent.address.split(',')[0] || parent.address,
            city: parent.address.split(',')[1]?.trim() || 'Johannesburg',
            province: parent.address.split(',')[2]?.trim() || 'Gauteng',
            country: 'South Africa',
            role: 'STUDENT',
            schoolId: school.id,
          },
        });

        // Create student record with all fields filled
        const student = await prisma.student.create({
          data: {
            id: studentUser.id,
            username: username,
            name: studentFirstName,
            surname: parent.surname, // Same surname as parent
            email: studentEmail,
            phone: studentUser.phone,
            address: parent.address, // Same address as parent
            bloodType: bloodType,
            sex: studentGender,
            gender: studentGender.toLowerCase(),
            homeLanguage: homeLanguage,
            allergies: allergies,
            medicalInfo: medicalInfo,
            emergencyContactName: `${parent.name} ${parent.surname}`,
            emergencyContactPhone: parent.phone,
            guardianRelationship: parent.relationshipToStudent,
            specialNeeds: Math.random() > 0.95 ? 'Learning support required' : null,
            extracurriculars: extracurriculars,
            admissionYear:
              new Date().getFullYear() - (assignedGrade.level - Math.floor(Math.random() * 2)),
            status: 'active',
            birthday: studentBirthDate,
            parentId: parent.id,
            classId: assignedClass.id,
            gradeId: assignedGrade.id,
            schoolId: school.id,
            userId: studentUser.id,
            img: studentGender === 'MALE' ? '/student.png' : '/student.png',
          },
        });

        // Create medical record with comprehensive information
        await prisma.medicalRecord.create({
          data: {
            studentId: student.id,
            bloodType: bloodType,
            allergies: allergies ? allergies.split(', ') : [],
            medications:
              Math.random() > 0.85
                ? getRandomElements(
                    ['Ritalin', 'Insulin', 'Ventolin', 'Antihistamine', 'Paracetamol'],
                    Math.floor(Math.random() * 2) + 1
                  )
                : [],
            conditions: medicalInfo ? [medicalInfo] : [],
            emergencyContactName: `${parent.name} ${parent.surname}`,
            emergencyContactPhone: parent.phone,
            emergencyContactRelationship: parent.relationshipToStudent,
            doctorName: `Dr. ${getRandomElement(SOUTH_AFRICAN_FIRST_NAMES.male)} ${getRandomElement(
              ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Garcia', 'Miller', 'Davis']
            )}`,
            doctorPhone: generatePhoneNumber(),
            notes: Math.random() > 0.7 ? 'Regular check-ups required' : undefined,
          },
        });

        // Create initial attendance records (last 30 days)
        const lessons = await prisma.lesson.findMany({
          where: { classId: assignedClass.id },
          take: 5, // Get first 5 lessons for this class
        });

        if (lessons.length > 0) {
          const attendanceRecords = [];
          for (let day = 0; day < 30; day++) {
            const attendanceDate = new Date();
            attendanceDate.setDate(attendanceDate.getDate() - day);

            // Skip weekends
            if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;

            // Create attendance for each lesson on this day
            const dailyLessons = lessons.slice(0, Math.min(3, lessons.length)); // Max 3 lessons per day
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
          }
        }

        // Create some results/grades for the student
        const subjects = await prisma.subject.findMany({ take: 6 }); // Get first 6 subjects
        const resultRecords = [];

        for (const subject of subjects) {
          // Create 2-3 assessment results
          const assessmentCount = Math.floor(Math.random() * 2) + 2;
          for (let a = 0; a < assessmentCount; a++) {
            const score = Math.floor(Math.random() * 40) + 50; // 50-90% range
            resultRecords.push({
              score: score,
              studentId: student.id,
              subjectId: subject.id,
              examId: null, // We'll create a simple assessment
              type: ['Test', 'Assignment', 'Project'][Math.floor(Math.random() * 3)],
            });
          }
        }

        if (resultRecords.length > 0) {
          await prisma.result.createMany({
            data: resultRecords,
          });
        }

        studentsCreated++;
        console.log(
          `✅ Created student: ${studentFirstName} ${parent.surname} (Grade ${assignedGrade.level}, Age: ${studentAge})`
        );
      }
    }

    // Final verification
    const finalStats = await getUpdatedStats();

    console.log('\\n📈 Final Results:');
    console.log(`👧👦 Students created: ${studentsCreated}`);
    console.log(`👨‍👩 Total parents: ${finalStats.totalParents}`);
    console.log(`👧👦 Total students: ${finalStats.totalStudents}`);
    console.log(`🔗 Students with parents: ${finalStats.studentsWithParents}`);
    console.log(`📊 Average students per parent: ${finalStats.avgStudentsPerParent}`);
    console.log(`✅ Relational integrity: ${finalStats.relationalIntegrity}%`);

    console.log('\\n📊 Updated Parent-Student Distribution:');
    Object.entries(finalStats.distribution).forEach(([studentCount, parentCount]) => {
      console.log(`👨‍👩 Parents with ${studentCount} students: ${parentCount}`);
    });
  } catch (error) {
    console.error('❌ Error creating realistic students:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function getUpdatedStats() {
  const totalParents = await prisma.parent.count();
  const totalStudents = await prisma.student.count();
  const studentsWithParents = await prisma.student.count({
    where: { parentId: { not: null } },
  });

  const parentsWithStudents = await prisma.parent.findMany({
    include: { students: true },
  });

  const distribution = {};
  parentsWithStudents.forEach(parent => {
    const studentCount = parent.students.length;
    distribution[studentCount] = (distribution[studentCount] || 0) + 1;
  });

  return {
    totalParents,
    totalStudents,
    studentsWithParents,
    avgStudentsPerParent: (totalStudents / totalParents).toFixed(2),
    relationalIntegrity: ((studentsWithParents / totalStudents) * 100).toFixed(1),
    distribution,
  };
}

createRealisticStudentsForParents();
