const AWS = require('aws-sdk');

const comprehend = new AWS.Comprehend({
  region: 'us-east-1'  // Use same region as Bedrock
});

const comprehendClient = {
  async extractKeywords(text) {
    const params = {
      Text: text,
      LanguageCode: 'en'
    };

    const response = await comprehend.detectKeyPhrases(params).promise();
    return response.KeyPhrases
      .filter(phrase => phrase.Score > 0.8)
      .map(phrase => phrase.Text)
      .slice(0, 10);
  },

  async generateHashtags(keywords) {
    return keywords.map(keyword => 
      '#' + keyword.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    );
  }
};

module.exports = comprehendClient;