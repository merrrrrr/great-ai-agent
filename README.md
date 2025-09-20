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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS SAM CLI installed
- AWS Account with Bedrock access

### 1. Frontend Setup
```bash
cd frontend
npm install

# Initialize Amplify (first time only)
amplify init
amplify add auth
amplify push

# Start development server
npm start
```

### 2. Backend Setup
```bash
cd backend
npm install

# Deploy Lambda functions
sam build
sam deploy --guided
```

### 3. AWS Services Setup

#### Enable Bedrock Models
1. Go to AWS Console → Bedrock → Model access
2. Enable: Claude v2, Stable Diffusion XL

#### Create S3 Bucket
```bash
aws s3 mb s3://great-ai-agent-media --region ap-southeast-5
aws s3api put-bucket-cors --bucket great-ai-agent-media --cors-configuration file://backend/cors.json
```

#### Update Frontend API URL
After backend deployment, update `frontend/.env`:
```
REACT_APP_API_BASE_URL=https://your-api-gateway-url.execute-api.ap-southeast-5.amazonaws.com/dev
```

## 🌐 Deployment

- **Frontend**: AWS Amplify (ap-southeast-5)
- **Backend**: AWS Lambda + API Gateway
- **Storage**: Amazon S3
- **Database**: Amazon DocumentDB (optional)

## 🔑 Environment Variables

Copy `.env.example` to `.env` and update:

```bash
# AWS Configuration
AWS_REGION=ap-southeast-5
S3_BUCKET=great-ai-agent-media

# API Gateway (from SAM deployment output)
REACT_APP_API_BASE_URL=https://your-api-gateway-url

# DocumentDB (optional)
DB_URI=mongodb://username:password@cluster:27017/great-ai-agent
DB_NAME=great-ai-agent
```

## 🎯 Features

- ✅ User authentication (AWS Cognito)
- ✅ AI-powered caption generation (Bedrock Claude)
- ✅ Image generation (Stable Diffusion)
- ✅ Smart hashtag extraction (Comprehend)
- ✅ Campaign history tracking
- ✅ Multi-platform support (Instagram, TikTok, Facebook)

## 🛠️ Development

### Test Backend Locally
```bash
cd backend
sam local start-api
```

### Frontend Development
```bash
cd frontend
npm start
```

## 📝 API Endpoints

- `POST /generateCampaign` - Generate AI content
- `POST /saveCampaign` - Save campaign to database
- `GET /campaigns` - Get user's campaign history

## 🔧 Troubleshooting

1. **Bedrock Access Denied**: Enable models in Bedrock console
2. **S3 Upload Failed**: Check bucket permissions and CORS
3. **API Gateway 403**: Verify Lambda permissions
4. **Frontend Auth Issues**: Check Amplify configuration

## 📄 License

MIT License - Built for hackathon demo