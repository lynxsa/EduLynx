const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // Create demo school
    const school = await prisma.school.upsert({
      where: { name: 'Lynx Academy' },
      update: {},
      create: {
        name: 'Lynx Academy',
        address: '123 Education Street',
        city: 'Cape Town',
        province: 'Western Cape',
        country: 'South Africa',
        website: 'https://lynxacademy.co.za',
        principal: 'Dr. Jane Smith',
        schoolType: 'private',
        motto: 'Excellence in Education',
      },
    });
    console.log('✅ Created/found school:', school.name);

    // Hash passwords for demo users
    const adminPassword = await bcrypt.hash('adminpass', 12);
    const teacherPassword = await bcrypt.hash('teacherpass', 12);
    const parentPassword = await bcrypt.hash('parentpass', 12);
    const studentPassword = await bcrypt.hash('studentpass', 12);

    // Create Admin user
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
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Created/updated Admin user:', admin.email);

    // Create Teacher user
    const teacher = await prisma.user.upsert({
      where: { email: 'teacher1@lynxacademy.co.za' },
      update: {
        password: teacherPassword,
        role: 'TEACHER',
        isActive: true,
      },
      create: {
        email: 'teacher1@lynxacademy.co.za',
        password: teacherPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'TEACHER',
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Created/updated Teacher user:', teacher.email);

    // Create Parent user
    const parent = await prisma.user.upsert({
      where: { email: 'parent1@lynxacademy.co.za' },
      update: {
        password: parentPassword,
        role: 'PARENT',
        isActive: true,
      },
      create: {
        email: 'parent1@lynxacademy.co.za',
        password: parentPassword,
        firstName: 'Michael',
        lastName: 'Smith',
        role: 'PARENT',
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Created/updated Parent user:', parent.email);

    // Create Student user
    const student = await prisma.user.upsert({
      where: { email: 'student1@lynxacademy.co.za' },
      update: {
        password: studentPassword,
        role: 'STUDENT',
        isActive: true,
      },
      create: {
        email: 'student1@lynxacademy.co.za',
        password: studentPassword,
        firstName: 'Emma',
        lastName: 'Johnson',
        role: 'STUDENT',
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Created/updated Student user:', student.email);

    console.log('\n🎉 Demo users created successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Admin: admin@lynxacademy.co.za / adminpass');
    console.log('Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('Student: student1@lynxacademy.co.za / studentpass');
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
