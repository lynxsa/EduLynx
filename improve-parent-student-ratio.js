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

// Family size distribution - more realistic
function getRandomFamilySize() {
  const rand = Math.random();
  if (rand < 0.15) return 1; // 15% single child families
  if (rand < 0.45) return 2; // 30% two child families
  if (rand < 0.7) return 3; // 25% three child families
  if (rand < 0.85) return 4; // 15% four child families
  if (rand < 0.95) return 5; // 10% five child families
  return Math.floor(Math.random() * 2) + 6; // 5% large families (6-7 children)
}

async function improveParentStudentRatio() {
  try {
    console.log('🔄 Starting parent-student ratio improvement...');

    // Get current data
    const school = await prisma.school.findFirst();
    const grades = await prisma.grade.findMany();
    const classes = await prisma.class.findMany();
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

    // Group remaining students by surname to create realistic families
    const nonDemoStudents = allStudents.filter(s => s.email !== 'student1@lynxacademy.co.za');
    const studentsBySurname = {};

    nonDemoStudents.forEach(student => {
      if (!studentsBySurname[student.surname]) {
        studentsBySurname[student.surname] = [];
      }
      studentsBySurname[student.surname].push(student);
    });

    console.log(`👨‍👩‍👧‍👦 Creating families from ${Object.keys(studentsBySurname).length} surnames...`);

    const parentPassword = await bcrypt.hash('parent123', 10);
    let parentCount = 0;
    let familyCount = 0;

    // Process each surname group
    for (const [surname, students] of Object.entries(studentsBySurname)) {
      // If there are many students with same surname, split into multiple families
      while (students.length > 0) {
        const familySize = Math.min(getRandomFamilySize(), students.length);
        const familyStudents = students.splice(0, familySize);
        familyCount++;

        // Create family address and location
        const city = getRandomElement(SOUTH_AFRICAN_CITIES);
        const address = generateAddress();
        const fullAddress = `${address}, ${city.city}, ${city.province}`;

        // Determine if single parent or two-parent household (70% two-parent, 30% single)
        const isTwoParentHousehold = Math.random() > 0.3;

        // Create primary parent (always exists)
        const primaryParentGender = Math.random() > 0.6 ? 'MALE' : 'FEMALE'; // Slightly more mothers as primary
        const primaryParentName = getRandomElement(
          SOUTH_AFRICAN_FIRST_NAMES[primaryParentGender.toLowerCase()]
        );
        const primaryParentBirthDate = new Date(
          1975 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        );

        const primaryParentUser = await prisma.user.create({
          data: {
            email: `${primaryParentName.toLowerCase()}.${surname
              .toLowerCase()
              .replace(/\\s+/g, '')}${familyCount}@gmail.com`,
            password: parentPassword,
            firstName: primaryParentName,
            lastName: surname,
            dateOfBirth: primaryParentBirthDate,
            gender: primaryParentGender.toLowerCase(),
            phone: generatePhoneNumber(),
            addressLine1: address,
            city: city.city,
            province: city.province,
            country: 'South Africa',
            role: 'PARENT',
            schoolId: school.id,
          },
        });

        const primaryParent = await prisma.parent.create({
          data: {
            id: primaryParentUser.id,
            username: `${primaryParentName.toLowerCase()}${surname
              .toLowerCase()
              .replace(/\\s+/g, '')}${familyCount}`,
            name: primaryParentName,
            surname: surname,
            email: primaryParentUser.email,
            phone: primaryParentUser.phone,
            address: fullAddress,
            sex: primaryParentGender,
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
            relationshipToStudent: primaryParentGender === 'MALE' ? 'Father' : 'Mother',
            schoolId: school.id,
            userId: primaryParentUser.id,
          },
        });

        parentCount++;

        // Create secondary parent if two-parent household
        let secondaryParent = null;
        if (isTwoParentHousehold) {
          const secondaryParentGender = primaryParentGender === 'MALE' ? 'FEMALE' : 'MALE';
          const secondaryParentName = getRandomElement(
            SOUTH_AFRICAN_FIRST_NAMES[secondaryParentGender.toLowerCase()]
          );
          const secondaryParentBirthDate = new Date(
            1975 + Math.floor(Math.random() * 15),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          );

          const secondaryParentUser = await prisma.user.create({
            data: {
              email: `${secondaryParentName.toLowerCase()}.${surname
                .toLowerCase()
                .replace(/\\s+/g, '')}${familyCount}b@gmail.com`,
              password: parentPassword,
              firstName: secondaryParentName,
              lastName: surname,
              dateOfBirth: secondaryParentBirthDate,
              gender: secondaryParentGender.toLowerCase(),
              phone: generatePhoneNumber(),
              addressLine1: address,
              city: city.city,
              province: city.province,
              country: 'South Africa',
              role: 'PARENT',
              schoolId: school.id,
            },
          });

          secondaryParent = await prisma.parent.create({
            data: {
              id: secondaryParentUser.id,
              username: `${secondaryParentName.toLowerCase()}${surname
                .toLowerCase()
                .replace(/\\s+/g, '')}${familyCount}b`,
              name: secondaryParentName,
              surname: surname,
              email: secondaryParentUser.email,
              phone: secondaryParentUser.phone,
              address: fullAddress,
              sex: secondaryParentGender,
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
              relationshipToStudent: secondaryParentGender === 'MALE' ? 'Father' : 'Mother',
              schoolId: school.id,
              userId: secondaryParentUser.id,
            },
          });

          parentCount++;
        }

        // Assign students to parents
        for (let i = 0; i < familyStudents.length; i++) {
          const student = familyStudents[i];
          // Alternate between parents if two-parent household, or use primary parent
          const assignedParent =
            isTwoParentHousehold && i % 2 === 1 && secondaryParent
              ? secondaryParent
              : primaryParent;

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

        console.log(
          `👨‍👩‍👧‍👦 Family ${familyCount}: ${familySize} children (${surname}) - ${
            isTwoParentHousehold ? 'Two' : 'Single'
          } parent household`
        );
      }
    }

    // Final statistics
    const finalParentCount = await prisma.parent.count();
    const finalStudentCount = await prisma.student.count();
    const studentsWithParents = await prisma.student.count({
      where: { parentId: { not: null } },
    });

    console.log('\\n📈 Final Results:');
    console.log(`👨‍👩‍👧‍👦 Total families created: ${familyCount}`);
    console.log(`👨‍👩 Total parents: ${finalParentCount}`);
    console.log(`👧👦 Total students: ${finalStudentCount}`);
    console.log(`🔗 Students with parents: ${studentsWithParents}`);
    console.log(
      `📊 Average students per parent: ${(finalStudentCount / finalParentCount).toFixed(2)}`
    );
    console.log(
      `✅ Relational integrity: ${((studentsWithParents / finalStudentCount) * 100).toFixed(1)}%`
    );
  } catch (error) {
    console.error('❌ Error improving parent-student ratio:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveParentStudentRatio();
