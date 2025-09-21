# Great AI Agent 🚀
AI-powered content generation platform for SMEs in Malaysia.  
Generate captions, hashtags, visuals, and even voiceovers with Amazon Bedrock, Comprehend, Polly, and S3.  

## 🎯 Features

- ✅ AI-powered caption generation (Llama 3 8B)
- ✅ AI image generation (Nova Canvas)
- ✅ Smart hashtag extraction
- ✅ Campaign preview (Instagram mockup)
- ✅ Campaign history tracking
- ✅ Multi-platform support

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

## 🚀 Complete Setup Guide

### Prerequisites
- Node.js 18+
- Git
- AWS Account with Bedrock access
- Windows/macOS/Linux

### 1. Install AWS CLI

**Download and install from official website:**
- Visit: [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
- Download the installer for your operating system
- Run the installer and follow the setup wizard

**Verify installation:**
```bash
aws --version
# Should show: aws-cli/2.x.x
```

### 2. Install AWS SAM CLI

**Download and install from official website:**
- Visit: [https://aws.amazon.com/serverless/sam/](https://aws.amazon.com/serverless/sam/)
- Click "Install the SAM CLI"
- Download the installer for your operating system
- Run the installer and follow the setup wizard

**Verify installation:**
```bash
sam --version
# Should show: SAM CLI, version 1.x.x
```

### 3. Configure AWS Credentials

**Option 1: Using AWS Toolkit Extension in VS Code (Recommended)**
1. Install **AWS Toolkit** extension in VS Code
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Type "AWS: Create Credentials Profile"
4. Follow the prompts to enter your AWS credentials
5. Set region to `ap-southeast-5`

**Option 2: Using AWS CLI**
```bash
aws configure
# Enter when prompted:
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: ap-southeast-5
# Default output format: json
```

**Get AWS Access Keys:**
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **IAM** → **Users** → **Your User**
3. Go to **Security credentials** tab
4. Click **Create access key**
5. Download the CSV file with your keys

**Verify configuration:**
```bash
aws sts get-caller-identity
# Should show your AWS account details
```

### 4. Clone and Setup Project
```bash
git clone <repository-url>
cd great-ai-agent

# Copy environment template
cp .env.example .env
```

### 5. Configure Environment Variables
Update `.env` with your settings:
```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET=great-ai-agent-media

# Bedrock Models
BEDROCK_TEXT_MODEL=meta.llama3-8b-instruct-v1:0
BEDROCK_IMAGE_MODEL=amazon.nova-canvas-v1:0
```

### 6. Enable Bedrock Models
Go to AWS Bedrock Console (us-east-1 region):
1. Navigate to **Model access**
2. Enable these models:
   - `meta.llama3-8b-instruct-v1:0` (Text generation)
   - `amazon.nova-canvas-v1:0` (Image generation)

### 7. Create S3 Bucket
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

### 8. Deploy Backend
```bash
cd backend
npm install
sam build

sam deploy --guided

# Follow prompts:
# - Stack name: great-ai-agent-backend
# - Region: ap-southeast-5
# - Parameter S3Bucket: great-ai-agent-media
# - Confirm changes: Y
# - Allow IAM role creation: Y
# - Functions have no authentication: Y (for all)
```

**Get your API Gateway URL after deployment:**
```bash
aws cloudformation describe-stacks \
  --stack-name great-ai-agent-backend \
  --region ap-southeast-5 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
  --output text
```

### 9. Setup Frontend
```bash
cd frontend
npm install

# Update .env with deployed API URL
echo "REACT_APP_API_BASE_URL=https://0wnrk1jgj5.execute-api.ap-southeast-5.amazonaws.com/dev" > .env

# Start development server
npm start
```

## 🌐 API Endpoints

Base URL: `https://your-api-gateway-url/dev` (Get from deployment output)

### Generation Endpoints
- `POST /generateCampaign` - Generate complete campaign (text + image)
- `POST /generateText` - Generate text only (caption + hashtags)
- `POST /generateImage` - Generate image only

### Data Management
- `POST /saveCampaign` - Save campaign to database
- `GET /getCampaigns` - Get campaign history

### Generation Types
- **Complete Campaign**: Full marketing campaign with image and text
- **Text Only**: Caption, hashtags, and keywords
- **Image Only**: AI-generated product image

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

## 🔧 Troubleshooting

### Installation Issues

1. **AWS CLI not found**
   - Restart terminal after installation
   - Check PATH environment variable
   - Run `aws --version` to verify

2. **SAM CLI not found**
   - Ensure Docker is installed (required for SAM)
   - Restart terminal after installation
   - Run `sam --version` to verify

3. **AWS credentials not configured**
   - Run `aws configure list` to check current config
   - Ensure you have programmatic access keys (not root account)
   - Check IAM permissions for Bedrock, Lambda, S3, DynamoDB

### Common Runtime Issues

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

### Missing API Gateway URL
```bash
# Get your deployed API Gateway URL
aws cloudformation describe-stacks \
  --stack-name great-ai-agent-backend \
  --region ap-southeast-5 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
  --output text
```

### Missing Endpoints ("Missing Authentication Token")
```bash
# Check if endpoints exist
aws apigateway get-resources \
  --rest-api-id $(aws cloudformation describe-stacks \
    --stack-name great-ai-agent-backend \
    --query "Stacks[0].Outputs[?OutputKey=='GreatAIAgentApi'].OutputValue" \
    --output text) \
  --region ap-southeast-5

# If endpoints missing, redeploy:
cd backend
sam build && sam deploy
```

### Test Endpoints
```bash
# Test generateCampaign endpoint
curl -X POST https://your-api-url/dev/generateCampaign \
  -H "Content-Type: application/json" \
  -d '{"description":"test product","targetAudience":"general","platform":"Instagram"}'

# Test generateText endpoint
curl -X POST https://your-api-url/dev/generateText \
  -H "Content-Type: application/json" \
  -d '{"description":"test product","targetAudience":"general","platform":"Instagram"}'

# Test generateImage endpoint
curl -X POST https://your-api-url/dev/generateImage \
  -H "Content-Type: application/json" \
  -d '{"description":"test product"}'
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/great-ai-agent-backend-GenerateCampaignFunction-* \
  --region ap-southeast-5 --since 10m
```

## 📄 License

MIT License - Built for hackathon demo
