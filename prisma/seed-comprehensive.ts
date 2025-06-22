import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// South African data
const SOUTH_AFRICAN_CITIES = [
  { city: 'Cape Town', province: 'Western Cape' },
  { city: 'Johannesburg', province: 'Gauteng' },
  { city: 'Durban', province: 'KwaZulu-Natal' },
  { city: 'Pretoria', province: 'Gauteng' },
  { city: 'Port Elizabeth', province: 'Eastern Cape' },
  { city: 'Bloemfontein', province: 'Free State' },
  { city: 'East London', province: 'Eastern Cape' },
  { city: 'Nelspruit', province: 'Mpumalanga' },
  { city: 'Kimberley', province: 'Northern Cape' },
  { city: 'Polokwane', province: 'Limpopo' },
];

const SOUTH_AFRICAN_SURNAMES = [
  'Van Der Merwe',
  'Smith',
  'Botha',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Wilson',
  'Martinez',
  'Anderson',
  'Taylor',
  'Thomas',
  'Hernandez',
  'Moore',
  'Martin',
  'Jackson',
  'Thompson',
  'White',
  'Lopez',
  'Lee',
  'Gonzalez',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
  'Perez',
  'Hall',
  'Mthembu',
  'Nkomo',
  'Dlamini',
  'Ndlovu',
  'Zulu',
  'Khumalo',
  'Mokoena',
  'Molefe',
  'Sithole',
  'Shabalala',
  'Mahlangu',
  'Mabaso',
  'Ngcobo',
  'Cele',
  'Mthethwa',
  'Naidoo',
  'Pillay',
  'Reddy',
  'Patel',
  'Singh',
  'Govender',
  'Maharaj',
  'Chetty',
  'Sharma',
];

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
  ],
};

const SUBJECTS_SA = [
  'Mathematics',
  'English Home Language',
  'Afrikaans First Additional Language',
  'Physical Sciences',
  'Life Sciences',
  'History',
  'Geography',
  'Accounting',
  'Business Studies',
  'Economics',
  'Life Orientation',
  'Information Technology',
  'Consumer Studies',
  'Tourism',
  'Agricultural Sciences',
  'Mathematical Literacy',
  'Technical Mathematics',
  'Technical Sciences',
  'Engineering Graphics and Design',
];

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
];

const OCCUPATIONS = [
  'Teacher',
  'Doctor',
  'Nurse',
  'Engineer',
  'Lawyer',
  'Accountant',
  'Police Officer',
  'Social Worker',
  'Manager',
  'Administrator',
  'Technician',
  'Sales Representative',
  'Shop Owner',
  'Taxi Driver',
  'Security Guard',
  'Chef',
  'Mechanic',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Farmer',
  'Domestic Worker',
  'Self-employed',
  'Retired',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateSAIdNumber(birthDate: Date, gender: 'MALE' | 'FEMALE'): string {
  const year = birthDate.getFullYear().toString().slice(-2);
  const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
  const day = birthDate.getDate().toString().padStart(2, '0');
  const genderDigit =
    gender === 'MALE' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 5);
  const citizenship = '0'; // SA citizen
  const race = '8'; // Not classified (modern SA doesn't use this)
  const checksum = Math.floor(Math.random() * 10);

  return `${year}${month}${day}${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}${genderDigit}${citizenship}${race}${checksum}`;
}

function generatePhoneNumber(): string {
  const prefixes = ['081', '082', '083', '084', '072', '073', '074', '076', '078', '079'];
  const prefix = getRandomElement(prefixes);
  const suffix = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0');
  return `${prefix}${suffix}`;
}

function generateAddress(): string {
  const streetNumbers = Math.floor(Math.random() * 999) + 1;
  const streetNames = [
    'Main Road',
    'Church Street',
    'Market Street',
    'Victoria Street',
    'Long Street',
    'Voortrekker Road',
    'Nelson Mandela Drive',
    'Kruger Street',
    'Smith Street',
    'Van Der Merwe Avenue',
    'Acacia Avenue',
    'Jacaranda Street',
    'Protea Road',
  ];
  return `${streetNumbers} ${getRandomElement(streetNames)}`;
}

