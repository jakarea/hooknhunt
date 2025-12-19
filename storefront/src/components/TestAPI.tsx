'use client';

import React, { useState } from 'react';
import api from '@/lib/api';

export default function TestAPI() {
  const [status, setStatus] = useState('Ready');

  const testAuthentication = async () => {
    try {
      setStatus('Registering...');
      console.log('🔐 Step 1: Registering user...');

      // Register a new user
      const registerResponse = await fetch('http://192.168.0.166:8000/api/v1/store/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          phone_number: '01345678902',
          password: 'password123'
        })
      });

      const registerData = await registerResponse.json();
      console.log('📝 Registration response:', registerData);

      if (registerData.otp_code) {
        setStatus(`Verifying OTP: ${registerData.otp_code}`);
        console.log('🔐 Step 2: Verifying OTP...');

        // Verify OTP
        const verifyResponse = await fetch('http://192.168.0.166:8000/api/v1/store/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            phone_number: '01345678902',
            otp_code: registerData.otp_code
          })
        });

        const verifyData = await verifyResponse.json();
        console.log('✅ Verification response:', verifyData);

        if (verifyData.token) {
          setStatus('Token received! Testing API...');
          console.log('🔐 Step 3: Storing token and testing API...');

          // Store token in localStorage
          localStorage.setItem('auth_token', verifyData.token);
          console.log('💾 Token stored in localStorage:', verifyData.token);

          // Test authenticated API call
          const meResponse = await api.getMe();
          console.log('✅ Authenticated API call success:', meResponse);
          setStatus('✅ Success! Authenticated');

          // Test manual API call with token
          console.log('🧪 Testing manual authenticated API call...');
          const manualToken = localStorage.getItem('auth_token');
          console.log('🧪 Manual token check:', manualToken);

          const manualResponse = await fetch('http://192.168.0.166:8000/api/v1/store/account/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${manualToken}`
            }
          });

          console.log('🧪 Manual response status:', manualResponse.status);
          const manualData = await manualResponse.json();
          console.log('🧪 Manual response data:', manualData);
          setStatus('✅ All tests passed!');

        } else {
          setStatus('❌ Verification failed');
        }
      } else {
        setStatus('❌ Registration failed');
      }

    } catch (error: unknown) {
      console.error('❌ Authentication test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatus(`❌ Error: ${errorMessage}`);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('auth_token');
    setStatus('Token cleared');
    console.log('🗑️ Token removed from localStorage');
  };

  const testCurrentToken = async () => {
    const token = localStorage.getItem('auth_token');
    console.log('🧪 Current token:', token);

    if (!token) {
      setStatus('No token found');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.166:8000/api/v1/store/account/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('🧪 API Response:', data);

      if (response.ok) {
        setStatus('✅ Token valid');
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (error: unknown) {
      console.error('❌ Token test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setStatus(`❌ Error: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded text-xs z-50 max-w-xs">
      <div className="space-y-2">
        <div className="font-bold">🧪 API Test Suite</div>
        <div className="text-yellow-200">Status: {status}</div>

        <div className="space-y-1">
          <button
            onClick={testAuthentication}
            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded w-full text-left"
          >
            🔐 Test Full Auth Flow
          </button>

          <button
            onClick={testCurrentToken}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded w-full text-left"
          >
            🧪 Test Current Token
          </button>

          <button
            onClick={clearToken}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded w-full text-left"
          >
            🗑️ Clear Token
          </button>
        </div>
      </div>
    </div>
  );
}