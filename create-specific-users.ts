import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSpecificUsers() {
  console.log('🌱 Creating specific users for testing...');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('adminpass', 10);
    const teacherPassword = await bcrypt.hash('teacherpass', 10);
    const parentPassword = await bcrypt.hash('parentpass', 10);
    const studentPassword = await bcrypt.hash('studentpass', 10);

    // Get the school
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('No school found. Please run the comprehensive seed first.');
    }

    // Create Admin User
    console.log('Creating admin user...');

    // First, delete existing admin if it exists
    await prisma.admin.deleteMany({ where: { username: 'admin' } });
    await prisma.user.deleteMany({ where: { email: 'admin@lynxacademy.co.za' } });

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        schoolId: school.id,
        city: school.city,
        province: school.province,
        country: 'South Africa',
      },
    });

    await prisma.admin.create({
      data: {
        id: adminUser.id,
        username: 'admin',
      },
    });

    // Create Teacher User
    console.log('Creating teacher user...');

    // Delete existing teacher if it exists
    await prisma.teacher.deleteMany({ where: { username: 'teacher1' } });
    await prisma.user.deleteMany({ where: { email: 'teacher1@lynxacademy.co.za' } });

    const teacherUser = await prisma.user.create({
      data: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: new Date(1985, 5, 15),
        gender: 'female',
        phone: '0821234567',
        addressLine1: '123 Teacher Street',
        city: school.city,
        province: school.province,
        country: 'South Africa',
        role: 'TEACHER',
        schoolId: school.id,
      },
    });

    await prisma.teacher.create({
      data: {
        id: teacherUser.id,
        username: 'teacher1',
        name: 'Sarah',
        surname: 'Johnson',
        email: teacherUser.email,
        phone: teacherUser.phone!,
        address: `${teacherUser.addressLine1}, ${teacherUser.city}, ${teacherUser.province}`,
        bloodType: 'O+',
        sex: 'FEMALE',
        gender: 'female',
        nationality: 'South African',
        idNumber: '8506151234567',
        qualifications: 'B.Ed Mathematics',
        yearsExperience: 8,
        employmentStatus: 'Permanent',
        nextOfKinName: 'John Johnson',
        nextOfKinPhone: '0827654321',
        birthday: teacherUser.dateOfBirth!,
        schoolId: school.id,
        userId: teacherUser.id,
      },
    });

    // Create Parent User
    console.log('Creating parent user...');

    // Delete existing parent if it exists
    await prisma.parent.deleteMany({ where: { username: 'parent1' } });
    await prisma.user.deleteMany({ where: { email: 'parent1@lynxacademy.co.za' } });

    const parentUser = await prisma.user.create({
      data: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPassword,
        firstName: 'Michael',
        lastName: 'Williams',
        dateOfBirth: new Date(1980, 3, 10),
        gender: 'male',
        phone: '0831234567',
        addressLine1: '456 Parent Avenue',
        city: school.city,
        province: school.province,
        country: 'South Africa',
        role: 'PARENT',
        schoolId: school.id,
      },
    });

    await prisma.parent.create({
      data: {
        id: parentUser.id,
        username: 'parent1',
        name: 'Michael',
        surname: 'Williams',
        email: parentUser.email,
        phone: parentUser.phone!,
        address: `${parentUser.addressLine1}, ${parentUser.city}, ${parentUser.province}`,
        sex: 'MALE',
        occupation: 'Engineer',
        employer: 'Tech Company',
        relationshipToStudent: 'Father',
        schoolId: school.id,
        userId: parentUser.id,
      },
    });

    // Create Student User
    console.log('Creating student user...');

    // Delete existing student if it exists
    await prisma.student.deleteMany({ where: { username: 'student1' } });
    await prisma.user.deleteMany({ where: { email: 'student1@lynxacademy.co.za' } });

    const studentUser = await prisma.user.create({
      data: {
        email: 'student1@lynxacademy.co.za',
        password: studentPassword,
        firstName: 'Emma',
        lastName: 'Williams',
        dateOfBirth: new Date(2008, 8, 20),
        gender: 'female',
        phone: '0841234567',
        addressLine1: '456 Parent Avenue',
        city: school.city,
        province: school.province,
        country: 'South Africa',
        role: 'STUDENT',
        schoolId: school.id,
      },
    });

    // Get a grade and class for the student
    const grade = await prisma.grade.findFirst({ where: { level: 10 } });
    const class_ = await prisma.class.findFirst({ where: { gradeId: grade?.id } });

    await prisma.student.create({
      data: {
        id: studentUser.id,
        username: 'student1',
        name: 'Emma',
        surname: 'Williams',
        email: studentUser.email,
        phone: studentUser.phone!,
        address: `${studentUser.addressLine1}, ${studentUser.city}, ${studentUser.province}`,
        bloodType: 'A+',
        sex: 'FEMALE',
        gender: 'female',
        homeLanguage: 'English',
        emergencyContactName: 'Michael Williams',
        emergencyContactPhone: parentUser.phone!,
        guardianRelationship: 'Father',
        admissionYear: 2024,
        status: 'active',
        birthday: studentUser.dateOfBirth!,
        parentId: parentUser.id,
        classId: class_?.id,
        gradeId: grade?.id,
        schoolId: school.id,
        userId: studentUser.id,
      },
    });

    console.log('✅ All specific users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@lynxacademy.co.za / adminpass');
    console.log('Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('Student: student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createSpecificUsers();
