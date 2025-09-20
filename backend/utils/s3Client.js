const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'ap-southeast-5'
});

const s3Client = {
  async uploadImage(base64Data, fileName) {
    const buffer = Buffer.from(base64Data, 'base64');
    
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `images/${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: 'image/png',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  },

  async uploadAudio(audioBuffer, fileName) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `audio/${Date.now()}-${fileName}`,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  }
};

module.exports = s3Client;