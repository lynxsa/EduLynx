// Debug login process for EduLynx
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function debugLogin() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing login process...');

    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const user = await prisma.user.findUnique({
      where: { email: 'admin@lynxacademy.co.za' },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }
    console.log('✅ User found:', user.email);

    // Step 2: Verify password
    console.log('Step 2: Verifying password...');
    const isValidPassword = await bcrypt.compare('adminpass', user.password);
    console.log('✅ Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Password invalid');
      return;
    }

    // Step 3: Generate token
    console.log('Step 3: Generating JWT token...');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-here';
    console.log('JWT_SECRET available:', !!JWT_SECRET);

    try {
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          schoolId: user.schoolId || undefined,
        },
        JWT_SECRET,
        {
          expiresIn: '7d',
          issuer: 'edulynx',
          audience: 'edulynx-users',
          algorithm: 'HS256',
        }
      );

      console.log('✅ Token generated successfully');
      console.log('Token length:', token.length);

      // Step 4: Test token verification
      console.log('Step 4: Verifying token...');
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully');
      console.log('Decoded payload:', JSON.stringify(decoded, null, 2));
    } catch (tokenError) {
      console.log('❌ Token generation/verification failed:', tokenError.message);
    }
  } catch (error) {
    console.error('❌ Debug login failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
