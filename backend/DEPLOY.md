# Deploy Great AI Agent Backend

## 1. Configure S3 Bucket
```bash
# Run setup script
.\setup-s3.ps1

# Or manually:
aws s3 mb s3://great-ai-agent-media --region ap-southeast-5
aws s3api put-bucket-cors --bucket great-ai-agent-media --cors-configuration file://cors.json
aws s3api put-bucket-policy --bucket great-ai-agent-media --policy file://bucket-policy.json

# Test configuration
node test-s3.js
```

## 2. Deploy Lambda Functions
```bash
sam build
sam deploy --guided
```

## 3. Environment Variables
- `AWS_REGION=ap-southeast-5`
- `S3_BUCKET=great-ai-agent-media`
- `DB_URI=mongodb://...`
- `DB_NAME=great-ai-agent`

## 4. IAM Permissions Required
- Bedrock: `InvokeModel`
- Comprehend: `DetectKeyPhrases`
- S3: `PutObject`, `GetObject`
- DocumentDB: Full access