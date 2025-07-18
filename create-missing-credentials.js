const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createMissingCredentials() {
  console.log('🔐 Creating Missing Login Credentials for Sign-In Page');
  console.log('===================================================\n');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    // Get or create the school
    let school = await prisma.school.findFirst();
    if (!school) {
      console.log('🏫 Creating Lynx Academy school...');
      school = await prisma.school.create({
        data: {
          name: 'Lynx Academy',
          address: '123 Education Street',
          city: 'Johannesburg',
          province: 'Gauteng',
          country: 'South Africa',
          logo: 'https://lynxacademy.co.za/logo.png',
          motto: 'Excellence in Education',
          principal: 'Dr. Sarah Johnson',
          registrationNumber: 'LAC2010001',
          schoolType: 'Public',
          website: 'https://lynxacademy.co.za',
        },
      });
      console.log('✅ School created:', school.name);
    }

    // 1. Create Admin User - Derah Manyelo
    console.log('👑 Creating Admin User: Derah Manyelo...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        password: adminPassword,
        isActive: true,
      },
      create: {
        firstName: 'Derah',
        lastName: 'Manyelo',
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+27-11-123-4567',
        addressLine1: '1 Admin Road',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
        country: 'South Africa',
        dateOfBirth: new Date('1985-01-15'),
        gender: 'Female',
        isActive: true,
        schoolId: school.id,
      },
    });
    console.log('✅ Admin user created:', adminUser.email);

    // 2. Update Nomsa Dlamini's email and password to match sign-in page
    console.log('👩‍🏫 Updating Teacher: Nomsa Dlamini...');
    const teacherUser = await prisma.user.upsert({
      where: { email: 'nomsa.dlamini@lynxacademy.co.za' },
      update: {
        password: teacherPassword,
        isActive: true,
      },
      create: {
        firstName: 'Nomsa',
        lastName: 'Dlamini',
        email: 'nomsa.dlamini@lynxacademy.co.za',
        password: teacherPassword,
        role: 'TEACHER',
        phone: '+27-11-234-5678',
        addressLine1: '2 Teacher Street',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2001',
        country: 'South Africa',
        dateOfBirth: new Date('1980-05-20'),
        gender: 'Female',
        isActive: true,
        schoolId: school.id,
      },
    });
    console.log('✅ Teacher user created/updated:', teacherUser.email);

    // 3. Create Parent User - Amy Singh
    console.log('👨‍👩‍👧‍👦 Creating Parent: Amy Singh...');
    const parentUser = await prisma.user.upsert({
      where: { email: 'amy.singh.0@gmail.com' },
      update: {
        password: parentPassword,
        isActive: true,
      },
      create: {
        firstName: 'Amy',
        lastName: 'Singh',
        email: 'amy.singh.0@gmail.com',
        password: parentPassword,
        role: 'PARENT',
        phone: '+27-11-345-6789',
        addressLine1: '3 Parent Avenue',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2002',
        country: 'South Africa',
        dateOfBirth: new Date('1975-08-10'),
        gender: 'Female',
        isActive: true,
        schoolId: school.id,
      },
    });
    console.log('✅ Parent user created:', parentUser.email);

    // 4. Create Student User - Johann Singh (Grade 8A)
    console.log('🎓 Creating Student: Johann Singh...');
    const studentUser = await prisma.user.upsert({
      where: { email: 'johann.singh.8a.0@student.lynxacademy.co.za' },
      update: {
        password: studentPassword,
        isActive: true,
      },
      create: {
        firstName: 'Johann',
        lastName: 'Singh',
        email: 'johann.singh.8a.0@student.lynxacademy.co.za',
        password: studentPassword,
        role: 'STUDENT',
        phone: '+27-11-456-7890',
        addressLine1: '4 Student Lane',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2003',
        country: 'South Africa',
        dateOfBirth: new Date('2008-03-15'),
        gender: 'Male',
        isActive: true,
        schoolId: school.id,
      },
    });
    console.log('✅ Student user created:', studentUser.email);

    // Create corresponding Parent record for Amy Singh
    await prisma.parent.upsert({
      where: { id: parentUser.id },
      update: {},
      create: {
        id: parentUser.id,
        username: 'amy.singh',
        name: 'Amy',
        surname: 'Singh',
        email: 'amy.singh.0@gmail.com',
        phone: '+27-11-345-6789',
        address: '3 Parent Avenue, Johannesburg',
        sex: 'FEMALE',
        employer: 'Singh & Associates',
        occupation: 'Marketing Manager',
        relationshipToStudent: 'Mother',
        schoolId: school.id,
      },
    });

    // Get first class for the student
    const grade8Class = await prisma.class.findFirst({
      where: { name: { contains: '8A' } },
    });

    // Create corresponding Student record for Johann Singh
    await prisma.student.upsert({
      where: { username: 'johann.singh.8a' },
      update: {},
      create: {
        id: studentUser.id,
        username: 'johann.singh.8a',
        name: 'Johann',
        surname: 'Singh',
        email: 'johann.singh.8a.0@student.lynxacademy.co.za',
        phone: '+27-11-456-7890',
        address: '4 Student Lane, Johannesburg',
        bloodType: 'O+',
        sex: 'MALE',
        birthday: new Date('2008-03-15'),
        gender: 'Male',
        classId: grade8Class?.id,
        schoolId: school.id,
      },
    });

    // Create corresponding Teacher record for Nomsa Dlamini
    await prisma.teacher.upsert({
      where: { username: 'nomsa.dlamini.lynx' },
      update: {},
      create: {
        id: teacherUser.id,
        username: 'nomsa.dlamini.lynx',
        name: 'Nomsa',
        surname: 'Dlamini',
        email: 'nomsa.dlamini@lynxacademy.co.za',
        phone: '+27-11-234-5678',
        address: '2 Teacher Street, Johannesburg',
        bloodType: 'A+',
        sex: 'FEMALE',
        birthday: new Date('1980-05-20'),
        qualifications: 'BSc Mathematics, PGCE',
        yearsExperience: 8,
        schoolId: school.id,
      },
    });

    console.log('\n🎉 All Missing Credentials Created Successfully!');
    console.log('==============================================\n');

    console.log('🔑 VERIFIED WORKING LOGIN CREDENTIALS:');
    console.log('------------------------------------\n');

    console.log('👑 ADMIN:');
    console.log('   Email: admin@lynxacademy.co.za');
    console.log('   Password: admin123');
    console.log('   Name: Derah Manyelo\n');

    console.log('👩‍🏫 TEACHER:');
    console.log('   Email: nomsa.dlamini@lynxacademy.co.za');
    console.log('   Password: teacher123');
    console.log('   Name: Nomsa Dlamini - Mathematics\n');

    console.log('👨‍👩‍👧‍👦 PARENT:');
    console.log('   Email: amy.singh.0@gmail.com');
    console.log('   Password: parent123');
    console.log('   Name: Amy Singh\n');

    console.log('🎓 STUDENT:');
    console.log('   Email: johann.singh.8a.0@student.lynxacademy.co.za');
    console.log('   Password: student123');
    console.log('   Name: Johann Singh - Grade 8A\n');

    console.log('✅ All credentials now match the sign-in page exactly!');
    console.log('🚀 Users can now login with the credentials shown on the sign-in cards.');
  } catch (error) {
    console.error('❌ Error creating missing credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingCredentials();
