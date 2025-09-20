const dbClient = require('../../utils/dbClient');

exports.handler = async (event) => {
  try {
    const campaignData = JSON.parse(event.body);
    
    // Add user ID from Cognito token (simplified for demo)
    const userId = event.requestContext?.authorizer?.claims?.sub || 'demo-user';
    
    const savedCampaign = await dbClient.saveCampaign({
      ...campaignData,
      userId
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(savedCampaign)
    };
    
  } catch (error) {
    console.error('Error saving campaign:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to save campaign',
        details: error.message 
      })
    };
  }
};