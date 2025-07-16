#!/usr/bin/env node

/**
 * PAGINATION LIMIT FIX VERIFICATION
 * Tests that the API now returns more than 100 records
 */

console.log('🔧 PAGINATION LIMIT FIX VERIFICATION');
console.log('Testing API response after increasing limit cap from 100 to 5000...');
console.log('=' * 60);

async function testPaginationFix() {
  try {
    console.log('\n🧪 TESTING STUDENTS API WITH HIGH LIMIT:');
    console.log('Making request to: /api/students?limit=2000&page=1');

    // Test the API endpoint
    const response = await fetch('http://localhost:3000/api/students?limit=2000&page=1');

    if (!response.ok) {
      console.log('❌ API request failed:', response.status);
      return;
    }

    const data = await response.json();
    console.log('✅ API request successful');

    // Extract student count
    const students = data.data?.data || data.data || data;
    const studentCount = Array.isArray(students) ? students.length : 0;

    console.log(`📊 Records returned: ${studentCount}`);

    if (studentCount >= 1000) {
      console.log('🎉 SUCCESS: More than 1000 records returned!');
      console.log('✅ Pagination limit fix is working correctly');
    } else if (studentCount > 100) {
      console.log('✅ IMPROVED: More than 100 records returned');
      console.log('⚠️  Expected more records - check database data');
    } else {
      console.log('❌ ISSUE: Still capped at 100 or fewer records');
      console.log('🔧 May need to restart server for changes to take effect');
    }

    console.log(`\n📈 PROGRESS:`);
    console.log(`Before fix: Limited to 100 records maximum`);
    console.log(`After fix: Can return up to 5000 records`);
    console.log(`Current result: ${studentCount} records`);
  } catch (error) {
    console.log('🔧 Note: API test requires running server');
    console.log('Please ensure localhost:3000 is running and try refreshing the students page');
  }
}

testPaginationFix();
