const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    // Test login
    console.log('Testing teacher login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'teacher1',
      password: 'teacher123'
    });
    
    console.log('Login successful:', loginResponse.data.message);
    const token = loginResponse.data.accessToken;
    console.log('Token received:', token ? 'Yes' : 'No');
    console.log('User role:', loginResponse.data.user?.role);
    
    // Test protected route
    console.log('\nTesting protected route...');
    const testResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Protected route access:', testResponse.status === 200 ? 'Success' : 'Failed');
    
    // Test virtual class creation
    console.log('\nTesting virtual class creation...');
    const classData = {
      title: 'Test Class',
      subject: 'Mathematics',
      grade: '10',
      scheduledAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      duration: 60
    };
    
    const createResponse = await axios.post(`${BASE_URL}/virtual-class/create`, classData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Virtual class creation:', createResponse.data.success ? 'Success' : 'Failed');
    console.log('Class ID:', createResponse.data.data?._id);
    
  } catch (error) {
    console.error('Error details:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data || error.message);
  }
}

testAuth();