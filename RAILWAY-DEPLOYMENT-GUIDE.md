# Railway.app Terminal-Only Deployment Guide

Complete guide for deploying Japan Trip Planner to Railway using terminal commands.

## Prerequisites

- Railway CLI installed
- Railway account
- GitHub repository: https://github.com/taylorkchan/japan-trip-planner
- Git repository up to date with latest code

## Part 1: What Works via Terminal Only

### Step 1: Install Railway CLI

```bash
# Install via npm
npm install -g @railway/cli

# Or via Homebrew (macOS)
brew install railway

# Verify installation
railway --version
```

### Step 2: Authenticate

```bash
# Login to Railway (opens browser for OAuth)
railway login

# Verify authentication
railway whoami
```

**Output:**
```
Logged in as Taylor Chan (chan.kan.hei@gmail.com) 👋
```

### Step 3: Create New Project

```bash
# Create project
railway init --name japan-trip-planner
```

**Output:**
```
Created project japan-trip-planner on Taylor Chan's Projects
https://railway.com/project/a3b81367-0df0-4357-9d6a-0a9787a1525f
```

**Save project ID:**
```bash
export RAILWAY_PROJECT_ID="a3b81367-0df0-4357-9d6a-0a9787a1525f"
```

### Step 4: Add PostgreSQL Database

```bash
# Add Postgres database to project
railway add --database postgres
```

**Verify database:**
```bash
railway service status --all
```

**Output:**
```
Services in production:

Postgres | 9c2aa8a8-9a99-4860-9ec9-a5538d166e32 | SUCCESS
```

### Step 5: Get Database Connection String

```bash
# Get database URL
railway variables --service Postgres | grep DATABASE_URL
```

## Part 2: Deploy Services (GitHub Integration)

Railway CLI has limitations for creating services non-interactively. The recommended approach is using GitHub integration:

### Method A: Via Railway Dashboard (One-Time Setup)

Since Railway CLI requires interactive mode for service creation, use the dashboard:

1. **Open your project:**
   ```
   Project URL: https://railway.com/project/a3b81367-0df0-4357-9d6a-0a9787a1525f
   ```

2. **Add Backend Service:**
   - Click "+ New Service"
   - Select "GitHub Repo"
   - Choose: `taylorkchan/japan-trip-planner`
   - Root Directory: `Source Code/backend`
   - Service Name: `backend`

3. **Add Frontend Service:**
   - Click "+ New Service"
   - Select "GitHub Repo"
   - Choose: `taylorkchan/japan-trip-planner`
   - Root Directory: `Source Code/frontend`
   - Service Name: `frontend`

### Method B: Using Railway Template (Advanced)

Create a `railway.json` in your repo root:

```json
{
  "version": 2,
  "services": {
    "backend": {
      "source": {
        "repo": "taylorkchan/japan-trip-planner",
        "rootDirectory": "Source Code/backend"
      },
      "build": {
        "buildCommand": "npm ci && npx prisma generate",
        "watchPatterns": ["Source Code/backend/**"]
      },
      "deploy": {
        "startCommand": "npm start",
        "healthcheckPath": "/health",
        "restartPolicyType": "ON_FAILURE"
      }
    },
    "frontend": {
      "source": {
        "repo": "taylorkchan/japan-trip-planner",
        "rootDirectory": "Source Code/frontend"
      },
      "build": {
        "buildCommand": "npm ci && npm run build",
        "watchPatterns": ["Source Code/frontend/**"]
      },
      "deploy": {
        "startCommand": "npx serve -s dist"
      }
    }
  }
}
```

Then deploy via:
```bash
railway deploy
```

## Part 3: Configure Environment Variables (Terminal)

Once services are created via dashboard, you can manage them via terminal:

### Link to Backend Service

```bash
cd "Source Code/backend"
railway service link
# Select: backend
```

### Set Backend Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set USE_SUPABASE=false
railway variables set JWT_SECRET=super_secure_production_jwt_secret_2024_japan_trip_planner

# Link database
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}'
```

### Link to Frontend Service

```bash
cd "Source Code/frontend"
railway service link
# Select: frontend
```

### Set Frontend Environment Variables

```bash
# Set backend API URL (after backend is deployed)
railway variables set VITE_API_URL='${{backend.RAILWAY_PUBLIC_DOMAIN}}'
```

## Part 4: Deploy and Monitor (Terminal)

### Deploy Backend

```bash
cd "Source Code/backend"
railway up --detach
```

**Monitor deployment:**
```bash
railway logs --service backend
```

### Deploy Frontend

```bash
cd "Source Code/frontend"
railway up --detach
```

**Monitor deployment:**
```bash
railway logs --service frontend
```

### Check Deployment Status

```bash
# Check all services
railway service status --all

# Check specific service
railway service status --service backend
railway service status --service frontend
```

## Part 5: Expose Services to Public Internet

### Add Public Domain to Backend

```bash
cd "Source Code/backend"
railway domain
```

**Output:**
```
Domain: japan-trip-planner-backend.up.railway.app
```

### Add Public Domain to Frontend

```bash
cd "Source Code/frontend"
railway domain
```

**Output:**
```
Domain: japan-trip-planner-frontend.up.railway.app
```

## Part 6: Useful Management Commands

### View All Variables

```bash
railway variables --service backend
railway variables --service frontend
railway variables --service Postgres
```

### Connect to Database

```bash
railway connect Postgres
```

This opens a `psql` shell connected to your database.

### View Logs

```bash
# Stream live logs
railway logs --service backend
railway logs --service frontend

