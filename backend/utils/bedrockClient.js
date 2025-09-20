const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1"
});

const s3Client = new S3Client({
  region: "us-east-1"
});

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
    modelId: "meta.llama3-8b-instruct-v1:0",
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
    modelId: "amazon.titan-image-generator-v1:0",
    contentType: "application/json",
    accept: "application/json",
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
  };

  const command = new InvokeModelCommand(input);
  const response = await bedrockClient.send(command);
  const decoded = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decoded);

  if (responseBody.images && responseBody.images[0]) {
    return Buffer.from(responseBody.images[0], "base64");
  } else if (responseBody.artifacts && responseBody.artifacts[0] && responseBody.artifacts[0].base64) {
    return Buffer.from(responseBody.artifacts[0].base64, "base64");
  }
  throw new Error('No image data found in Titan response');
}

async function uploadToS3(buffer, key, contentType = "image/png") {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read"
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
}

function extractKeywords(text) {
  const stopWords = ['the', 'and', 'for', 'with', 'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', 'is', 'it', 'this', 'that'];
  return text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .map(word => word.toLowerCase())
    .filter(word => word.length > 3 && !stopWords.includes(word));
}

module.exports = {
  generateText,
  generateImage,
  extractKeywords,
  uploadToS3
};