import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './Dashboard.css';

const Dashboard = ({ user, onNavigate }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    averageEngagement: 0,
    timeSaved: 0,
    totalReach: 0
  });
  
  const [trendingHashtags] = useState([
    '#AI', '#Marketing', '#SocialMedia', '#ContentCreation', '#DigitalMarketing',
    '#Branding', '#Innovation', '#TechTrends', '#Automation', '#Growth'
  ]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await apiClient.getCampaigns();
      setCampaigns(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (campaignData) => {
    const total = campaignData.length;
    const avgEng = total > 0 ? Math.floor(Math.random() * 500) + 200 : 0;
    const timeSaved = total * 2.5;
    const totalReach = campaignData.reduce((sum) => sum + Math.floor(Math.random() * 10000), 0);

    setStats({
      totalCampaigns: total,
      averageEngagement: avgEng,
      timeSaved: timeSaved,
      totalReach: totalReach
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Campaign Dashboard</h1>
          <button onClick={() => onNavigate('create')} className="create-button">
            + New Campaign
          </button>
        </div>
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalCampaigns}</h3>
                <p className="stat-label">Total Campaigns</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.averageEngagement}</h3>
                <p className="stat-label">Avg Engagement</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.timeSaved}h</h3>
                <p className="stat-label">Time Saved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.totalReach.toLocaleString()}</h3>
                <p className="stat-label">Total Reach</p>
              </div>
            </div>
          </div>
        </section>

        <div className="content-grid">
          <section className="campaigns-section">
            <h2 className="section-title">Recent Activity</h2>
          {campaigns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No campaigns yet</h3>
              <p>Create your first AI-powered campaign to get started</p>
              <button onClick={() => onNavigate('create')} className="create-first-button">
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="activity-list">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="activity-item">
                  <div className="activity-thumbnail">
                    <img src={campaign.imageUrl} alt={campaign.description} />
                  </div>
                  <div className="activity-details">
                    <h4>Campaign Created</h4>
                    <p>{campaign.description}</p>
                    <span className="activity-time">{formatDate(campaign.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </section>
          
          <section className="trending-section">
            <h2 className="section-title">Trending Hashtags</h2>
            <div className="hashtags-grid">
              {trendingHashtags.map((hashtag, index) => (
                <span key={index} className="trending-hashtag">
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

export default Dashboard;