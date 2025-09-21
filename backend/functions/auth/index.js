const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-5" });
const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = process.env.USERS_TABLE || 'users';

exports.handler = async (event) => {
  const { action, email, password, name } = JSON.parse(event.body);
  
  try {
    if (action === 'register') {
      // Check if user exists
      const existingUser = await docClient.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { email }
      }));
      
      if (existingUser.Item) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'User already exists' })
        };
      }
      
      // Create user (simple password storage for demo)
      const user = {
        email,
        password, // In production, hash this
        name,
        createdAt: new Date().toISOString()
      };
      
      await docClient.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: user
      }));
      
      return {
        statusCode: 201,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ user: { email, name } })
      };
    }
    
    if (action === 'login') {
      const user = await docClient.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { email }
      }));
      
      if (!user.Item || user.Item.password !== password) {
        return {
          statusCode: 401,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
      
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ user: { email, name: user.Item.name } })
      };
    }
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};