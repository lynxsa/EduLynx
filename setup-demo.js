#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple demo user creation
const createDemoScript = `
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing users
    await prisma.user.deleteMany({});
    
    // Create demo users
    const users = [
      { email: 'admin@lynxacademy.co.za', password: 'adminpass', firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
      { email: 'teacher1@lynxacademy.co.za', password: 'teacherpass', firstName: 'Sarah', lastName: 'Johnson', role: 'TEACHER' },
      { email: 'parent1@lynxacademy.co.za', password: 'parentpass', firstName: 'Michael', lastName: 'Smith', role: 'PARENT' },
      { email: 'student1@lynxacademy.co.za', password: 'studentpass', firstName: 'Emma', lastName: 'Davis', role: 'STUDENT' }
    ];
    
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          isActive: true
        }
      });
      console.log('Created user:', userData.email);
    }
    
    console.log('Demo users created successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
`;

fs.writeFileSync('./create-users.js', createDemoScript);
console.log('Created user creation script');

// Run it
exec('node create-users.js', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);

  // Clean up
  fs.unlinkSync('./create-users.js');
  console.log('Demo users setup complete!');
});
