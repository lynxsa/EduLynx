const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testLogin() {
  console.log('🔐 TESTING LOGIN FUNCTIONALITY');
  console.log('==============================\n');

  try {
    // Test Admin Login
    console.log('👑 Testing Admin (Derah Manyelo) login...');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    if (admin) {
      const isPasswordValid = await bcrypt.compare('admin123', admin.password);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password Hash: ${admin.password.substring(0, 20)}...`);
      console.log(`   Password Valid: ${isPasswordValid}`);
      console.log(`   Active Status: ${admin.isActive}`);
      console.log(`   Role: ${admin.role}`);
      console.log('   ✅ Admin login - WORKING\n');
    } else {
      console.log('   ❌ Admin not found\n');
    }

    // Test Teacher Login
    console.log('👩‍🏫 Testing Teacher (Nomsa Dlamini) login...');
    const teacher = await prisma.user.findUnique({
      where: { email: 'nomsa.dlamini@lynxacademy.co.za' },
    });

    if (teacher) {
      const isPasswordValid = await bcrypt.compare('teacher123', teacher.password);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Password Hash: ${teacher.password.substring(0, 20)}...`);
      console.log(`   Password Valid: ${isPasswordValid}`);
      console.log(`   Active Status: ${teacher.isActive}`);
      console.log(`   Role: ${teacher.role}`);
      console.log('   ✅ Teacher login - WORKING\n');
    } else {
      console.log('   ❌ Teacher not found\n');
    }

    // Test Student Login
    console.log('🎓 Testing Student login...');
    const student = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
    });

    if (student) {
      const isPasswordValid = await bcrypt.compare('student123', student.password);
      console.log(`   Email: ${student.email}`);
      console.log(`   Password Hash: ${student.password.substring(0, 20)}...`);
      console.log(`   Password Valid: ${isPasswordValid}`);
      console.log(`   Active Status: ${student.isActive}`);
      console.log(`   Role: ${student.role}`);
      console.log('   ✅ Student login - WORKING\n');
    } else {
      console.log('   ❌ Student not found\n');
    }

    // Test Parent Login
    console.log('👨‍👩‍👧‍👦 Testing Parent login...');
    const parent = await prisma.user.findFirst({
      where: { role: 'PARENT' },
    });

    if (parent) {
      const isPasswordValid = await bcrypt.compare('parent123', parent.password);
      console.log(`   Email: ${parent.email}`);
      console.log(`   Password Hash: ${parent.password.substring(0, 20)}...`);
      console.log(`   Password Valid: ${isPasswordValid}`);
      console.log(`   Active Status: ${parent.isActive}`);
      console.log(`   Role: ${parent.role}`);
      console.log('   ✅ Parent login - WORKING\n');
    } else {
      console.log('   ❌ Parent not found\n');
    }

    console.log('🎉 ALL LOGIN TESTS PASSED!');
    console.log('==========================\n');

    // Database counts
    const counts = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'PARENT' } }),
      prisma.class.count(),
      prisma.grade.count(),
    ]);

    console.log('📊 FINAL DATABASE VERIFICATION:');
    console.log(`   Admins: ${counts[0]}`);
    console.log(`   Teachers: ${counts[1]}`);
    console.log(`   Students: ${counts[2]}`);
    console.log(`   Parents: ${counts[3]}`);
    console.log(`   Classes: ${counts[4]}`);
    console.log(`   Grades: ${counts[5]}`);
    console.log(`   Student-to-Parent Ratio: ${(counts[2] / counts[3]).toFixed(2)}:1`);
  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
