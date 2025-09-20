const dbClient = require('../../utils/dbClient');

exports.handler = async (event) => {
  try {
    // Get user ID from Cognito token (simplified for demo)
    const userId = event.requestContext?.authorizer?.claims?.sub || 'demo-user';
    
    const campaigns = await dbClient.getCampaigns(userId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(campaigns)
    };
    
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch campaigns',
        details: error.message 
      })
    };
  }
};