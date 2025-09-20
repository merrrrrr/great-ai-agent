# Great AI Agent 🚀
AI-powered content generation platform for SMEs in Malaysia.  
Generate captions, hashtags, visuals, and even voiceovers with Amazon Bedrock, Comprehend, Polly, and S3.  

## ⚡ Tech Stack
- **Frontend:** React + AWS Amplify (Auth + Hosting)
- **Backend:** AWS Lambda + API Gateway
- **AI:** Amazon Bedrock (LLM + Stable Diffusion)
- **NLP:** AWS Comprehend (keyword/hashtag analysis)
- **Voiceover:** Amazon Polly
- **Storage:** Amazon S3
- **Database:** Amazon DocumentDB

## 📂 Project Structure
```
frontend/     # React + Amplify
backend/      # Lambda functions
infrastructure/ # API Gateway, IAM, Amplify config
```

## 🌐 Live Demo

**Frontend:** [Deployed on AWS Amplify](https://main.d2k7lojphc90md.amplifyapp.com)
**API:** https://0wnrk1jgj5.execute-api.ap-southeast-5.amazonaws.com/dev

## 🚀 Quick Setup Guide

### Prerequisites
- Node.js 18+
- AWS CLI configured with credentials
- AWS SAM CLI installed
- AWS Account with Bedrock access

### 1. Clone and Setup Environment
```bash
git clone <repository-url>
cd great-ai-agent

# Copy environment template
cp .env.example .env
```

### 2. Configure AWS Credentials
Update `.env` with your AWS credentials:
```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET=great-ai-agent-media
```

### 3. Enable Bedrock Models
Go to AWS Bedrock Console (us-east-1 region):
1. Navigate to **Model access**
2. Enable these models:
   - `meta.llama3-8b-instruct-v1:0` (Text generation)
   - `amazon.nova-canvas-v1:0` (Image generation)

### 4. Create S3 Bucket
```bash
# Create bucket in ap-southeast-5 (Malaysia)
aws s3 mb s3://great-ai-agent-media --region ap-southeast-5

# Make bucket publicly readable for images
aws s3api put-bucket-policy --bucket great-ai-agent-media --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::great-ai-agent-media/*"
  }]
}'
```

### 5. Deploy Backend
```bash
cd backend
npm install
sam build
sam deploy --guided

# Follow prompts:
# - Stack name: great-ai-agent-backend
# - Region: ap-southeast-5
# - Confirm changes: Y
# - Allow IAM role creation: Y
# - Functions have no authentication: Y (for all)
```

### 6. Setup Frontend
```bash
cd frontend
npm install

# Update .env with deployed API URL
echo "REACT_APP_API_BASE_URL=https://0wnrk1jgj5.execute-api.ap-southeast-5.amazonaws.com/dev" > .env

# Start development server
npm start
```

## 🌐 API Endpoints

Base URL: `https://0wnrk1jgj5.execute-api.ap-southeast-5.amazonaws.com/dev`

- `POST /generateCampaign` - Generate AI campaign
- `POST /saveCampaign` - Save campaign to database
- `GET /getCampaigns` - Get campaign history

### Example Request
```bash
curl -X POST https://0wnrk1jgj5.execute-api.ap-southeast-5.amazonaws.com/dev/generateCampaign \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Eco-friendly water bottles for active lifestyle",
    "targetAudience": "Health-conscious millennials",
    "platform": "Instagram"
  }'
```

## 🎯 Features

- ✅ AI-powered caption generation (Llama 3 8B)
- ✅ AI image generation (Nova Canvas)
- ✅ Smart hashtag extraction
- ✅ Campaign preview (Instagram mockup)
- ✅ Campaign history tracking
- ✅ Multi-platform support

## 🔧 Troubleshooting

### Common Issues

1. **"Internal server error"**
   - Check Bedrock model access is enabled
   - Verify AWS credentials in Lambda environment
   - Check CloudWatch logs: `aws logs tail /aws/lambda/function-name --region ap-southeast-5`

2. **Images not displaying**
   - Ensure S3 bucket policy allows public read
   - Check S3 bucket exists in ap-southeast-5
   - Verify image URLs use correct regional endpoint

3. **"Model doesn't support on-demand throughput"**
   - Ensure you're using Nova Canvas, not Titan Image Generator
   - Titan requires expensive provisioned throughput (~$920/month)

4. **Frontend can't connect to API**
   - Update `frontend/.env` with correct API Gateway URL
   - Check CORS is enabled in API Gateway

### Get API Gateway URL
```bash
aws cloudformation describe-stacks \
  --stack-name great-ai-agent-backend \
  --region ap-southeast-5 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
  --output text
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/great-ai-agent-backend-GenerateCampaignFunction-* \
  --region ap-southeast-5 --since 10m
```

## 📄 License

MIT License - Built for hackathon demo
