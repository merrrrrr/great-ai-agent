const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-5" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.CAMPAIGNS_TABLE;

exports.handler = async (event) => {
  try {
    const campaignData = JSON.parse(event.body);
    
    // Add timestamp and ID if not present
    const campaignToSave = {
      ...campaignData,
      id: campaignData.id || Date.now().toString(),
      createdAt: campaignData.createdAt || new Date().toISOString(),
      userId: 'demo-user'
    };
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: campaignToSave
    });
    
    await docClient.send(command);
    const savedCampaign = campaignToSave;
    
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