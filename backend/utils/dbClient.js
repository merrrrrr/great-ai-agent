const { MongoClient } = require('mongodb');

let cachedDb = null;

const dbClient = {
  async connect() {
    if (cachedDb) return cachedDb;
    
    const client = new MongoClient(process.env.DB_URI);
    await client.connect();
    cachedDb = client.db(process.env.DB_NAME);
    return cachedDb;
  },

  async saveCampaign(campaignData) {
    const db = await this.connect();
    const collection = db.collection('campaigns');
    
    const campaign = {
      ...campaignData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(campaign);
    return { ...campaign, _id: result.insertedId };
  },

  async getCampaigns(userId, limit = 20) {
    const db = await this.connect();
    const collection = db.collection('campaigns');
    
    return await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
};

module.exports = dbClient;