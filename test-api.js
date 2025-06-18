// Simple test to check if our API works
const testAPI = async () => {
  console.log('Testing API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lynxacademy.co.za',
        password: 'adminpass'
      })
    });
    
    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('API Error:', error);
  }
};

// For Node.js environment
if (typeof window === 'undefined') {
  const fetch = require('node-fetch');
  testAPI();
}
