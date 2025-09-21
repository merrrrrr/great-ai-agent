import React, { useState } from 'react';
import CampaignPreview from './CampaignPreview';

function CampaignForm() {
  const [formData, setFormData] = useState({
    description: '',
    image: null
  });
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generationType, setGenerationType] = useState('campaign');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔥 Generate button clicked');
    console.log('📝 Form data:', formData);
    console.log('🌐 API URL:', process.env.REACT_APP_API_BASE_URL);
    
    setLoading(true);

    // Use JSON instead of FormData for now
    const payload = {
      description: formData.description,
      targetAudience: 'general audience',
      platform: 'Instagram'
    };

    console.log('📤 Sending payload:', payload);

    try {
      let endpoint;
      switch(generationType) {
        case 'text': endpoint = '/generateText'; break;
        case 'image': endpoint = '/generateImage'; break;
        default: endpoint = '/generateCampaign';
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ API Response:', result);
      
      // Add form data to result for saving
      const campaignWithFormData = {
        ...result,
        description: formData.description,
        targetAudience: payload.targetAudience,
        platform: payload.platform
      };
      
      setCampaign(campaignWithFormData);
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="campaign-form">
      <div className="form-section">
        <h2>Create New Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Generation Type:</label>
            <select 
              value={generationType} 
              onChange={(e) => setGenerationType(e.target.value)}
            >
              <option value="campaign">Complete Campaign (Text + Image)</option>
              <option value="text">Text Only (Caption + Hashtags)</option>
              <option value="image">Image Only</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Describe your product/campaign goal:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g., Eco-friendly water bottles for active lifestyle..."
              required
            />
          </div>
          
          <div className="form-group">
            <label>Upload reference image (optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : `Generate ${generationType === 'campaign' ? 'Campaign' : generationType === 'text' ? 'Text' : 'Image'}`}
          </button>
        </form>
      </div>

      {campaign && (
        <div className="preview-section">
          <CampaignPreview campaign={campaign} generationType={generationType} />
        </div>
      )}
    </div>
  );
}

export default CampaignForm;