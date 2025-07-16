const fetch = require('node-fetch');

async function testDashboardAPI() {
  try {
    console.log('🧪 Testing Dashboard API...');
    const response = await fetch('http://localhost:3000/api/dashboard/admin');
    const data = await response.json();

    console.log('📋 API Response Structure:');
    console.log('Success:', data.success);
    console.log('Data Keys:', Object.keys(data.data || {}));

    if (data.data?.metrics) {
      console.log('\n📊 Metrics:');
      console.log('Total Students:', data.data.metrics.totalStudents);
      console.log('Total Teachers:', data.data.metrics.totalTeachers);
      console.log('Total Parents:', data.data.metrics.totalParents);
      console.log('Total Classes:', data.data.metrics.totalClasses);
    } else {
      console.log('\n❌ No metrics found in response');
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testDashboardAPI();
