import React, { useState } from 'react';
import CampaignForm from './CampaignForm';
import ContentPreview from './ContentPreview';
import CampaignHistory from './CampaignHistory';

const Dashboard = ({ user }) => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const handleContentGenerated = (content) => {
    setGeneratedContent(content);
  };

  const handleCampaignSaved = (campaign) => {
    setCampaigns([campaign, ...campaigns]);
  };

  return (
    <div className="dashboard">
      <div>
        <CampaignForm 
          onContentGenerated={handleContentGenerated}
          onCampaignSaved={handleCampaignSaved}
        />
        <CampaignHistory campaigns={campaigns} />
      </div>
      <div>
        <ContentPreview content={generatedContent} />
      </div>
    </div>
  );
};

export default Dashboard;