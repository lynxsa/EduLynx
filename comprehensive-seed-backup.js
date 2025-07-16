const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function comprehensiveSeed() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // Clear existing data first (in reverse order of dependencies)
    console.log('🧹 Cleaning existing data...');
    await prisma.$transaction([
      // Delete dependent records first
      prisma.attendance.deleteMany(),
      prisma.result.deleteMany(),
      prisma.submission.deleteMany(),
      // Delete quiz-related data (deepest dependencies first)
      prisma.answer.deleteMany(),
      prisma.option.deleteMany(),
      prisma.quizAttempt.deleteMany(),
      prisma.question.deleteMany(),
      prisma.quiz.deleteMany(),
      // Delete many-to-many relations
      prisma.subjectToTeacher.deleteMany(),
      // Delete main entities
      prisma.assignment.deleteMany(),
      prisma.exam.deleteMany(),
      prisma.lesson.deleteMany(),
      prisma.announcement.deleteMany(),
      prisma.event.deleteMany(),
      // Delete medical records
      prisma.medicalRecord.deleteMany(),
      // Delete users and their related data
      prisma.student.deleteMany(),
      prisma.teacher.deleteMany(),
      prisma.parent.deleteMany(),
      // Delete structural data
      prisma.class.deleteMany(),
      prisma.subject.deleteMany(),
      prisma.grade.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // 1. Create Grades
    console.log('📚 Creating grades...');
    const grades = await Promise.all([
      prisma.grade.create({ data: { level: 8 } }),
      prisma.grade.create({ data: { level: 9 } }),
      prisma.grade.create({ data: { level: 10 } }),
      prisma.grade.create({ data: { level: 11 } }),
      prisma.grade.create({ data: { level: 12 } }),
    ]);

    // 2. Create Subjects
    console.log('📖 Creating subjects...');
    const subjects = await Promise.all([
      prisma.subject.create({ data: { name: 'Mathematics' } }),
      prisma.subject.create({ data: { name: 'English' } }),
      prisma.subject.create({ data: { name: 'Physical Science' } }),
      prisma.subject.create({ data: { name: 'Life Sciences' } }),
      prisma.subject.create({ data: { name: 'History' } }),
      prisma.subject.create({ data: { name: 'Geography' } }),
      prisma.subject.create({ data: { name: 'Business Studies' } }),
      prisma.subject.create({ data: { name: 'Economics' } }),
      prisma.subject.create({ data: { name: 'Computer Applications Technology' } }),
      prisma.subject.create({ data: { name: 'Life Orientation' } }),
    ]);

    // 3. Create Classes (5 classes per grade for better distribution)
    console.log('🏫 Creating classes...');
    const classes = [];
    for (const grade of grades) {
      const classesForGrade = await Promise.all([
        prisma.class.create({
          data: {
            name: `${grade.level}A`,
            capacity: 32,
            roomNumber: `${grade.level}01`,
            gradeId: grade.id,
          },
        }),
        prisma.class.create({
          data: {
            name: `${grade.level}B`,
            capacity: 32,
            roomNumber: `${grade.level}02`,
            gradeId: grade.id,
          },
        }),
        prisma.class.create({
          data: {
            name: `${grade.level}C`,
            capacity: 32,
            roomNumber: `${grade.level}03`,
            gradeId: grade.id,
          },
        }),
        prisma.class.create({
          data: {
            name: `${grade.level}D`,
            capacity: 32,
            roomNumber: `${grade.level}04`,
            gradeId: grade.id,
          },
        }),
        prisma.class.create({
          data: {
            name: `${grade.level}E`,
            capacity: 32,
            roomNumber: `${grade.level}05`,
            gradeId: grade.id,
          },
        }),
      ]);
      classes.push(...classesForGrade);
    }

    // 4. Create Users and Teachers (40+ teachers for realistic school structure)
    console.log('👩‍🏫 Creating teachers...');
    const teacherData = [
      // Mathematics Department (8 teachers)
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Thabo', lastName: 'Mokwena', email: 'thabo.mokwena@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Lisa', lastName: 'Williams', email: 'lisa.williams@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'David', lastName: 'Brown', email: 'david.brown@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Nomsa', lastName: 'Dlamini', email: 'nomsa.dlamini@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Peter', lastName: 'Van Der Merwe', email: 'peter.vandermerwe@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      { firstName: 'Fatima', lastName: 'Hassan', email: 'fatima.hassan@edulynx.com', subjects: ['Mathematics'], department: 'Mathematics' },
      
      // English Department (6 teachers)
      { firstName: 'Emma', lastName: 'Thompson', email: 'emma.thompson@edulynx.com', subjects: ['English'], department: 'English' },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@edulynx.com', subjects: ['English'], department: 'English' },
      { firstName: 'Sipho', lastName: 'Mthembu', email: 'sipho.mthembu@edulynx.com', subjects: ['English'], department: 'English' },
      { firstName: 'Rachel', lastName: 'Adams', email: 'rachel.adams@edulynx.com', subjects: ['English'], department: 'English' },
      { firstName: 'Trevor', lastName: 'Ncube', email: 'trevor.ncube@edulynx.com', subjects: ['English'], department: 'English' },
      { firstName: 'Michelle', lastName: 'Jones', email: 'michelle.jones@edulynx.com', subjects: ['English'], department: 'English' },
      
      // Science Department (12 teachers)
      { firstName: 'Robert', lastName: 'Martinez', email: 'robert.martinez@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Zanele', lastName: 'Khumalo', email: 'zanele.khumalo@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Andrew', lastName: 'Smith', email: 'andrew.smith@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Mandla', lastName: 'Zulu', email: 'mandla.zulu@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      { firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.taylor@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      { firstName: 'Kwame', lastName: 'Asante', email: 'kwame.asante@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      { firstName: 'Dr. Maria', lastName: 'Rodriguez', email: 'maria.rodriguez@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      { firstName: 'Benjamin', lastName: 'Clark', email: 'benjamin.clark@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Thandiwe', lastName: 'Mabena', email: 'thandiwe.mabena@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      { firstName: 'Carlos', lastName: 'Silva', email: 'carlos.silva@edulynx.com', subjects: ['Physical Science'], department: 'Science' },
      { firstName: 'Aisha', lastName: 'Mohammed', email: 'aisha.mohammed@edulynx.com', subjects: ['Life Sciences'], department: 'Science' },
      
      // Social Sciences Department (8 teachers)
      { firstName: 'Dr. William', lastName: 'Parker', email: 'william.parker@edulynx.com', subjects: ['History'], department: 'Social Sciences' },
      { firstName: 'Lerato', lastName: 'Motaung', email: 'lerato.motaung@edulynx.com', subjects: ['History'], department: 'Social Sciences' },
      { firstName: 'Oliver', lastName: 'Green', email: 'oliver.green@edulynx.com', subjects: ['Geography'], department: 'Social Sciences' },
      { firstName: 'Nontando', lastName: 'Ndaba', email: 'nontando.ndaba@edulynx.com', subjects: ['Geography'], department: 'Social Sciences' },
      { firstName: 'Christopher', lastName: 'Lee', email: 'christopher.lee@edulynx.com', subjects: ['History'], department: 'Social Sciences' },
      { firstName: 'Busisiwe', lastName: 'Masuku', email: 'busisiwe.masuku@edulynx.com', subjects: ['Geography'], department: 'Social Sciences' },
      { firstName: 'Marcus', lastName: 'Thompson', email: 'marcus.thompson@edulynx.com', subjects: ['History'], department: 'Social Sciences' },
      { firstName: 'Naledi', lastName: 'Tladi', email: 'naledi.tladi@edulynx.com', subjects: ['Geography'], department: 'Social Sciences' },
      
      // Business Studies Department (6 teachers)
      { firstName: 'Karen', lastName: 'White', email: 'karen.white@edulynx.com', subjects: ['Business Studies'], department: 'Business' },
      { firstName: 'Sello', lastName: 'Mohapi', email: 'sello.mohapi@edulynx.com', subjects: ['Business Studies'], department: 'Business' },
      { firstName: 'Dr. Rebecca', lastName: 'Davis', email: 'rebecca.davis@edulynx.com', subjects: ['Economics'], department: 'Business' },
      { firstName: 'Tshepo', lastName: 'Mokoena', email: 'tshepo.mokoena@edulynx.com', subjects: ['Economics'], department: 'Business' },
      { firstName: 'Amanda', lastName: 'Miller', email: 'amanda.miller@edulynx.com', subjects: ['Business Studies'], department: 'Business' },
      { firstName: 'Nkosana', lastName: 'Dube', email: 'nkosana.dube@edulynx.com', subjects: ['Economics'], department: 'Business' },
      
      // Technology Department (4 teachers)
      { firstName: 'Daniel', lastName: 'Moore', email: 'daniel.moore@edulynx.com', subjects: ['Computer Applications Technology'], department: 'Technology' },
      { firstName: 'Lindiwe', lastName: 'Mahlangu', email: 'lindiwe.mahlangu@edulynx.com', subjects: ['Computer Applications Technology'], department: 'Technology' },
      { firstName: 'Alex', lastName: 'Johnson', email: 'alex.johnson@edulynx.com', subjects: ['Computer Applications Technology'], department: 'Technology' },
      { firstName: 'Precious', lastName: 'Sithole', email: 'precious.sithole@edulynx.com', subjects: ['Computer Applications Technology'], department: 'Technology' },
      
      // Life Orientation Department (4 teachers)
      { firstName: 'Grace', lastName: 'Anderson', email: 'grace.anderson@edulynx.com', subjects: ['Life Orientation'], department: 'Life Orientation' },
      { firstName: 'Bongani', lastName: 'Mthethwa', email: 'bongani.mthethwa@edulynx.com', subjects: ['Life Orientation'], department: 'Life Orientation' },
      { firstName: 'Helen', lastName: 'Roberts', email: 'helen.roberts@edulynx.com', subjects: ['Life Orientation'], department: 'Life Orientation' },
      { firstName: 'Sibongile', lastName: 'Nkomo', email: 'sibongile.nkomo@edulynx.com', subjects: ['Life Orientation'], department: 'Life Orientation' },
    ];

    const teachers = [];
    for (const teacher of teacherData) {
      const user = await prisma.user.create({
        data: {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          role: 'TEACHER',
          phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
          addressLine1: `${Math.floor(Math.random() * 999) + 1} Main Street`,
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
          country: 'South Africa',
          dateOfBirth: new Date(
            1980 + Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
        },
      });

      const teacherRecord = await prisma.teacher.create({
        data: {
          id: user.id,
          username: `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}`,
          name: teacher.firstName,
          surname: teacher.lastName,
          email: teacher.email,
          phone: user.phone || '+27123456789',
          address: user.addressLine1 || '123 Main Street',
          bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
            Math.floor(Math.random() * 8)
          ],
          sex: user.gender === 'Male' ? 'MALE' : 'FEMALE',
          birthday: user.dateOfBirth,
          img: `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
          qualifications: ['Bachelor of Education', 'Honours in Subject Teaching', 'PGCE'][
            Math.floor(Math.random() * 3)
          ],
          yearsExperience: Math.floor(Math.random() * 15) + 5,
          subjects: {
            create: teacher.subjects.map(subjectName => ({
              subject: {
                connect: { name: subjectName },
              },
            })),
          },
        },
      });

      teachers.push(teacherRecord);
    }

    // 5. Create Parents and Students with Realistic Distribution
    console.log('👨‍👩‍👧‍👦 Creating parents and students with realistic class distribution...');

    // Enhanced student names pool for realistic distribution
    const studentNamesPool = [
      {
        firstName: 'Amahle',
        lastName: 'Mthembu',
        parent: { firstName: 'Sipho', lastName: 'Mthembu' },
      },
      {
        firstName: 'Lerato',
        lastName: 'Motaung',
        parent: { firstName: 'Tebogo', lastName: 'Motaung' },
      },
      {
        firstName: 'Kai',
        lastName: 'Johnson',
        parent: { firstName: 'Robert', lastName: 'Johnson' },
      },
      { firstName: 'Aisha', lastName: 'Patel', parent: { firstName: 'Ravi', lastName: 'Patel' } },
      { firstName: 'Connor', lastName: 'Smith', parent: { firstName: 'James', lastName: 'Smith' } },
      { firstName: 'Zara', lastName: 'Adams', parent: { firstName: 'Sarah', lastName: 'Adams' } },
      { firstName: 'Liam', lastName: 'Brown', parent: { firstName: 'Michael', lastName: 'Brown' } },
      {
        firstName: 'Nala',
        lastName: 'Khumalo',
        parent: { firstName: 'Bongani', lastName: 'Khumalo' },
      },
      {
        firstName: 'Emma',
        lastName: 'Davis',
        parent: { firstName: 'Jennifer', lastName: 'Davis' },
      },
      {
        firstName: 'Tyler',
        lastName: 'Wilson',
        parent: { firstName: 'Christopher', lastName: 'Wilson' },
      },
      { firstName: 'Zoe', lastName: 'Miller', parent: { firstName: 'Daniel', lastName: 'Miller' } },
      {
        firstName: 'Ethan',
        lastName: 'Garcia',
        parent: { firstName: 'Carlos', lastName: 'Garcia' },
      },
      {
        firstName: 'Mia',
        lastName: 'Rodriguez',
        parent: { firstName: 'Maria', lastName: 'Rodriguez' },
      },
      {
        firstName: 'Noah',
        lastName: 'Anderson',
        parent: { firstName: 'David', lastName: 'Anderson' },
      },
      { firstName: 'Ava', lastName: 'Taylor', parent: { firstName: 'Lisa', lastName: 'Taylor' } },
      { firstName: 'Mason', lastName: 'Thomas', parent: { firstName: 'Mark', lastName: 'Thomas' } },
      {
        firstName: 'Sophia',
        lastName: 'Hernandez',
        parent: { firstName: 'Ana', lastName: 'Hernandez' },
      },
      { firstName: 'Logan', lastName: 'Moore', parent: { firstName: 'Kevin', lastName: 'Moore' } },
      {
        firstName: 'Isabella',
        lastName: 'Martin',
        parent: { firstName: 'Sandra', lastName: 'Martin' },
      },
      {
        firstName: 'Lucas',
        lastName: 'Jackson',
        parent: { firstName: 'Paul', lastName: 'Jackson' },
      },
      {
        firstName: 'Thandiwe',
        lastName: 'Ndlovu',
        parent: { firstName: 'Mandla', lastName: 'Ndlovu' },
      },
      { firstName: 'Omar', lastName: 'Hassan', parent: { firstName: 'Ahmed', lastName: 'Hassan' } },
      {
        firstName: 'Chloe',
        lastName: 'Van Der Merwe',
        parent: { firstName: 'Pieter', lastName: 'Van Der Merwe' },
      },
      { firstName: 'Arjun', lastName: 'Sharma', parent: { firstName: 'Raj', lastName: 'Sharma' } },
      { firstName: 'Maya', lastName: 'Lebeko', parent: { firstName: 'Thabo', lastName: 'Lebeko' } },
      {
        firstName: 'Ryan',
        lastName: "O'Connor",
        parent: { firstName: 'Sean', lastName: "O'Connor" },
      },
      {
        firstName: 'Aaliyah',
        lastName: 'Williams',
        parent: { firstName: 'Marcus', lastName: 'Williams' },
      },
      {
        firstName: 'Jayden',
        lastName: 'Clarke',
        parent: { firstName: 'Richard', lastName: 'Clarke' },
      },
      {
        firstName: 'Naledi',
        lastName: 'Mogale',
        parent: { firstName: 'Kagiso', lastName: 'Mogale' },
      },
      {
        firstName: 'Sebastian',
        lastName: 'Costa',
        parent: { firstName: 'Paulo', lastName: 'Costa' },
      },
      { firstName: 'Zainab', lastName: 'Khan', parent: { firstName: 'Imran', lastName: 'Khan' } },
      {
        firstName: 'Benjamin',
        lastName: 'Scott',
        parent: { firstName: 'Andrew', lastName: 'Scott' },
      },
      { firstName: 'Kira', lastName: 'Botha', parent: { firstName: 'Johan', lastName: 'Botha' } },
      {
        firstName: 'Aiden',
        lastName: 'Murphy',
        parent: { firstName: 'Patrick', lastName: 'Murphy' },
      },
      {
        firstName: 'Siyanda',
        lastName: 'Mabena',
        parent: { firstName: 'Lucky', lastName: 'Mabena' },
      },
      {
        firstName: 'Grace',
        lastName: 'Thompson',
        parent: { firstName: 'William', lastName: 'Thompson' },
      },
      {
        firstName: 'Caleb',
        lastName: 'De Villiers',
        parent: { firstName: 'Pierre', lastName: 'De Villiers' },
      },
      {
        firstName: 'Fatima',
        lastName: 'Adams',
        parent: { firstName: 'Abdullah', lastName: 'Adams' },
      },
      {
        firstName: 'Luke',
        lastName: 'Robinson',
        parent: { firstName: 'Steven', lastName: 'Robinson' },
      },
      {
        firstName: 'Precious',
        lastName: 'Sithole',
        parent: { firstName: 'Gift', lastName: 'Sithole' },
      },
    ];

    const students = [];
    const parents = [];
    let studentNameIndex = 0;

    // Create students for each class ensuring realistic distribution
    // With 25 classes total, target ~650 students (26 per class average)
    for (const cls of classes) {
      const studentsPerClass = Math.floor(Math.random() * 4) + 25; // 25-28 students per class
      console.log(`Creating ${studentsPerClass} students for class ${cls.name}...`);

      for (let i = 0; i < studentsPerClass; i++) {
        let studentData;
        if (studentNameIndex < studentNamesPool.length) {
          studentData = studentNamesPool[studentNameIndex];
          studentNameIndex++;
        } else {
          // Generate additional names if we run out
          const firstNames = [
            'Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Avery', 'Quinn',
            'Cameron', 'Sage', 'River', 'Sky', 'Phoenix', 'Emery', 'Finley', 'Hayden',
            'Kai', 'Logan', 'Peyton', 'Reese', 'Rowan', 'Sawyer', 'Tatum', 'Wren'
          ];
          const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
            'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
          ];
          
          studentData = {
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            parent: {
              firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
              lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
            }
          };
        }

        // Create parent for this student (implementing 2.2:1 ratio logic)
        // Every 2-3 students should share parents (siblings)
        let parent;
        const shouldCreateNewParent = Math.random() < 0.45; // ~45% chance of new parent
        
        if (shouldCreateNewParent || parents.length === 0) {
          // Create new parent
          const parentUser = await prisma.user.create({
            'Brown',
            'Davis',
            'Miller',
            'Wilson',
            'Moore',
            'Taylor',
          ];
          const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
          const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
          studentData = {
            firstName: randomFirst,
            lastName: randomLast,
            parent: {
              firstName: randomFirst.charAt(0) === 'A' ? 'Alice' : 'Bob',
              lastName: randomLast,
            },
          };
        }

        // Find the grade for this class
        const classGrade = grades.find(g => g.id === cls.gradeId);

        // Create parent user first
        const parentUser = await prisma.user.create({
          data: {
            firstName: studentData.parent.firstName,
            lastName: studentData.parent.lastName,
            email: `${studentData.parent.firstName.toLowerCase()}.${studentData.parent.lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}@gmail.com`,
            role: 'PARENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: `${Math.floor(Math.random() * 999) + 1} ${['Oak', 'Pine', 'Maple', 'Cedar', 'Birch'][Math.floor(Math.random() * 5)]} Street`,
            city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][
              Math.floor(Math.random() * 4)
            ],
            province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal'][Math.floor(Math.random() * 3)],
            postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
            country: 'South Africa',
            dateOfBirth: new Date(
              1975 + Math.floor(Math.random() * 15),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
          },
        });

        // Create parent
        const parent = await prisma.parent.create({
          data: {
            id: parentUser.id,
            username: `${studentData.parent.firstName.toLowerCase()}.${studentData.parent.lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}`,
            name: studentData.parent.firstName,
            surname: studentData.parent.lastName,
            email: parentUser.email,
            phone: parentUser.phone || '+27123456789',
            address: parentUser.addressLine1 || '123 Main Street',
            sex: parentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
            occupation: [
              'Engineer',
              'Teacher',
              'Nurse',
              'Manager',
              'Consultant',
              'Doctor',
              'Lawyer',
              'Accountant',
            ][Math.floor(Math.random() * 8)],
            employer: [
              'ABC Company',
              'XYZ Corp',
              'Tech Solutions',
              'Health Services',
              'Education Dept',
            ][Math.floor(Math.random() * 5)],
            relationshipToStudent: Math.random() > 0.5 ? 'Father' : 'Mother',
          },
        });

        // Create student user
        const studentUser = await prisma.user.create({
          data: {
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}@edulynx.student.com`,
            role: 'STUDENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: parentUser.addressLine1,
            city: parentUser.city,
            province: parentUser.province,
            postalCode: parentUser.postalCode,
            country: 'South Africa',
            dateOfBirth: new Date(
              2006 + Math.floor(Math.random() * 5),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
          },
        });

        // Create student
        const student = await prisma.student.create({
          data: {
            id: studentUser.id,
            username: `${studentData.firstName.toLowerCase()}.${studentData.lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}`,
            name: studentData.firstName,
            surname: studentData.lastName,
            email: studentUser.email,
            phone: studentUser.phone || '+27123456789',
            address: studentUser.addressLine1 || '123 Main Street',
            img: `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
              Math.floor(Math.random() * 8)
            ],
            sex: studentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
            gender: studentUser.gender,
            birthday: studentUser.dateOfBirth,
            classId: cls.id,
            gradeId: classGrade.id,
            parentId: parent.id,
          },
        });

        students.push(student);
      }
    }

    console.log(`✅ Created ${students.length} students with parents`);

    // 6. Create Lessons
    console.log('📅 Creating lessons...');
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
    const timeSlots = [
      { start: '08:00', end: '08:45' },
      { start: '08:45', end: '09:30' },
      { start: '09:45', end: '10:30' },
      { start: '10:30', end: '11:15' },
      { start: '12:00', end: '12:45' },
      { start: '12:45', end: '13:30' },
      { start: '13:45', end: '14:30' },
    ];

    const lessons = [];
    for (const cls of classes) {
      for (const day of days) {
        for (let i = 0; i < Math.min(4, subjects.length); i++) {
          const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
          const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
          const timeSlot = timeSlots[i];

          const lesson = await prisma.lesson.create({
            data: {
              name: `${randomSubject.name} - ${cls.name}`,
              day: day,
              startTime: new Date(`2024-01-01T${timeSlot.start}:00Z`),
              endTime: new Date(`2024-01-01T${timeSlot.end}:00Z`),
              subjectId: randomSubject.id,
              classId: cls.id,
              teacherId: randomTeacher.id,
            },
          });
          lessons.push(lesson);
        }
      }
    }

    console.log(`✅ Created ${lessons.length} lessons`);

    // 7. Create Assignments
    console.log('📝 Creating assignments...');
    const assignmentTitles = [
      'Chapter 1 Review Questions',
      'Mathematical Problem Set A',
      'Essay on Historical Events',
      'Scientific Method Lab Report',
      'Business Case Study Analysis',
      'Geography Field Study',
      'Literature Analysis Paper',
      'Physics Calculations Worksheet',
      'Economics Data Analysis',
      'Research Project Proposal',
    ];

    const assignments = [];
    for (let i = 0; i < 25; i++) {
      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 3);

      const assignment = await prisma.assignment.create({
        data: {
          title: assignmentTitles[Math.floor(Math.random() * assignmentTitles.length)],
          startDate,
          dueDate,
          lessonId: randomLesson.id,
        },
      });
      assignments.push(assignment);
    }

    console.log(`✅ Created ${assignments.length} assignments`);

    // 8. Create Attendance Records
    console.log('📊 Creating attendance records...');
    const attendanceRecords = [];
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    for (const student of students) {
      for (const date of last30Days.filter(d => d.getDay() !== 0 && d.getDay() !== 6)) {
        // Skip weekends
        const studentLessons = lessons.filter(l => l.classId === student.classId);
        for (const lesson of studentLessons.slice(0, 3)) {
          // 3 lessons per day
          if (Math.random() > 0.15) {
            // 85% attendance rate
            const attendance = await prisma.attendance.create({
              data: {
                date,
                present: true,
                studentId: student.id,
                lessonId: lesson.id,
              },
            });
            attendanceRecords.push(attendance);
          }
        }
      }
    }

    console.log(`✅ Created ${attendanceRecords.length} attendance records`);

    // 9. Create Exams and Results
    console.log('🎓 Creating exams and results...');
    const exams = [];
    const examTitles = [
      'Mid-term Assessment',
      'Final Examination',
      'Unit Test',
      'Practical Assessment',
    ];

    for (let i = 0; i < 15; i++) {
      const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + Math.floor(Math.random() * 60) - 30);

      const exam = await prisma.exam.create({
        data: {
          title: examTitles[Math.floor(Math.random() * examTitles.length)],
          startTime: examDate,
          endTime: new Date(examDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
          lessonId: randomLesson.id,
        },
      });
      exams.push(exam);

      // Create results for this exam
      const studentsInClass = students.filter(s => s.classId === randomLesson.classId);
      for (const student of studentsInClass) {
        if (Math.random() > 0.1) {
          // 90% of students have results
          await prisma.result.create({
            data: {
              score: Math.floor(Math.random() * 60) + 30, // Scores between 30-90
              studentId: student.id,
              examId: exam.id,
            },
          });
        }
      }
    }

    console.log(`✅ Created ${exams.length} exams with results`);

    // 10. Create Announcements
    console.log('📢 Creating announcements...');
    const announcementData = [
      {
        title: 'School Sports Day',
        description:
          'Annual school sports day will be held next Friday. All students are encouraged to participate.',
      },
      {
        title: 'Parent-Teacher Meetings',
        description:
          'Parent-teacher conferences are scheduled for next week. Please book your appointments.',
      },
      {
        title: 'Mid-term Examination Schedule',
        description:
          'Mid-term examinations will commence on Monday. Please refer to the timetable for details.',
      },
      {
        title: 'Library Renovation',
        description:
          'The school library will be closed for renovation from next Monday for two weeks.',
      },
      {
        title: 'Science Fair Registration',
        description:
          'Registration for the annual science fair is now open. Deadline for submission is next Friday.',
      },
    ];

    for (const announcement of announcementData) {
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      await prisma.announcement.create({
        data: {
          title: announcement.title,
          description: announcement.description,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last week
          classId: randomClass.id,
        },
      });
    }

    console.log('✅ Created announcements');

    // 11. Create Events
    console.log('🎉 Creating events...');
    const eventData = [
      {
        title: 'Mathematics Competition',
        location: 'Main Hall',
        description: 'Inter-school mathematics competition',
      },
      {
        title: 'Science Exhibition',
        location: 'Science Laboratory',
        description: 'Student science project showcase',
      },
      {
        title: 'Cultural Day',
        location: 'School Grounds',
        description: 'Celebration of diverse cultures in our school',
      },
      {
        title: 'Career Guidance Workshop',
        location: 'Assembly Hall',
        description: 'Workshop on career choices and university applications',
      },
    ];

    for (const event of eventData) {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + Math.floor(Math.random() * 30));
      const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

      await prisma.event.create({
        data: {
          title: event.title,
          description: event.description,
          startTime,
          endTime,
          classId: classes[Math.floor(Math.random() * classes.length)].id,
        },
      });
    }

    console.log('✅ Created events');

    // 12. Create Projects
    console.log('🚀 Creating projects...');
    const projectTitles = [
      'Science Fair Project',
      'History Research Paper',
      'Mathematics Portfolio',
      'Geography Field Study',
      'English Literature Analysis',
      'Business Plan Development',
      'Computer Programming Project',
      'Art Exhibition Piece',
      'Physics Lab Experiment',
      'Economics Case Study',
    ];

    const projectTypes = ['INDIVIDUAL', 'GROUP', 'CLASS'];
    const projectStatuses = ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'SUBMITTED', 'GRADED'];

    const projects = [];
    for (let i = 0; i < 30; i++) {
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
      const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
      const status = projectStatuses[Math.floor(Math.random() * projectStatuses.length)];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 7);

      const project = await prisma.project.create({
        data: {
          title:
            projectTitles[Math.floor(Math.random() * projectTitles.length)] +
            ` - ${randomClass.name}`,
          description: `A comprehensive ${projectType.toLowerCase()} project for ${randomSubject.name}`,
          type: projectType,
          status: status,
          startDate,
          dueDate,
          grade: status === 'GRADED' ? Math.floor(Math.random() * 41) + 60 : null, // 60-100 grade
          feedback:
            status === 'GRADED'
              ? 'Good work on this project. Well researched and presented.'
              : null,
          requirements: JSON.stringify({
            minPages: Math.floor(Math.random() * 10) + 5,
            references: Math.floor(Math.random() * 8) + 3,
            format: 'PDF',
            presentationRequired: Math.random() > 0.5,
          }),
          resources: JSON.stringify({
            textbooks: ['Chapter 1-3 from main textbook'],
            websites: ['Educational websites provided in class'],
            library: 'School library resources available',
          }),
          subjectId: randomSubject.id,
          classId: randomClass.id,
          teacherId: randomTeacher.id,
        },
      });

      // For group projects, assign some students
      if (projectType === 'GROUP') {
        const classStudents = students.filter(s => s.classId === randomClass.id);
        const groupSize = Math.floor(Math.random() * 4) + 2; // 2-5 students
        const selectedStudents = classStudents.slice(0, Math.min(groupSize, classStudents.length));

        for (const student of selectedStudents) {
          await prisma.project.update({
            where: { id: project.id },
            data: {
              students: {
                connect: { id: student.id },
              },
            },
          });
        }
      } else if (projectType === 'INDIVIDUAL') {
        // Assign to one random student from the class
        const classStudents = students.filter(s => s.classId === randomClass.id);
        if (classStudents.length > 0) {
          const randomStudent = classStudents[Math.floor(Math.random() * classStudents.length)];
          await prisma.project.update({
            where: { id: project.id },
            data: {
              students: {
                connect: { id: randomStudent.id },
              },
            },
          });
        }
      }

      projects.push(project);
    }

    console.log(`✅ Created ${projects.length} projects`);

    // Print summary
    const summary = {
      grades: grades.length,
      subjects: subjects.length,
      classes: classes.length,
      teachers: teachers.length,
      students: students.length,
      lessons: lessons.length,
      assignments: assignments.length,
      attendanceRecords: attendanceRecords.length,
      exams: exams.length,
      projects: projects.length,
    };

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:', summary);

    return summary;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

comprehensiveSeed().catch(console.error);
