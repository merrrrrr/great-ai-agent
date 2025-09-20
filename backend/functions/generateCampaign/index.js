const bedrockClient = require('../../utils/bedrockClient');
const comprehendClient = require('../../utils/comprehendClient');
const s3Client = require('../../utils/s3Client');

exports.handler = async (event) => {
  try {
    const { description, targetAudience, platform } = JSON.parse(event.body);
    
    // Generate enhanced campaign text using Bedrock
    const prompt = `Create a compelling ${platform} campaign for: ${description}. Target audience: ${targetAudience}. Generate a catchy caption that's engaging and platform-appropriate.`;
    
    const caption = await bedrockClient.generateText(prompt);
    
    // Extract keywords and generate hashtags
    const keywords = await comprehendClient.extractKeywords(description + ' ' + caption);
    const hashtags = await comprehendClient.generateHashtags(keywords);
    
    // Generate image if no file uploaded
    let imageUrl = null;
    if (!event.image) {
      const imagePrompt = `Professional product photo for ${description}, high quality, marketing style, clean background`;
      const imageBase64 = await bedrockClient.generateImage(imagePrompt);
      imageUrl = await s3Client.uploadImage(imageBase64, 'generated-image.png');
    }
    
    const response = {
      caption: caption.trim(),
      hashtags,
      keywords,
      imageUrl,
      platform,
      description,
      targetAudience
    };
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Error generating campaign:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate campaign',
        details: error.message 
      })
    };
  }
};