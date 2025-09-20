import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const CampaignForm = ({ onContentGenerated, onCampaignSaved }) => {
  const [formData, setFormData] = useState({
    description: '',
    targetAudience: '',
    platform: 'instagram'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const content = await apiClient.generateCampaign({
        ...formData,
        file
      });
      
      onContentGenerated(content);
      
      // Auto-save campaign
      const savedCampaign = await apiClient.saveCampaign(content);
      onCampaignSaved(savedCampaign);
      
    } catch (error) {
      console.error('Campaign generation failed:', error);
      alert('Failed to generate campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-form">
      <h2>Create AI Campaign 🎯</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product/Campaign Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your product or campaign goal..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Target Audience</label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
            placeholder="e.g., Young professionals in Malaysia"
          />
        </div>
        
        <div className="form-group">
          <label>Platform</label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading || !formData.description}
        >
          {loading ? 'Generating...' : 'Generate Campaign ✨'}
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;