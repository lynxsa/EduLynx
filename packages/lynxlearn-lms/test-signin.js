const fetch = require('node-fetch');

async function testSignIn() {
  const credentials = {
    email: 'admin@lynxacademy.co.za',
    password: 'adminpass',
  };

  try {
    console.log('Testing authentication with:', credentials.email);

    // First, get the CSRF token
    const csrfResponse = await fetch('http://localhost:3001/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    console.log('CSRF Token:', csrfData.csrfToken);

    // Now attempt to sign in
    const signInResponse = await fetch('http://localhost:3001/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': csrfData.csrfToken,
      },
      body: new URLSearchParams({
        email: credentials.email,
        password: credentials.password,
        csrfToken: csrfData.csrfToken,
      }),
      redirect: 'manual',
    });

    console.log('Sign-in response status:', signInResponse.status);
    console.log('Sign-in response headers:', signInResponse.headers.raw());

    const responseText = await signInResponse.text();
    console.log('Sign-in response body:', responseText);
  } catch (error) {
    console.error('Test error:', error);
  }
}

testSignIn().catch(console.error);
