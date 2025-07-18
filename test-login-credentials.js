#!/usr/bin/env node

// Test script to verify all login credentials work correctly
const SERVER_URL = 'http://localhost:3000';

const testCredentials = [
  { role: 'Admin', email: 'admin@lynxacademy.co.za', password: 'admin123' },
  { role: 'Teacher', email: 'nomsa.dlamini@lynxacademy.co.za', password: 'teacher123' },
  { role: 'Parent', email: 'amy.singh.0@gmail.com', password: 'parent123' },
  { role: 'Student', email: 'johann.singh.8a.0@student.lynxacademy.co.za', password: 'student123' },
];

async function testLogin(credentials) {
  try {
    console.log(`🧪 Testing ${credentials.role} login...`);

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
      console.log(`✅ ${credentials.role} login successful:`);
      console.log(`   Email: ${data.data.user.email}`);
      console.log(`   Role: ${data.data.user.role}`);
      console.log(`   Name: ${data.data.user.firstName} ${data.data.user.lastName}`);
      console.log(`   Token: ${data.data.token ? 'Generated' : 'Missing'}`);
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

async function testAllCredentials() {
  console.log('🔐 Testing All Login Credentials');
  console.log('================================\n');

  // Check if server is running
  try {
    const healthCheck = await fetch(`${SERVER_URL}`);
    console.log('✅ Server is running at', SERVER_URL);
  } catch (error) {
    console.log('❌ Server is not running. Please start with: npm run dev\n');
    return;
  }

  let successCount = 0;

  for (const credentials of testCredentials) {
    const success = await testLogin(credentials);
    if (success) successCount++;
    console.log(''); // Empty line for readability
  }

  console.log(`📊 Test Results: ${successCount}/${testCredentials.length} logins successful\n`);

  if (successCount === testCredentials.length) {
    console.log(
      '🎉 All login tests passed! All credentials from sign-in page are working correctly.'
    );
    console.log(
      '✅ Users can now successfully login with the credentials shown on the sign-in cards.'
    );
  } else {
    console.log('⚠️  Some login tests failed. Please check the server logs for more details.');
  }

  console.log('\n🚀 Next Steps:');
  console.log('1. Open http://localhost:3000/sign-in in your browser');
  console.log('2. Click any demo credential card to auto-fill login details');
  console.log('3. Test the role-based dashboard redirections');
  console.log('4. Verify all dashboard data displays correctly');
}

// Run the tests
testAllCredentials().catch(console.error);
