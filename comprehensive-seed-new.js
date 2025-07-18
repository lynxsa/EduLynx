const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function comprehensiveSeed() {
  console.log('🌱 Starting comprehensive database seeding...'); // 1. Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.$transaction([
    // Delete dependent records first (in correct order)
    prisma.attendance.deleteMany(),
    prisma.result.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.exam.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.event.deleteMany(),
    prisma.project.deleteMany(),

    // Delete users and their related records
    prisma.student.deleteMany(),
    prisma.subjectToTeacher.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.user.deleteMany(),

    // Delete core structure
    prisma.class.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.grade.deleteMany(),
  ]);

  // 2. Create Grades (8-12)
  console.log('📚 Creating grades...');
  const grades = await Promise.all([
    prisma.grade.create({ data: { level: 8 } }),
    prisma.grade.create({ data: { level: 9 } }),
    prisma.grade.create({ data: { level: 10 } }),
    prisma.grade.create({ data: { level: 11 } }),
    prisma.grade.create({ data: { level: 12 } }),
  ]);

  // 3. Create Subjects
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

  // 4. Create Classes (5 classes per grade = 25 total)
  console.log('🏫 Creating classes...');
  const classes = [];
  for (const grade of grades) {
    const classesForGrade = await Promise.all([
      prisma.class.create({
        data: {
          name: `${grade.level}A`,
          capacity: 30,
          roomNumber: `${grade.level}01`,
          gradeId: grade.id,
        },
      }),
      prisma.class.create({
        data: {
          name: `${grade.level}B`,
          capacity: 30,
          roomNumber: `${grade.level}02`,
          gradeId: grade.id,
        },
      }),
      prisma.class.create({
        data: {
          name: `${grade.level}C`,
          capacity: 30,
          roomNumber: `${grade.level}03`,
          gradeId: grade.id,
        },
      }),
      prisma.class.create({
        data: {
          name: `${grade.level}D`,
          capacity: 30,
          roomNumber: `${grade.level}04`,
          gradeId: grade.id,
        },
      }),
      prisma.class.create({
        data: {
          name: `${grade.level}E`,
          capacity: 30,
          roomNumber: `${grade.level}05`,
          gradeId: grade.id,
        },
      }),
    ]);
    classes.push(...classesForGrade);
  }

  // 5. Create 48 Teachers with realistic distribution
  console.log('👩‍🏫 Creating teachers...');
  const teacherData = [
    // Mathematics Department (8 teachers)
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Thabo',
      lastName: 'Mokwena',
      email: 'thabo.mokwena@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Lisa',
      lastName: 'Williams',
      email: 'lisa.williams@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Nomsa',
      lastName: 'Dlamini',
      email: 'nomsa.dlamini@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Peter',
      lastName: 'Van Der Merwe',
      email: 'peter.vandermerwe@edulynx.com',
      subjects: ['Mathematics'],
    },
    {
      firstName: 'Fatima',
      lastName: 'Hassan',
      email: 'fatima.hassan@edulynx.com',
      subjects: ['Mathematics'],
    },

    // English Department (6 teachers)
    {
      firstName: 'Emma',
      lastName: 'Thompson',
      email: 'emma.thompson@edulynx.com',
      subjects: ['English'],
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@edulynx.com',
      subjects: ['English'],
    },
    {
      firstName: 'Sipho',
      lastName: 'Mthembu',
      email: 'sipho.mthembu@edulynx.com',
      subjects: ['English'],
    },
    {
      firstName: 'Rachel',
      lastName: 'Adams',
      email: 'rachel.adams@edulynx.com',
      subjects: ['English'],
    },
    {
      firstName: 'Trevor',
      lastName: 'Ncube',
      email: 'trevor.ncube@edulynx.com',
      subjects: ['English'],
    },
    {
      firstName: 'Michelle',
      lastName: 'Jones',
      email: 'michelle.jones@edulynx.com',
      subjects: ['English'],
    },

    // Science Department (12 teachers)
    {
      firstName: 'Robert',
      lastName: 'Martinez',
      email: 'robert.martinez@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Zanele',
      lastName: 'Khumalo',
      email: 'zanele.khumalo@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Andrew',
      lastName: 'Smith',
      email: 'andrew.smith@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Mandla',
      lastName: 'Zulu',
      email: 'mandla.zulu@edulynx.com',
      subjects: ['Life Sciences'],
    },
    {
      firstName: 'Jennifer',
      lastName: 'Taylor',
      email: 'jennifer.taylor@edulynx.com',
      subjects: ['Life Sciences'],
    },
    {
      firstName: 'Kwame',
      lastName: 'Asante',
      email: 'kwame.asante@edulynx.com',
      subjects: ['Life Sciences'],
    },
    {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@edulynx.com',
      subjects: ['Life Sciences'],
    },
    {
      firstName: 'Benjamin',
      lastName: 'Clark',
      email: 'benjamin.clark@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Thandiwe',
      lastName: 'Mabena',
      email: 'thandiwe.mabena@edulynx.com',
      subjects: ['Life Sciences'],
    },
    {
      firstName: 'Carlos',
      lastName: 'Silva',
      email: 'carlos.silva@edulynx.com',
      subjects: ['Physical Science'],
    },
    {
      firstName: 'Aisha',
      lastName: 'Mohammed',
      email: 'aisha.mohammed@edulynx.com',
      subjects: ['Life Sciences'],
    },

    // Social Sciences Department (8 teachers)
    {
      firstName: 'William',
      lastName: 'Parker',
      email: 'william.parker@edulynx.com',
      subjects: ['History'],
    },
    {
      firstName: 'Lerato',
      lastName: 'Motaung',
      email: 'lerato.motaung@edulynx.com',
      subjects: ['History'],
    },
    {
      firstName: 'Oliver',
      lastName: 'Green',
      email: 'oliver.green@edulynx.com',
      subjects: ['Geography'],
    },
    {
      firstName: 'Nontando',
      lastName: 'Ndaba',
      email: 'nontando.ndaba@edulynx.com',
      subjects: ['Geography'],
    },
    {
      firstName: 'Christopher',
      lastName: 'Lee',
      email: 'christopher.lee@edulynx.com',
      subjects: ['History'],
    },
    {
      firstName: 'Busisiwe',
      lastName: 'Masuku',
      email: 'busisiwe.masuku@edulynx.com',
      subjects: ['Geography'],
    },
    {
      firstName: 'Marcus',
      lastName: 'Thompson',
      email: 'marcus.thompson@edulynx.com',
      subjects: ['History'],
    },
    {
      firstName: 'Naledi',
      lastName: 'Tladi',
      email: 'naledi.tladi@edulynx.com',
      subjects: ['Geography'],
    },

    // Business Studies Department (6 teachers)
    {
      firstName: 'Karen',
      lastName: 'White',
      email: 'karen.white@edulynx.com',
      subjects: ['Business Studies'],
    },
    {
      firstName: 'Sello',
      lastName: 'Mohapi',
      email: 'sello.mohapi@edulynx.com',
      subjects: ['Business Studies'],
    },
    {
      firstName: 'Rebecca',
      lastName: 'Davis',
      email: 'rebecca.davis@edulynx.com',
      subjects: ['Economics'],
    },
    {
      firstName: 'Tshepo',
      lastName: 'Mokoena',
      email: 'tshepo.mokoena@edulynx.com',
      subjects: ['Economics'],
    },
    {
      firstName: 'Amanda',
      lastName: 'Miller',
      email: 'amanda.miller@edulynx.com',
      subjects: ['Business Studies'],
    },
    {
      firstName: 'Nkosana',
      lastName: 'Dube',
      email: 'nkosana.dube@edulynx.com',
      subjects: ['Economics'],
    },

    // Technology Department (4 teachers)
    {
      firstName: 'Daniel',
      lastName: 'Moore',
      email: 'daniel.moore@edulynx.com',
      subjects: ['Computer Applications Technology'],
    },
    {
      firstName: 'Lindiwe',
      lastName: 'Mahlangu',
      email: 'lindiwe.mahlangu@edulynx.com',
      subjects: ['Computer Applications Technology'],
    },
    {
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@edulynx.com',
      subjects: ['Computer Applications Technology'],
    },
    {
      firstName: 'Precious',
      lastName: 'Sithole',
      email: 'precious.sithole@edulynx.com',
      subjects: ['Computer Applications Technology'],
    },

    // Life Orientation Department (4 teachers)
    {
      firstName: 'Grace',
      lastName: 'Anderson',
      email: 'grace.anderson@edulynx.com',
      subjects: ['Life Orientation'],
    },
    {
      firstName: 'Bongani',
      lastName: 'Mthethwa',
      email: 'bongani.mthethwa@edulynx.com',
      subjects: ['Life Orientation'],
    },
    {
      firstName: 'Helen',
      lastName: 'Roberts',
      email: 'helen.roberts@edulynx.com',
      subjects: ['Life Orientation'],
    },
    {
      firstName: 'Sibongile',
      lastName: 'Nkomo',
      email: 'sibongile.nkomo@edulynx.com',
      subjects: ['Life Orientation'],
    },
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
          1975 + Math.floor(Math.random() * 20),
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
        createdAt: new Date(),
      },
    });

    // Create teacher-subject relationships manually
    for (const subjectName of teacher.subjects) {
      const subject = subjects.find(s => s.name === subjectName);
      if (subject) {
        await prisma.subjectToTeacher.create({
          data: {
            subjectId: subject.id,
            teacherId: teacherRecord.id,
          },
        });
      }
    }

    teachers.push(teacherRecord);
  }

  // 6. Create Students and Parents with 2.2:1 ratio
  console.log('👨‍👩‍👧‍👦 Creating students and parents with 2.2:1 ratio...');

  const studentFirstNames = [
    'Aiden',
    'Amara',
    'Bongani',
    'Chloe',
    'Daniel',
    'Elena',
    'Fatima',
    'Gabriel',
    'Hannah',
    'Ibrahim',
    'Jade',
    'Kiran',
    'Lerato',
    'Maya',
    'Nomsa',
    'Omar',
    'Priya',
    'Quinton',
    'Riya',
    'Sipho',
    'Tanya',
    'Umar',
    'Vanja',
    'Willem',
    'Xolani',
    'Yuki',
    'Zara',
    'Aarav',
    'Bella',
    'Caleb',
    'Devi',
    'Ethan',
    'Fia',
    'Gio',
    'Hala',
    'Ivan',
    'Jaya',
    'Kael',
    'Luna',
    'Milo',
    'Naya',
    'Orion',
    'Pia',
    'Quin',
    'Ria',
    'Sage',
    'Tara',
    'Uma',
    'Vera',
    'Wren',
  ];

  const lastNames = [
    'Adams',
    'Botha',
    'Chen',
    'Dlamini',
    'Evans',
    'Fisher',
    'Garcia',
    'Hassan',
    'Iyer',
    'Johnson',
    'Khumalo',
    'Lee',
    'Mthembu',
    'Naidoo',
    'Okafor',
    'Patel',
    'Qadi',
    'Roberts',
    'Singh',
    'Taylor',
    'Usman',
    'Van Der Merwe',
    'Williams',
    'Xaba',
    'Yusuf',
    'Zulu',
    'Anderson',
    'Brown',
    'Campbell',
    'Davies',
  ];

  const students = [];
  const parents = [];
  let parentIndex = 0;

  for (const cls of classes) {
    const studentsPerClass = Math.floor(Math.random() * 3) + 25; // 25-27 students per class
    console.log(`Creating ${studentsPerClass} students for class ${cls.name}...`);

    for (let i = 0; i < studentsPerClass; i++) {
      const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      // Implement 2.2:1 student-to-parent ratio
      // Every 2-3 students get a new parent (siblings logic)
      let parent;
      if (i % 2 === 0 || parents.length === 0) {
        // Create new parent
        const parentFirstName =
          studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)];
        const parentUser = await prisma.user.create({
          data: {
            firstName: parentFirstName,
            lastName: lastName,
            email: `${parentFirstName.toLowerCase()}.${lastName.toLowerCase()}.${parentIndex}@gmail.com`,
            role: 'PARENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: `${Math.floor(Math.random() * 999) + 1} ${['Oak', 'Pine', 'Maple'][Math.floor(Math.random() * 3)]} Street`,
            city: ['Cape Town', 'Johannesburg', 'Durban'][Math.floor(Math.random() * 3)],
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

        parent = await prisma.parent.create({
          data: {
            id: parentUser.id,
            username: `${parentFirstName.toLowerCase()}.${lastName.toLowerCase()}.${parentIndex}`,
            name: parentFirstName,
            surname: lastName,
            email: parentUser.email,
            phone: parentUser.phone || '+27123456789',
            address: parentUser.addressLine1 || '123 Main Street',
            sex: parentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
            createdAt: new Date(),
            employer: ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'City Council'][
              Math.floor(Math.random() * 4)
            ],
            occupation: ['Engineer', 'Teacher', 'Doctor', 'Manager'][Math.floor(Math.random() * 4)],
            relationshipToStudent: Math.random() > 0.5 ? 'Father' : 'Mother',
          },
        });

        parents.push(parent);
        parentIndex++;
      } else {
        // Use existing parent (sibling)
        parent = parents[Math.floor(Math.random() * parents.length)];
      }

      // Find the grade for this class
      const classGrade = grades.find(g => g.id === cls.gradeId);

      // Create student user
      const studentUser = await prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}@student.edulynx.com`,
          role: 'STUDENT',
          phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
          addressLine1: parent.address,
          city: ['Cape Town', 'Johannesburg', 'Durban'][Math.floor(Math.random() * 3)],
          province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal'][Math.floor(Math.random() * 3)],
          postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
          country: 'South Africa',
          dateOfBirth: new Date(
            2024 - (18 - classGrade.level), // Age appropriate to grade
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
          username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${i}`,
          name: firstName,
          surname: lastName,
          email: studentUser.email,
          phone: studentUser.phone || '+27123456789',
          address: parent.address,
          bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
            Math.floor(Math.random() * 8)
          ],
          sex: studentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
          birthday: studentUser.dateOfBirth,
          img: `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`,
          gender: studentUser.gender,
          classId: cls.id,
          gradeId: classGrade.id,
          parentId: parent.id,
          createdAt: new Date(),
        },
      });

      students.push(student);
    }
  }

  console.log(`✅ Created ${students.length} students and ${parents.length} parents`);
  console.log(`✅ Student-to-parent ratio: ${(students.length / parents.length).toFixed(2)}:1`);

  // 7. Create Lessons
  console.log('📅 Creating lessons...');
  const lessons = [];
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  // Create lessons for each subject per class (realistic weekly schedule)
  for (const cls of classes) {
    for (const subject of subjects) {
      // Each subject has 2-3 lessons per week
      const lessonsPerSubject = Math.floor(Math.random() * 2) + 2;

      // Find teachers who teach this subject
      const subjectTeacherRelations = await prisma.subjectToTeacher.findMany({
        where: { subjectId: subject.id },
        include: { teacher: true },
      });

      if (subjectTeacherRelations.length > 0) {
        const randomRelation =
          subjectTeacherRelations[Math.floor(Math.random() * subjectTeacherRelations.length)];
        const teacher = randomRelation.teacher;

        for (let i = 0; i < lessonsPerSubject; i++) {
          const randomDay = days[Math.floor(Math.random() * days.length)];
          const startHour = 8 + Math.floor(Math.random() * 6); // 8 AM to 2 PM
          const startTime = new Date();
          startTime.setHours(startHour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setHours(startHour + 1, 0, 0, 0);

          const lesson = await prisma.lesson.create({
            data: {
              name: `${subject.name} - ${cls.name}`,
              day: randomDay,
              startTime: startTime,
              endTime: endTime,
              subjectId: subject.id,
              classId: cls.id,
              teacherId: teacher.id,
            },
          });
          lessons.push(lesson);
        }
      }
    }
  }

  console.log(`✅ Created ${lessons.length} lessons`);

  // 8. Create Assignments
  console.log('📝 Creating assignments...');
  const assignments = [];

  for (let i = 0; i < 50; i++) {
    const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
    const randomSubject = subjects.find(s => s.id === randomLesson.subjectId);

    const assignment = await prisma.assignment.create({
      data: {
        title: `${randomSubject.name} Assignment ${i + 1}`,
        startDate: new Date(),
        dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        lessonId: randomLesson.id,
        createdAt: new Date(),
      },
    });
    assignments.push(assignment);
  }

  console.log(`✅ Created ${assignments.length} assignments`);

  // 9. Create Attendance Records
  console.log('📊 Creating attendance records...');
  let attendanceCount = 0;

  for (const lesson of lessons) {
    const studentsInClass = students.filter(s => s.classId === lesson.classId);
    for (const student of studentsInClass) {
      const attendance = await prisma.attendance.create({
        data: {
          date: lesson.startTime,
          present: Math.random() > 0.1, // 90% attendance rate
          studentId: student.id,
          lessonId: lesson.id,
        },
      });
      attendanceCount++;
    }
  }

  console.log(`✅ Created ${attendanceCount} attendance records`);

  // 10. Create Exams and Results
  console.log('🎓 Creating exams and results...');
  const exams = [];

  // Create exams for each lesson (some lessons have exams)
  for (let i = 0; i < Math.min(lessons.length, 100); i++) {
    if (Math.random() > 0.7) {
      // 30% of lessons have exams
      const lesson = lessons[i];
      const exam = await prisma.exam.create({
        data: {
          title: `${lesson.name} Exam`,
          startTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          endTime: new Date(
            Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
          ),
          lessonId: lesson.id,
        },
      });
      exams.push(exam);
    }
  }

  // Create results for exams
  let resultCount = 0;
  for (const exam of exams) {
    const lesson = lessons.find(l => l.id === exam.lessonId);
    const studentsInClass = students.filter(s => s.classId === lesson.classId);

    for (const student of studentsInClass) {
      const score = Math.floor(Math.random() * 40) + 40; // 40-80% range
      const result = await prisma.result.create({
        data: {
          score: score,
          studentId: student.id,
          examId: exam.id,
        },
      });
      resultCount++;
    }
  }

  console.log(`✅ Created ${exams.length} exams with ${resultCount} results`);

  // 11. Create Announcements
  console.log('📢 Creating announcements...');
  const announcements = [];
  const announcementTitles = [
    'Welcome to the New Academic Year',
    'School Sports Day',
    'Parent-Teacher Conferences',
    'Library Hours Update',
    'Science Fair Competition',
    'Cultural Day Celebration',
    'Exam Timetable Released',
    'School Holiday Notice',
  ];

  for (const title of announcementTitles) {
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const announcement = await prisma.announcement.create({
      data: {
        title: title,
        description: `Important announcement regarding ${title.toLowerCase()}`,
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        class: {
          connect: {
            id: randomClass.id,
          },
        },
      },
    });
    announcements.push(announcement);
  }

  console.log('✅ Created announcements');

  // 12. Create Events
  console.log('🎉 Creating events...');
  const events = [];
  const eventTitles = [
    'Science Fair',
    'Sports Day',
    'Cultural Festival',
    'Art Exhibition',
    'Music Concert',
    'Drama Performance',
    'Career Day',
    'Open Day',
  ];

  for (const title of eventTitles) {
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const event = await prisma.event.create({
      data: {
        title: title,
        description: `Join us for ${title.toLowerCase()} event`,
        startTime: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
        ),
        class: {
          connect: {
            id: randomClass.id,
          },
        },
      },
    });
    events.push(event);
  }

  console.log('✅ Created events');

  // 13. Create Projects
  console.log('🚀 Creating projects...');
  const projects = [];
  const projectTypes = ['INDIVIDUAL', 'GROUP', 'CLASS'];

  for (let i = 0; i < 60; i++) {
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];

    const project = await prisma.project.create({
      data: {
        title: `${randomSubject.name} ${projectType} Project ${i + 1}`,
        description: `A comprehensive ${projectType.toLowerCase()} project for ${randomSubject.name}`,
        startDate: new Date(),
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        type: projectType,
        class: {
          connect: {
            id: randomClass.id,
          },
        },
        subject: {
          connect: {
            id: randomSubject.id,
          },
        },
      },
    });
    projects.push(project);
  }

  console.log(`✅ Created ${projects.length} projects`);

  // Final summary
  const finalCounts = {
    grades: grades.length,
    subjects: subjects.length,
    classes: classes.length,
    teachers: teachers.length,
    students: students.length,
    parents: parents.length,
    lessons: lessons.length,
    assignments: assignments.length,
    attendanceRecords: attendanceCount,
    exams: exams.length,
    results: resultCount,
    announcements: announcements.length,
    events: events.length,
    projects: projects.length,
    studentToParentRatio: (students.length / parents.length).toFixed(2),
  };

  console.log('🎉 Database seeding completed successfully!');
  console.log('📊 Summary:', finalCounts);

  await prisma.$disconnect();
  return finalCounts;
}

comprehensiveSeed().catch(console.error);
