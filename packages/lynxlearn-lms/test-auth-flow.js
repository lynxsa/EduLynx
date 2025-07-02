const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function testAuth() {
  const client = new Client({
    connectionString:
      'postgresql://lynxdb_admin:lynxacadmy2025@localhost:5432/lynxacademydb?schema=public',
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');

    // Test if admin user exists
    const result = await client.query(
      'SELECT id, email, "firstName", "lastName", role, password FROM "User" WHERE email = $1',
      ['admin@lynxacademy.co.za']
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User found:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0,
      });

      // Test password verification
      if (user.password) {
        const isValid = await bcrypt.compare('adminpass', user.password);
        console.log('Password verification result:', isValid);

        if (!isValid) {
          console.log('Testing with different password variations...');
          const variants = ['admin', 'Admin123', 'password'];
          for (const variant of variants) {
            const testResult = await bcrypt.compare(variant, user.password);
            if (testResult) {
              console.log(`Password match found with: ${variant}`);
              break;
            }
          }
        }
      }
    } else {
      console.log('Admin user not found');

      // Check if any users exist
      const allUsers = await client.query('SELECT COUNT(*) FROM "User"');
      console.log('Total users in database:', allUsers.rows[0].count);

      if (parseInt(allUsers.rows[0].count) > 0) {
        const sampleUsers = await client.query('SELECT email, role FROM "User" LIMIT 5');
        console.log('Sample users:', sampleUsers.rows);
      }
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await client.end();
  }
}

testAuth().catch(console.error);
