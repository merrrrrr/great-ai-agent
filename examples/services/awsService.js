const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function generateText(prompt) {
  console.log('🔍 Generating text with prompt:', prompt.substring(0, 100) + '...');
  
  // Format prompt for Llama 3
  const formattedPrompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a marketing expert. You must respond with valid JSON only. No additional text before or after the JSON.
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
      max_gen_len: 4000, // Increased from 3000
      temperature: 0.5,  // Reduced for more consistent output
      top_p: 0.9,
      stop: ["<|eot_id|>", "<|end_of_text|>"] // Add stop tokens
    })
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);

    const decoded = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decoded);
    
    console.log('✅ Bedrock response received');
    console.log('Raw generation:', responseBody.generation); // Debug log
    
    if (responseBody.generation) {
      let generatedText = responseBody.generation.trim();
      
      // Remove any leading/trailing text that's not JSON
      const jsonStart = generatedText.indexOf('{');
      const jsonEnd = generatedText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonText = generatedText.substring(jsonStart, jsonEnd + 1);
        try {
          return JSON.parse(jsonText);
        } catch (e) {
          console.error('Failed to parse extracted JSON:', e.message);
          console.error('Extracted text:', jsonText);
          throw new Error('Invalid JSON in Bedrock response');
        }
      }
      
      throw new Error('No valid JSON found in Bedrock response');
    }
    
    throw new Error("No generation returned from Llama 3");
  } catch (error) {
    console.error('❌ Error in generateText:', error);
    throw error;
  }
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Upload buffer to S3 and return public URL
async function uploadToS3(buffer, key, contentType = "image/png") {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read"
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
}

// Generate image using Titan Image Generator G1
async function generateImage(prompt) {
  console.log("🎨 Starting image generation with prompt:", prompt);
  
  const input = {
    modelId: "amazon.titan-image-generator-v1:0", // Try this model ID instead
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      taskType: "TEXT_IMAGE", // Add task type
      textToImageParams: {
        text: prompt,
        negativeText: "blurry, low quality, distorted" // Optional negative prompt
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        height: 512,
        width: 512,
        cfgScale: 8.0, // Guidance scale
        seed: Math.floor(Math.random() * 1000000) // Random seed
      }
    })
  };

  console.log("📤 Sending request to Bedrock:", JSON.stringify(input, null, 2));

  try {
    const command = new InvokeModelCommand(input);
    const response = await bedrockClient.send(command);

    console.log("📥 Raw response received, body length:", response.body.length);

    const decoded = new TextDecoder().decode(response.body);
    console.log("🔍 Decoded response:", decoded.substring(0, 200) + "...");

    let responseBody;
    try {
      responseBody = JSON.parse(decoded);
      console.log("✅ Successfully parsed JSON response");
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e.message);
      console.error("Raw response:", decoded);
      throw new Error("Malformed response from Titan Image Generator");
    }

    console.log("📋 Response structure:", Object.keys(responseBody));

    // Check different possible response structures
    if (responseBody.images && responseBody.images[0]) {
      console.log("✅ Found image in 'images' array");
      return Buffer.from(responseBody.images[0], "base64");
    } else if (responseBody.artifacts && responseBody.artifacts[0] && responseBody.artifacts[0].base64) {
      console.log("✅ Found image in 'artifacts' array");
      return Buffer.from(responseBody.artifacts[0].base64, "base64");
    } else if (responseBody.image) {
      console.log("✅ Found image in 'image' field");
      return Buffer.from(responseBody.image, "base64");
    } else {
      console.error("❌ No image found in response");
      console.error("Full response:", JSON.stringify(responseBody, null, 2));
      throw new Error("No image data found in Titan response");
    }

  } catch (error) {
    console.error("❌ Error during image generation:", error);
    
    // Check if it's a model access issue
    if (error.message && error.message.includes("AccessDeniedException")) {
      throw new Error("Access denied to Titan Image Generator. Please check model access in AWS Bedrock console.");
    }
    
    // Check if it's a region issue
    if (error.message && error.message.includes("ValidationException")) {
      throw new Error("Model validation failed. Check if the model is available in your region (us-east-1).");
    }
    
    throw error;
  }
}

// Alternative function to try different model versions
async function generateImageFallback(prompt) {
  const models = [
    "amazon.titan-image-generator-v1:0",
    "amazon.titan-image-generator-g1:latest",
    "stability.stable-diffusion-xl-base-v1-0" // Alternative model
  ];

  for (const modelId of models) {
    try {
      console.log(`🔄 Trying model: ${modelId}`);
      
      const input = {
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(
          modelId.includes("stability") ? {
            // Stable Diffusion format
            text_prompts: [{ text: prompt }],
            cfg_scale: 10,
            seed: 0,
            steps: 50,
            width: 512,
            height: 512
          } : {
            // Titan format
            taskType: "TEXT_IMAGE",
            textToImageParams: { text: prompt },
            imageGenerationConfig: {
              numberOfImages: 1,
              height: 512,
              width: 512,
              cfgScale: 8.0
            }
          }
        )
      };

      const command = new InvokeModelCommand(input);
      const response = await bedrockClient.send(command);
      const decoded = new TextDecoder().decode(response.body);
      const responseBody = JSON.parse(decoded);

      // Handle different response formats
      if (responseBody.images && responseBody.images[0]) {
        return Buffer.from(responseBody.images[0], "base64");
      } else if (responseBody.artifacts && responseBody.artifacts[0]) {
        return Buffer.from(responseBody.artifacts[0].base64, "base64");
      } else if (responseBody.image) {
        return Buffer.from(responseBody.image, "base64");
      }
      
    } catch (error) {
      console.log(`❌ Failed with ${modelId}:`, error.message);
      continue;
    }
  }
  
  throw new Error("All image generation models failed");
}


function extractKeywords(text) {
  // Remove punctuation, split by spaces, filter out short/common words
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
}

// Only run CLI if called directly
if (require.main === module) {
  async function main() {
    const prompt = process.argv.slice(2).join(" ");
    if (!prompt) {
      console.log("Usage: node generateImageCLI.js <your prompt>");
      return;
    }

    try {
      console.log("Generating image for prompt:", prompt);
      const imageBuffer = await generateImage(prompt);

      if (!imageBuffer || imageBuffer.length === 0) {
        console.error("❌ Image generation failed: no data returned from Titan.");
        return;
      }

      console.log("✅ Image generated successfully! Buffer size:", imageBuffer.length);

      const key = `cli-images/${Date.now()}.png`;
      const url = await uploadToS3(imageBuffer, key);

      console.log("✅ Image uploaded successfully!");
      console.log("S3 URL:", url);
    } catch (err) {
      console.error("❌ Failed to generate/upload image:", err.message);
    }
  }

  main();
}
