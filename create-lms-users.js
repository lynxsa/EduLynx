#!/usr/bin/env node

/**
 * LynxLearn LMS Demo Users Creation Script
 *
 * This script creates demo users for the LynxLearn LMS application
 * with proper school setup and user roles.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating LMS users...');

  try {
    // Create a school first
    const school = await prisma.school.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'LynxLearn Academy',
        code: 'LLA',
        address: '123 Education Street, Learning City',
        contactEmail: 'admin@lynxlearn.co.za',
        contactPhone: '+27 11 123 4567',
      },
    });

    console.log('✅ School created:', school.name);

    // Create demo users
    const users = [
      {
        email: 'admin@lynxlearn.co.za',
        password: 'admin123',
        name: 'Admin User',
        role: 'ADMIN',
      },
      {
        email: 'teacher@lynxlearn.co.za',
        password: 'teacher123',
        name: 'Teacher User',
        role: 'TEACHER',
      },
      {
        email: 'student@lynxlearn.co.za',
        password: 'student123',
        name: 'Student User',
        role: 'STUDENT',
      },
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
        },
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          schoolId: school.id,
        },
      });

      console.log(`✅ ${userData.role} created:`, user.email);
    }

    console.log('\n🎉 LMS Users created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@lynxlearn.co.za / admin123');
    console.log('Teacher: teacher@lynxlearn.co.za / teacher123');
    console.log('Student: student@lynxlearn.co.za / student123');
    console.log('\nLMS Available at: http://localhost:3001');
  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
