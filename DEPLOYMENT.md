# Creator Platform Deployment Guide

This guide covers deploying your Creator Platform application to AWS Amplify and various backend options.

## Prerequisites

- AWS Account
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 20+ installed locally
- AWS CLI configured (for backend deployment)

## Frontend Deployment (AWS Amplify)

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to your Git repository
2. Verify the `amplify.yml` file is in your root directory
3. Make sure all dependencies are in `package.json`

### Step 2: Deploy to Amplify

1. **Go to AWS Amplify Console**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Authorize AWS Amplify to access your repositories
   - Select your Creator Platform repository
   - Choose the branch you want to deploy (usually `main` or `master`)

3. **Configure Build Settings**
   - The build settings are already configured in `amplify.yml`
   - Build command: `npm run build`
   - Output directory: `dist/public`
   - Click "Save and deploy"

4. **Set Environment Variables**
   - In the Amplify Console, go to your app
   - Navigate to "Environment variables"
   - Add the following variables:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://your-api-domain.com`)

5. **Deploy**
   - Amplify will automatically build and deploy your frontend
   - The first build may take 5-10 minutes
   - Subsequent deployments will be faster

### Step 3: Custom Domain (Optional)

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Follow the DNS configuration instructions

## Backend Deployment Options

### Option 1: Railway (Recommended for Quick Start)

Railway is the simplest option for deploying your Express.js backend.

#### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway Project**
   ```bash
   railway init
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set DATABASE_URL=your_neon_database_url
   railway variables set SESSION_SECRET=your_session_secret
   railway variables set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get Your Backend URL**
   - Railway will provide you with a URL like `https://your-app.railway.app`
   - Use this URL as your `VITE_API_URL` in Amplify

### Option 2: Render

Render is another simple deployment option.

#### Steps:

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `creator-platform-backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Plan: Free (or choose paid plan)

3. **Set Environment Variables**
   - `DATABASE_URL`: Your Neon database URL
   - `SESSION_SECRET`: Your session secret
   - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend

### Option 3: AWS Lambda + API Gateway

For a serverless backend deployment.

#### Steps:

1. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS Credentials**
   ```bash
   aws configure
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Environment Variables**
   ```bash
   export DATABASE_URL=your_neon_database_url
   export SESSION_SECRET=your_session_secret
   ```

5. **Deploy**
   ```bash
   serverless deploy
   ```

6. **Get API Gateway URL**
   - The deployment will output an API Gateway URL
   - Use this as your `VITE_API_URL`

### Option 4: AWS ECS/Fargate

For containerized deployment.

#### Steps:

1. **Build Docker Image**
   ```bash
   docker build -t creator-platform-backend .
   ```

2. **Push to ECR**
   ```bash
   aws ecr create-repository --repository-name creator-platform-backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
   docker tag creator-platform-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/creator-platform-backend:latest
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/creator-platform-backend:latest
   ```

3. **Create ECS Cluster and Service**
   - Use AWS Console or AWS CLI to create ECS cluster
   - Create task definition with your container image
   - Create service with load balancer

### Option 5: AWS EC2

For traditional server deployment.

#### Steps:

1. **Launch EC2 Instance**
   - Use Amazon Linux 2 or Ubuntu
   - Configure security groups to allow HTTP/HTTPS traffic

2. **Install Dependencies**
   ```bash
   sudo yum update -y
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```

3. **Deploy Application**
   ```bash
   git clone your-repository
   cd CreatorPlatform
   npm install
   npm run build
   ```

4. **Set Up PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name creator-platform
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx**
   ```bash
   sudo yum install nginx -y
   # Configure nginx as reverse proxy
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

## Environment Variables

### Frontend (Amplify)
- `VITE_API_URL`: Backend API URL

### Backend
- `DATABASE_URL`: Neon PostgreSQL connection string
- `SESSION_SECRET`: Session encryption secret (32+ characters)
- `NODE_ENV`: `production`
- `PORT`: Server port (default: 5000)

## Database Setup

1. **Neon Database**
   - Create a Neon account at [neon.tech](https://neon.tech)
   - Create a new project
   - Get your connection string
   - Run migrations: `npm run db:push`

2. **Environment Variables**
   - Set `DATABASE_URL` in your backend deployment
   - Format: `postgresql://username:password@host:port/database`

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Amplify build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **API Connection Issues**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS configuration in backend
   - Ensure backend is accessible from frontend domain

3. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from deployment region
   - Ensure SSL is configured if required

### Support

- **Amplify Issues**: Check [Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- **Backend Issues**: Check deployment platform documentation
- **Database Issues**: Check [Neon Documentation](https://neon.tech/docs)

## Cost Optimization

- **Amplify**: Free tier includes 1000 build minutes/month
- **Railway**: Free tier includes $5 credit/month
- **Render**: Free tier available for web services
- **AWS Lambda**: Pay per request, very cost-effective for low traffic
- **Neon**: Free tier includes 0.5GB storage and 10GB transfer/month
