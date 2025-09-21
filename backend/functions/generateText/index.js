const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const { description, targetAudience, platform, contentStyle } = JSON.parse(event.body);
    
    const formattedPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a marketing expert. You must respond with valid JSON only.
<|eot_id|><|start_header_id|>user<|end_header_id|>
Create an engaging ${platform || 'Instagram'} caption for: ${description}
Target audience: ${targetAudience || 'general audience'}
Content style: ${contentStyle || 'professional'}

Respond with valid JSON in this exact format:
{
  "caption": "engaging social media caption",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "target_audience": "target demographic"
}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_TEXT_MODEL,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: formattedPrompt,
        max_gen_len: 4000,
        temperature: 0.5,
        top_p: 0.9,
        stop: ["<|eot_id|>", "<|end_of_text|>"]
      })
    });

    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    if (result.generation) {
      let generatedText = result.generation.trim();
      const jsonStart = generatedText.indexOf('{');
      const jsonEnd = generatedText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonText = generatedText.substring(jsonStart, jsonEnd + 1);
        const parsedJson = JSON.parse(jsonText);
        
        const keywords = description.toLowerCase().split(' ').filter(word => word.length > 2);
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
          },
          body: JSON.stringify({
            caption: parsedJson.caption,
            hashtags: parsedJson.hashtags || [],
            keywords,
            createdAt: new Date().toISOString()
          })
        };
      }
    }
    
    throw new Error('Invalid JSON in Bedrock response');
    
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