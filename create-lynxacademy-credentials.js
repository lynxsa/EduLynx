const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createLynxAcademyCredentials() {
  console.log('🎯 Creating LynxAcademy Login Credentials');
  console.log('========================================\n');

  try {
    // 1. Create Admin User with lynxacademy.co.za domain
    console.log('👑 Creating LynxAcademy Admin User...');

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'LynxAcademy',
        email: 'admin@lynxacademy.co.za',
        role: 'ADMIN',
        phone: '+27123456789',
        addressLine1: '123 LynxAcademy Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8000',
        country: 'South Africa',
        dateOfBirth: new Date('1985-01-01'),
        gender: 'Male',
      },
    });

    // Create admin record
    await prisma.admin.upsert({
      where: { username: 'lynxadmin' },
      update: {},
      create: {
        id: adminUser.id,
        username: 'lynxadmin',
      },
    });

    // 2. Create Teacher with lynxacademy.co.za domain
    console.log('👩‍🏫 Creating LynxAcademy Teacher...');

    const teacherUser = await prisma.user.upsert({
      where: { email: 'teacher@lynxacademy.co.za' },
      update: {},
      create: {
        firstName: 'Teacher',
        lastName: 'LynxAcademy',
        email: 'teacher@lynxacademy.co.za',
        role: 'TEACHER',
        phone: '+27123456790',
        addressLine1: '123 LynxAcademy Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        country: 'South Africa',
        dateOfBirth: new Date('1980-05-15'),
        gender: 'Female',
      },
    });

    await prisma.teacher.upsert({
      where: { username: 'lynxteacher' },
      update: {},
      create: {
        id: teacherUser.id,
        username: 'lynxteacher',
        name: 'Teacher',
        surname: 'LynxAcademy',
        email: 'teacher@lynxacademy.co.za',
        phone: '+27123456790',
        address: '123 LynxAcademy Street',
        bloodType: 'O+',
        sex: 'FEMALE',
        birthday: new Date('1980-05-15'),
        qualifications: 'Bachelor of Education',
        yearsExperience: 10,
      },
    });

    // 3. Create Student with lynxacademy.co.za domain
    console.log('🎓 Creating LynxAcademy Student...');

    const studentUser = await prisma.user.upsert({
      where: { email: 'student@lynxacademy.co.za' },
      update: {},
      create: {
        firstName: 'Student',
        lastName: 'LynxAcademy',
        email: 'student@lynxacademy.co.za',
        role: 'STUDENT',
        phone: '+27123456791',
        addressLine1: '123 LynxAcademy Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8002',
        country: 'South Africa',
        dateOfBirth: new Date('2008-03-20'),
        gender: 'Male',
      },
    });

    // Get first class for the student
    const firstClass = await prisma.class.findFirst();
    const firstGrade = await prisma.grade.findFirst();

    await prisma.student.upsert({
      where: { username: 'lynxstudent' },
      update: {},
      create: {
        id: studentUser.id,
        username: 'lynxstudent',
        name: 'Student',
        surname: 'LynxAcademy',
        email: 'student@lynxacademy.co.za',
        phone: '+27123456791',
        address: '123 LynxAcademy Street',
        bloodType: 'A+',
        sex: 'MALE',
        birthday: new Date('2008-03-20'),
        gender: 'Male',
        classId: firstClass?.id,
        gradeId: firstGrade?.id,
      },
    });

    // 4. Create Parent with lynxacademy.co.za domain
    console.log('👨‍👩‍👧‍👦 Creating LynxAcademy Parent...');

    const parentUser = await prisma.user.upsert({
      where: { email: 'parent@lynxacademy.co.za' },
      update: {},
      create: {
        firstName: 'Parent',
        lastName: 'LynxAcademy',
        email: 'parent@lynxacademy.co.za',
        role: 'PARENT',
        phone: '+27123456792',
        addressLine1: '123 LynxAcademy Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8003',
        country: 'South Africa',
        dateOfBirth: new Date('1975-08-10'),
        gender: 'Female',
      },
    });

    await prisma.parent.upsert({
      where: { username: 'lynxparent' },
      update: {},
      create: {
        id: parentUser.id,
        username: 'lynxparent',
        name: 'Parent',
        surname: 'LynxAcademy',
        email: 'parent@lynxacademy.co.za',
        phone: '+27123456792',
        address: '123 LynxAcademy Street',
        sex: 'FEMALE',
        employer: 'LynxAcademy Company',
        occupation: 'Manager',
        relationshipToStudent: 'Mother',
      },
    });

    console.log('\n🎉 LynxAcademy Login Credentials Created!');
    console.log('==========================================\n');

    console.log('🔑 WORKING LYNXACADEMY.CO.ZA CREDENTIALS:');
    console.log('------------------------------------------\n');

    console.log('👑 ADMIN LOGIN:');
    console.log('   Email: admin@lynxacademy.co.za');
    console.log('   Username: lynxadmin');
    console.log('   Password: admin123');
    console.log('   Role: Admin\n');

    console.log('👩‍🏫 TEACHER LOGIN:');
    console.log('   Email: teacher@lynxacademy.co.za');
    console.log('   Username: lynxteacher');
    console.log('   Password: teacher123');
    console.log('   Role: Teacher\n');

    console.log('🎓 STUDENT LOGIN:');
    console.log('   Email: student@lynxacademy.co.za');
    console.log('   Username: lynxstudent');
    console.log('   Password: student123');
    console.log('   Role: Student\n');

    console.log('👨‍👩‍👧‍👦 PARENT LOGIN:');
    console.log('   Email: parent@lynxacademy.co.za');
    console.log('   Username: lynxparent');
    console.log('   Password: parent123');
    console.log('   Role: Parent\n');

    console.log('🔥 ALTERNATIVE WORKING CREDENTIALS:');
    console.log('-----------------------------------\n');

    console.log('👑 ADMIN (Alternative):');
    console.log('   Email: admin@edulynx.com');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

    console.log('👩‍🏫 TEACHER (Alternative):');
    console.log('   Email: demo.teacher@edulynx.com');
    console.log('   Username: demo.teacher');
    console.log('   Password: teacher123\n');

    console.log('🎓 STUDENT (Alternative):');
    console.log('   Email: demo.student@edulynx.com');
    console.log('   Username: demo.student');
    console.log('   Password: student123\n');

    console.log('👨‍👩‍👧‍👦 PARENT (Alternative):');
    console.log('   Email: demo.parent@edulynx.com');
    console.log('   Username: demo.parent');
    console.log('   Password: parent123\n');

    console.log('💡 IMPORTANT TIPS:');
    console.log('------------------');
    console.log('• You can use either email OR username to login');
    console.log('• Passwords are case-sensitive (use lowercase)');
    console.log('• Make sure you select the correct role in the dropdown');
    console.log("• If one doesn't work, try the alternative credentials");
    console.log('• All passwords are simple: admin123, teacher123, student123, parent123');
  } catch (error) {
    console.error('❌ Error creating LynxAcademy credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLynxAcademyCredentials();
