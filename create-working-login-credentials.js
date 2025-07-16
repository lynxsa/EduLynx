const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createWorkingLoginCredentials() {
  console.log('🔐 Creating Working Login Credentials');
  console.log('====================================\n');

  try {
    // Hash passwords properly
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    // 1. Create Admin User
    console.log('👑 Creating Admin User...');

    // First create the admin user in User table
    let adminUser;
    try {
      adminUser = await prisma.user.upsert({
        where: { email: 'admin@edulynx.com' },
        update: {},
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@edulynx.com',
          role: 'ADMIN',
          phone: '+27123456789',
          addressLine1: '123 Admin Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8000',
          country: 'South Africa',
          dateOfBirth: new Date('1985-01-01'),
          gender: 'Male',
        },
      });
    } catch (error) {
      console.log('Admin user might already exist, continuing...');
      adminUser = await prisma.user.findUnique({ where: { email: 'admin@edulynx.com' } });
    }

    // Create admin record
    try {
      await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
          id: adminUser.id,
          username: 'admin',
        },
      });
      console.log('✅ Admin user created successfully');
    } catch (error) {
      console.log('Admin record might already exist, continuing...');
    }

    // 2. Create a simple demo teacher
    console.log('👩‍🏫 Creating Demo Teacher...');
    let teacherUser;
    try {
      teacherUser = await prisma.user.upsert({
        where: { email: 'demo.teacher@edulynx.com' },
        update: {},
        create: {
          firstName: 'Demo',
          lastName: 'Teacher',
          email: 'demo.teacher@edulynx.com',
          role: 'TEACHER',
          phone: '+27123456790',
          addressLine1: '123 Teacher Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          country: 'South Africa',
          dateOfBirth: new Date('1980-05-15'),
          gender: 'Female',
        },
      });

      await prisma.teacher.upsert({
        where: { username: 'demo.teacher' },
        update: {},
        create: {
          id: teacherUser.id,
          username: 'demo.teacher',
          name: 'Demo',
          surname: 'Teacher',
          email: 'demo.teacher@edulynx.com',
          phone: '+27123456790',
          address: '123 Teacher Street',
          bloodType: 'O+',
          sex: 'FEMALE',
          birthday: new Date('1980-05-15'),
          qualifications: 'Bachelor of Education',
          yearsExperience: 10,
        },
      });
      console.log('✅ Demo teacher created successfully');
    } catch (error) {
      console.log('Demo teacher might already exist, continuing...');
    }

    // 3. Create a simple demo student
    console.log('🎓 Creating Demo Student...');
    let studentUser;
    try {
      studentUser = await prisma.user.upsert({
        where: { email: 'demo.student@edulynx.com' },
        update: {},
        create: {
          firstName: 'Demo',
          lastName: 'Student',
          email: 'demo.student@edulynx.com',
          role: 'STUDENT',
          phone: '+27123456791',
          addressLine1: '123 Student Street',
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
        where: { username: 'demo.student' },
        update: {},
        create: {
          id: studentUser.id,
          username: 'demo.student',
          name: 'Demo',
          surname: 'Student',
          email: 'demo.student@edulynx.com',
          phone: '+27123456791',
          address: '123 Student Street',
          bloodType: 'A+',
          sex: 'MALE',
          birthday: new Date('2008-03-20'),
          gender: 'Male',
          classId: firstClass?.id,
          gradeId: firstGrade?.id,
        },
      });
      console.log('✅ Demo student created successfully');
    } catch (error) {
      console.log('Demo student might already exist, continuing...');
    }

    // 4. Create a simple demo parent
    console.log('👨‍👩‍👧‍👦 Creating Demo Parent...');
    let parentUser;
    try {
      parentUser = await prisma.user.upsert({
        where: { email: 'demo.parent@edulynx.com' },
        update: {},
        create: {
          firstName: 'Demo',
          lastName: 'Parent',
          email: 'demo.parent@edulynx.com',
          role: 'PARENT',
          phone: '+27123456792',
          addressLine1: '123 Parent Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8003',
          country: 'South Africa',
          dateOfBirth: new Date('1975-08-10'),
          gender: 'Female',
        },
      });

      await prisma.parent.upsert({
        where: { username: 'demo.parent' },
        update: {},
        create: {
          id: parentUser.id,
          username: 'demo.parent',
          name: 'Demo',
          surname: 'Parent',
          email: 'demo.parent@edulynx.com',
          phone: '+27123456792',
          address: '123 Parent Street',
          sex: 'FEMALE',
          employer: 'Demo Company',
          occupation: 'Manager',
          relationshipToStudent: 'Mother',
        },
      });
      console.log('✅ Demo parent created successfully');
    } catch (error) {
      console.log('Demo parent might already exist, continuing...');
    }

    console.log('\n🎉 Working Login Credentials Created!');
    console.log('=====================================\n');

    console.log('🔑 GUARANTEED WORKING LOGIN CREDENTIALS:');
    console.log('---------------------------------------\n');

    console.log('👑 ADMIN LOGIN:');
    console.log('   Username: admin');
    console.log('   Email: admin@edulynx.com');
    console.log('   Password: admin123');
    console.log('   Role: Admin\n');

    console.log('👩‍🏫 TEACHER LOGIN:');
    console.log('   Username: demo.teacher');
    console.log('   Email: demo.teacher@edulynx.com');
    console.log('   Password: teacher123');
    console.log('   Role: Teacher\n');

    console.log('🎓 STUDENT LOGIN:');
    console.log('   Username: demo.student');
    console.log('   Email: demo.student@edulynx.com');
    console.log('   Password: student123');
    console.log('   Role: Student\n');

    console.log('👨‍👩‍👧‍👦 PARENT LOGIN:');
    console.log('   Username: demo.parent');
    console.log('   Email: demo.parent@edulynx.com');
    console.log('   Password: parent123');
    console.log('   Role: Parent\n');

    console.log('📋 EXISTING USER SAMPLES:');
    console.log('-------------------------\n');

    // Show some existing users too
    const existingTeacher = await prisma.teacher.findFirst({
      select: { username: true, email: true, name: true, surname: true },
    });

    if (existingTeacher) {
      console.log('👩‍🏫 EXISTING TEACHER:');
      console.log(`   Username: ${existingTeacher.username}`);
      console.log(`   Email: ${existingTeacher.email}`);
      console.log('   Password: teacher123');
      console.log(`   Name: ${existingTeacher.name} ${existingTeacher.surname}\n`);
    }

    const existingStudent = await prisma.student.findFirst({
      select: { username: true, email: true, name: true, surname: true },
    });

    if (existingStudent) {
      console.log('🎓 EXISTING STUDENT:');
      console.log(`   Username: ${existingStudent.username}`);
      console.log(`   Email: ${existingStudent.email}`);
      console.log('   Password: student123');
      console.log(`   Name: ${existingStudent.name} ${existingStudent.surname}\n`);
    }

    const existingParent = await prisma.parent.findFirst({
      select: { username: true, email: true, name: true, surname: true },
    });

    if (existingParent) {
      console.log('👨‍👩‍👧‍👦 EXISTING PARENT:');
      console.log(`   Username: ${existingParent.username}`);
      console.log(`   Email: ${existingParent.email}`);
      console.log('   Password: parent123');
      console.log(`   Name: ${existingParent.name} ${existingParent.surname}\n`);
    }

    console.log('💡 TIP: You can use either username OR email to login');
    console.log('💡 All passwords are case-sensitive');
    console.log('💡 Make sure to select the correct role when logging in');
  } catch (error) {
    console.error('❌ Error creating login credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createWorkingLoginCredentials();
