const { exec } = require('child_process');

async function testDashboardAPI() {
  try {
    console.log('🧪 Testing Dashboard API with curl...');

    exec('curl -s "http://localhost:3000/api/dashboard/admin"', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ API Test Error:', error.message);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        console.log('📋 API Response Structure:');
        console.log('Success:', data.success);

        if (data.data) {
          console.log('Data Keys:', Object.keys(data.data));

          if (data.data.metrics) {
            console.log('\n📊 Live Metrics from Database:');
            console.log('Total Students:', data.data.metrics.totalStudents);
            console.log('Total Teachers:', data.data.metrics.totalTeachers);
            console.log('Total Parents:', data.data.metrics.totalParents);
            console.log('Total Classes:', data.data.metrics.totalClasses);
            console.log('Total Subjects:', data.data.metrics.totalSubjects);
            console.log('Gender Distribution:', data.data.metrics.genderDistribution);
          } else {
            console.log('\n❌ No metrics found in data');
          }
        } else {
          console.log('\n❌ No data object found');
        }
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.log('Raw response preview:', stdout.substring(0, 200));
      }
    });
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testDashboardAPI();
