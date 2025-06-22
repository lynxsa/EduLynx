const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUsersToSouthAfrican() {
  console.log('🇿🇦 Updating users to South African profiles...');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('adminpass', 12);
    const teacherPassword = await bcrypt.hash('teacherpass', 12);
    const parentPassword = await bcrypt.hash('parentpass', 12);
    const studentPassword = await bcrypt.hash('studentpass', 12);

    // Update Admin user to Themba Mashaba
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        firstName: 'Themba',
        lastName: 'Mashaba',
        preferredName: 'Themba',
        password: adminPassword,
        phone: '+27-82-456-7890',
        addressLine1: '123 Vilakazi Street',
        addressLine2: 'Orlando West',
        city: 'Soweto',
        province: 'Gauteng',
        postalCode: '1804',
        country: 'South Africa',
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email: 'admin@lynxacademy.co.za',
        firstName: 'Themba',
        lastName: 'Mashaba',
        preferredName: 'Themba',
        password: adminPassword,
        phone: '+27-82-456-7890',
        addressLine1: '123 Vilakazi Street',
        addressLine2: 'Orlando West',
        city: 'Soweto',
        province: 'Gauteng',
        postalCode: '1804',
        country: 'South Africa',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Updated Admin:', admin.firstName, admin.lastName);

    // Update Teacher user to Naledi Mokoena
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {
        firstName: 'Naledi',
        lastName: 'Mokoena',
        preferredName: 'Ms. Naledi',
        password: teacherPassword,
        phone: '+27-83-123-4567',
        addressLine1: '67 Mandela Avenue',
        addressLine2: 'Hatfield',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0083',
        country: 'South Africa',
        role: 'TEACHER',
        isActive: true,
      },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        firstName: 'Naledi',
        lastName: 'Mokoena',
        preferredName: 'Ms. Naledi',
        password: teacherPassword,
        phone: '+27-83-123-4567',
        addressLine1: '67 Mandela Avenue',
        addressLine2: 'Hatfield',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0083',
        country: 'South Africa',
        role: 'TEACHER',
        isActive: true,
      },
    });
    console.log('✅ Updated Teacher:', teacher.firstName, teacher.lastName);

    // Update Parent user to Sipho Ndlovu
    const parent = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {
        firstName: 'Sipho',
        lastName: 'Ndlovu',
        preferredName: 'Mr. Sipho',
        password: parentPassword,
        phone: '+27-84-789-0123',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'PARENT',
        isActive: true,
      },
      create: {
        email: 'parent1@lynxacademy.co.za',
        firstName: 'Sipho',
        lastName: 'Ndlovu',
        preferredName: 'Mr. Sipho',
        password: parentPassword,
        phone: '+27-84-789-0123',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'PARENT',
        isActive: true,
      },
    });
    console.log('✅ Updated Parent:', parent.firstName, parent.lastName);

    // Update Student user to Amahle Ndlovu
    const student = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {
        firstName: 'Amahle',
        lastName: 'Ndlovu',
        preferredName: 'Amahle',
        password: studentPassword,
        phone: '+27-85-234-5678',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'STUDENT',
        isActive: true,
      },
      create: {
        email: 'student1@lynxacademy.co.za',
        firstName: 'Amahle',
        lastName: 'Ndlovu',
        preferredName: 'Amahle',
        password: studentPassword,
        phone: '+27-85-234-5678',
        addressLine1: '234 Church Street',
        addressLine2: 'Mamelodi',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0122',
        country: 'South Africa',
        role: 'STUDENT',
        isActive: true,
      },
    });
    console.log('✅ Updated Student:', student.firstName, student.lastName);

    console.log('\n🎉 All users updated with South African information!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Admin (Themba Mashaba): admin@lynxacademy.co.za / adminpass');
    console.log('Teacher (Naledi Mokoena): teacher1@lynxacademy.co.za / teacherpass');
    console.log('Parent (Sipho Ndlovu): parent1@lynxacademy.co.za / parentpass');
    console.log('Student (Amahle Ndlovu): student1@lynxacademy.co.za / studentpass');
  } catch (error) {
    console.error('❌ Error during update:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsersToSouthAfrican();
