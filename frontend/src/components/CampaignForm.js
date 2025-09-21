import React, { useState } from 'react';
import CampaignPreview from './CampaignPreview';
import './CampaignForm.css';

function CampaignForm({ onNavigate }) {
  const [formData, setFormData] = useState({
    description: '',
    contentStyle: '',
    platform: '',
    image: null,
    audience: {
      age: '',
      gender: '',
      location: '',
      language: ''
    }
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
    const audienceDetails = Object.values(formData.audience).filter(v => v).join(', ') || 'general audience';
    const payload = {
      description: formData.description,
      targetAudience: audienceDetails,
      platform: formData.platform || 'Instagram',
      contentStyle: formData.contentStyle
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
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Create New Campaign</h2>
          <p className="form-subtitle">Generate AI-powered marketing content</p>
        </div>
        <div className="form-section">
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Generation Type</label>
              <select 
                className="form-select"
                value={generationType} 
                onChange={(e) => setGenerationType(e.target.value)}
              >
                <option value="campaign">Complete Campaign (Text + Image)</option>
                <option value="text">Text Only (Caption + Hashtags)</option>
                <option value="image">Image Only</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Describe your product/campaign goal</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="e.g., Eco-friendly water bottles for active lifestyle..."
                required
                rows={4}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Content Style</label>
                <select
                  className="form-select"
                  value={formData.contentStyle}
                  onChange={(e) => setFormData({...formData, contentStyle: e.target.value})}
                >
                  <option value="">Select Style</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="creative">Creative</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="bold">Bold</option>
                  <option value="elegant">Elegant</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Platform Format</label>
                <select
                  className="form-select"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="">Select Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>
            
            <div className="audience-section">
              <h3 className="section-title">Target Audience (Malaysia Focus)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age Group</label>
                  <select className="form-select" value={formData.audience.age} onChange={(e) => setFormData({...formData, audience: {...formData.audience, age: e.target.value}})}>
                    <option value="">Select Age</option>
                    <option value="18-24">18-24 (Gen Z)</option>
                    <option value="25-34">25-34 (Millennials)</option>
                    <option value="35-44">35-44 (Gen X)</option>
                    <option value="45-54">45-54 (Gen X)</option>
                    <option value="55+">55+ (Baby Boomers)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={formData.audience.gender} onChange={(e) => setFormData({...formData, audience: {...formData.audience, gender: e.target.value}})}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="All">All Genders</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select className="form-select" value={formData.audience.location} onChange={(e) => setFormData({...formData, audience: {...formData.audience, location: e.target.value}})}>
                    <option value="">Select Location</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Penang">Penang</option>
                    <option value="Johor">Johor</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Perak">Perak</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Terengganu">Terengganu</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Melaka">Melaka</option>
                    <option value="Perlis">Perlis</option>
                    <option value="All Malaysia">All Malaysia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-select" value={formData.audience.language} onChange={(e) => setFormData({...formData, audience: {...formData.audience, language: e.target.value}})}>
                    <option value="">Select Language</option>
                    <option value="Bahasa Malaysia">Bahasa Malaysia</option>
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Bilingual">Bilingual (BM/EN)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Upload reference image (optional)</label>
              <input
                className="form-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => onNavigate('home')} className="cancel-button">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="generate-button">
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="button-icon">✨</span>
                    Generate {generationType === 'campaign' ? 'Campaign' : generationType === 'text' ? 'Text' : 'Image'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {campaign && (
          <div className="preview-section">
            <CampaignPreview campaign={campaign} generationType={generationType} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignForm;