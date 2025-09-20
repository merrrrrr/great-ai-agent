const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-5" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.CAMPAIGNS_TABLE || "great-ai-agent-campaigns";

async function saveCampaign(campaignData) {
  const item = {
    id: campaignData.id,
    userId: campaignData.userId || 'demo-user',
    description: campaignData.description,
    caption: campaignData.caption,
    hashtags: campaignData.hashtags,
    keywords: campaignData.keywords,
    imageUrl: campaignData.imageUrl,
    platform: campaignData.platform || 'Instagram',
    targetAudience: campaignData.targetAudience,
    createdAt: campaignData.createdAt,
    updatedAt: new Date().toISOString()
  };

  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  });

  await docClient.send(command);
  return item;
}

async function getCampaigns(userId = 'demo-user') {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  });

  const response = await docClient.send(command);
  return response.Items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  saveCampaign,
  getCampaigns
};