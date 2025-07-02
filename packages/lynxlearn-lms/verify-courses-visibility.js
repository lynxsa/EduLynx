#!/usr/bin/env node

const https = require('http');

// Test API endpoint
console.log('🔍 Verifying courses visibility across all grades...\n');

// Test API
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/courses?limit=200',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = https.request(options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const courses = response.data || response.courses || [];

      console.log('📊 API Response Analysis:');
      console.log(`Total courses returned: ${courses.length}`);

      // Count by grade
      const gradeStats = {};
      courses.forEach(course => {
        const grade = course.grade;
        gradeStats[grade] = (gradeStats[grade] || 0) + 1;
      });

      console.log('\n📈 Courses by Grade:');
      Object.keys(gradeStats)
        .sort()
        .forEach(grade => {
          console.log(`  Grade ${grade}: ${gradeStats[grade]} courses`);
        });

      // Count by subject
      const subjectStats = {};
      courses.forEach(course => {
        const subject = course.subject?.name || 'Unknown';
        subjectStats[subject] = (subjectStats[subject] || 0) + 1;
      });

      console.log(`\n📚 Total unique subjects: ${Object.keys(subjectStats).length}`);

      // Check expected coverage
      const expectedGrades = [8, 9, 10, 11, 12];
      const expectedCoursesPerGrade = 26;

      console.log('\n✅ Coverage Verification:');
      let allGradesCovered = true;
      expectedGrades.forEach(grade => {
        const count = gradeStats[grade] || 0;
        const status = count === expectedCoursesPerGrade ? '✅' : '❌';
        console.log(`  Grade ${grade}: ${count}/${expectedCoursesPerGrade} courses ${status}`);
        if (count !== expectedCoursesPerGrade) allGradesCovered = false;
      });

      console.log(
        `\n🎯 Overall Status: ${allGradesCovered ? '✅ All grades properly covered' : '❌ Some grades missing courses'}`
      );

      if (allGradesCovered) {
        console.log('\n🚀 Frontend Fix Applied:');
        console.log('  - Updated expandedGrades to include all grades [8, 9, 10, 11, 12]');
        console.log('  - API limit set to 200 to fetch all courses');
        console.log('  - All courses should now be visible in the browser');
        console.log('\n💡 Next Steps:');
        console.log('  1. Open http://localhost:3001/courses in browser');
        console.log('  2. Verify all grade sections are expanded and show courses');
        console.log('  3. Test grade and subject filters');
        console.log('  4. Login with demo accounts and verify access');
      }
    } catch (error) {
      console.error('❌ Error parsing API response:', error);
    }
  });
});

req.on('error', error => {
  console.error('❌ Error connecting to API:', error);
  console.log('\n💡 Make sure the LynxLearn LMS server is running on port 3001');
});

req.end();
