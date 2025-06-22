import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUsers() {
  console.log('🌱 Creating demo users with specific credentials...');

  try {
    // Hash passwords
    const adminHash = await bcrypt.hash('adminpass', 12);
    const teacherHash = await bcrypt.hash('teacherpass', 12);
    const parentHash = await bcrypt.hash('parentpass', 12);
    const studentHash = await bcrypt.hash('studentpass', 12);

    // Get existing school
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('No school found. Please run the comprehensive seed first.');
    }

    // Create or update Admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        firstName: 'Admin',
        lastName: 'User',
        password: adminHash,
        role: 'ADMIN',
      },
      create: {
        email: 'admin@lynxacademy.co.za',
        firstName: 'Admin',
        lastName: 'User',
        password: adminHash,
        role: 'ADMIN',
        schoolId: school.id,
      },
    });
    console.log('✅ Admin user created/updated:', adminUser.email);

    // Create or update Teacher user
    const teacherUser = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {
        firstName: 'John',
        lastName: 'Smith',
        password: teacherHash,
        role: 'TEACHER',
      },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        firstName: 'John',
        lastName: 'Smith',
        password: teacherHash,
        role: 'TEACHER',
        schoolId: school.id,
        phone: '+27111234567',
        addressLine1: '123 Teacher Street',
        city: 'Johannesburg',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
      },
    });

    // Check if teacher profile exists, create if not
    const existingTeacher = await prisma.teacher.findUnique({
      where: { userId: teacherUser.id },
    });

    if (!existingTeacher) {
      await prisma.teacher.create({
        data: {
          id: `TCH_${teacherUser.id}`,
          username: `teacher_${teacherUser.email.split('@')[0]}`,
          name: 'John',
          surname: 'Smith',
          email: 'teacher1@lynxacademy.co.za',
          phone: '+27111234567',
          address: '123 Teacher Street, Johannesburg',
          bloodType: 'O+',
          sex: 'MALE',
          birthday: new Date('1985-03-15'),
          schoolId: school.id,
          userId: teacherUser.id,
        },
      });
    }
    console.log('✅ Teacher user created/updated:', teacherUser.email);

    // Create or update Parent user
    const parentUser = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        password: parentHash,
        role: 'PARENT',
      },
      create: {
        email: 'parent1@lynxacademy.co.za',
        firstName: 'Sarah',
        lastName: 'Johnson',
        password: parentHash,
        role: 'PARENT',
        schoolId: school.id,
        phone: '+27112345678',
        addressLine1: '456 Parent Avenue',
        city: 'Cape Town',
        dateOfBirth: new Date('1980-06-20'),
        gender: 'Female',
      },
    });

    // Check if parent profile exists, create if not
    const existingParent = await prisma.parent.findUnique({
      where: { userId: parentUser.id },
    });

    if (!existingParent) {
      await prisma.parent.create({
        data: {
          id: `PAR_${parentUser.id}`,
          username: `parent_${parentUser.email.split('@')[0]}`,
          name: 'Sarah',
          surname: 'Johnson',
          email: 'parent1@lynxacademy.co.za',
          phone: '+27112345678',
          address: '456 Parent Avenue, Cape Town',
          sex: 'FEMALE',
          occupation: 'Software Engineer',
          schoolId: school.id,
          userId: parentUser.id,
        },
      });
    }
    console.log('✅ Parent user created/updated:', parentUser.email);

    // Get a class for the student
    const studentClass = await prisma.class.findFirst({
      include: { grade: true },
    });
    if (!studentClass) {
      throw new Error('No class found for student assignment');
    }

    // Create or update Student user
    const studentUser = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {
        firstName: 'Michael',
        lastName: 'Williams',
        password: studentHash,
        role: 'STUDENT',
      },
      create: {
        email: 'student1@lynxacademy.co.za',
        firstName: 'Michael',
        lastName: 'Williams',
        password: studentHash,
        role: 'STUDENT',
        schoolId: school.id,
        phone: '+27113456789',
        addressLine1: '789 Student Road',
        city: 'Durban',
        dateOfBirth: new Date('2008-09-20'),
        gender: 'Male',
      },
    });

    // Check if student profile exists, create if not
    const existingStudent = await prisma.student.findUnique({
      where: { userId: studentUser.id },
    });

    if (!existingStudent) {
      await prisma.student.create({
        data: {
          id: `STU_${studentUser.id}`,
          username: `student_${studentUser.email.split('@')[0]}`,
          name: 'Michael',
          surname: 'Williams',
          email: 'student1@lynxacademy.co.za',
          phone: '+27113456789',
          address: '789 Student Road, Durban',
          bloodType: 'O+',
          sex: 'MALE',
          gender: 'Male',
          birthday: new Date('2008-09-20'),
          classId: studentClass.id,
          gradeId: studentClass.gradeId,
          schoolId: school.id,
          userId: studentUser.id,
        },
      });
    }
    console.log('✅ Student user created/updated:', studentUser.email);

    console.log('\n🎉 Demo users created successfully!');
    console.log('Login credentials:');
    console.log('• Admin: admin@lynxacademy.co.za / adminpass');
    console.log('• Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('• Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('• Student: student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createDemoUsers().catch(error => {
  console.error('Failed to create demo users:', error);
  process.exit(1);
});
