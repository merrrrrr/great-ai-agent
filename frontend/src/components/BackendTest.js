import React, { useState } from 'react';

function BackendTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🔥 Testing backend connection...');
      console.log('🌐 API URL:', process.env.REACT_APP_API_BASE_URL);

      // Test with a simple campaign generation request
      const testPayload = {
        description: "Test product for backend connectivity",
        targetAudience: "test audience",
        platform: "Instagram"
      };

      console.log('📤 Sending test payload:', testPayload);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generateCampaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Backend test successful:', result);

      setTestResult({
        success: true,
        message: 'Backend connection successful! ✅',
        data: {
          status: response.status,
          campaignId: result.id,
          caption: result.caption?.substring(0, 100) + '...',
          hashtags: result.hashtags?.slice(0, 3),
          imageGenerated: result.imageUrl ? 'Yes' : 'No'
        }
      });

    } catch (error) {
      console.error('❌ Backend test failed:', error);

      setTestResult({
        success: false,
        message: `Backend connection failed: ${error.message}`,
        error: {
          message: error.message,
          apiUrl: process.env.REACT_APP_API_BASE_URL
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '2rem', 
      borderRadius: '10px', 
      margin: '2rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2>🔧 Backend Connection Test</h2>
      <p>Click the button below to test your backend API connection:</p>
      
      <button 
        onClick={testBackendConnection}
        disabled={loading}
        style={{
          background: loading ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1rem',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {loading ? '🔄 Testing...' : '🚀 Test Backend Connection'}
      </button>

      {testResult && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          <h3>{testResult.success ? '✅ Success!' : '❌ Failed!'}</h3>
          <p><strong>Message:</strong> {testResult.message}</p>
          
          {testResult.success && testResult.data && (
            <div>
              <h4>Response Details:</h4>
              <ul>
                <li><strong>Status:</strong> {testResult.data.status}</li>
                <li><strong>Campaign ID:</strong> {testResult.data.campaignId}</li>
                <li><strong>Caption Preview:</strong> {testResult.data.caption}</li>
                <li><strong>Sample Hashtags:</strong> {testResult.data.hashtags?.join(', ')}</li>
                <li><strong>Image Generated:</strong> {testResult.data.imageGenerated}</li>
              </ul>
            </div>
          )}
          
          {!testResult.success && testResult.error && (
            <div>
              <h4>Debug Info:</h4>
              <ul>
                <li><strong>API URL:</strong> {testResult.error.apiUrl || 'Not set'}</li>
                <li><strong>Error:</strong> {testResult.error.message}</li>
              </ul>
              <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginTop: '1rem'}}>
                <strong>Troubleshooting:</strong>
                <ul>
                  <li>Check if your API Gateway URL is correct in `.env`</li>
                  <li>Verify your Lambda functions are deployed</li>
                  <li>Check CORS settings in API Gateway</li>
                  <li>Ensure Bedrock models are enabled in AWS Console</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BackendTest;