import React from 'react';

const CampaignHistory = ({ campaigns }) => {
  return (
    <div className="campaign-history">
      <h2>Campaign History 📊</h2>
      
      {campaigns.length === 0 ? (
        <p style={{color: '#999', textAlign: 'center', padding: '2rem'}}>
          No campaigns yet. Create your first campaign above!
        </p>
      ) : (
        <div>
          {campaigns.map((campaign, index) => (
            <div key={index} className="campaign-item">
              <h4>{campaign.description?.substring(0, 50)}...</h4>
              <p><strong>Platform:</strong> {campaign.platform}</p>
              <p><strong>Created:</strong> {new Date(campaign.createdAt).toLocaleDateString()}</p>
              <p><strong>Hashtags:</strong> {campaign.hashtags?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignHistory;