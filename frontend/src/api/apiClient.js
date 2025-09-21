import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-gateway-id.execute-api.ap-southeast-5.amazonaws.com/dev';

const apiClient = {
  async generateCampaign(data) {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('targetAudience', data.targetAudience);
    formData.append('platform', data.platform);
    
    if (data.file) {
      formData.append('image', data.file);
    }

    const response = await axios.post(`${API_BASE_URL}/generateCampaign`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async saveCampaign(campaignData) {
    const response = await axios.post(`${API_BASE_URL}/saveCampaign`, campaignData);
    return response.data;
  },

  async getCampaigns() {
    const response = await axios.get(`${API_BASE_URL}/getCampaigns`);
    return response.data;
  },

  async auth(action, data) {
    const response = await axios.post(`${API_BASE_URL}/auth`, { action, ...data });
    return response.data;
  }
};

export default apiClient;