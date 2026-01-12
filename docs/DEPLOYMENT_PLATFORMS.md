# Platform Deployment Guide

**Author:** Arman Hazrati  
**Last Updated:** January 12, 2026

## 🚀 Quick Deploy Options

Choose your platform and follow the guide:

---

## 1. 🔷 Vercel (Frontend) + Railway (Backend)

**Best for:** Quick demo, free tier available  
**Time to Deploy:** ~15 minutes

### Frontend (Vercel)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy Frontend
```bash
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? northstar-frontend
# - Directory? ./
# - Override settings? No
```

#### Step 3: Add Environment Variables
```bash
# In Vercel Dashboard (https://vercel.com/dashboard)
# Go to your project → Settings → Environment Variables
# Add:
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend-url.railway.app
```

### Backend (Railway)

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Initialize Project
```bash
# In project root
railway init

# Follow prompts:
# - Project name? northstar-backend
```

#### Step 3: Add PostgreSQL and Redis
```bash
railway add --database postgres
railway add --database redis
```

#### Step 4: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Copy the DATABASE_URL from Railway dashboard
# Copy the REDIS_URL from Railway dashboard
```

#### Step 5: Deploy
```bash
railway up
```

#### Step 6: Get Your URLs
```bash
railway domain
# Note the URL for your frontend env vars
```

---

## 2. 🟢 Render (All-in-One)

**Best for:** Single-platform deployment  
**Time to Deploy:** ~10 minutes

#### Step 1: Create Blueprint Deployment
```bash
# Push render.yaml to your repo
git add render.yaml
git commit -m "Add Render blueprint"
git push
```

#### Step 2: Deploy on Render
1. Go to https://render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select `render.yaml`
5. Click "Apply"

**Done!** Render will automatically:
- Create PostgreSQL database
- Create Redis instance
- Deploy backend
- Deploy frontend
- Set up environment variables

---

## 3. ☁️ AWS (ECS + RDS)

**Best for:** Enterprise production  
**Time to Deploy:** ~1 hour

### Prerequisites
```bash
aws configure
# Enter your AWS credentials
```

### Deploy Steps

#### 1. Create ECR Repositories
```bash
aws ecr create-repository --repository-name northstar-backend
aws ecr create-repository --repository-name northstar-frontend
```

#### 2. Build and Push Images
```bash
# Backend
docker build -t northstar-backend .
docker tag northstar-backend:latest <your-account-id>.dkr.ecr.<region>.amazonaws.com/northstar-backend:latest
docker push <your-account-id>.dkr.ecr.<region>.amazonaws.com/northstar-backend:latest

# Frontend
cd client
docker build -t northstar-frontend .
docker tag northstar-frontend:latest <your-account-id>.dkr.ecr.<region>.amazonaws.com/northstar-frontend:latest
docker push <your-account-id>.dkr.ecr.<region>.amazonaws.com/northstar-frontend:latest
```

#### 3. Create RDS Database
```bash
aws rds create-db-instance \
  --db-instance-identifier northstar-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password <your-password> \
  --allocated-storage 20
```

#### 4. Create ECS Cluster and Services
Use the AWS Console or CloudFormation template provided in `aws-cloudformation.yaml`

---

## 4. 🔵 Google Cloud (Cloud Run)

**Best for:** Pay-per-use, auto-scaling  
**Time to Deploy:** ~30 minutes

### Deploy Backend
```bash
gcloud run deploy northstar-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production"
```

### Deploy Frontend
```bash
cd client
gcloud run deploy northstar-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 5. 🟣 Azure (Container Apps)

**Best for:** Microsoft ecosystem  
**Time to Deploy:** ~30 minutes

### Deploy with Azure CLI
```bash
az containerapp up \
  --name northstar-backend \
  --resource-group northstar-rg \
  --location eastus \
  --source .
```

---

## 6. 🌊 DigitalOcean (App Platform)

**Best for:** Simple, affordable  
**Time to Deploy:** ~20 minutes

### Deploy via GUI
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository
4. DigitalOcean will auto-detect your configuration
5. Add environment variables
6. Click "Launch App"

---

## 🔧 Post-Deployment Checklist

After deploying to any platform:

### 1. Update Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url
NEXT_PUBLIC_WS_URL=wss://your-backend-url
```

### 2. Run Database Migrations
```bash
# If using Railway:
railway run npm run prisma:migrate:deploy

# If using Render:
# SSH into backend service and run:
npm run prisma:migrate:deploy

# If using Vercel + Railway:
# In Railway service:
npm run prisma:migrate:deploy && npm run prisma:seed
```

### 3. Test Your Deployment
```bash
# Health check
curl https://your-backend-url/health

# API docs
open https://your-backend-url/api

# Frontend
open https://your-frontend-url
```

### 4. Update README with Demo Links
Add your live URLs to `README.md`:
```markdown
## 🌐 Live Demo

- **Frontend**: https://your-frontend-url.vercel.app
- **Backend API**: https://your-backend-url.railway.app
- **API Docs**: https://your-backend-url.railway.app/api
```

---

## 💰 Cost Estimates

| Platform | Free Tier | Monthly Cost (Small) | Best For |
|----------|-----------|---------------------|----------|
| Vercel + Railway | ✅ Yes | $0-5 | Demos, portfolios |
| Render | ✅ Limited | $7-15 | Small projects |
| AWS ECS | ❌ No | $20-50 | Enterprise |
| Google Cloud Run | ✅ Limited | $5-20 | Auto-scaling |
| Azure | ✅ Limited | $10-30 | Microsoft stack |
| DigitalOcean | ❌ No | $12-25 | Simple hosting |

---

## 🆘 Troubleshooting

### Issue: Database connection errors
**Solution:** Ensure DATABASE_URL is correctly set and database is accessible

### Issue: Frontend can't reach backend
**Solution:** Check CORS settings in backend and NEXT_PUBLIC_API_URL in frontend

### Issue: WebSocket not connecting
**Solution:** Ensure your hosting platform supports WebSocket connections

### Issue: Build fails
**Solution:** Check Node.js version (requires 18+) and build logs

---

## 📚 Platform-Specific Guides

For detailed platform guides, see:
- `PRODUCTION_DEPLOYMENT.md` - Kubernetes production guide
- `docker-compose.prod.yml` - Docker Compose deployment
- `k8s/` - Kubernetes manifests

---

**Built with ❤️ by Arman Hazrati**
