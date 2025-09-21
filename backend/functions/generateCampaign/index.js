const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require('uuid');

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const s3Client = new S3Client({ region: "ap-southeast-5" });

async function generateText(prompt) {
  const formattedPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a marketing expert. You must respond with valid JSON only.
<|eot_id|><|start_header_id|>user<|end_header_id|>
${prompt}

Respond with valid JSON in this exact format:
{
  "caption": "engaging social media caption",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "target_audience": "target demographic"
}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>`;

  const input = {
<<<<<<< HEAD
    modelId: process.env.BEDROCK_TEXT_MODEL || "meta.llama3-8b-instruct-v1:0",
=======
    modelId: process.env.BEDROCK_TEXT_MODEL,
>>>>>>> 0d2d2b817a64f18068a9e5a1ce9706a6cb987c2e
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: formattedPrompt,
      max_gen_len: 4000,
      temperature: 0.5,
      top_p: 0.9,
      stop: ["<|eot_id|>", "<|end_of_text|>"]
    })
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);
  const decoded = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decoded);
  
  if (responseBody.generation) {
    let generatedText = responseBody.generation.trim();
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonText = generatedText.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonText);
    }
  }
  throw new Error('Invalid JSON in Bedrock response');
}

async function generateImage(prompt) {
  const input = {
<<<<<<< HEAD
    modelId: process.env.BEDROCK_IMAGE_MODEL || "amazon.nova-canvas-v1:0",
=======
    modelId: process.env.BEDROCK_IMAGE_MODEL,
>>>>>>> 0d2d2b817a64f18068a9e5a1ce9706a6cb987c2e
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: prompt
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        quality: "standard",
        height: 512,
        width: 512,
        cfgScale: 8.0,
        seed: Math.floor(Math.random() * 1000000)
      }
    })
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);
  const decoded = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decoded);

  if (responseBody.images && responseBody.images[0]) {
    return Buffer.from(responseBody.images[0], "base64");
  }
  throw new Error('No image data found in Nova Canvas response');
}

async function uploadToS3(buffer, key, contentType = "image/png") {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${params.Bucket}.s3.ap-southeast-5.amazonaws.com/${key}`;
}

function extractKeywords(text) {
  const stopWords = ['the', 'and', 'for', 'with', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', 'is', 'it', 'this', 'that'];
  return text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .map(word => word.toLowerCase())
    .filter(word => word.length > 3 && !stopWords.includes(word));
}

exports.handler = async (event) => {
  try {
    const { description, targetAudience, platform } = JSON.parse(event.body);
    
    const prompt = `Create a marketing campaign for: ${description}. Target audience: ${targetAudience || 'general audience'}. Platform: ${platform || 'Instagram'}. 
    Generate:
    1. A compelling caption (max 150 words)
    2. 5 relevant hashtags
    3. Target audience description`;
    
    const campaign = await generateText(prompt);
    const keywords = extractKeywords(description);
    
    let imageUrl = "https://picsum.photos/512/512";
    
    try {
      const imagePrompt = `Professional product photography of ${description}, clean white background, high quality, commercial photography style`;
      const imageBuffer = await generateImage(imagePrompt);
      
      if (imageBuffer && imageBuffer.length > 0) {
        const key = `campaigns/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
        imageUrl = await uploadToS3(imageBuffer, key);
      }
    } catch (imageError) {
      console.error('Image generation failed:', imageError.message);
    }
    
    const response = {
      id: uuidv4(),
      description,
      caption: campaign.caption,
      hashtags: campaign.hashtags,
      keywords,
      imageUrl,
      createdAt: new Date()
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