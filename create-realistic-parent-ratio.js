const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// South African data arrays (reusing from seed-comprehensive.ts)
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

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhoneNumber() {
  const prefixes = ['082', '083', '084', '072', '073', '074', '076', '078', '079'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  return `+27 ${prefix} ${number.toString().slice(0, 3)} ${number.toString().slice(3)}`;
}

function generateAddress() {
  const streetNumbers = Math.floor(Math.random() * 999) + 1;
  const streetNames = [
    'Main Road',
    'Church Street',
    'High Street',
    'Park Avenue',
    'Oak Street',
    'Elm Street',
    'Maple Avenue',
    'Cedar Road',
  ];
  return `${streetNumbers} ${getRandomElement(streetNames)}`;
}

async function createRealisticParentRatio() {
  try {
    console.log('🔄 Creating realistic parent-student ratio...');

    // Get current data
    const school = await prisma.school.findFirst();
    const allStudents = await prisma.student.findMany({
      orderBy: { createdAt: 'asc' },
    });

    console.log(`📊 Current state: ${allStudents.length} students`);

    // Clear existing parent relationships
    console.log('🗑️ Clearing existing parent relationships...');
    await prisma.student.updateMany({
      data: { parentId: null },
    });

    // Delete all existing parents except the specific demo parent
    await prisma.parent.deleteMany({
      where: {
        NOT: {
          email: 'parent1@lynxacademy.co.za',
        },
      },
    });

    // Keep the demo parent and demo student relationship
    const demoParent = await prisma.parent.findUnique({
      where: { email: 'parent1@lynxacademy.co.za' },
    });
    const demoStudent = await prisma.student.findUnique({
      where: { email: 'student1@lynxacademy.co.za' },
    });

    if (demoParent && demoStudent) {
      await prisma.student.update({
        where: { id: demoStudent.id },
        data: { parentId: demoParent.id },
      });
      console.log('✅ Demo parent-student relationship preserved');
    }

    // Get non-demo students
    const nonDemoStudents = allStudents.filter(s => s.email !== 'student1@lynxacademy.co.za');
    console.log(`👨‍👩‍👧‍👦 Creating families for ${nonDemoStudents.length} students...`);

    const parentPassword = await bcrypt.hash('parent123', 10);
    const createdParents = [];
    let currentStudentIndex = 0;
    let familyCount = 0;

    // Create families with realistic distribution
    while (currentStudentIndex < nonDemoStudents.length) {
      familyCount++;

      // Determine family size (1-4 children, with occasional larger families)
      const remainingStudents = nonDemoStudents.length - currentStudentIndex;
      let familySize;
      const rand = Math.random();

      if (rand < 0.25)
        familySize = 1; // 25% single child
      else if (rand < 0.55)
        familySize = 2; // 30% two children
      else if (rand < 0.8)
        familySize = 3; // 25% three children
      else if (rand < 0.95)
        familySize = 4; // 15% four children
      else familySize = Math.min(5, remainingStudents); // 5% large families

      familySize = Math.min(familySize, remainingStudents);
      const familyStudents = nonDemoStudents.slice(
        currentStudentIndex,
        currentStudentIndex + familySize
      );

      // Use the first student's surname for the family
      const familySurname = familyStudents[0].surname;

      // Create family address and location
      const city = getRandomElement(SOUTH_AFRICAN_CITIES);
      const address = generateAddress();
      const fullAddress = `${address}, ${city.city}, ${city.province}`;

      // Determine number of parents (1 or 2)
      // Single child: 50% single parent
      // Multiple children: 25% single parent, 75% two parents
      const isTwoParentFamily = familySize === 1 ? Math.random() > 0.5 : Math.random() > 0.25;
      const numParents = isTwoParentFamily ? 2 : 1;

      // Create parents for this family
      const familyParents = [];

      for (let parentNum = 0; parentNum < numParents; parentNum++) {
        const isSecondParent = parentNum === 1;
        const parentGender = isSecondParent
          ? familyParents[0].sex === 'MALE'
            ? 'FEMALE'
            : 'MALE' // Opposite gender for second parent
          : Math.random() > 0.6
            ? 'MALE'
            : 'FEMALE'; // Slightly more mothers as primary

        const parentName = getRandomElement(SOUTH_AFRICAN_FIRST_NAMES[parentGender.toLowerCase()]);
        const parentBirthDate = new Date(
          1975 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );

        const uniqueId = `${familyCount}${parentNum}${Date.now()}`;

        const parentUser = await prisma.user.create({
          data: {
            email: `${parentName.toLowerCase()}.${familySurname
              .toLowerCase()
              .replace(/\\s+/g, '')}.${uniqueId}@gmail.com`,
            password: parentPassword,
            firstName: parentName,
            lastName: familySurname,
            dateOfBirth: parentBirthDate,
            gender: parentGender.toLowerCase(),
            phone: generatePhoneNumber(),
            addressLine1: address,
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
            username: `${parentName.toLowerCase()}${familySurname
              .toLowerCase()
              .replace(/\\s+/g, '')}.${uniqueId}`,
            name: parentName,
            surname: familySurname,
            email: parentUser.email,
            phone: parentUser.phone,
            address: fullAddress,
            sex: parentGender,
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
                : null,
            relationshipToStudent: parentGender === 'MALE' ? 'Father' : 'Mother',
            schoolId: school.id,
            userId: parentUser.id,
          },
        });

        familyParents.push(parent);
        createdParents.push(parent);
      }

      // Assign students to parents in this family
      // For single parent: all children go to that parent
      // For two parents: alternate children between parents, but ensure both get at least one
      for (let i = 0; i < familyStudents.length; i++) {
        const student = familyStudents[i];
        let assignedParent;

        if (familyParents.length === 1) {
          assignedParent = familyParents[0];
        } else {
          // For two parents: first child to parent 0, second to parent 1, then alternate
          assignedParent = familyParents[i % 2];
        }

        await prisma.student.update({
          where: { id: student.id },
          data: {
            parentId: assignedParent.id,
            address: fullAddress,
            emergencyContactName: `${assignedParent.name} ${assignedParent.surname}`,
            emergencyContactPhone: assignedParent.phone,
            guardianRelationship: assignedParent.relationshipToStudent,
          },
        });
      }

      const parentType = familyParents.length === 1 ? 'Single' : 'Two';
      console.log(
        `👨‍👩‍👧‍👦 Family ${familyCount}: ${familySize} children (${familySurname}) - ${parentType} parent household`
      );

      currentStudentIndex += familySize;
    }

    // Final statistics
    const finalParentCount = await prisma.parent.count();
    const finalStudentCount = await prisma.student.count();
    const studentsWithParents = await prisma.student.count({
      where: { parentId: { not: null } },
    });

    // Check distribution
    const parentsWithStudents = await prisma.parent.findMany({
      include: {
        students: true,
      },
    });

    const distribution = {};
    parentsWithStudents.forEach(parent => {
      const studentCount = parent.students.length;
      distribution[studentCount] = (distribution[studentCount] || 0) + 1;
    });

    console.log('\\n📈 Final Results:');
    console.log(`👨‍👩‍👧‍👦 Total families created: ${familyCount}`);
    console.log(`👨‍👩 Total parents: ${finalParentCount}`);
    console.log(`👧👦 Total students: ${finalStudentCount}`);
    console.log(`🔗 Students with parents: ${studentsWithParents}`);
    console.log(
      `📊 Average students per parent: ${(studentsWithParents / finalParentCount).toFixed(2)}`
    );
    console.log(
      `✅ Relational integrity: ${((studentsWithParents / finalStudentCount) * 100).toFixed(1)}%`
    );

    console.log('\\n📊 Parent-Student Distribution:');
    Object.entries(distribution).forEach(([studentCount, parentCount]) => {
      console.log(`👨‍👩 Parents with ${studentCount} students: ${parentCount}`);
    });
  } catch (error) {
    console.error('❌ Error creating realistic parent ratio:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRealisticParentRatio();
