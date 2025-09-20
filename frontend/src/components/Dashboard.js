import React from 'react';

function Dashboard({ setCurrentView }) {
  return (
    <div className="dashboard">
      <div className="hero-section">
        <h2>Welcome to Great AI Agent</h2>
        <p>AI-powered content generation for Malaysian SMEs</p>
        <button 
          className="cta-button"
          onClick={() => setCurrentView('create')}
        >
          Create Your First Campaign
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>🎯 Smart Campaigns</h3>
          <p>AI-generated captions and hashtags</p>
        </div>
        <div className="feature-card">
          <h3>🎨 Visual Content</h3>
          <p>Product images with Nova Canvas</p>
        </div>
        <div className="feature-card">
          <h3>📊 Trend Analysis</h3>
          <p>Keyword insights with smart extraction</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;