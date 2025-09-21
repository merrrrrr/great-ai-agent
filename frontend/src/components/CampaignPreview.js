import React from 'react';
import './CampaignPreview.css';

function CampaignPreview({ campaign, onSave, generationType = 'campaign' }) {
  const handleSave = async () => {
    try {
      const saveData = {
        id: Date.now().toString(),
        ...campaign,
        type: generationType
      };
      
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/saveCampaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
      
      alert(`${generationType === 'campaign' ? 'Campaign' : generationType === 'text' ? 'Text' : 'Image'} saved successfully!`);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving content');
    }
  };

  return (
    <div className="campaign-preview">
      <div className="preview-header">
        <h3 className="preview-title">
          {generationType === 'campaign' ? '✨ Campaign Preview' : generationType === 'text' ? '📝 Generated Text' : '🖼️ Generated Image'}
        </h3>
      </div>
      
      {generationType === 'image' ? (
        <div className="image-only-preview">
          <div className="image-container">
            <img src={campaign.imageUrl} alt="Generated image" className="generated-image" />
          </div>
        </div>
      ) : generationType === 'text' ? (
        <div className="text-only-preview">
          <div className="content-section">
            <div className="section-header">
              <h4 className="section-title">📝 Caption</h4>
            </div>
            <div className="caption-content">
              <p>{campaign.caption}</p>
            </div>
          </div>
          
          <div className="content-section">
            <div className="section-header">
              <h4 className="section-title">#️⃣ Hashtags</h4>
            </div>
            <div className="hashtags-container">
              {campaign.hashtags?.map((tag, index) => (
                <span key={index} className="hashtag-tag">{tag}</span>
              ))}
            </div>
          </div>
          
          {campaign.keywords && (
            <div className="content-section">
              <div className="section-header">
                <h4 className="section-title">🔑 Keywords</h4>
              </div>
              <div className="keywords-container">
                {campaign.keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="campaign-mockup">
          <div className="social-post">
            <div className="post-header">
              <div className="profile-avatar">🚀</div>
              <div className="profile-info">
                <span className="profile-name">your_business</span>
                <span className="post-time">Just now</span>
              </div>
            </div>
            
            <div className="post-image-container">
              {campaign.imageUrl ? (
                <img src={campaign.imageUrl} alt="Generated content" className="post-image" />
              ) : (
                <div className="placeholder-image">
                  <span>🖼️ Generated Image</span>
                </div>
              )}
            </div>
            
            <div className="post-actions">
              <div className="action-buttons">
                <span className="action-btn">❤️</span>
                <span className="action-btn">💬</span>
                <span className="action-btn">📤</span>
              </div>
            </div>
            
            <div className="post-content">
              <div className="post-stats">
                <span className="likes">234 likes</span>
              </div>
              <div className="post-caption">
                <span className="username">your_business</span>
                <span className="caption-text">{campaign.caption}</span>
              </div>
              <div className="post-hashtags">
                {campaign.hashtags?.slice(0, 5).map((tag, index) => (
                  <span key={index} className="post-hashtag">{tag}</span>
                ))}
              </div>
              {campaign.keywords && (
                <div className="post-keywords">
                  <span className="keywords-label">Keywords:</span>
                  <span className="keywords-list">{campaign.keywords.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="preview-actions">
        <button className="save-button" onClick={handleSave}>
          <span className="button-icon">💾</span>
          Save {generationType === 'campaign' ? 'Campaign' : generationType === 'text' ? 'Text' : 'Image'}
        </button>
      </div>
    </div>
  );
}

export default CampaignPreview;