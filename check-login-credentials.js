const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLoginCredentials() {
  console.log('🔍 Checking Available Login Credentials');
  console.log('=====================================\n');

  try {
    // Check all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
      take: 10, // Just show first 10 of each role
    });

    console.log('📧 Available User Accounts:\n');

    // Group by role
    const usersByRole = users.reduce((acc, user) => {
      if (!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    }, {});

    for (const [role, roleUsers] of Object.entries(usersByRole)) {
      console.log(`${role} ACCOUNTS:`);
      roleUsers.slice(0, 3).forEach(user => {
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.firstName} ${user.lastName}`);
        console.log(`  Password: demo123 (default for all users)`);
        console.log('  ---');
      });
      console.log('');
    }

    // Check for admin users specifically
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
      },
      take: 5,
    });

    if (admins.length > 0) {
      console.log('👑 ADMIN ACCOUNTS:');
      admins.forEach(admin => {
        console.log(`  Username: ${admin.username}`);
        console.log(`  Password: admin123 (default for admins)`);
        console.log('  ---');
      });
    }

    // Let's also check teachers specifically
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        surname: true,
      },
      take: 5,
    });

    if (teachers.length > 0) {
      console.log('\n👩‍🏫 TEACHER ACCOUNTS (Username/Email):');
      teachers.forEach(teacher => {
        console.log(`  Username: ${teacher.username}`);
        console.log(`  Email: ${teacher.email}`);
        console.log(`  Name: ${teacher.name} ${teacher.surname}`);
        console.log(`  Password: teacher123 (default for teachers)`);
        console.log('  ---');
      });
    }

    // Check students
    const students = await prisma.student.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        surname: true,
      },
      take: 5,
    });

    if (students.length > 0) {
      console.log('\n🎓 STUDENT ACCOUNTS (Username/Email):');
      students.forEach(student => {
        console.log(`  Username: ${student.username}`);
        console.log(`  Email: ${student.email}`);
        console.log(`  Name: ${student.name} ${student.surname}`);
        console.log(`  Password: student123 (default for students)`);
        console.log('  ---');
      });
    }

    // Check parents
    const parents = await prisma.parent.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        surname: true,
      },
      take: 5,
    });

    if (parents.length > 0) {
      console.log('\n👨‍👩‍👧‍👦 PARENT ACCOUNTS (Username/Email):');
      parents.forEach(parent => {
        console.log(`  Username: ${parent.username}`);
        console.log(`  Email: ${parent.email}`);
        console.log(`  Name: ${parent.name} ${parent.surname}`);
        console.log(`  Password: parent123 (default for parents)`);
        console.log('  ---');
      });
    }

    console.log('\n🔑 QUICK LOGIN CREDENTIALS FOR TESTING:');
    console.log('======================================');

    if (teachers.length > 0) {
      console.log(`🎯 TEACHER LOGIN:`);
      console.log(`   Email: ${teachers[0].email}`);
      console.log(`   Username: ${teachers[0].username}`);
      console.log(`   Password: teacher123`);
      console.log('');
    }

    if (students.length > 0) {
      console.log(`🎯 STUDENT LOGIN:`);
      console.log(`   Email: ${students[0].email}`);
      console.log(`   Username: ${students[0].username}`);
      console.log(`   Password: student123`);
      console.log('');
    }

    if (parents.length > 0) {
      console.log(`🎯 PARENT LOGIN:`);
      console.log(`   Email: ${parents[0].email}`);
      console.log(`   Username: ${parents[0].username}`);
      console.log(`   Password: parent123`);
      console.log('');
    }

    if (admins.length > 0) {
      console.log(`🎯 ADMIN LOGIN:`);
      console.log(`   Username: ${admins[0].username}`);
      console.log(`   Password: admin123`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error checking credentials:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLoginCredentials();
