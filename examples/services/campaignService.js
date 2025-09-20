async function generateCampaign(description, imagePath) {
  // Generate enhanced campaign content
  const prompt = `Create a marketing campaign for: ${description}. 
  Generate:
  1. A compelling caption (max 150 words)
  2. 5 relevant hashtags
  3. A detailed image description for product visualization
  
  Format as JSON: {"caption": "", "hashtags": [], "imagePrompt": ""}`;
  
  const campaign = await generateText(prompt);
  console.log('Bedrock AI Response:', campaign);
  
  // Extract keywords from description
  const keywords = extractKeywords(description);
  
  // ✅ Generate AI image based on the description
  let imageUrl = "https://picsum.photos/512/512"; // fallback
  
  try {
    console.log('🎨 Generating AI image...');
    
    // Create detailed image prompt
    const imagePrompt = campaign.imagePrompt || 
      `Professional product photography of ${description}, clean white background, high quality, commercial photography style`;
    
    const imageBuffer = await generateImage(imagePrompt);
    
    if (imageBuffer && imageBuffer.length > 0) {
      // Upload to S3 and get URL
      const key = `campaigns/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
      imageUrl = await uploadToS3(imageBuffer, key);
      console.log('✅ AI image generated and uploaded:', imageUrl);
    }
  } catch (imageError) {
    console.error('❌ Image generation failed, using placeholder:', imageError.message);
    // Keep the placeholder URL as fallback
  }
  
  return {
    id: uuidv4(),
    description,
    caption: campaign.caption,
    hashtags: campaign.hashtags,
    keywords,
    imageUrl, // ✅ Now using AI-generated image URL
    createdAt: new Date()
  };
}