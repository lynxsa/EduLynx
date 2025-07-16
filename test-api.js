// Test script to verify API endpoints
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing admin dashboard API...');
    const response = await fetch('http://localhost:3000/api/dashboard/admin?period=month');
    const data = await response.json();

    console.log('API Response:');
    console.log('Total Students:', data.metrics?.totalStudents);
    console.log('Total Teachers:', data.metrics?.totalTeachers);
    console.log('Total Classes:', data.metrics?.totalClasses);
    console.log('Attendance %:', data.metrics?.attendancePercentage);

    console.log('\nLive Data Check:');
    console.log('Is using live data:', data.metrics?.totalStudents === 589 ? 'YES' : 'NO');
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
