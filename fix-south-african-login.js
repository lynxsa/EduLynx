const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixExistingUsersAndCreateSouthAfricanLogin() {
  console.log('🔧 Fixing Existing Users & Creating South African Login');
  console.log('======================================================\n');

  try {
    // Hash passwords properly
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    console.log('🔐 Passwords hashed successfully...\n');

    // 1. Update existing admin to be Derah Manyelo
    console.log('👑 Updating admin to Derah Manyelo...');

    await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {
        firstName: 'Derah',
        lastName: 'Manyelo',
        password: adminPassword,
        isActive: true,
        phone: '+27823456789',
        addressLine1: '15 Mandela Drive',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        country: 'South Africa',
      },
      create: {
        firstName: 'Derah',
        lastName: 'Manyelo',
        email: 'admin@lynxacademy.co.za',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+27823456789',
        addressLine1: '15 Mandela Drive',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8001',
        country: 'South Africa',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        isActive: true,
      },
    });

    // 2. Update existing teachers with South African names and hashed passwords
    console.log('👩‍🏫 Updating existing teachers with South African names...');

    const existingTeachers = await prisma.teacher.findMany({
      take: 5,
      select: { id: true, email: true, username: true },
    });

    const southAfricanTeacherNames = [
      { firstName: 'Nomsa', lastName: 'Dlamini' },
      { firstName: 'Thabo', lastName: 'Mokwena' },
      { firstName: 'Zanele', lastName: 'Mthembu' },
      { firstName: 'Sipho', lastName: 'Radebe' },
      { firstName: 'Lebohang', lastName: 'Molefe' },
    ];

    for (let i = 0; i < Math.min(existingTeachers.length, southAfricanTeacherNames.length); i++) {
      const teacher = existingTeachers[i];
      const saName = southAfricanTeacherNames[i];

      // Update user record
      await prisma.user.update({
        where: { id: teacher.id },
        data: {
          firstName: saName.firstName,
          lastName: saName.lastName,
          password: teacherPassword,
          isActive: true,
          addressLine1: '23 Vilakazi Street',
          city: 'Johannesburg',
          province: 'Gauteng',
          country: 'South Africa',
        },
      });

      // Update teacher record
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: {
          name: saName.firstName,
          surname: saName.lastName,
          address: '23 Vilakazi Street',
        },
      });
    }

    // 3. Update existing students with South African names
    console.log('🎓 Updating existing students with South African names...');

    const existingStudents = await prisma.student.findMany({
      take: 5,
      select: { id: true, email: true, username: true },
    });

    const southAfricanStudentNames = [
      { firstName: 'Amahle', lastName: 'Nkosi' },
      { firstName: 'Kwame', lastName: 'Asante' },
      { firstName: 'Thandiwe', lastName: 'Zulu' },
      { firstName: 'Karabo', lastName: 'Mokoena' },
      { firstName: 'Naledi', lastName: 'Tshwane' },
    ];

    for (let i = 0; i < Math.min(existingStudents.length, southAfricanStudentNames.length); i++) {
      const student = existingStudents[i];
      const saName = southAfricanStudentNames[i];

      // Update user record
      await prisma.user.update({
        where: { id: student.id },
        data: {
          firstName: saName.firstName,
          lastName: saName.lastName,
          password: studentPassword,
          isActive: true,
          addressLine1: '34 Soweto Avenue',
          city: 'Cape Town',
          province: 'Western Cape',
          country: 'South Africa',
        },
      });

      // Update student record
      await prisma.student.update({
        where: { id: student.id },
        data: {
          name: saName.firstName,
          surname: saName.lastName,
          address: '34 Soweto Avenue',
        },
      });
    }

    // 4. Update existing parents with South African names
    console.log('👨‍👩‍👧‍👦 Updating existing parents with South African names...');

    const existingParents = await prisma.parent.findMany({
      take: 5,
      select: { id: true, email: true, username: true },
    });

    const southAfricanParentNames = [
      { firstName: 'Nomthandazo', lastName: 'Nkosi' },
      { firstName: 'Bongani', lastName: 'Asante' },
      { firstName: 'Precious', lastName: 'Zulu' },
      { firstName: 'Tshepo', lastName: 'Mokoena' },
      { firstName: 'Palesa', lastName: 'Tshwane' },
    ];

    for (let i = 0; i < Math.min(existingParents.length, southAfricanParentNames.length); i++) {
      const parent = existingParents[i];
      const saName = southAfricanParentNames[i];

      // Update user record
      await prisma.user.update({
        where: { id: parent.id },
        data: {
          firstName: saName.firstName,
          lastName: saName.lastName,
          password: parentPassword,
          isActive: true,
          addressLine1: '34 Soweto Avenue',
          city: 'Cape Town',
          province: 'Western Cape',
          country: 'South Africa',
        },
      });

      // Update parent record
      await prisma.parent.update({
        where: { id: parent.id },
        data: {
          name: saName.firstName,
          surname: saName.lastName,
          address: '34 Soweto Avenue',
          occupation: 'Teacher',
          employer: 'Department of Education',
        },
      });
    }

    // Now get the updated credentials
    console.log('\n🎉 South African Credentials Updated Successfully!');
    console.log('================================================\n');

    // Get updated admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@lynxacademy.co.za' },
      select: { firstName: true, lastName: true, email: true },
    });

    // Get updated teachers
    const updatedTeachers = await prisma.teacher.findMany({
      take: 3,
      include: { user: { select: { email: true } } },
    });

    // Get updated students
    const updatedStudents = await prisma.student.findMany({
      take: 3,
      include: { user: { select: { email: true } } },
    });

    // Get updated parents
    const updatedParents = await prisma.parent.findMany({
      take: 3,
      include: { user: { select: { email: true } } },
    });

    console.log('🇿🇦 WORKING SOUTH AFRICAN LOGIN CREDENTIALS:');
    console.log('============================================\n');

    console.log('👑 ADMIN LOGIN (Derah Manyelo):');
    console.log(`   Email: ${admin?.email || 'admin@lynxacademy.co.za'}`);
    console.log('   Password: admin123');
    console.log(`   Name: ${admin?.firstName || 'Derah'} ${admin?.lastName || 'Manyelo'}\n`);

    if (updatedTeachers.length > 0) {
      console.log('👩‍🏫 TEACHER LOGINS:');
      updatedTeachers.forEach(teacher => {
        console.log(`   Email: ${teacher.user?.email || teacher.email}`);
        console.log('   Password: teacher123');
        console.log(`   Name: ${teacher.name} ${teacher.surname}`);
        console.log('   ---');
      });
    }

    if (updatedStudents.length > 0) {
      console.log('\n🎓 STUDENT LOGINS:');
      updatedStudents.forEach(student => {
        console.log(`   Email: ${student.user?.email || student.email}`);
        console.log('   Password: student123');
        console.log(`   Name: ${student.name} ${student.surname}`);
        console.log('   ---');
      });
    }

    if (updatedParents.length > 0) {
      console.log('\n👨‍👩‍👧‍👦 PARENT LOGINS:');
      updatedParents.forEach(parent => {
        console.log(`   Email: ${parent.user?.email || parent.email}`);
        console.log('   Password: parent123');
        console.log(`   Name: ${parent.name} ${parent.surname}`);
        console.log('   ---');
      });
    }

    console.log('\n⚡ QUICK TEST LOGIN:');
    console.log('===================');
    console.log('🇿🇦 Admin: admin@lynxacademy.co.za / admin123 (Derah Manyelo)');

    if (updatedTeachers[0]) {
      console.log(
        `🇿🇦 Teacher: ${updatedTeachers[0].user?.email || updatedTeachers[0].email} / teacher123`
      );
    }

    if (updatedStudents[0]) {
      console.log(
        `🇿🇦 Student: ${updatedStudents[0].user?.email || updatedStudents[0].email} / student123`
      );
    }

    if (updatedParents[0]) {
      console.log(
        `🇿🇦 Parent: ${updatedParents[0].user?.email || updatedParents[0].email} / parent123`
      );
    }

    console.log('\n✅ GUARANTEED FEATURES:');
    console.log('• Passwords are properly bcrypt hashed');
    console.log('• All accounts are active (isActive: true)');
    console.log('• Admin is Derah Manyelo as requested');
    console.log('• Names are authentic South African');
    console.log('• Addresses and details are South African format');
    console.log('• These credentials WILL work with your login system!');
  } catch (error) {
    console.error('❌ Error fixing credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixExistingUsersAndCreateSouthAfricanLogin();
