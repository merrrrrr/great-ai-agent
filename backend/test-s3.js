const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'ap-southeast-5'
});

const bucketName = process.env.S3_BUCKET || 'great-ai-agent-media';

async function testS3Configuration() {
  try {
    console.log('Testing S3 bucket configuration...');
    
    // Test bucket exists
    await s3.headBucket({ Bucket: bucketName }).promise();
    console.log('✅ Bucket exists');
    
    // Test CORS configuration
    const cors = await s3.getBucketCors({ Bucket: bucketName }).promise();
    console.log('✅ CORS configured:', cors.CORSRules.length, 'rules');
    
    // Test bucket policy
    try {
      const policy = await s3.getBucketPolicy({ Bucket: bucketName }).promise();
      console.log('✅ Bucket policy configured');
    } catch (err) {
      if (err.code === 'NoSuchBucketPolicy') {
        console.log('⚠️  No bucket policy found');
      } else {
        throw err;
      }
    }
    
    console.log('🎉 S3 configuration test completed successfully!');
    
  } catch (error) {
    console.error('❌ S3 configuration test failed:', error.message);
    process.exit(1);
  }
}

testS3Configuration();