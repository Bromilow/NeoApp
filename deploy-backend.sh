#!/bin/bash

# Backend Deployment Script for Creator Platform
# This script provides options for deploying the Express.js backend

echo "Creator Platform Backend Deployment"
echo "==================================="
echo ""

echo "Choose your deployment option:"
echo "1. AWS Lambda + API Gateway (Serverless)"
echo "2. AWS ECS/Fargate (Container)"
echo "3. AWS EC2 (Traditional)"
echo "4. Railway (Simple deployment)"
echo "5. Render (Simple deployment)"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo "Setting up AWS Lambda + API Gateway deployment..."
    echo "This requires the Serverless Framework."
    echo ""
    echo "Steps:"
    echo "1. Install Serverless Framework: npm install -g serverless"
    echo "2. Configure AWS credentials"
    echo "3. Create serverless.yml configuration"
    echo "4. Run: serverless deploy"
    ;;
  2)
    echo "Setting up AWS ECS/Fargate deployment..."
    echo "This requires Docker and AWS CLI."
    echo ""
    echo "Steps:"
    echo "1. Create Dockerfile"
    echo "2. Build and push Docker image to ECR"
    echo "3. Create ECS cluster and service"
    echo "4. Configure load balancer"
    ;;
  3)
    echo "Setting up AWS EC2 deployment..."
    echo "This requires an EC2 instance and traditional deployment."
    echo ""
    echo "Steps:"
    echo "1. Launch EC2 instance"
    echo "2. Install Node.js and dependencies"
    echo "3. Set up PM2 for process management"
    echo "4. Configure nginx as reverse proxy"
    ;;
  4)
    echo "Setting up Railway deployment..."
    echo "This is the simplest option for quick deployment."
    echo ""
    echo "Steps:"
    echo "1. Install Railway CLI: npm install -g @railway/cli"
    echo "2. Login: railway login"
    echo "3. Initialize: railway init"
    echo "4. Deploy: railway up"
    ;;
  5)
    echo "Setting up Render deployment..."
    echo "This is another simple option for quick deployment."
    echo ""
    echo "Steps:"
    echo "1. Connect your GitHub repository to Render"
    echo "2. Create a new Web Service"
    echo "3. Set build command: npm run build"
    echo "4. Set start command: npm start"
    echo "5. Configure environment variables"
    ;;
  *)
    echo "Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "After deploying the backend, update your frontend environment variable:"
echo "VITE_API_URL=https://your-backend-domain.com"
echo ""
echo "Then redeploy your frontend on Amplify."
