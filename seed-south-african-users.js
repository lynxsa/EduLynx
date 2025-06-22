const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive South African database seeding...');

  try {
    // Create demo school with South African details
    const school = await prisma.school.upsert({
      where: { name: 'Lynx Academy' },
      update: {},
      create: {
        name: 'Lynx Academy',
        address: '45 Nelson Mandela Boulevard',
        city: 'Cape Town',
        province: 'Western Cape',
        country: 'South Africa',
        website: 'https://lynxacademy.co.za',
        principal: 'Dr. Nomsa Mthembu',
        schoolType: 'private',
        motto: 'Ubuntu - Excellence Through Unity',
      },
    });
    console.log('✅ Created/found school:', school.name);

    // Hash passwords for demo users
    const adminPassword = await bcrypt.hash('adminpass', 12);
    const teacherPassword = await bcrypt.hash('teacherpass', 12);
    const parentPassword = await bcrypt.hash('parentpass', 12);
    const studentPassword = await bcrypt.hash('studentpass', 12);

    // Create Admin user - Themba Mashaba
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        password: adminPassword,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        firstName: 'Themba',
        lastName: 'Mashaba',
        preferredName: 'Themba',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        phone: '+27-82-456-7890',
        addressLine1: '123 Vilakazi Street',
        addressLine2: 'Orlando West',
        city: 'Soweto',
        province: 'Gauteng',
        postalCode: '1804',
        country: 'South Africa',
        role: 'ADMIN',
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Created/updated Admin user:', admin.email);

    // Create Teacher user - Naledi Mokoena
    const teacherUser = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {
        password: teacherPassword,
        role: 'TEACHER',
        isActive: true,
      },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'Naledi',
        lastName: 'Mokoena',
        preferredName: 'Ms. Naledi',
        dateOfBirth: new Date('1988-07-22'),
        gender: 'Female',
        phone: '+27-83-123-4567',
        addressLine1: '67 Mandela Avenue',
        addressLine2: 'Hatfield',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0083',
        country: 'South Africa',
        role: 'TEACHER',
        schoolId: school.id,
        isActive: true,
      },
    });

    // Create Teacher profile
    const teacher = await prisma.teacher.upsert({
      where: { id: teacherUser.id },
      update: {
        username: 'naledi.mokoena',
        name: 'Naledi',
        surname: 'Mokoena',
        email: 'teacher1@lynxacademy.co.za',
        phone: '+27-83-123-4567',
        address: '67 Mandela Avenue, Hatfield, Pretoria',
        bloodType: 'O+',
        sex: 'FEMALE',
        gender: 'Female',
        nationality: 'South African',
        idNumber: '8807220234567',
        qualifications: 'BEd Honours in Mathematics Education, University of the Witwatersrand',
        yearsExperience: 8,
        employmentStatus: 'permanent',
        nextOfKinName: 'Thabo Mokoena',
        nextOfKinPhone: '+27-82-987-6543',
        birthday: new Date('1988-07-22'),
        schoolId: school.id,
        userId: teacherUser.id,
      },
      create: {
        id: teacherUser.id,
        username: 'naledi.mokoena',
        name: 'Naledi',
        surname: 'Mokoena',
        email: 'teacher1@lynxacademy.co.za',
        phone: '+27-83-123-4567',
        address: '67 Mandela Avenue, Hatfield, Pretoria',
        bloodType: 'O+',
        sex: 'FEMALE',
        gender: 'Female',
        nationality: 'South African',
        idNumber: '8807220234567',
        qualifications: 'BEd Honours in Mathematics Education, University of the Witwatersrand',
        yearsExperience: 8,
        employmentStatus: 'permanent',
        nextOfKinName: 'Thabo Mokoena',
        nextOfKinPhone: '+27-82-987-6543',
        birthday: new Date('1988-07-22'),
        schoolId: school.id,
        userId: teacherUser.id,
      },
    });
    console.log('✅ Created/updated Teacher user:', teacherUser.email);

    // Create Parent user - Sipho Ndlovu
    const parentUser = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {
        password: parentPassword,
        role: 'PARENT',
        isActive: true,
      },
      create: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPassword,
        firstName: 'Sipho',
        lastName: 'Ndlovu',
        preferredName: 'Mr. Sipho',
        dateOfBirth: new Date('1978-11-10'),
        gender: 'Male',
        phone: '+27-84-789-0123',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'PARENT',
        schoolId: school.id,
        isActive: true,
      },
    });

    // Create Parent profile
    const parent = await prisma.parent.upsert({
      where: { id: parentUser.id },
      update: {
        username: 'sipho.ndlovu',
        name: 'Sipho',
        surname: 'Ndlovu',
        email: 'parent1@lynxacademy.co.za',
        phone: '+27-84-789-0123',
        address: '234 Church Street, Mamelodi, Pretoria',
        sex: 'MALE',
        occupation: 'Civil Engineer',
        employer: 'City of Tshwane Municipality',
        relationshipToStudent: 'Father',
        schoolId: school.id,
        userId: parentUser.id,
      },
      create: {
        id: parentUser.id,
        username: 'sipho.ndlovu',
        name: 'Sipho',
        surname: 'Ndlovu',
        email: 'parent1@lynxacademy.co.za',
        phone: '+27-84-789-0123',
        address: '234 Church Street, Mamelodi, Pretoria',
        sex: 'MALE',
        occupation: 'Civil Engineer',
        employer: 'City of Tshwane Municipality',
        relationshipToStudent: 'Father',
        schoolId: school.id,
        userId: parentUser.id,
      },
    });
    console.log('✅ Created/updated Parent user:', parentUser.email);

    // Create Student user - Amahle Ndlovu
    const studentUser = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {
        password: studentPassword,
        role: 'STUDENT',
        isActive: true,
      },
      create: {
        email: 'student1@lynxacademy.co.za',
        password: studentPassword,
        firstName: 'Amahle',
        lastName: 'Ndlovu',
        preferredName: 'Amahle',
        dateOfBirth: new Date('2010-05-18'),
        gender: 'Female',
        phone: '+27-85-234-5678',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'STUDENT',
        schoolId: school.id,
        isActive: true,
      },
    });

    // Create Student profile
    const student = await prisma.student.upsert({
      where: { id: studentUser.id },
      update: {
        username: 'amahle.ndlovu',
        name: 'Amahle',
        surname: 'Ndlovu',
        email: 'student1@lynxacademy.co.za',
        phone: '+27-85-234-5678',
        address: '234 Church Street, Mamelodi, Pretoria',
        bloodType: 'A+',
        sex: 'FEMALE',
        gender: 'Female',
        homeLanguage: 'IsiZulu',
        allergies: 'None',
        medicalInfo: 'No known medical conditions',
        emergencyContactName: 'Sipho Ndlovu (Father)',
        emergencyContactPhone: '+27-84-789-0123',
        guardianRelationship: 'Father',
        specialNeeds: 'None',
        extracurriculars: 'Debate Club, Mathematics Olympiad, Netball',
        admissionYear: 2023,
        status: 'active',
        birthday: new Date('2010-05-18'),
        parentId: parent.id,
        schoolId: school.id,
        userId: studentUser.id,
      },
      create: {
        id: studentUser.id,
        username: 'amahle.ndlovu',
        name: 'Amahle',
        surname: 'Ndlovu',
        email: 'student1@lynxacademy.co.za',
        phone: '+27-85-234-5678',
        address: '234 Church Street, Mamelodi, Pretoria',
        bloodType: 'A+',
        sex: 'FEMALE',
        gender: 'Female',
        homeLanguage: 'IsiZulu',
        allergies: 'None',
        medicalInfo: 'No known medical conditions',
        emergencyContactName: 'Sipho Ndlovu (Father)',
        emergencyContactPhone: '+27-84-789-0123',
        guardianRelationship: 'Father',
        specialNeeds: 'None',
        extracurriculars: 'Debate Club, Mathematics Olympiad, Netball',
        admissionYear: 2023,
        status: 'active',
        birthday: new Date('2010-05-18'),
        parentId: parent.id,
        schoolId: school.id,
        userId: studentUser.id,
      },
    });
    console.log('✅ Created/updated Student user:', studentUser.email);

    console.log('\n🎉 South African demo users created successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Admin (Themba Mashaba): admin@lynxacademy.co.za / adminpass');
    console.log('Teacher (Naledi Mokoena): teacher1@lynxacademy.co.za / teacherpass');
    console.log('Parent (Sipho Ndlovu): parent1@lynxacademy.co.za / parentpass');
    console.log('Student (Amahle Ndlovu): student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
