# GreatAIgent 🚀
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
frontend/ # React + Amplify
backend/ # Lambda functions
infrastructure/ # API Gateway, IAM, Amplify config


## 🚀 Quick Start

### Frontend
``` bash
cd frontend
npm install
npm start
```


### Backend
``` bash
cd backend
npm install
# Deploy Lambda functions via AWS Console or IaC templates
```

### Amplify
``` bash
cd frontend
amplify init
amplify add auth
amplify push
```

## 🌐 Deployment

- **Frontend**: Hosted on AWS Amplify (ap-southeast-5)
- **Backend**: AWS Lambda (via API Gateway)
- **Storage**: Amazon S3
- **Database**: Amazon DocumentDB


## 🔑 Environment Variables

Rename the `.env.example` file to `.env`

Replace the placeholder with your actual key