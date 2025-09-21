import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './CampaignHistory.css';

const CampaignHistory = ({ user, onNavigate }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getCampaigns`);
      const data = await response.json();
      setCampaigns(data);
=======
      const data = await apiClient.getCampaigns();
      
      if (data && Array.isArray(data)) {
        const campaignsWithStatus = data.map(campaign => ({
          ...campaign,
          status: Math.random() > 0.5 ? 'Published' : 'Draft',
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          platform: ['Instagram', 'Facebook', 'Twitter'][Math.floor(Math.random() * 3)],
          performance: Math.floor(Math.random() * 100)
        }));
        setCampaigns(campaignsWithStatus);
      } else {
        setCampaigns([]);
      }
>>>>>>> 0d2d2b817a64f18068a9e5a1ce9706a6cb987c2e
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    filter === 'All' || campaign.status === filter
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'performance':
        aValue = a.performance;
        bValue = b.performance;
        break;
      case 'engagement':
        aValue = a.likes + a.comments + a.shares;
        bValue = b.likes + b.comments + b.shares;
        break;
      default:
        aValue = a.description;
        bValue = b.description;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getCounts = () => ({
    All: campaigns.length,
    Published: campaigns.filter(c => c.status === 'Published').length,
    Draft: campaigns.filter(c => c.status === 'Draft').length
  });

  const counts = getCounts();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAction = (action, campaign) => {
    console.log('Action clicked:', action, campaign);
    switch (action) {
      case 'view':
        console.log('Setting selected campaign:', campaign);
        setSelectedCampaign(campaign);
        console.log('Selected campaign state after set:', selectedCampaign);
        break;
      case 'edit':
        onNavigate('create', campaign);
        break;
      case 'duplicate':
        const duplicated = { ...campaign, id: Date.now().toString(), description: `Copy of ${campaign.description}` };
        setCampaigns([duplicated, ...campaigns]);
        break;
      case 'publish':
        setCampaigns(campaigns.map(c => c.id === campaign.id ? { ...c, status: 'Published' } : c));
        break;
    }
  };

  const closeModal = () => {
    setSelectedCampaign(null);
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="history-title">Campaign Analytics</h1>
            <p className="history-subtitle">Track performance and manage your marketing campaigns</p>
          </div>
          <button onClick={() => onNavigate('create')} className="create-btn">
            <span className="btn-icon">+</span>
            New Campaign
          </button>
        </div>
      </div>

      <div className="controls-section">
        <div className="filter-controls">
          <div className="filter-tabs">
            {['All', 'Published', 'Draft'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`filter-tab ${filter === filterOption ? 'active' : ''}`}
              >
                {filterOption}
                <span className="count">({counts[filterOption]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="performance">Sort by Performance</option>
            <option value="engagement">Sort by Engagement</option>
          </select>
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {sortedCampaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No campaigns found</h3>
          <p>No campaigns match the selected filter</p>
          <button onClick={() => onNavigate('create')} className="create-first-btn">
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="campaigns-table">
          <div className="table-header">
            <div className="col-campaign">Campaign</div>
            <div className="col-status">Status</div>
            <div className="col-platform">Platform</div>
            <div className="col-engagement">Engagement</div>
            <div className="col-performance">Performance</div>
            <div className="col-date">Created</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {sortedCampaigns.map((campaign) => (
              <div key={campaign.id} className="table-row">
                <div className="col-campaign">
                  <div className="campaign-info">
                    <div className="campaign-image">
                      {campaign.imageUrl ? (
                        <img src={campaign.imageUrl} alt={campaign.description} />
                      ) : (
                        <div className="placeholder">📷</div>
                      )}
                    </div>
                    <div className="campaign-details">
                      <h4 className="campaign-name">
                        {(campaign.description || 'Untitled Campaign').substring(0, 40)}...
                      </h4>
                      <p className="campaign-desc">
                        {(campaign.caption || 'No description').substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-status">
                  <span className={`status-badge ${campaign.status.toLowerCase()}`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="col-platform">
                  <span className="platform-tag">{campaign.platform}</span>
                </div>
                
                <div className="col-engagement">
                  <div className="engagement-stats">
                    <span className="stat">❤️ {campaign.likes}</span>
                    <span className="stat">💬 {campaign.comments}</span>
                    <span className="stat">🔄 {campaign.shares}</span>
                  </div>
                </div>
                
                <div className="col-performance">
                  <div className="performance-bar">
                    <div 
                      className="performance-fill" 
                      style={{ width: `${campaign.performance}%` }}
                    ></div>
                    <span className="performance-text">{campaign.performance}%</span>
                  </div>
                </div>
                
                <div className="col-date">
                  <span className="date-text">{formatDate(campaign.createdAt)}</span>
                </div>
                
                <div className="col-actions">
                  <div className="action-buttons">
                    <button className="action-btn view" title="View campaign details" onClick={() => handleAction('view', campaign)}>👁️</button>
                    <button className="action-btn edit" title="Edit this campaign" onClick={() => handleAction('edit', campaign)}>✏️</button>
                    <button className="action-btn duplicate" title="Create a copy of this campaign" onClick={() => handleAction('duplicate', campaign)}>📋</button>
                    {campaign.status === 'Draft' && (
                      <button className="action-btn publish" title="Publish this campaign" onClick={() => handleAction('publish', campaign)}>🚀</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedCampaign && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'}} onClick={closeModal}>
          <div style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '0', borderRadius: '16px', maxWidth: '600px', width: '90%', color: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(79, 172, 254, 0.3)', overflow: 'hidden'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(79, 172, 254, 0.2)', background: 'rgba(30, 30, 30, 0.8)'}}>
              <h2 style={{margin: 0, color: '#4facfe', fontSize: '1.5rem', fontWeight: '600'}}>Campaign Details</h2>
              <button onClick={closeModal} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '8px', borderRadius: '4px', transition: 'all 0.3s ease'}} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.target.style.background = 'none'}>×</button>
            </div>
            <div style={{padding: '24px', maxHeight: '70vh', overflowY: 'auto'}}>
              {selectedCampaign.imageUrl && (
                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                  <img src={selectedCampaign.imageUrl} alt="Campaign" style={{maxWidth: '100%', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'}} />
                </div>
              )}
              <div style={{display: 'grid', gap: '16px'}}>
                <div style={{padding: '12px', background: 'rgba(79, 172, 254, 0.1)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                  <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Description</div>
                  <div style={{fontSize: '0.95rem', lineHeight: '1.5'}}>{selectedCampaign.description}</div>
                </div>
                <div style={{padding: '12px', background: 'rgba(79, 172, 254, 0.1)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                  <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Caption</div>
                  <div style={{fontSize: '0.95rem', lineHeight: '1.5'}}>{selectedCampaign.caption}</div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <div style={{padding: '12px', background: 'rgba(30, 30, 30, 0.6)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                    <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Status</div>
                    <span style={{padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: selectedCampaign.status === 'Published' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)', color: selectedCampaign.status === 'Published' ? '#34d399' : '#fbbf24', border: selectedCampaign.status === 'Published' ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)'}}>{selectedCampaign.status}</span>
                  </div>
                  <div style={{padding: '12px', background: 'rgba(30, 30, 30, 0.6)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                    <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Platform</div>
                    <span style={{padding: '4px 12px', background: 'rgba(79, 172, 254, 0.1)', border: '1px solid rgba(79, 172, 254, 0.3)', borderRadius: '12px', color: '#4facfe', fontSize: '0.75rem', fontWeight: '500'}}>{selectedCampaign.platform}</span>
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <div style={{padding: '12px', background: 'rgba(30, 30, 30, 0.6)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                    <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Created</div>
                    <div style={{fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)'}}>{formatDate(selectedCampaign.createdAt)}</div>
                  </div>
                  <div style={{padding: '12px', background: 'rgba(30, 30, 30, 0.6)', borderRadius: '8px', border: '1px solid rgba(79, 172, 254, 0.2)'}}>
                    <div style={{color: '#4facfe', fontSize: '0.875rem', fontWeight: '600', marginBottom: '4px'}}>Engagement</div>
                    <div style={{fontSize: '0.75rem', display: 'flex', gap: '8px'}}>
                      <span>❤️ {selectedCampaign.likes}</span>
                      <span>💬 {selectedCampaign.comments}</span>
                      <span>🔄 {selectedCampaign.shares}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignHistory;