const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function expandToTargetNumbers() {
  console.log('🚀 EXPANDING DATABASE TO TARGET NUMBERS');
  console.log('=====================================\n');

  try {
    // Check current counts
    const currentCounts = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'PARENT' } }),
      prisma.class.count(),
    ]);

    console.log('📊 Current Counts:');
    console.log(`Students: ${currentCounts[0]} (target: 1,250)`);
    console.log(`Teachers: ${currentCounts[1]} (target: 85)`);
    console.log(`Parents: ${currentCounts[2]} (target: 980)`);
    console.log(`Classes: ${currentCounts[3]} (target: 42)`);

    // Target numbers
    const targetStudents = 1250;
    const targetTeachers = 85;
    const targetParents = 980;
    const targetClasses = 42;

    const studentsToAdd = targetStudents - currentCounts[0];
    const teachersToAdd = targetTeachers - currentCounts[1];
    const parentsToAdd = targetParents - currentCounts[2];
    const classesToAdd = targetClasses - currentCounts[3];

    console.log(`\n🎯 Need to add:`);
    console.log(`Students: ${studentsToAdd}`);
    console.log(`Teachers: ${teachersToAdd}`);
    console.log(`Parents: ${parentsToAdd}`);
    console.log(`Classes: ${classesToAdd}`);

    // Hash passwords
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    // Get existing data
    const grades = await prisma.grade.findMany();
    const subjects = await prisma.subject.findMany();
    const existingClasses = await prisma.class.findMany({
      include: { grade: true },
    });

    // South African names arrays
    const southAfricanFirstNames = [
      'Amahle',
      'Kwame',
      'Thandiwe',
      'Karabo',
      'Naledi',
      'Lesego',
      'Tebogo',
      'Refilwe',
      'Kgomotso',
      'Boitumelo',
      'Mpho',
      'Kagiso',
      'Tshegofatso',
      'Amogelang',
      'Keabetswe',
      'Lebohang',
      'Thapelo',
      'Palesa',
      'Nomsa',
      'Bongani',
      'Sizani',
      'Phemelo',
      'Thandeka',
      'Neo',
      'Katleho',
      'Lebo',
      'Thabo',
      'Nomthandazo',
      'Sello',
      'Lerato',
      'Tshepo',
      'Busisiwe',
      'Nkosana',
      'Precious',
      'Lindiwe',
      'Sibongile',
      'Mandla',
      'Zanele',
      'Sipho',
      'Abdullah',
      'Fatima',
      'Amina',
      'Yusuf',
      'Khadija',
      'Mogamat',
      'Zahra',
      'Ibrahim',
      'Aaliyah',
      'Hassan',
      'Ashwin',
      'Priya',
      'Deepak',
      'Meera',
      'Ravi',
      'Kavitha',
      'Arjun',
      'Devi',
      'Nikhil',
      'Sneha',
      'Wei',
      'Ling',
      'Jun',
      'Mei',
      'Leo',
      'Amy',
      'Kevin',
      'Grace',
      'Michael',
      'Sarah',
      'Pieter',
      'Annelize',
      'Johann',
      'Marlene',
      'Deon',
      'Elmarie',
      'Henk',
      'Rina',
      'Francois',
      'Susan',
    ];

    const southAfricanLastNames = [
      'Nkosi',
      'Dlamini',
      'Mthembu',
      'Zulu',
      'Khumalo',
      'Ndlovu',
      'Mahlangu',
      'Nkomo',
      'Mokoena',
      'Molefe',
      'Mofokeng',
      'Tshwane',
      'Mokwena',
      'Radebe',
      'Masuku',
      'Motaung',
      'Mohapi',
      'Tladi',
      'Sithole',
      'Dube',
      'Adams',
      'Hassan',
      'Samuels',
      'Davids',
      'Hendricks',
      'Williams',
      'Jacobs',
      'Koeries',
      'Petersen',
      'Fortune',
      'Patel',
      'Reddy',
      'Singh',
      'Naidoo',
      'Pillay',
      'Maharaj',
      'Govind',
      'Sharma',
      'Kumar',
      'Naicker',
      'Chen',
      'Wang',
      'Zhang',
      'Liu',
      'Li',
      'Zhou',
      'Wu',
      'Tang',
      'Ng',
      'Lim',
      'van der Merwe',
      'Botha',
      'Steyn',
      'Kruger',
      'Visser',
      'du Plessis',
      'Oosthuizen',
      'Potgieter',
      'Nel',
      'Pretorius',
    ];

    // 1. Add more classes if needed
    if (classesToAdd > 0) {
      console.log(`\n🏫 Adding ${classesToAdd} additional classes...`);

      for (let i = 0; i < classesToAdd; i++) {
        const grade = grades[Math.floor(Math.random() * grades.length)];
        const existingClassCount = await prisma.class.count({
          where: { gradeId: grade.id },
        });

        const className = `${grade.level}${String.fromCharCode(65 + existingClassCount)}`; // A, B, C, etc.

        await prisma.class.create({
          data: {
            name: className,
            capacity: 30,
            roomNumber: `${grade.level}${String(existingClassCount + 1).padStart(2, '0')}`,
            gradeId: grade.id,
          },
        });
      }
    }

    // 2. Add more teachers if needed
    if (teachersToAdd > 0) {
      console.log(`\n👩‍🏫 Adding ${teachersToAdd} additional teachers...`);

      for (let i = 0; i < teachersToAdd; i++) {
        const firstName =
          southAfricanFirstNames[Math.floor(Math.random() * southAfricanFirstNames.length)];
        const lastName =
          southAfricanLastNames[Math.floor(Math.random() * southAfricanLastNames.length)];

        const teacherUser = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i + 100}@lynxacademy.co.za`,
            password: teacherPassword,
            role: 'TEACHER',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: `${Math.floor(Math.random() * 999) + 1} ${['Mandela', 'Biko', 'Tambo', 'Luthuli', 'Sisulu'][Math.floor(Math.random() * 5)]} Street`,
            city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][
              Math.floor(Math.random() * 4)
            ],
            province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State'][
              Math.floor(Math.random() * 4)
            ],
            postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
            country: 'South Africa',
            dateOfBirth: new Date(
              1975 + Math.floor(Math.random() * 20),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            isActive: true,
          },
        });

        const teacherRecord = await prisma.teacher.create({
          data: {
            id: teacherUser.id,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i + 100}`,
            name: firstName,
            surname: lastName,
            email: teacherUser.email,
            phone: teacherUser.phone,
            address: teacherUser.addressLine1,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
              Math.floor(Math.random() * 8)
            ],
            sex: teacherUser.gender === 'Male' ? 'MALE' : 'FEMALE',
            birthday: teacherUser.dateOfBirth,
            qualifications: 'Bachelor of Education',
            yearsExperience: Math.floor(Math.random() * 15) + 5,
          },
        });

        // Assign random subjects
        const numberOfSubjects = Math.floor(Math.random() * 2) + 1; // 1-2 subjects per teacher
        const randomSubjects = subjects.sort(() => 0.5 - Math.random()).slice(0, numberOfSubjects);

        for (const subject of randomSubjects) {
          await prisma.subjectToTeacher.create({
            data: {
              subjectId: subject.id,
              teacherId: teacherRecord.id,
            },
          });
        }
      }
    }

    // 3. Add more parents if needed
    if (parentsToAdd > 0) {
      console.log(`\n👨‍👩‍👧‍👦 Adding ${parentsToAdd} additional parents...`);

      for (let i = 0; i < parentsToAdd; i++) {
        const firstName =
          southAfricanFirstNames[Math.floor(Math.random() * southAfricanFirstNames.length)];
        const lastName =
          southAfricanLastNames[Math.floor(Math.random() * southAfricanLastNames.length)];

        const parentUser = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.parent.${i + 1000}@gmail.com`,
            password: parentPassword,
            role: 'PARENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: `${Math.floor(Math.random() * 999) + 1} ${['Mandela', 'Biko', 'Tambo', 'Luthuli', 'Sisulu'][Math.floor(Math.random() * 5)]} Street`,
            city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][
              Math.floor(Math.random() * 4)
            ],
            province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State'][
              Math.floor(Math.random() * 4)
            ],
            postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
            country: 'South Africa',
            dateOfBirth: new Date(
              1975 + Math.floor(Math.random() * 15),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            isActive: true,
          },
        });

        await prisma.parent.create({
          data: {
            id: parentUser.id,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.parent.${i + 1000}`,
            name: firstName,
            surname: lastName,
            email: parentUser.email,
            phone: parentUser.phone,
            address: parentUser.addressLine1,
            sex: parentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
            employer: [
              'Department of Education',
              'City of Cape Town',
              'Eskom',
              'MTN',
              'Standard Bank',
            ][Math.floor(Math.random() * 5)],
            occupation: ['Teacher', 'Nurse', 'Engineer', 'Doctor', 'Manager'][
              Math.floor(Math.random() * 5)
            ],
            relationshipToStudent: parentUser.gender === 'Male' ? 'Father' : 'Mother',
          },
        });
      }
    }

    // 4. Add more students to reach exactly 1,250 (650 male, 600 female)
    if (studentsToAdd > 0) {
      console.log(`\n🎓 Adding ${studentsToAdd} additional students...`);

      // Get current gender counts
      const currentMale = await prisma.user.count({ where: { role: 'STUDENT', gender: 'Male' } });
      const currentFemale = await prisma.user.count({
        where: { role: 'STUDENT', gender: 'Female' },
      });

      const targetMale = 650;
      const targetFemale = 600;

      const maleToAdd = targetMale - currentMale;
      const femaleToAdd = targetFemale - currentFemale;

      console.log(`   Male students to add: ${maleToAdd}`);
      console.log(`   Female students to add: ${femaleToAdd}`);

      // Get all classes for distribution
      const allClasses = await prisma.class.findMany({
        include: { grade: true },
      });

      // Get all parents for assignment
      const allParents = await prisma.parent.findMany();

      let studentIndex = currentCounts[0];

      // Add male students
      for (let i = 0; i < maleToAdd; i++) {
        const firstName =
          southAfricanFirstNames[Math.floor(Math.random() * southAfricanFirstNames.length)];
        const lastName =
          southAfricanLastNames[Math.floor(Math.random() * southAfricanLastNames.length)];
        const cls = allClasses[Math.floor(Math.random() * allClasses.length)];
        const parent = allParents[Math.floor(Math.random() * allParents.length)];

        const studentUser = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${studentIndex + i}@student.lynxacademy.co.za`,
            password: studentPassword,
            role: 'STUDENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: parent.address,
            city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][
              Math.floor(Math.random() * 4)
            ],
            province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State'][
              Math.floor(Math.random() * 4)
            ],
            postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
            country: 'South Africa',
            dateOfBirth: new Date(
              2024 - (18 - cls.grade.level),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: 'Male',
            isActive: true,
          },
        });

        await prisma.student.create({
          data: {
            id: studentUser.id,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${studentIndex + i}`,
            name: firstName,
            surname: lastName,
            email: studentUser.email,
            phone: studentUser.phone,
            address: parent.address,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
              Math.floor(Math.random() * 8)
            ],
            sex: 'MALE',
            birthday: studentUser.dateOfBirth,
            gender: 'Male',
            classId: cls.id,
            gradeId: cls.grade.id,
            parentId: parent.id,
          },
        });
      }

      studentIndex += maleToAdd;

      // Add female students
      for (let i = 0; i < femaleToAdd; i++) {
        const firstName =
          southAfricanFirstNames[Math.floor(Math.random() * southAfricanFirstNames.length)];
        const lastName =
          southAfricanLastNames[Math.floor(Math.random() * southAfricanLastNames.length)];
        const cls = allClasses[Math.floor(Math.random() * allClasses.length)];
        const parent = allParents[Math.floor(Math.random() * allParents.length)];

        const studentUser = await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${studentIndex + i}@student.lynxacademy.co.za`,
            password: studentPassword,
            role: 'STUDENT',
            phone: `+27${Math.floor(Math.random() * 900000000) + 100000000}`,
            addressLine1: parent.address,
            city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][
              Math.floor(Math.random() * 4)
            ],
            province: ['Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Free State'][
              Math.floor(Math.random() * 4)
            ],
            postalCode: `${Math.floor(Math.random() * 9000) + 1000}`,
            country: 'South Africa',
            dateOfBirth: new Date(
              2024 - (18 - cls.grade.level),
              Math.floor(Math.random() * 12),
              Math.floor(Math.random() * 28) + 1
            ),
            gender: 'Female',
            isActive: true,
          },
        });

        await prisma.student.create({
          data: {
            id: studentUser.id,
            username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${cls.name.toLowerCase()}.${studentIndex + i}`,
            name: firstName,
            surname: lastName,
            email: studentUser.email,
            phone: studentUser.phone,
            address: parent.address,
            bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
              Math.floor(Math.random() * 8)
            ],
            sex: 'FEMALE',
            birthday: studentUser.dateOfBirth,
            gender: 'Female',
            classId: cls.id,
            gradeId: cls.grade.id,
            parentId: parent.id,
          },
        });
      }
    }

    // Final verification
    const finalCounts = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'PARENT' } }),
      prisma.class.count(),
      prisma.user.count({ where: { role: 'STUDENT', gender: 'Male' } }),
      prisma.user.count({ where: { role: 'STUDENT', gender: 'Female' } }),
    ]);

    console.log('\n🎉 EXPANSION COMPLETE!');
    console.log('=======================');
    console.log('📊 Final Counts:');
    console.log(`Students: ${finalCounts[0]} (target: 1,250)`);
    console.log(`  Male: ${finalCounts[4]} (target: 650)`);
    console.log(`  Female: ${finalCounts[5]} (target: 600)`);
    console.log(`Teachers: ${finalCounts[1]} (target: 85)`);
    console.log(`Parents: ${finalCounts[2]} (target: 980)`);
    console.log(`Classes: ${finalCounts[3]} (target: 42)`);
  } catch (error) {
    console.error('❌ Error expanding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

expandToTargetNumbers();