# Show last 100 lines
railway logs --service backend --tail 100
```

### Redeploy a Service

```bash
railway redeploy --service backend
railway redeploy --service frontend
```

### Check Service Info

```bash
railway status
```

## Part 7: Complete Deployment Script

Here's a complete bash script for deployment (after services are created):

```bash
#!/bin/bash
# deploy-to-railway.sh

set -e

echo "🚂 Deploying to Railway..."

# Project details
PROJECT_ID="a3b81367-0df0-4357-9d6a-0a9787a1525f"
BACKEND_DIR="/Users/menchy/Documents/SPRINT_APPS/japan-trip-planner/Source Code/backend"
FRONTEND_DIR="/Users/menchy/Documents/SPRINT_APPS/japan-trip-planner/Source Code/frontend"

# Deploy Backend
echo "📦 Deploying backend..."
cd "$BACKEND_DIR"
railway up --service backend --detach

# Wait for backend to be ready
echo "⏳ Waiting for backend to deploy..."
sleep 30

# Deploy Frontend
echo "🎨 Deploying frontend..."
cd "$FRONTEND_DIR"
railway up --service frontend --detach

# Wait for frontend
echo "⏳ Waiting for frontend to deploy..."
sleep 30

# Check status
echo "📊 Deployment Status:"
railway service status --all

# Get public URLs
echo ""
echo "🌐 Public URLs:"
echo "Backend:  https://japan-trip-planner-backend.up.railway.app"
echo "Frontend: https://japan-trip-planner-frontend.up.railway.app"

echo ""
echo "✅ Deployment complete!"
```

Make it executable and run:
```bash
chmod +x deploy-to-railway.sh
./deploy-to-railway.sh
```

## Part 8: Environment Variables Reference

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3000` | Server port |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL connection |
| `JWT_SECRET` | `your_secret_here` | JWT signing key |
| `USE_SUPABASE` | `false` | Use Railway Postgres |
| `CORS_ORIGIN` | `${{frontend.RAILWAY_PUBLIC_DOMAIN}}` | CORS origin |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `${{backend.RAILWAY_PUBLIC_DOMAIN}}` | Backend API URL |

## Part 9: Troubleshooting

### Service Won't Start

```bash
# Check logs
railway logs --service backend

# Check environment variables
railway variables --service backend

# Restart service
railway redeploy --service backend
```

### Database Connection Issues

```bash
# Verify database is running
railway service status --service Postgres

# Test database connection
railway connect Postgres

# Check DATABASE_URL is set
railway variables --service backend | grep DATABASE_URL
```

### Build Failures

```bash
# View build logs
railway logs --service backend --deployment latest

# Redeploy with fresh build
railway redeploy --service backend
```

### Port Issues

Ensure your app listens on the `PORT` environment variable:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT);
```

## Part 10: Cleanup / Remove Services

### Remove Individual Service

```bash
# Note: Must be done via dashboard or API
# Railway CLI doesn't support service deletion in v3
```

Via Dashboard:
1. Go to project
2. Click service
3. Settings → Danger → Delete Service

### Delete Entire Project

```bash
# Note: Must be done via dashboard
```

Via Dashboard:
1. Go to project settings
2. Danger → Delete Project

## Part 11: Railway API (Advanced)

For full terminal automation, use Railway's GraphQL API:

```bash
# Get API token from dashboard
RAILWAY_API_TOKEN="your_token_here"

# Example: Query project
curl -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { projects { edges { node { id name } } } }"
  }'
```

## Summary of What We Did

### ✅ Successful Terminal Commands:
1. **Installed Railway CLI** - `railway --version`
2. **Authenticated** - `railway login` & `railway whoami`
3. **Created Project** - `railway init --name japan-trip-planner`
4. **Added PostgreSQL** - `railway add --database postgres`
5. **Verified Database** - `railway service status --all`

### ⚠️ Limitations Found:
- Service creation requires either:
  - Interactive mode (not available in terminal-only)
  - Web dashboard (one-time setup)
  - GitHub integration (recommended)
  - GraphQL API (advanced)

### 🎯 Best Practice:
1. Create project via CLI: ✅
2. Add database via CLI: ✅
3. Create services via Dashboard (one-time): 🌐
4. Deploy via CLI: ✅
5. Manage via CLI: ✅

## Expected URLs After Deployment

- **Frontend**: https://japan-trip-planner-frontend.up.railway.app
- **Backend**: https://japan-trip-planner-backend.up.railway.app
- **Database**: Internal (accessed via DATABASE_URL)

## Project Information

- **Project ID**: `a3b81367-0df0-4357-9d6a-0a9787a1525f`
- **Project URL**: https://railway.com/project/a3b81367-0df0-4357-9d6a-0a9787a1525f
- **Database ID**: `9c2aa8a8-9a99-4860-9ec9-a5538d166e32`
- **GitHub Repo**: https://github.com/taylorkchan/japan-trip-planner

---

**Railway Deployment Guide Complete!** 🚂

For service creation, visit: https://railway.com/project/a3b81367-0df0-4357-9d6a-0a9787a1525f
