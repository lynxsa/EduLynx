#!/usr/bin/env node

// Simple test script to verify login functionality
const SERVER_URL = 'http://localhost:3000';

const testCredentials = [
  { role: 'Admin', email: 'admin@lynxacademy.co.za', password: 'adminpass' },
  { role: 'Teacher', email: 'teacher1@lynxacademy.co.za', password: 'teacherpass' },
  { role: 'Parent', email: 'parent1@lynxacademy.co.za', password: 'parentpass' },
  { role: 'Student', email: 'student1@lynxacademy.co.za', password: 'studentpass' },
];

async function testLogin(credentials) {
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ ${credentials.role} login successful:`, {
        email: data.data.user.email,
        role: data.data.user.role,
        name: `${data.data.user.firstName} ${data.data.user.lastName}`,
      });
      return true;
    } else {
      console.log(`❌ ${credentials.role} login failed:`, data.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log(`❌ ${credentials.role} login error:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing login functionality...\n');

  // Check if server is running
  try {
    const healthCheck = await fetch(`${SERVER_URL}/api/system/health`);
    console.log('🔍 Server status check...');
  } catch (error) {
    console.log(
      '⚠️  Server might not be running. Please start the development server with: npm run dev\n'
    );
  }

  let successCount = 0;

  for (const credentials of testCredentials) {
    const success = await testLogin(credentials);
    if (success) successCount++;
    console.log(''); // Empty line for readability
  }

  console.log(`📊 Test Results: ${successCount}/${testCredentials.length} logins successful\n`);

  if (successCount === testCredentials.length) {
    console.log('🎉 All login tests passed! The authentication system is working correctly.');
  } else {
    console.log('⚠️  Some login tests failed. Please check the server logs for more details.');
  }
}

// Run the tests
runTests().catch(console.error);
