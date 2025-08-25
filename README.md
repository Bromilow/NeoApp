# Creator Platform

A full-stack application for managing creator content and analytics.

## Project Structure

- `client/` - React frontend with Vite
- `server/` - Express.js backend
- `shared/` - Shared types and schemas

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

### Frontend Deployment (AWS Amplify)

1. **Connect your repository to Amplify:**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Select your branch (main/master)

2. **Configure build settings:**
   - The `amplify.yml` file is already configured
   - Build command: `npm run build`
   - Output directory: `dist/public`

3. **Set environment variables:**
   - In Amplify Console, go to Environment Variables
   - Add `VITE_API_URL` with your backend URL

### Backend Deployment Options

#### Option 1: AWS Lambda + API Gateway
Deploy the Express server as Lambda functions using serverless framework.

#### Option 2: AWS ECS/Fargate
Containerize the Express server and deploy to ECS.

#### Option 3: AWS EC2
Deploy the Express server on EC2 instances.

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (required for production)

### Backend
- `DATABASE_URL` - Neon database connection string
- `SESSION_SECRET` - Session encryption secret
- `PORT` - Server port (default: 5000)

## Database

This project uses Neon PostgreSQL with Drizzle ORM.

```bash
# Push schema changes
npm run db:push
```
