# Great AI Agent 🚀
AI-powered content generation platform for SMEs in Malaysia.  
Generate captions, hashtags, visuals, and even voiceovers with Amazon Bedrock, Comprehend, Polly, and S3.  

## 🎯 Features

- ✅ AI-powered caption generation (Llama 3 8B)
- ✅ AI image generation (Nova Canvas)
- ✅ Generation type selector (Campaign/Text/Image)
- ✅ Content style options (Professional, Casual, Creative, etc.)
- ✅ Smart hashtag extraction
- ✅ Campaign preview (Instagram mockup)
- ✅ Campaign history tracking
- ✅ Multi-platform support

## ⚡ Tech Stack

- **Frontend:** React + AWS Amplify (Hosting)
- **Backend:** AWS Lambda + API Gateway
- **AI:** Amazon Bedrock (Llama 3 8B + Nova Canvas)
- **Storage:** Amazon S3
- **Database:** Amazon DynamoDB

## 📂 Project Structure
```
frontend/           # React application
├── src/
│   ├── components/   # React components
│   └── App.js       # Main app
└── public/         # Static files

backend/            # AWS SAM application
├── functions/      # Lambda functions
│   ├── generateCampaign/
│   ├── generateText/
│   ├── generateImage/
│   ├── saveCampaign/
│   └── getCampaigns/
└── template.yml    # SAM template

amplify/            # Amplify configuration
```

## 🌐 Live Demo

**Frontend:** [Deployed on AWS Amplify](https://dev.d2k7lojphc90md.amplifyapp.com)

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
cp frontend/.env.example frontend/.env
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

**Pre-deployment checklist:**
- ✅ AWS credentials configured (`aws sts get-caller-identity` works)
- ✅ Bedrock models enabled in us-east-1 region
- ✅ S3 bucket created in ap-southeast-5 region

```bash
cd backend
npm install
sam build

# Deploy with guided setup
sam deploy --guided

# Follow prompts:
# - Stack name: great-ai-agent-backend
# - Region: ap-southeast-5
# - Parameter S3Bucket: great-ai-agent-media
# - Confirm changes: Y
# - Allow IAM role creation: Y
# - Functions have no authentication: Y (for all)

# WAIT for "Successfully created/updated stack" message before proceeding
```

**Get your API Gateway URL after deployment:**
```bash
aws cloudformation describe-stacks \
  --stack-name great-ai-agent-backend \
  --region ap-southeast-5 \
  --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayUrl'].OutputValue" \
  --output text
```

**⚠️ IMPORTANT: Verify endpoints are working:**
```bash
# Test generateCampaign endpoint (should return JSON, not "Missing Authentication Token")
curl -X POST https://YOUR_API_URL_HERE/dev/generateCampaign \
  -H "Content-Type: application/json" \
  -d '{"description":"test product"}'

# If you get "Missing Authentication Token", redeploy:
cd backend
sam build && sam deploy
```

### 9. Setup Frontend
```bash
cd frontend
npm install

# CRITICAL: Get your actual API URL from step 8 and replace YOUR_API_URL_HERE
# Example: https://abc123.execute-api.ap-southeast-5.amazonaws.com/dev
echo "REACT_APP_API_BASE_URL=YOUR_API_URL_HERE" > .env

# Verify .env file was created correctly
cat .env
# Should show: REACT_APP_API_BASE_URL=https://your-actual-api-url/dev

# Start development server
npm start
```

**⚠️ TROUBLESHOOTING: If frontend shows "Failed to fetch" errors:**
1. Check your `.env` file has the correct API URL
2. Restart the React app after changing `.env`
3. Test the API URL works: `curl -X POST YOUR_API_URL/generateCampaign -H "Content-Type: application/json" -d '{"description":"test"}'`

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

### API Parameters
- **description** (required): Product/campaign description
- **targetAudience**: Target demographic (default: "general audience")
- **platform**: Social media platform (default: "Instagram")
- **contentStyle**: Content style (professional, casual, creative, etc.)


### Example Requests

**Complete Campaign:**
```bash
curl -X POST https://your-api-url/dev/generateCampaign \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Eco-friendly water bottles for active lifestyle",
    "targetAudience": "Health-conscious millennials",
    "platform": "Instagram",
    "contentStyle": "professional",

  }'
```

**Image Only:**
```bash
curl -X POST https://your-api-url/dev/generateImage \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Modern smartphone",
    "contentStyle": "minimalist",

  }'
```

### Response Format
```json
{
  "caption": "Engaging social media caption...",
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "keywords": ["keyword1", "keyword2"],
  "imageUrl": "https://s3.../image.png",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
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
  -d '{"description":"test product","contentStyle":"professional"}'

# Test generateText endpoint
curl -X POST https://your-api-url/dev/generateText \
  -H "Content-Type: application/json" \
  -d '{"description":"test product","platform":"Instagram","contentStyle":"casual"}'

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
