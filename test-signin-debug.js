const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testDatabaseAndCreateUsers() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if users exist
    const existingUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    
    console.log(`📊 Found ${existingUsers.length} existing users`);
    existingUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    
    // Create demo users if they don't exist
    const demoUsers = [
      { email: 'admin@lynxacademy.co.za', password: 'adminpass', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
      { email: 'teacher1@lynxacademy.co.za', password: 'teacherpass', firstName: 'Sarah', lastName: 'Johnson', role: 'TEACHER' },
      { email: 'parent1@lynxacademy.co.za', password: 'parentpass', firstName: 'Michael', lastName: 'Smith', role: 'PARENT' },
      { email: 'student1@lynxacademy.co.za', password: 'studentpass', firstName: 'Emma', lastName: 'Davis', role: 'STUDENT' }
    ];
    
    for (const demoUser of demoUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: demoUser.email }
      });
      
      if (!existing) {
        console.log(`🔧 Creating user: ${demoUser.email}`);
        const hashedPassword = await bcrypt.hash(demoUser.password, 12);
        
        await prisma.user.create({
          data: {
            email: demoUser.email,
            password: hashedPassword,
            firstName: demoUser.firstName,
            lastName: demoUser.lastName,
            role: demoUser.role,
            isActive: true
          }
        });
      } else {
        console.log(`✅ User exists: ${demoUser.email}`);
      }
    }
    
    // Final user count
    const finalUsers = await prisma.user.findMany({
      select: { id: true, email: true, role: true, isActive: true }
    });
    
    console.log(`🎉 Final user count: ${finalUsers.length}`);
    console.log('\n📧 Demo Credentials:');
    console.log('  Admin: admin@lynxacademy.co.za / adminpass');
    console.log('  Teacher: teacher1@lynxacademy.co.za / teacherpass');
    console.log('  Parent: parent1@lynxacademy.co.za / parentpass');
    console.log('  Student: student1@lynxacademy.co.za / studentpass');
    
  } catch (error) {
    console.error('❌ Database error:', error);
    if (error.code === 'P1001') {
      console.error('🔥 Database connection failed. Is PostgreSQL running?');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseAndCreateUsers();