async function main() {
  console.log('🌱 Starting comprehensive seeding with South African data...');

  try {
    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.financeEntry.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.result.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.exam.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.event.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.subjectToTeacher.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.parent.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();
    await prisma.class.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.grade.deleteMany();
    await prisma.school.deleteMany();

    // Create school
    const city = getRandomElement(SOUTH_AFRICAN_CITIES);
    const school = await prisma.school.create({
      data: {
        name: 'Lynx High School',
        address: generateAddress(),
        city: city.city,
        province: city.province,
        country: 'South Africa',
        principal: 'Dr. Sarah Mthembu',
        schoolType: 'public',
        registrationNumber: 'LHS2024001',
        motto: 'Striving for Excellence',
        website: 'https://lynxhigh.edu.za',
      },
    });
    console.log('✅ School created:', school.name);

    // Create grades (8-12 for South African high school)
    const grades = [];
    for (let level = 8; level <= 12; level++) {
      const grade = await prisma.grade.create({
        data: { level, schoolId: school.id },
      });
      grades.push(grade);
    }
    console.log('✅ Grades 8-12 created');

    // Create subjects
    const subjects = [];
    for (const subjectName of SUBJECTS_SA) {
      const subject = await prisma.subject.create({
        data: { name: subjectName },
      });
      subjects.push(subject);
    }
    console.log('✅ South African subjects created');

    // Create classes (2 classes per grade)
    const classes: any[] = [];
    for (const grade of grades) {
      for (let classNum = 1; classNum <= 2; classNum++) {
        const className = `${grade.level}${String.fromCharCode(64 + classNum)}`; // 8A, 8B, etc.
        const class_ = await prisma.class.create({
          data: {
            name: className,
            capacity: 35,
            roomNumber: `R${grade.level}${classNum}`,
            gradeId: grade.id,
            schoolId: school.id,
          },
        });
        classes.push(class_);
      }
    }
    console.log('✅ Classes created');

    // Create admin user with specific credentials
    const adminPassword = await bcrypt.hash('adminpass', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'male',
        phone: '+27 11 123 4567',
        addressLine1: '123 Education Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        country: 'South Africa',
        role: 'ADMIN',
        schoolId: school.id,
      },
    });

    const admin = await prisma.admin.create({
      data: {
        id: adminUser.id,
        username: 'admin',
      },
    });
    console.log('✅ Admin user created with email: admin@lynxacademy.co.za');

    // Create specific teacher user with provided credentials
    const teacherPassword = await bcrypt.hash('teacherpass', 10);
    const teacherUser = await prisma.user.create({
      data: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'female',
        phone: '+27 11 234 5678',
        addressLine1: '456 Teacher Avenue',
        city: 'Johannesburg',
        province: 'Gauteng',
        country: 'South Africa',
        role: 'TEACHER',
        schoolId: school.id,
      },
    });

    const primaryTeacher = await prisma.teacher.create({
      data: {
        id: teacherUser.id,
        username: 'teacher1',
        name: 'Sarah',
        surname: 'Johnson',
        email: 'teacher1@lynxacademy.co.za',
        phone: '+27 11 234 5678',
        address: '456 Teacher Avenue, Johannesburg, Gauteng',
        bloodType: 'O+',
        sex: 'FEMALE',
        gender: 'female',
        nationality: 'South African',
        idNumber: '8503150234087',
        qualifications: 'B.Ed Mathematics',
        yearsExperience: 8,
        employmentStatus: 'Permanent',
        nextOfKinName: 'Michael Johnson',
        nextOfKinPhone: '+27 82 345 6789',
        birthday: new Date('1985-03-15'),
        schoolId: school.id,
        img: '/teacher.png',
      },
    });
    console.log('✅ Primary teacher user created with email: teacher1@lynxacademy.co.za');

    // Create teachers with realistic SA data
    const teachers = [];
    const additionalTeacherPassword = await bcrypt.hash('teacher123', 10);

    for (let i = 0; i < 15; i++) {
      const gender = Math.random() > 0.6 ? 'FEMALE' : 'MALE'; // More female teachers in SA
      const firstName = getRandomElement(
        SOUTH_AFRICAN_FIRST_NAMES[gender.toLowerCase() as 'male' | 'female']
      );
      const surname = getRandomElement(SOUTH_AFRICAN_SURNAMES);
      const birthDate = new Date(
        1970 + Math.floor(Math.random() * 25),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      const city = getRandomElement(SOUTH_AFRICAN_CITIES);

      const teacherUser = await prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}.${surname.toLowerCase().replace(/\s+/g, '')}@lynxhigh.edu.za`,
          password: additionalTeacherPassword,
          firstName,
          lastName: surname,
          dateOfBirth: birthDate,
          gender: gender.toLowerCase(),
          phone: generatePhoneNumber(),
          addressLine1: generateAddress(),
          city: city.city,
          province: city.province,
          country: 'South Africa',
          role: 'TEACHER',
          schoolId: school.id,
        },
      });

      const teacher = await prisma.teacher.create({
        data: {
          id: teacherUser.id,
          username: `${firstName.toLowerCase()}${surname.toLowerCase().replace(/\s+/g, '')}`,
          name: firstName,
          surname,
          email: teacherUser.email,
          phone: teacherUser.phone!,
          address: `${teacherUser.addressLine1}, ${teacherUser.city}, ${teacherUser.province}`,
          bloodType: getRandomElement(BLOOD_TYPES),
          sex: gender as 'MALE' | 'FEMALE',
          gender: gender.toLowerCase(),
          nationality: 'South African',
          idNumber: generateSAIdNumber(birthDate, gender as 'MALE' | 'FEMALE'),
          qualifications: getRandomElement(['B.Ed', 'B.A + PGCE', 'B.Sc + PGCE', 'HDE', 'M.Ed']),
          yearsExperience: Math.floor(Math.random() * 20) + 1,
          employmentStatus: getRandomElement(['Permanent', 'Contract', 'Temporary']),
          nextOfKinName: `${getRandomElement(SOUTH_AFRICAN_FIRST_NAMES[gender === 'MALE' ? 'female' : 'male'])} ${getRandomElement(SOUTH_AFRICAN_SURNAMES)}`,
          nextOfKinPhone: generatePhoneNumber(),
          birthday: birthDate,
          schoolId: school.id,
          userId: teacherUser.id,
        },
      });

      // Assign subjects to teachers (2-3 subjects each)
      const teacherSubjects = getRandomElements(subjects, Math.floor(Math.random() * 2) + 2);
      for (const subject of teacherSubjects) {
        await prisma.subjectToTeacher.create({
          data: {
            teacherId: teacher.id,
            subjectId: subject.id,
          },
        });
      }

      teachers.push(teacher);
    }
    console.log('✅ Teachers with SA data created');

    // Assign class supervisors
    for (let i = 0; i < classes.length && i < teachers.length; i++) {
      await prisma.class.update({
        where: { id: classes[i].id },
        data: {
          supervisorId: teachers[i].id,
          classTeacher: `${teachers[i].name} ${teachers[i].surname}`,
        },
      });
    }

    // Create parents and students
    const parents = [];
    const students = [];
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    // Create specific parent user with provided credentials
    const specificParentPassword = await bcrypt.hash('parentpass', 10);
    const specificParentUser = await prisma.user.create({
      data: {
        email: 'parent1@lynxacademy.co.za',
        password: specificParentPassword,
        firstName: 'Michael',
        lastName: 'Smith',
        dateOfBirth: new Date('1978-05-20'),
        gender: 'male',
        phone: '+27 82 123 4567',
        addressLine1: '789 Parent Road',
        city: 'Johannesburg',
        province: 'Gauteng',
        country: 'South Africa',
        role: 'PARENT',
        schoolId: school.id,
      },
    });

    const specificParent = await prisma.parent.create({
      data: {
        id: specificParentUser.id,
        username: 'parent1',
        name: 'Michael',
        surname: 'Smith',
        email: 'parent1@lynxacademy.co.za',
        phone: '+27 82 123 4567',
        address: '789 Parent Road, Johannesburg, Gauteng',
        sex: 'MALE',
        occupation: 'Software Engineer',
        employer: 'Tech Solutions Ltd',
        relationshipToStudent: 'Father',
        schoolId: school.id,
        userId: specificParentUser.id,
      },
    });
    parents.push(specificParent);

    // Create specific student user with provided credentials
    const specificStudentPassword = await bcrypt.hash('studentpass', 10);
    const assignedGrade = grades[2]; // Grade 3
    const assignedClass = classes.find(c => c.gradeId === assignedGrade.id) || classes[0];

    const specificStudentUser = await prisma.user.create({
      data: {
        email: 'student1@lynxacademy.co.za',
        password: specificStudentPassword,
        firstName: 'Emily',
        lastName: 'Smith',
        dateOfBirth: new Date('2012-08-15'),
        gender: 'female',
        phone: '+27 82 234 5678',
        addressLine1: '789 Parent Road',
        city: 'Johannesburg',
        province: 'Gauteng',
        country: 'South Africa',
        role: 'STUDENT',
        schoolId: school.id,
      },
    });

    const specificStudent = await prisma.student.create({
      data: {
        id: specificStudentUser.id,
        username: 'student1',
        name: 'Emily',
        surname: 'Smith',
        email: 'student1@lynxacademy.co.za',
        phone: '+27 82 234 5678',
        address: '789 Parent Road, Johannesburg, Gauteng',
        bloodType: 'A+',
        sex: 'FEMALE',
        gender: 'female',
        gradeId: assignedGrade.id,
        classId: assignedClass.id,
        parentId: specificParent.id,
        birthday: new Date('2012-08-15'),
        allergies: 'None',
        medicalInfo: 'None',
        emergencyContactName: 'Michael Smith',
        emergencyContactPhone: '+27 82 123 4567',
        schoolId: school.id,
        userId: specificStudentUser.id,
        img: '/student.png',
      },
    });
    students.push(specificStudent);
    console.log('✅ Specific parent and student users created with lynxacademy.co.za emails');

    for (let i = 0; i < 150; i++) {
      // 150 students across all grades
      const studentGender = Math.random() > 0.5 ? 'FEMALE' : 'MALE';
      const studentFirstName = getRandomElement(
        SOUTH_AFRICAN_FIRST_NAMES[studentGender.toLowerCase() as 'male' | 'female']
      );
      const studentSurname = getRandomElement(SOUTH_AFRICAN_SURNAMES);
      const studentBirthDate = new Date(
        2006 + Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );
      const city = getRandomElement(SOUTH_AFRICAN_CITIES);
      const homeLanguage = getRandomElement(HOME_LANGUAGES);

      // Create parent
      const parentGender = Math.random() > 0.7 ? 'MALE' : 'FEMALE'; // More mothers as primary contacts
      const parentFirstName = getRandomElement(
        SOUTH_AFRICAN_FIRST_NAMES[parentGender.toLowerCase() as 'male' | 'female']
      );
      const parentBirthDate = new Date(
        1975 + Math.floor(Math.random() * 15),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      );

      const parentUser = await prisma.user.create({
        data: {
          email: `${parentFirstName.toLowerCase()}.${studentSurname.toLowerCase().replace(/\s+/g, '')}${i}@gmail.com`,
          password: parentPassword,
          firstName: parentFirstName,
          lastName: studentSurname,
          dateOfBirth: parentBirthDate,
          gender: parentGender.toLowerCase(),
          phone: generatePhoneNumber(),
          addressLine1: generateAddress(),
          city: city.city,
          province: city.province,
          country: 'South Africa',
          role: 'PARENT',
          schoolId: school.id,
        },
      });

      const parent = await prisma.parent.create({
        data: {
          id: parentUser.id,
          username: `${parentFirstName.toLowerCase()}${studentSurname.toLowerCase().replace(/\s+/g, '')}${i}`,
          name: parentFirstName,
          surname: studentSurname,
          email: parentUser.email,
          phone: parentUser.phone!,
          address: `${parentUser.addressLine1}, ${parentUser.city}, ${parentUser.province}`,
          sex: parentGender as 'MALE' | 'FEMALE',
          occupation: getRandomElement(OCCUPATIONS),
          employer:
            Math.random() > 0.3
              ? getRandomElement([
                  'Department of Education',
                  'City Council',
                  'Private Company',
                  'Self-employed',
                  'Hospital',
                  'School',
                ])
              : undefined,
          relationshipToStudent: parentGender === 'MALE' ? 'Father' : 'Mother',
          schoolId: school.id,
          userId: parentUser.id,
        },
      });
      parents.push(parent);

      // Create student
      const assignedGrade = getRandomElement(grades);
      const assignedClass = classes.find(c => c.gradeId === assignedGrade.id) || classes[0];

      const studentUser = await prisma.user.create({
        data: {
          email: `${studentFirstName.toLowerCase()}.${studentSurname.toLowerCase().replace(/\s+/g, '')}${i}@student.lynxhigh.edu.za`,
          password: studentPassword,
          firstName: studentFirstName,
          lastName: studentSurname,
          dateOfBirth: studentBirthDate,
          gender: studentGender.toLowerCase(),
          phone: generatePhoneNumber(),
          addressLine1: parentUser.addressLine1,
          city: parentUser.city,
          province: parentUser.province,
          country: 'South Africa',
          role: 'STUDENT',
          schoolId: school.id,
        },
      });

      const student = await prisma.student.create({
        data: {
          id: studentUser.id,
          username: `${studentFirstName.toLowerCase()}${studentSurname.toLowerCase().replace(/\s+/g, '')}${i}`,
          name: studentFirstName,
          surname: studentSurname,
          email: studentUser.email,
          phone: studentUser.phone!,
          address: `${studentUser.addressLine1}, ${studentUser.city}, ${studentUser.province}`,
          bloodType: getRandomElement(BLOOD_TYPES),
          sex: studentGender as 'MALE' | 'FEMALE',
          gender: studentGender.toLowerCase(),
          homeLanguage,
          allergies:
            Math.random() > 0.7
              ? getRandomElements(ALLERGIES, Math.floor(Math.random() * 3) + 1).join(', ')
              : undefined,
          medicalInfo: Math.random() > 0.9 ? getRandomElement(MEDICAL_CONDITIONS) : undefined,
          emergencyContactName: `${parent.name} ${parent.surname}`,
          emergencyContactPhone: parent.phone,
          guardianRelationship: parent.relationshipToStudent,
          specialNeeds: Math.random() > 0.95 ? 'Learning support required' : undefined,
          extracurriculars:
            Math.random() > 0.5
              ? getRandomElements(
                  [
                    'Soccer',
                    'Rugby',
                    'Netball',
                    'Cricket',
                    'Athletics',
                    'Chess',
                    'Debating',
                    'Drama',
                    'Choir',
                  ],
                  Math.floor(Math.random() * 3) + 1
                ).join(', ')
              : undefined,
          admissionYear: new Date().getFullYear() - (assignedGrade.level - 8),
          status: 'active',
          birthday: studentBirthDate,
          parentId: parent.id,
          classId: assignedClass.id,
          gradeId: assignedGrade.id,
          schoolId: school.id,
          userId: studentUser.id,
        },
      });

      // Create medical record
      if (Math.random() > 0.3) {
        // 70% of students have medical records
        await prisma.medicalRecord.create({
          data: {
            studentId: student.id,
            bloodType: student.bloodType,
            allergies: student.allergies ? student.allergies.split(', ') : [],
            medications:
              Math.random() > 0.8
                ? getRandomElements(
                    ['Ritalin', 'Insulin', 'Ventolin', 'Antihistamine'],
                    Math.floor(Math.random() * 2) + 1
                  )
                : [],
            conditions: student.medicalInfo ? [student.medicalInfo] : [],
            emergencyContactName: student.emergencyContactName!,
            emergencyContactPhone: student.emergencyContactPhone!,
            emergencyContactRelationship: student.guardianRelationship!,
            doctorName: `Dr. ${getRandomElement(SOUTH_AFRICAN_FIRST_NAMES.male)} ${getRandomElement(SOUTH_AFRICAN_SURNAMES)}`,
            doctorPhone: generatePhoneNumber(),
            notes: Math.random() > 0.7 ? 'Regular check-ups required' : undefined,
          },
        });
      }

      students.push(student);
    }
    console.log('✅ Parents and students with SA data created');

    // Create lessons (timetable)
    const lessons: any[] = [];
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = [
      { start: 8, end: 9 },
      { start: 9, end: 10 },
      { start: 10, end: 11 },
      { start: 11, end: 12 },
      { start: 13, end: 14 }, // After lunch
      { start: 14, end: 15 },
    ];

    for (const class_ of classes) {
      const grade = grades.find(g => g.id === class_.gradeId)!;
      const coreSubjects = subjects.filter(s =>
        [
          'Mathematics',
          'English Home Language',
          'Afrikaans First Additional Language',
          'Life Orientation',
        ].includes(s.name)
      );
      const electiveSubjects = subjects.filter(s => !coreSubjects.includes(s));
      const classSubjects = [...coreSubjects, ...getRandomElements(electiveSubjects, 4)];

      for (const day of days) {
        for (let i = 0; i < Math.min(timeSlots.length, classSubjects.length); i++) {
          const timeSlot = timeSlots[i];
          const subject = classSubjects[i % classSubjects.length];
          // Find teacher who teaches this subject
          const teacherSubjectRelation = await prisma.subjectToTeacher.findFirst({
            where: { subjectId: subject.id },
          });
          const teacher = teacherSubjectRelation
            ? teachers.find(t => t.id === teacherSubjectRelation.teacherId) || teachers[0]
            : teachers[0];

          const startTime = new Date();
          startTime.setHours(timeSlot.start, 0, 0, 0);
          const endTime = new Date();
          endTime.setHours(timeSlot.end, 0, 0, 0);

          const lesson = await prisma.lesson.create({
            data: {
              name: `${subject.name} - ${class_.name}`,
              day: day as any,
              startTime,
              endTime,
              subjectId: subject.id,
              classId: class_.id,
              teacherId: teacher.id,
            },
          });
          lessons.push(lesson);
        }
      }
    }
    console.log('✅ Timetable/lessons created');

    // Create assignments
    const assignments = [];
    for (let i = 0; i < 50; i++) {
      const lesson = getRandomElement(lessons);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

      const assignment = await prisma.assignment.create({
        data: {
          title: `${lesson.name} Assignment ${i + 1}`,
          startDate,
          dueDate,
          lessonId: lesson.id,
        },
      });
      assignments.push(assignment);
    }
    console.log('✅ Assignments created');

    // Create exams
    const exams = [];
    for (let i = 0; i < 25; i++) {
      const lesson = getRandomElement(lessons);
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 60));
      startTime.setHours(8 + Math.floor(Math.random() * 4), 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);

      const exam = await prisma.exam.create({
        data: {
          title: `${lesson.name} Exam`,
          startTime,
          endTime,
          lessonId: lesson.id,
        },
      });
      exams.push(exam);
    }
    console.log('✅ Exams created');

    // Create attendance records
    const attendanceRecords: any[] = [];
    for (const student of students) {
      const studentLessons = lessons.filter(l => {
        const lessonClass = classes.find(c => c.id === l.classId);
        return lessonClass?.id === student.classId;
      });

      for (const lesson of studentLessons.slice(0, 20)) {
        // Last 20 lessons for each student
        const attendance = await prisma.attendance.create({
          data: {
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
            present: Math.random() > 0.1, // 90% attendance rate
            studentId: student.id,
            lessonId: lesson.id,
          },
        });
        attendanceRecords.push(attendance);
      }
    }
    console.log('✅ Attendance records created');

    // Create results
    for (const student of students) {
      // Assignment results
      const studentAssignments = assignments.filter(a => {
        const lesson = lessons.find(l => l.id === a.lessonId);
        const lessonClass = classes.find(c => c.id === lesson?.classId);
        return lessonClass?.id === student.classId;
      });

      for (const assignment of studentAssignments.slice(0, 10)) {
        await prisma.result.create({
          data: {
            score: Math.floor(Math.random() * 51) + 50, // 50-100%
            assignmentId: assignment.id,
            studentId: student.id,
          },
        });
      }

      // Exam results
      const studentExams = exams.filter(e => {
        const lesson = lessons.find(l => l.id === e.lessonId);
        const lessonClass = classes.find(c => c.id === lesson?.classId);
        return lessonClass?.id === student.classId;
      });

      for (const exam of studentExams.slice(0, 5)) {
        await prisma.result.create({
          data: {
            score: Math.floor(Math.random() * 41) + 40, // 40-80%
            examId: exam.id,
            studentId: student.id,
          },
        });
      }
    }
    console.log('✅ Results created');

    // Create events
    const events = [];
    const eventTypes = [
      'Sports Day',
      'Science Fair',
      'Cultural Day',
      'Parent-Teacher Conference',
      'Grade Assembly',
      'Heritage Day Celebration',
      'Inter-house Competition',
      'Matric Dance',
      'Prize Giving Ceremony',
      'Open Day',
    ];

    for (let i = 0; i < 20; i++) {
      const eventClass = Math.random() > 0.3 ? getRandomElement(classes) : null;
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 90));
      startTime.setHours(Math.floor(Math.random() * 8) + 8, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + Math.floor(Math.random() * 4) + 1);

      const event = await prisma.event.create({
        data: {
          title: getRandomElement(eventTypes),
          description: `Important school event for all participants. Please make sure to attend on time.`,
          startTime,
          endTime,
          classId: eventClass?.id,
        },
      });
      events.push(event);
    }
    console.log('✅ Events created');

    // Create announcements
    for (let i = 0; i < 15; i++) {
      const announcementClass = Math.random() > 0.4 ? getRandomElement(classes) : null;
      await prisma.announcement.create({
        data: {
          title: `Important Notice ${i + 1}`,
          description: `This is an important announcement for ${announcementClass ? `Grade ${announcementClass.name}` : 'all students'}. Please take note of the information provided.`,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          classId: announcementClass?.id,
        },
      });
    }
    console.log('✅ Announcements created');

    // Create finance entries
    const financeCategories = {
      Income: ['School Fees', 'Government Grant', 'Fundraising', 'Donations', 'Facility Rental'],
      Expense: [
        'Salaries',
        'Utilities',
        'Maintenance',
        'Supplies',
        'Transport',
        'Equipment',
        'Insurance',
      ],
    };

    for (let i = 0; i < 100; i++) {
      const type = Math.random() > 0.6 ? 'Income' : 'Expense';
      const category = getRandomElement(financeCategories[type]);
      const amount =
        type === 'Income'
          ? Math.floor(Math.random() * 50000) + 10000 // R10,000 - R60,000
          : Math.floor(Math.random() * 30000) + 5000; // R5,000 - R35,000

      await prisma.financeEntry.create({
        data: {
          title: `${category} - ${new Date().toLocaleDateString()}`,
          amount,
          type: type as 'Income' | 'Expense',
          category,
          reference: `REF${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0')}`,
          notes: `${type} entry for ${category.toLowerCase()}`,
          linkedStudentId: Math.random() > 0.7 ? getRandomElement(students).id : undefined,
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        },
      });
    }
    console.log('✅ Finance entries created');

    console.log('🎉 Comprehensive South African school data seeding completed!');
    console.log(`
📊 Summary:
- 1 School (${school.name})
- 5 Grades (8-12)
- 10 Classes
- ${SUBJECTS_SA.length} Subjects
- 1 Admin
- ${teachers.length} Teachers
- ${parents.length} Parents
- ${students.length} Students
- ${lessons.length} Lessons/Timetable entries
- ${assignments.length} Assignments
- ${exams.length} Exams
- ${attendanceRecords.length} Attendance records
- ${events.length} School events
- 15 Announcements
- 100 Finance entries
    `);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
