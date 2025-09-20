const AWS = require('aws-sdk');

const bedrock = new AWS.BedrockRuntime({
  region: 'us-east-1'  // Bedrock is available in us-east-1
});

const bedrockClient = {
  async generateText(prompt) {
    const params = {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    };

    const response = await bedrock.invokeModel(params).promise();
    const result = JSON.parse(response.body.toString());
    return result.content[0].text;
  },

  async generateImage(prompt) {
    const params = {
      modelId: 'amazon.titan-image-generator-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        taskType: 'TEXT_IMAGE',
        textToImageParams: {
          text: prompt
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          quality: 'standard',
          cfgScale: 8.0,
          height: 512,
          width: 512
        }
      })
    };

    const response = await bedrock.invokeModel(params).promise();
    const result = JSON.parse(response.body.toString());
    return result.images[0];
  }
};

module.exports = bedrockClient;