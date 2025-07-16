const https = require('https');
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET',
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testAPIs() {
  try {
    console.log('🌟 TESTING ADMIN DASHBOARD API 🌟');
    console.log('=====================================');

    const adminData = await makeRequest('/api/dashboard/admin?period=month');

    console.log('Admin Dashboard API Response:');
    console.log('Total Students:', adminData.metrics?.totalStudents);
    console.log('Total Teachers:', adminData.metrics?.totalTeachers);
    console.log('Total Classes:', adminData.metrics?.totalClasses);
    console.log('Total Parents:', adminData.metrics?.totalParents);
    console.log('Attendance %:', adminData.metrics?.attendancePercentage);

    console.log('\n📊 LIVE DATA VERIFICATION:');
    console.log('✅ Expected Students: 589');
    console.log('✅ Actual Students:', adminData.metrics?.totalStudents);
    console.log('✅ Match:', adminData.metrics?.totalStudents === 589 ? 'YES' : 'NO');

    console.log('\n🎯 Student Dashboard API:');
    const studentData = await makeRequest('/api/dashboard/student?studentId=1');
    console.log('Student API working:', studentData.error ? 'NO' : 'YES');
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
}

testAPIs();
