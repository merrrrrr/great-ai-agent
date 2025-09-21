const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const { description, targetAudience, platform } = JSON.parse(event.body);
    
    const prompt = `Create an engaging ${platform} caption for: ${description}
Target audience: ${targetAudience}
Include relevant hashtags and keywords.
Format: Caption text followed by hashtags.`;

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_TEXT_MODEL,
      body: JSON.stringify({
        prompt,
        max_gen_len: 300,
        temperature: 0.7
      })
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    const caption = result.generation.trim();
    const hashtags = caption.match(/#\w+/g) || [];
    const keywords = description.toLowerCase().split(' ').filter(word => word.length > 2);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        caption,
        hashtags,
        keywords,
        createdAt: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Error generating text:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate text',
        details: error.message 
      })
    };
  }
};