const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function testAPILogin() {
  console.log('🧪 TESTING LOGIN API SIMULATION');
  console.log('=================================\n');

  try {
    const email = 'admin@lynxacademy.co.za';
    const password = 'admin123';

    console.log('📧 Login attempt for:', email);
    console.log('🔑 Password:', password);

    // Step 1: Find user (exactly as API does)
    console.log('\n🔍 Step 1: Searching for user in database...');
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Step 2: Check if active
    if (!user.isActive) {
      console.log('❌ Account deactivated');
      return;
    }

    console.log('✅ Account is active');

    // Step 3: Verify password (exactly as API does)
    console.log('\n🔐 Step 2: Verifying password...');
    console.log('Stored password hash:', user.password);
    console.log('Input password:', password);

    const isValidPassword = await bcrypt.compare(password, user.password || '');
    console.log('Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password');

      // Let's also test the hash generation
      console.log('\n🔍 Testing hash generation...');
      const newHash = await bcrypt.hash(password, 10);
      console.log('New hash for same password:', newHash);
      const testCompare = await bcrypt.compare(password, newHash);
      console.log('New hash comparison works:', testCompare);

      return;
    }

    console.log('✅ Password verified successfully!');
    console.log('\n🎉 LOGIN TEST: SUCCESS');
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPILogin();
