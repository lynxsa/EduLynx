// prisma/seed.ts
import { Day, PrismaClient, UserRole, UserSex } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // Move these to the top of main()
  const students: any[] = [];
  const lessons: any[] = [];

  // 0) SCHOOL
  const school = await prisma.school.upsert({
    where: { name: 'LYNX Academy' },
    update: {},
    create: {
      name: 'LYNX Academy',
      address: '123 Sandown Road',
      city: 'Sandown, Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
    },
  });

  // Hash passwords for demo users
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
  };

  // 0.1) CREATE DEMO USERS WITH SPECIFIED CREDENTIALS
  console.log('🔐 Creating demo users...');

  // Admin User - Derah Manyelo
  const adminPassword = await hashPassword('adminpass');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lynxacademy.co.za' },
    update: {},
    create: {
      email: 'admin@lynxacademy.co.za',
      password: adminPassword,
      firstName: 'Derah',
      lastName: 'Manyelo',
      preferredName: 'Derah',
      role: UserRole.ADMIN,
      schoolId: school.id,
      phone: '+27 11 123 4567',
      addressLine1: '123 Admin Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      isActive: true,
    },
  });

  // Teacher User
  const teacherPassword = await hashPassword('teacherpass');
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher1@lynxacademy.co.za' },
    update: {},
    create: {
      email: 'teacher1@lynxacademy.co.za',
      password: teacherPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      preferredName: 'Ms. Johnson',
      role: UserRole.TEACHER,
      schoolId: school.id,
      phone: '+27 11 123 4568',
      addressLine1: '456 Teacher Avenue',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      isActive: true,
    },
  });

  // Parent User
  const parentPassword = await hashPassword('parentpass');
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent1@lynxacademy.co.za' },
    update: {},
    create: {
      email: 'parent1@lynxacademy.co.za',
      password: parentPassword,
      firstName: 'Michael',
      lastName: 'Smith',
      preferredName: 'Mike',
      role: UserRole.PARENT,
      schoolId: school.id,
      phone: '+27 11 123 4569',
      addressLine1: '789 Parent Road',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      isActive: true,
    },
  });

  // Student User
  const studentPassword = await hashPassword('studentpass');
  const studentUser = await prisma.user.upsert({
    where: { email: 'student1@lynxacademy.co.za' },
    update: {},
    create: {
      email: 'student1@lynxacademy.co.za',
      password: studentPassword,
      firstName: 'Emma',
      lastName: 'Smith',
      preferredName: 'Emma',
      role: UserRole.STUDENT,
      schoolId: school.id,
      phone: '+27 11 123 4570',
      addressLine1: '789 Parent Road',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'Female',
      isActive: true,
    },
  });

  console.log('✅ Demo users created successfully!');

  // 0.2) ADMIN USERS - Enhanced with realistic data (Admin model is basic, detailed info in User model)
  const adminUsers = [
    {
      email: 'derah.manyelo@lynxacademy.co.za',
      firstName: 'Derah',
      lastName: 'Manyelo',
      username: 'derah_principal',
    },
    {
      email: 'thabo.mokwena@lynxacademy.co.za',
      firstName: 'Thabo',
      lastName: 'Mokwena',
      username: 'thabo_deputy',
    },
    {
      email: 'nomsa.dube@lynxacademy.co.za',
      firstName: 'Nomsa',
      lastName: 'Dube',
      username: 'nomsa_admin',
    },
    {
      email: 'sipho.mahlangu@lynxacademy.co.za',
      firstName: 'Sipho',
      lastName: 'Mahlangu',
      username: 'sipho_it',
    },
    {
      email: 'lerato.motaung@lynxacademy.co.za',
      firstName: 'Lerato',
      lastName: 'Motaung',
      username: 'lerato_finance',
    },
  ];

  const createdAdminUsers = [];
  for (let i = 0; i < adminUsers.length; i++) {
    const adminData = adminUsers[i];
    const user = await prisma.user.upsert({
      where: { email: adminData.email },
      update: {},
      create: {
        email: adminData.email,
        password: 'adminpass',
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'ADMIN',
        schoolId: school.id,
      },
    });
    createdAdminUsers.push(user);

    await prisma.admin.upsert({
      where: { id: `a${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `a${String(i + 1).padStart(3, '0')}`,
        username: adminData.username,
      },
    });
  }

  // 0.2) DEMO TEACHER USERS
  const teacherUsers: any[] = [];
  for (let i = 1; i <= 2; i++) {
    const user = await prisma.user.upsert({
      where: { email: `teacher${i}@lynxacademy.co.za` },
      update: {},
      create: {
        email: `teacher${i}@lynxacademy.co.za`,
        password: 'teacherpass',
        firstName: `Teacher${i}`,
        lastName: 'Demo',
        role: 'TEACHER',
        schoolId: school.id,
      },
    });
    teacherUsers.push(user);
  }

  // 1) GRADES 8–12
  const grades = [];
  for (let lvl = 8; lvl <= 12; lvl++) {
    grades.push(
      await prisma.grade.upsert({
        where: { level: lvl },
        update: {},
        create: { level: lvl, schoolId: school.id },
      })
    );
  }

  // 3) CLASSES: A–E per grade → 25 total
  const classes = [];
  for (const grade of grades) {
    for (const suffix of ['A', 'B', 'C', 'D', 'E']) {
      classes.push(
        await prisma.class.upsert({
          where: { name: `${grade.level}${suffix}` },
          update: {},
          create: {
            name: `${grade.level}${suffix}`,
            capacity: 30,
            gradeId: grade.id,
            schoolId: school.id,
          },
        })
      );
    }
  }

  // 4) SUBJECTS (20)
  const subjectNames = [
    'Mathematics',
    'English',
    'Afrikaans',
    'Physical Sciences',
    'Life Sciences',
    'Accounting',
    'Business Studies',
    'Economics',
    'History',
    'Geography',
    'Life Orientation',
    'Consumer Studies',
    'Visual Arts',
    'Music',
    'Industrial Technology',
    'Agricultural Science',
    'Computer Applications Technology',
    'Information Technology',
    'Design',
    'Civil Technology',
  ];
  const subjects = [];
  for (const name of subjectNames) {
    subjects.push(
      await prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    );
  }

  // 5) TEACHERS & SUBJECT-TO-TEACHER (Enhanced with realistic SA data)
  const teacherFirstNames = [
    'Sipho',
    'Naledi',
    'Teboho',
    'Lerato',
    'Thabo',
    'Mpho',
    'Anele',
    'Nomsa',
    'Tumelo',
    'Karabo',
    'Sibusiso',
    'Gugu',
    'Tshepo',
    'Bongani',
    'Nokuthula',
    'Jabulani',
    'Thandeka',
    'Siyabonga',
    'Zanele',
    'Ayanda',
    'Mandla',
    'Nomfundo',
    'Thandi',
    'Sizwe',
    'Lindiwe',
    'Nkosana',
    'Precious',
    'Themba',
    'Busisiwe',
    'Vusi',
  ];
  const teacherLastNames = [
    'Dlamini',
    'Mokgobu',
    'Nkosi',
    'Mahlangu',
    'Mokoena',
    'Radebe',
    'Zulu',
    'Mbatha',
    'Mkhize',
    'Khoza',
    'Mthembu',
    'Ngcobo',
    'Mabaso',
    'Molefe',
    'Mofokeng',
    'Motsoeneng',
    'Mahlatsi',
    'Molekwa',
    'Mabena',
    'Mokwena',
    'Motaung',
    'Mthethwa',
    'Nkomo',
    'Sibeko',
    'Khumalo',
    'Ndlovu',
    'Mthimkhulu',
    'Mofokeng',
    'Nkabinde',
    'Skosana',
  ];
  const qualifications = [
    'B.Ed',
    'B.Sc + PGCE',
    'B.A + PGCE',
    'B.Com + PGCE',
    'M.Ed',
    'M.Sc',
    'M.A',
    'Honours B.Ed',
    'B.Tech Education',
    'National Diploma Education',
  ];
  const southAfricanCities = [
    'Johannesburg',
    'Pretoria',
    'Sandton',
    'Randburg',
    'Rosebank',
    'Parktown',
    'Midrand',
    'Centurion',
    'Germiston',
    'Boksburg',
    'Benoni',
    'Soweto',
    'Alexandra',
    'Diepsloot',
    'Roodepoort',
  ];

  const teachers = [];
  let tc = 1;
  for (const subj of subjects) {
    for (let i = 0; i < 2; i++, tc++) {
      const fn = rand(teacherFirstNames),
        ln = rand(teacherLastNames);
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${tc}@lynxacademy.co.za`;
      const gender = rand([UserSex.MALE, UserSex.FEMALE]);
      const city = rand(southAfricanCities);

      // Only link the first two teachers to the demo users
      let userId: string | undefined = undefined;
      if (tc <= teacherUsers.length) {
        userId = teacherUsers[tc - 1].id;
      }

      const t = await prisma.teacher.upsert({
        where: { id: `t${String(tc).padStart(3, '0')}` },
        update: {},
        create: {
          id: `t${String(tc).padStart(3, '0')}`,
          username: `teacher${tc}`,
          name: fn,
          surname: ln,
          email,
          phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          address: `${Math.floor(1 + Math.random() * 999)} ${rand(['Main', 'Church', 'School', 'Oak', 'Pine', 'Rose', 'Victoria', 'Nelson Mandela', 'OR Tambo', 'Chris Hani'])} ${rand(['Street', 'Road', 'Avenue', 'Drive', 'Lane'])}, ${city}, Gauteng`,
          bloodType: rand(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
          sex: gender,
          birthday: new Date(
            1975 + Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          classId: rand(classes).id,
          schoolId: school.id,
          gender: gender === UserSex.MALE ? 'Male' : 'Female',
          nationality: 'South African',
          idNumber: `${Math.floor(7000000000000 + Math.random() * 2999999999999)}`, // SA ID format
          qualifications: rand(qualifications),
          yearsExperience: Math.floor(2 + Math.random() * 25),
          employmentStatus: rand(['Permanent', 'Contract', 'Substitute', 'Part-time']),
          nextOfKinName: `${rand(teacherFirstNames)} ${rand(teacherLastNames)}`,
          nextOfKinPhone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          ...(userId ? { userId } : {}),
        },
      });
      teachers.push(t);
      await prisma.subjectToTeacher.upsert({
        where: {
          subjectId_teacherId: {
            subjectId: subj.id,
            teacherId: t.id,
          },
        },
        update: {},
        create: {
          subjectId: subj.id,
          teacherId: t.id,
        },
      });
    }
  }

  // Build subject → [teacherIds]
  const subjMap = new Map<number, string[]>();
  const rels = await prisma.subjectToTeacher.findMany();
  rels.forEach(r => {
    const arr = subjMap.get(r.subjectId) ?? [];
    arr.push(r.teacherId);
    subjMap.set(r.subjectId, arr);
  });

  // 6) PARENTS (Enhanced with realistic SA data)
  const parentUsers: any[] = [];
  const parentFirstNames = [
    'Mary',
    'John',
    'Thandi',
    'Sipho',
    'Nomsa',
    'Peter',
    'Lindiwe',
    'Kabelo',
    'Zanele',
    'Sibusiso',
    'Naledi',
    'Karabo',
    'Bongani',
    'Gugu',
    'Tshepo',
    'Jabulani',
    'Thandeka',
    'Siyabonga',
    'Ayanda',
    'Mandla',
    'Nomfundo',
    'Lucas',
    'Beauty',
    'David',
    'Grace',
    'Simon',
    'Faith',
    'Michael',
    'Joy',
    'Patrick',
  ];
  const parentLastNames = [
    'Nkosi',
    'Mokoena',
    'Dlamini',
    'Mahlangu',
    'Mabena',
    'Molefe',
    'Mofokeng',
    'Motsoeneng',
    'Mahlatsi',
    'Molekwa',
    'Mabaso',
    'Ngcobo',
    'Mthembu',
    'Khoza',
    'Mbatha',
    'Zulu',
    'Radebe',
    'Mkhize',
    'Mokwena',
    'Motaung',
    'Mthethwa',
    'Nkomo',
    'Sibeko',
    'Khumalo',
    'Ndlovu',
    'Mthimkhulu',
    'Nkabinde',
    'Skosana',
    'Sithole',
    'Maseko',
  ];
  const occupations = [
    'Engineer',
    'Teacher',
    'Nurse',
    'Doctor',
    'Lawyer',
    'Accountant',
    'Manager',
    'Administrator',
    'Consultant',
    'Technician',
    'Sales Representative',
    'Business Owner',
    'Social Worker',
    'Pharmacist',
    'IT Specialist',
    'Marketing Manager',
    'Project Manager',
    'Human Resources',
    'Financial Advisor',
    'Government Official',
  ];
  const employers = [
    'Eskom',
    'Sasol',
    'Standard Bank',
    'FNB',
    'Nedbank',
    'MTN',
    'Vodacom',
    'Cell C',
    'Discovery',
    'Old Mutual',
    'Sanlam',
    'Anglo American',
    'BHP Billiton',
    'Department of Education',
    'Department of Health',
    'City of Johannesburg',
    'Gauteng Provincial Government',
    'University of the Witwatersrand',
    'University of Johannesburg',
    'CSIR',
  ];
  const relationships = [
    'Mother',
    'Father',
    'Guardian',
    'Stepmother',
    'Stepfather',
    'Grandmother',
    'Grandfather',
    'Aunt',
    'Uncle',
  ];

  const parents = [];
  for (let i = 1; i <= 40; i++) {
    const fn = rand(parentFirstNames),
      ln = rand(parentLastNames);
    const gender = rand([UserSex.MALE, UserSex.FEMALE]);
    const city = rand(southAfricanCities);

    const user = await prisma.user.upsert({
      where: { email: `parent${i}@lynxacademy.co.za` },
      update: {},
      create: {
        email: `parent${i}@lynxacademy.co.za`,
        password: 'parentpass',
        firstName: fn,
        lastName: ln,
        role: 'PARENT',
        schoolId: school.id,
      },
    });
    parentUsers.push(user);

    parents.push(
      await prisma.parent.upsert({
        where: { id: `p${String(i).padStart(3, '0')}` },
        update: {},
        create: {
          id: `p${String(i).padStart(3, '0')}`,
          username: `parent${i}`,
          name: fn,
          surname: ln,
          email: `parent${i}@lynxacademy.co.za`,
          phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          address: `${Math.floor(1 + Math.random() * 999)} ${rand(['Main', 'Church', 'School', 'Oak', 'Pine', 'Rose', 'Victoria', 'Nelson Mandela', 'OR Tambo', 'Chris Hani'])} ${rand(['Street', 'Road', 'Avenue', 'Drive', 'Lane'])}, ${city}, Gauteng`,
          sex: gender,
          occupation: rand(occupations),
          employer: rand(employers),
          relationshipToStudent: rand(relationships),
          schoolId: school.id,
          userId: user.id,
        },
      })
    );
  }

  // 7) STUDENTS (200+)
  const studentFirstNames = [
    'Lebo',
    'Sizwe',
    'Naledi',
    'Thabo',
    'Ayanda',
    'Kagiso',
    'Lerato',
    'Sipho',
    'Zanele',
    'Karabo',
    'Tshepo',
    'Bongani',
    'Gugu',
    'Jabulani',
    'Thandeka',
    'Siyabonga',
    'Nomsa',
    'Mpho',
    'Anele',
    'Tumelo',
  ];
  const studentLastNames = parentLastNames;
  for (let i = 1; i <= 200; i++) {
    const fn = rand(studentFirstNames),
      ln = rand(studentLastNames);
    const gender = rand(['Male', 'Female']);
    const user = await prisma.user.upsert({
      where: { email: `student${i}@lynxacademy.co.za` },
      update: {},
      create: {
        email: `student${i}@lynxacademy.co.za`,
        password: 'studentpass',
        firstName: fn,
        lastName: ln,
        role: 'STUDENT',
        schoolId: school.id,
      },
    });
    const parent = rand(parents);
    const cls = rand(classes);
    students.push(
      await prisma.student.upsert({
        where: { username: `student${i}` },
        update: {},
        create: {
          id: `s${String(i).padStart(4, '0')}`,
          username: `student${i}`,
          name: fn,
          surname: ln,
          email: `student${i}@lynxacademy.co.za`,
          phone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
          address: '123 Sandown Road, Sandown, Johannesburg',
          bloodType: rand(['A+', 'B+', 'O+', 'AB+']),
          sex: gender === 'Male' ? UserSex.MALE : UserSex.FEMALE,
          birthday: new Date(
            2007 + Math.floor(Math.random() * 5),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          parentId: parent.id,
          classId: cls.id,
          gradeId: cls.gradeId,
          schoolId: school.id,
          userId: user.id,
          gender,
          homeLanguage: rand(['English', 'Zulu', 'Afrikaans', 'Sotho', 'Xhosa']),
          allergies: rand(['None', 'Peanuts', 'Penicillin', 'Pollen', 'Shellfish']),
          medicalInfo: rand(['None', 'Asthma', 'Diabetic', 'Epilepsy']),
          emergencyContactName: parent.name,
          emergencyContactPhone: parent.phone,
          guardianRelationship: rand(['Mother', 'Father', 'Aunt', 'Uncle', 'Grandparent']),
          specialNeeds: rand(['None', 'Dyslexia', 'ADHD', 'Visual Impairment']),
          extracurriculars: rand([
            'Soccer',
            'Chess',
            'Choir',
            'Debate',
            'Science Club',
            'Netball',
            'Rugby',
            'Drama',
          ]),
          admissionYear: 2020 + Math.floor(Math.random() * 5),
          status: rand(['ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED']),
          profileImage: '/avatar.png',
        },
      })
    );
  }
  console.log('200 students seeded.');

  // Medical Records for Students
  for (const student of students) {
    await prisma.medicalRecord.upsert({
      where: { studentId: student.id },
      update: {},
      create: {
        studentId: student.id,
        bloodType: student.bloodType || 'O+',
        allergies: [student.allergies || 'None'],
        conditions: [student.medicalInfo || 'None'],
        medications: rand([[], ['Asthma Inhaler'], ['Insulin'], ['Antihistamine']]),
        notes: `Medical record for ${student.name} ${student.surname}`,
        doctorName: rand(['Dr. Mthembu', 'Dr. Nkosi', 'Dr. Radebe']),
        doctorPhone: `+27${Math.floor(600000000 + Math.random() * 100000000)}`,
        emergencyContactName: student.emergencyContactName,
        emergencyContactPhone: student.emergencyContactPhone,
        emergencyContactRelationship: student.guardianRelationship,
      },
    });
  }
  console.log('Medical records seeded.');

  // 13) FINANCE ENTRIES (100+ realistic entries)
  const financeTitles = [
    'Tuition',
    'Book Purchases',
    'Sports Equipment',
    'Sponsorship',
    'Facility Maintenance',
    'Uniforms',
    'Transport',
    'Catering',
    'Donations',
    'Events',
  ];
  for (let i = 1; i <= 100; i++) {
    await prisma.financeEntry.create({
      data: {
        title: rand(financeTitles) + (i % 10 === 0 ? ' - Special' : ''),
        amount: Math.floor(1000 + Math.random() * 10000),
        type: rand(['Income', 'Expense']),
        category: rand([
          'School Fees',
          'Books',
          'Sports',
          'Sponsorship',
          'Maintenance',
          'Uniforms',
          'Transport',
          'Catering',
          'Donations',
          'Events',
        ]),
        reference: `REF${1000 + i}`,
        notes: '',
        date: new Date(
          2024 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      },
    });
  }

  // 8) LESSONS (25×20=500)
  for (const cls of classes) {
    for (const subj of subjects) {
      const tIds = subjMap.get(subj.id)!;
      lessons.push(
        await prisma.lesson.create({
          data: {
            name: `${subj.name} Lesson`,
            day: rand(Object.values(Day)),
            startTime: new Date(2025, 5, 1, 8, 0),
            endTime: new Date(2025, 5, 1, 9, 0),
            subjectId: subj.id,
            classId: cls.id,
            teacherId: rand(tIds),
          },
        })
      );
    }
  }

  // 9) EXAMS & ASSIGNMENTS (500 each) + RESULTS (625×2 per lesson = 1250)
  for (const lesson of lessons) {
    const exam = await prisma.exam.create({
      data: {
        title: `${lesson.name} Exam`,
        startTime: new Date(2025, 5, 15, 9, 0),
        endTime: new Date(2025, 5, 15, 11, 0),
        lessonId: lesson.id,
      },
    });
    const assignment = await prisma.assignment.create({
      data: {
        title: `${lesson.name} Assignment`,
        startDate: new Date(2025, 5, 2),
        dueDate: new Date(2025, 5, 9),
        lessonId: lesson.id,
      },
    });
    const clsStus = students.filter(s => s.classId === lesson.classId);
    for (const stu of clsStus) {
      await prisma.result.create({
        data: {
          examId: exam.id,
          assignmentId: assignment.id,
          studentId: stu.id,
          score: Math.floor(50 + Math.random() * 50),
        },
      });
    }
  }

  // 10) ATTENDANCE: one per student per lesson
  for (const lesson of lessons) {
    const clsStus = students.filter(s => s.classId === lesson.classId);
    for (const stu of clsStus) {
      await prisma.attendance.create({
        data: {
          lessonId: lesson.id,
          studentId: stu.id,
          present: Math.random() > 0.1,
        },
      });
    }
  }

  // 11) ANNOUNCEMENTS & EVENTS (2 each per class = 50)
  for (const cls of classes) {
    for (let i = 1; i <= 2; i++) {
      await prisma.announcement.create({
        data: {
          title: `Notice ${i} for ${cls.name}`,
          description: `This is announcement ${i} for class ${cls.name}.`,
          classId: cls.id,
        },
      });
      await prisma.event.create({
        data: {
          title: `Event ${i} for ${cls.name}`,
          description: `Details of event ${i} for class ${cls.name}.`,
          startTime: new Date(2025, 5, 20 + i, 10, 0),
          endTime: new Date(2025, 5, 20 + i, 12, 0),
          classId: cls.id,
        },
      });
    }
  }

  // 12) QUIZZES, QUESTIONS, OPTIONS, ATTEMPTS, ANSWERS (demo for first 5 lessons)
  for (const lesson of lessons.slice(0, 5)) {
    const quiz = await prisma.quiz.create({
      data: {
        title: `${lesson.name} Quiz`,
        lessonId: lesson.id,
        startDate: new Date(2025, 5, 10),
        endDate: new Date(2025, 5, 11),
      },
    });
    // Add 3 questions per quiz
    for (let qn = 1; qn <= 3; qn++) {
      const qType = qn === 1 ? 'MULTIPLE_CHOICE' : qn === 2 ? 'TRUE_FALSE' : 'SHORT_ANSWER';
      const question = await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: `Question ${qn} for ${quiz.title}`,
          type: qType,
          answer:
            qType === 'MULTIPLE_CHOICE' ? 'A' : qType === 'TRUE_FALSE' ? 'True' : 'Sample answer',
        },
      });
      if (qType === 'MULTIPLE_CHOICE') {
        await prisma.option.createMany({
          data: [
            { questionId: question.id, text: 'A' },
            { questionId: question.id, text: 'B' },
            { questionId: question.id, text: 'C' },
            { questionId: question.id, text: 'D' },
          ],
        });
      }
      if (qType === 'TRUE_FALSE') {
        await prisma.option.createMany({
          data: [
            { questionId: question.id, text: 'True' },
            { questionId: question.id, text: 'False' },
          ],
        });
      }
    }
    // Add quiz attempts for first 3 students in the class
    const clsStus = students.filter(s => s.classId === lesson.classId).slice(0, 3);
    for (const stu of clsStus) {
      const attempt = await prisma.quizAttempt.create({
        data: {
          quizId: quiz.id,
          studentId: stu.id,
          startedAt: new Date(2025, 5, 10, 9, 0),
          submittedAt: new Date(2025, 5, 10, 9, 30),
          score: Math.floor(2 + Math.random() * 2),
          feedback: 'Good job!',
        },
      });
      // Add answers for each question
      const questions = await prisma.question.findMany({ where: { quizId: quiz.id } });
      for (const q of questions) {
        await prisma.answer.create({
          data: {
            attemptId: attempt.id,
            questionId: q.id,
            response:
              q.type === 'MULTIPLE_CHOICE'
                ? 'A'
                : q.type === 'TRUE_FALSE'
                  ? 'True'
                  : 'Sample answer',
            isCorrect: true,
          },
        });
      }
    }
  }

  // 13) ASSIGNMENT SUBMISSIONS (demo for first 5 assignments)
  const assignments = await prisma.assignment.findMany({ take: 5 });
  const lessonsMap = new Map<number, any>();
  const lessonIds = assignments.map(a => a.lessonId);
  const lessonsForAssignments = await prisma.lesson.findMany({ where: { id: { in: lessonIds } } });
  lessonsForAssignments.forEach(lesson => lessonsMap.set(lesson.id, lesson));
  for (const assignment of assignments) {
    const lesson = lessonsMap.get(assignment.lessonId);
    if (!lesson) continue;
    const clsStus = students.filter(s => s.classId === lesson.classId).slice(0, 3);
    for (const stu of clsStus) {
      await prisma.submission.create({
        data: {
          assignmentId: assignment.id,
          studentId: stu.id,
          fileUrl: 'https://example.com/demo.pdf',
          text: 'Demo submission text',
          submittedAt: new Date(2025, 5, 5),
          grade: Math.floor(60 + Math.random() * 40),
          feedback: 'Well done!',
        },
      });
    }
  }

  console.log('✅ Seed complete — All tables populated!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
