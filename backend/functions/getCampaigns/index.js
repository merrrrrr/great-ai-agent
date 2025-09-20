const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-5" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.CAMPAIGNS_TABLE;

exports.handler = async (event) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": 'demo-user'
      }
    });
    
    const response = await docClient.send(command);
    const campaigns = response.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
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