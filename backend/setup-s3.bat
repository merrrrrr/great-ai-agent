@echo off
echo Setting up S3 bucket for Great AI Agent...

REM Create S3 bucket
echo Creating S3 bucket...
aws s3 mb s3://great-ai-agent-media --region ap-southeast-5

REM Apply CORS configuration
echo Applying CORS configuration...
aws s3api put-bucket-cors --bucket great-ai-agent-media --cors-configuration file://cors.json

REM Apply bucket policy for public read access
echo Applying bucket policy...
aws s3api put-bucket-policy --bucket great-ai-agent-media --policy file://bucket-policy.json

REM Enable versioning (optional)
echo Enabling versioning...
aws s3api put-bucket-versioning --bucket great-ai-agent-media --versioning-configuration Status=Enabled

echo S3 bucket configuration complete!
echo Bucket URL: https://great-ai-agent-media.s3.ap-southeast-5.amazonaws.com