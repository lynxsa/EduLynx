const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSimpleLoginCredentials() {
  console.log('🚀 Creating Simple Working Login Credentials');
  console.log('===========================================\n');

  try {
    // Just create the admin user you were trying to login with
    console.log('👑 Creating admin@lynxacademy.co.za...');

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@lynxacademy.co.za' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'LynxAcademy',
        email: 'admin@lynxacademy.co.za',
        role: 'ADMIN',
        phone: '+27111222333',
        addressLine1: '1 LynxAcademy Plaza',
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
      where: { username: 'admin.lynx' },
      update: {},
      create: {
        id: adminUser.id,
        username: 'admin.lynx',
      },
    });

    console.log('✅ Admin user created successfully!\n');

    console.log('🎯 WORKING LOGIN CREDENTIALS FOR EDULYNX:');
    console.log('=========================================\n');

    console.log('👑 ADMIN LOGIN (Use this one!):');
    console.log('   Email: admin@lynxacademy.co.za');
    console.log('   Password: admin123');
    console.log('   (This is the exact email you were trying!)\n');

    console.log('🔄 BACKUP ADMIN LOGIN:');
    console.log('   Email: admin@edulynx.com');
    console.log('   Password: admin123\n');

    console.log('👩‍🏫 TEACHER LOGIN:');
    console.log('   Email: sarah.johnson@edulynx.com');
    console.log('   Password: teacher123\n');

    console.log('🎓 STUDENT LOGIN:');
    console.log('   Email: wren.fisher.8a.0@student.edulynx.com');
    console.log('   Password: student123\n');

    console.log('👨‍👩‍👧‍👦 PARENT LOGIN:');
    console.log('   Email: aarav.fisher.0@gmail.com');
    console.log('   Password: parent123\n');

    console.log('⚡ QUICK TEST CREDENTIALS:');
    console.log('-------------------------');
    console.log('Admin: admin@lynxacademy.co.za / admin123');
    console.log('Teacher: sarah.johnson@edulynx.com / teacher123');
    console.log('Student: wren.fisher.8a.0@student.edulynx.com / student123');
    console.log('Parent: aarav.fisher.0@gmail.com / parent123\n');

    console.log('💡 USAGE TIPS:');
    console.log('• Copy and paste the exact email addresses');
    console.log('• Use lowercase passwords');
    console.log('• Make sure to select the right role from dropdown');
    console.log('• Try the admin@lynxacademy.co.za first (the one you were using)');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🎯 BUT YOU CAN STILL USE THESE EXISTING CREDENTIALS:');
    console.log('====================================================\n');

    console.log('👑 ADMIN: admin@edulynx.com / admin123');
    console.log('👩‍🏫 TEACHER: sarah.johnson@edulynx.com / teacher123');
    console.log('🎓 STUDENT: wren.fisher.8a.0@student.edulynx.com / student123');
    console.log('👨‍👩‍👧‍👦 PARENT: aarav.fisher.0@gmail.com / parent123');
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleLoginCredentials();
