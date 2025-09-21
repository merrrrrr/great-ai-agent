const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const s3Client = new S3Client({ region: "ap-southeast-5" });

exports.handler = async (event) => {
  try {
    const { description } = JSON.parse(event.body);
    
    const prompt = `Product photography of ${description}, professional lighting, clean background, high quality, commercial style`;

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_IMAGE_MODEL,
      body: JSON.stringify({
        taskType: "TEXT_IMAGE",
        textToImageParams: {
          text: prompt,
          negativeText: "blurry, low quality, distorted"
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          height: 512,
          width: 512,
          cfgScale: 8.0,
          seed: Math.floor(Math.random() * 1000000)
        }
      })
    });

    const response = await bedrockClient.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    const imageData = result.images[0];
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    const key = `campaigns/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png'
    };
    
    await s3Client.send(new PutObjectCommand(uploadParams));
    const imageUrl = `https://${process.env.S3_BUCKET}.s3.ap-southeast-5.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        imageUrl,
        createdAt: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Error generating image:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message 
      })
    };
  }
};