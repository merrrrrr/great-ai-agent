import React, { useState, useEffect } from 'react';
import './Homepage.css';

const Homepage = ({ user, onNavigate }) => {
  const [trendingHashtags] = useState([
    '#AI', '#Marketing', '#SocialMedia', '#ContentCreation', '#DigitalMarketing',
    '#Branding', '#Innovation', '#TechTrends', '#Automation', '#Growth'
  ]);

  const [dailyTrends] = useState([
    { topic: 'AI-Generated Content', engagement: '↗ 45%', color: '#4facfe' },
    { topic: 'Video Marketing', engagement: '↗ 32%', color: '#00f2fe' },
    { topic: 'Influencer Partnerships', engagement: '↗ 28%', color: '#4facfe' },
    { topic: 'Interactive Posts', engagement: '↗ 23%', color: '#00f2fe' }
  ]);

  return (
    <div className="homepage">
      <main className="homepage-main">
        <section className="hero-section">
          <h2 className="hero-title">AI-Powered Marketing Campaigns</h2>
          <p className="hero-subtitle">Create engaging content with artificial intelligence</p>
          
          <div className="quick-actions">
            <button onClick={() => onNavigate('create')} className="action-button primary">
              <span className="action-icon">✨</span>
              Generate Campaign
            </button>
            <button onClick={() => onNavigate('dashboard')} className="action-button secondary">
              <span className="action-icon">📊</span>
              View Analytics
            </button>
          </div>
        </section>

        <div className="content-grid">
          <section className="trending-section">
            <h3 className="section-title">Daily Content Trends</h3>
            <div className="trends-list">
              {dailyTrends.map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-info">
                    <span className="trend-topic">{trend.topic}</span>
                    <span className="trend-engagement" style={{ color: trend.color }}>
                      {trend.engagement}
                    </span>
                  </div>
                  <div className="trend-bar">
                    <div 
                      className="trend-progress" 
                      style={{ 
                        width: `${parseInt(trend.engagement)}%`,
                        background: `linear-gradient(90deg, ${trend.color}, ${trend.color}80)`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="hashtags-section">
            <h3 className="section-title">Trending Hashtags</h3>
            <div className="hashtags-grid">
              {trendingHashtags.map((hashtag, index) => (
                <span key={index} className="hashtag-tag">
                  {hashtag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Homepage;