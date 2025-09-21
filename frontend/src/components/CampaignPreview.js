import React from 'react';

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
      <h3>{generationType === 'campaign' ? 'Campaign Preview' : generationType === 'text' ? 'Generated Text' : 'Generated Image'}</h3>
      
      {generationType === 'image' ? (
        <div className="image-only-preview">
          <img src={campaign.imageUrl} alt="Generated image" style={{maxWidth: '400px', borderRadius: '8px'}} />
        </div>
      ) : generationType === 'text' ? (
        <div className="text-only-preview">
          <div className="caption-box">
            <h4>Caption:</h4>
            <p>{campaign.caption}</p>
          </div>
          <div className="hashtags-box">
            <h4>Hashtags:</h4>
            <div className="hashtags">
              {campaign.hashtags?.map((tag, index) => (
                <span key={index} className="hashtag">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="keywords-box">
            <h4>Keywords:</h4>
            <p>{campaign.keywords?.join(', ')}</p>
          </div>
        </div>
      ) : (
        <div className="social-mockup">
          <div className="instagram-post">
            <div className="post-header">
              <div className="profile-pic"></div>
              <span>your_business</span>
            </div>
            
            <div className="post-image">
              {campaign.imageUrl ? (
                <img src={campaign.imageUrl} alt="Generated content" />
              ) : (
                <div className="placeholder-image">Generated Image</div>
              )}
            </div>
            
            <div className="post-content">
              <p className="caption">{campaign.caption}</p>
              <div className="hashtags">
                {campaign.hashtags?.map((tag, index) => (
                  <span key={index} className="hashtag">#{tag}</span>
                ))}
              </div>
              <div className="keywords">
                <strong>Keywords:</strong> {campaign.keywords?.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button className="save-button" onClick={handleSave}>
        Save {generationType === 'campaign' ? 'Campaign' : generationType === 'text' ? 'Text' : 'Image'}
      </button>
    </div>
  );
}

export default CampaignPreview;