const fetch = require('node-fetch');

async function testAuthFlow() {
  // Start a session by visiting the signin page first
  console.log('1. Visiting signin page to establish session...');
  const signinPageResponse = await fetch('http://localhost:3001/auth/signin');
  const cookies = signinPageResponse.headers.raw()['set-cookie'] || [];
  console.log('Session cookies:', cookies);

  // Get CSRF token
  console.log('2. Getting CSRF token...');
  const csrfResponse = await fetch('http://localhost:3001/api/auth/csrf', {
    headers: {
      Cookie: cookies.join('; '),
    },
  });
  const csrfData = await csrfResponse.json();
  console.log('CSRF Token:', csrfData.csrfToken);

  // Try to authenticate
  console.log('3. Attempting authentication...');
  const authResponse = await fetch('http://localhost:3001/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies.join('; '),
    },
    body: new URLSearchParams({
      email: 'admin@lynxacademy.co.za',
      password: 'adminpass',
      csrfToken: csrfData.csrfToken,
      callbackUrl: 'http://localhost:3001/dashboard',
      json: 'true',
    }),
    redirect: 'manual',
  });

  console.log('Auth response status:', authResponse.status);
  console.log('Auth response headers:', authResponse.headers.raw());

  if (authResponse.status === 200) {
    const responseData = await authResponse.json();
    console.log('Auth response data:', responseData);
  } else {
    const responseText = await authResponse.text();
    console.log('Auth response body:', responseText);
  }
}

testAuthFlow().catch(console.error);
