const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createPermanentSouthAfricanCredentials() {
  console.log('🇿🇦 Creating Permanent South African Login Credentials');
  console.log('====================================================\n');

  try {
    // Hash passwords properly
    const adminPassword = await bcrypt.hash('admin123', 10);
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const parentPassword = await bcrypt.hash('parent123', 10);

    console.log('🔐 Passwords hashed successfully...\n');

    // 1. Create Derah Manyelo as Admin
    console.log('👑 Creating Admin: Derah Manyelo...');

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

    // Create admin record
    await prisma.admin.upsert({
      where: { username: 'derah.manyelo' },
      update: {},
      create: {
        id: adminUser.id,
        username: 'derah.manyelo',
      },
    });

    // 2. Create South African Teachers
    console.log('👩‍🏫 Creating South African Teachers...');

    const southAfricanTeachers = [
      {
        firstName: 'Nomsa',
        lastName: 'Dlamini',
        email: 'nomsa.dlamini@lynxacademy.co.za',
        phone: '+27824567890',
        address: '23 Vilakazi Street',
        city: 'Johannesburg',
      },
      {
        firstName: 'Thabo',
        lastName: 'Mokwena',
        email: 'thabo.mokwena@lynxacademy.co.za',
        phone: '+27825678901',
        address: '45 Madiba Avenue',
        city: 'Pretoria',
      },
      {
        firstName: 'Zanele',
        lastName: 'Mthembu',
        email: 'zanele.mthembu@lynxacademy.co.za',
        phone: '+27826789012',
        address: '67 Khumalo Road',
        city: 'Durban',
      },
      {
        firstName: 'Sipho',
        lastName: 'Radebe',
        email: 'sipho.radebe@lynxacademy.co.za',
        phone: '+27827890123',
        address: '89 Ubuntu Close',
        city: 'Cape Town',
      },
      {
        firstName: 'Lebohang',
        lastName: 'Molefe',
        email: 'lebohang.molefe@lynxacademy.co.za',
        phone: '+27828901234',
        address: '12 Freedom Square',
        city: 'Bloemfontein',
      },
    ];

    for (const teacher of southAfricanTeachers) {
      const teacherUser = await prisma.user.upsert({
        where: { email: teacher.email },
        update: {
          password: teacherPassword,
          isActive: true,
        },
        create: {
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          password: teacherPassword,
          role: 'TEACHER',
          phone: teacher.phone,
          addressLine1: teacher.address,
          city: teacher.city,
          province: 'Gauteng',
          postalCode: '2000',
          country: 'South Africa',
          dateOfBirth: new Date(
            1980 + Math.floor(Math.random() * 15),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          isActive: true,
        },
      });

      await prisma.teacher.upsert({
        where: { username: `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}` },
        update: {},
        create: {
          id: teacherUser.id,
          username: `${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}`,
          name: teacher.firstName,
          surname: teacher.lastName,
          email: teacher.email,
          phone: teacher.phone,
          address: teacher.address,
          bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
            Math.floor(Math.random() * 8)
          ],
          sex: teacherUser.gender === 'Male' ? 'MALE' : 'FEMALE',
          birthday: teacherUser.dateOfBirth,
          qualifications: 'Bachelor of Education (University of the Witwatersrand)',
          yearsExperience: Math.floor(Math.random() * 15) + 5,
        },
      });
    }

    // 3. Create South African Students
    console.log('🎓 Creating South African Students...');

    const southAfricanStudents = [
      {
        firstName: 'Amahle',
        lastName: 'Nkosi',
        email: 'amahle.nkosi@student.lynxacademy.co.za',
        phone: '+27829012345',
        address: '34 Soweto Avenue',
      },
      {
        firstName: 'Kwame',
        lastName: 'Asante',
        email: 'kwame.asante@student.lynxacademy.co.za',
        phone: '+27830123456',
        address: '56 Langa Street',
      },
      {
        firstName: 'Thandiwe',
        lastName: 'Zulu',
        email: 'thandiwe.zulu@student.lynxacademy.co.za',
        phone: '+27831234567',
        address: '78 Alexandra Road',
      },
      {
        firstName: 'Karabo',
        lastName: 'Mokoena',
        email: 'karabo.mokoena@student.lynxacademy.co.za',
        phone: '+27832345678',
        address: '90 Gugulethu Close',
      },
      {
        firstName: 'Naledi',
        lastName: 'Tshwane',
        email: 'naledi.tshwane@student.lynxacademy.co.za',
        phone: '+27833456789',
        address: '23 Mitchells Plain Boulevard',
      },
    ];

    // Get first class and grade for students
    const firstClass = await prisma.class.findFirst();
    const firstGrade = await prisma.grade.findFirst();

    for (const student of southAfricanStudents) {
      const studentUser = await prisma.user.upsert({
        where: { email: student.email },
        update: {
          password: studentPassword,
          isActive: true,
        },
        create: {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          password: studentPassword,
          role: 'STUDENT',
          phone: student.phone,
          addressLine1: student.address,
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '7750',
          country: 'South Africa',
          dateOfBirth: new Date(
            2006 + Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          isActive: true,
        },
      });

      await prisma.student.upsert({
        where: { username: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}` },
        update: {},
        create: {
          id: studentUser.id,
          username: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}`,
          name: student.firstName,
          surname: student.lastName,
          email: student.email,
          phone: student.phone,
          address: student.address,
          bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
            Math.floor(Math.random() * 8)
          ],
          sex: studentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
          birthday: studentUser.dateOfBirth,
          gender: studentUser.gender,
          classId: firstClass?.id,
          gradeId: firstGrade?.id,
        },
      });
    }

    // 4. Create South African Parents
    console.log('👨‍👩‍👧‍👦 Creating South African Parents...');

    const southAfricanParents = [
      {
        firstName: 'Nomthandazo',
        lastName: 'Nkosi',
        email: 'nomthandazo.nkosi@gmail.com',
        phone: '+27834567890',
        address: '34 Soweto Avenue',
        occupation: 'Nurse',
      },
      {
        firstName: 'Bongani',
        lastName: 'Asante',
        email: 'bongani.asante@gmail.com',
        phone: '+27835678901',
        address: '56 Langa Street',
        occupation: 'Teacher',
      },
      {
        firstName: 'Precious',
        lastName: 'Zulu',
        email: 'precious.zulu@gmail.com',
        phone: '+27836789012',
        address: '78 Alexandra Road',
        occupation: 'Social Worker',
      },
      {
        firstName: 'Tshepo',
        lastName: 'Mokoena',
        email: 'tshepo.mokoena@gmail.com',
        phone: '+27837890123',
        address: '90 Gugulethu Close',
        occupation: 'Engineer',
      },
      {
        firstName: 'Palesa',
        lastName: 'Tshwane',
        email: 'palesa.tshwane@gmail.com',
        phone: '+27838901234',
        address: '23 Mitchells Plain Boulevard',
        occupation: 'Doctor',
      },
    ];

    for (const parent of southAfricanParents) {
      const parentUser = await prisma.user.upsert({
        where: { email: parent.email },
        update: {
          password: parentPassword,
          isActive: true,
        },
        create: {
          firstName: parent.firstName,
          lastName: parent.lastName,
          email: parent.email,
          password: parentPassword,
          role: 'PARENT',
          phone: parent.phone,
          addressLine1: parent.address,
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '7750',
          country: 'South Africa',
          dateOfBirth: new Date(
            1975 + Math.floor(Math.random() * 15),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          isActive: true,
        },
      });

      await prisma.parent.upsert({
        where: { username: `${parent.firstName.toLowerCase()}.${parent.lastName.toLowerCase()}` },
        update: {},
        create: {
          id: parentUser.id,
          username: `${parent.firstName.toLowerCase()}.${parent.lastName.toLowerCase()}`,
          name: parent.firstName,
          surname: parent.lastName,
          email: parent.email,
          phone: parent.phone,
          address: parent.address,
          sex: parentUser.gender === 'Male' ? 'MALE' : 'FEMALE',
          employer: 'City of Cape Town',
          occupation: parent.occupation,
          relationshipToStudent: parentUser.gender === 'Male' ? 'Father' : 'Mother',
        },
      });
    }

    console.log('\n🎉 South African Credentials Created Successfully!');
    console.log('=================================================\n');

    console.log('🇿🇦 GUARANTEED WORKING SOUTH AFRICAN CREDENTIALS:');
    console.log('--------------------------------------------------\n');

    console.log('👑 ADMIN LOGIN (Derah Manyelo):');
    console.log('   Email: admin@lynxacademy.co.za');
    console.log('   Username: derah.manyelo');
    console.log('   Password: admin123');
    console.log('   Name: Derah Manyelo\n');

    console.log('👩‍🏫 TEACHER LOGINS:');
    southAfricanTeachers.forEach(teacher => {
      console.log(`   Email: ${teacher.email}`);
      console.log(
        `   Username: ${teacher.firstName.toLowerCase()}.${teacher.lastName.toLowerCase()}`
      );
      console.log('   Password: teacher123');
      console.log(`   Name: ${teacher.firstName} ${teacher.lastName}`);
      console.log('   ---');
    });

    console.log('\n🎓 STUDENT LOGINS:');
    southAfricanStudents.forEach(student => {
      console.log(`   Email: ${student.email}`);
      console.log(
        `   Username: ${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}`
      );
      console.log('   Password: student123');
      console.log(`   Name: ${student.firstName} ${student.lastName}`);
      console.log('   ---');
    });

    console.log('\n👨‍👩‍👧‍👦 PARENT LOGINS:');
    southAfricanParents.forEach(parent => {
      console.log(`   Email: ${parent.email}`);
      console.log(
        `   Username: ${parent.firstName.toLowerCase()}.${parent.lastName.toLowerCase()}`
      );
      console.log('   Password: parent123');
      console.log(`   Name: ${parent.firstName} ${parent.lastName}`);
      console.log('   ---');
    });

    console.log('\n⚡ QUICK TEST CREDENTIALS:');
    console.log('=========================');
    console.log('🇿🇦 Admin: admin@lynxacademy.co.za / admin123 (Derah Manyelo)');
    console.log('🇿🇦 Teacher: nomsa.dlamini@lynxacademy.co.za / teacher123');
    console.log('🇿🇦 Student: amahle.nkosi@student.lynxacademy.co.za / student123');
    console.log('🇿🇦 Parent: nomthandazo.nkosi@gmail.com / parent123\n');

    console.log('✅ FEATURES:');
    console.log('• All passwords are properly bcrypt hashed');
    console.log('• All accounts are marked as active (isActive: true)');
    console.log('• All names are authentic South African names');
    console.log('• Admin is Derah Manyelo as requested');
    console.log('• Addresses and phone numbers are South African format');
    console.log('• Email domains match your system (@lynxacademy.co.za)');
  } catch (error) {
    console.error('❌ Error creating South African credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPermanentSouthAfricanCredentials();
