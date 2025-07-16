const fetch = require('node-fetch');

async function testDashboardAPI() {
  try {
    console.log('🧪 Testing Dashboard API...');

    const response = await fetch('http://localhost:3000/api/dashboard/admin');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ API Response received');
    console.log('📊 Metrics:', {
      totalStudents: data.data?.metrics?.totalStudents,
      totalTeachers: data.data?.metrics?.totalTeachers,
      totalParents: data.data?.metrics?.totalParents,
      totalClasses: data.data?.metrics?.totalClasses,
      genderDistribution: data.data?.metrics?.genderDistribution,
    });

    if (data.data?.metrics?.teachersBySubject) {
      console.log('👩‍🏫 Teachers by Subject:');
      data.data.metrics.teachersBySubject.forEach(subject => {
        console.log(`  ${subject.subject}: ${subject.teachers} teachers`);
      });
    }
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

testDashboardAPI();
