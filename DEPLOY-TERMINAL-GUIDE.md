# Terminal-Only Deployment Guide for Render

## Overview

This guide provides a complete terminal-only deployment workflow for the Japan Trip Planner application using Render's Blueprint deployment system.

## Prerequisites

✅ **Completed:**
- render.yaml configuration file created and committed
- GitHub repository accessible at: https://github.com/taylorkchan/japan-trip-planner
- All source code committed and pushed to master branch

## Deployment Methods Available

### Method 1: Blueprint Deployment (Recommended)

**Status:** ✅ Ready to deploy

The Blueprint deployment uses the `render.yaml` file to deploy all services at once:

```bash
# Open Blueprint deployment URL
open "https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"
```

**What happens:**
1. Render reads the `render.yaml` configuration
2. Creates 3 services automatically:
   - PostgreSQL Database (`japan-trip-planner-db`)
   - Node.js Backend (`japan-trip-planner-backend`)
   - Static Frontend (`japan-trip-planner-frontend`)
3. Sets up environment variables and database connections
4. Starts the deployment process (~10-15 minutes)

### Method 2: API Deployment (Alternative)

**Status:** ⚠️ Authentication issues detected

API deployment script created but requires valid API credentials:

```bash
# Set API token and deploy
export RENDER_API_TOKEN="your_api_token_here"
./deploy-render-api.sh
```

**Note:** Current API token showing "Unauthorized" - may need regeneration.

## Current Configuration

### Services Configured in render.yaml:

**Backend Service:**
- Name: `japan-trip-planner-backend`
- Type: Web Service (Node.js)
- Repository: `Source Code/backend`
- Build: `npm ci && npx prisma generate`
- Start: `npm start`
- Health Check: `/health`
- Region: Oregon (Free Tier)

**Frontend Service:**
- Name: `japan-trip-planner-frontend`
- Type: Static Site
- Repository: `Source Code/frontend`
- Build: `npm ci && npm run build`
- Output: `./dist`
- SPA Routing: Configured

**Database:**
- Name: `japan-trip-planner-db`
- Type: PostgreSQL
- Region: Oregon (Free Tier)
- Auto-connection to backend via environment variable

## Expected Live URLs

After successful deployment:

- **Frontend:** https://japan-trip-planner-frontend.onrender.com
- **Backend API:** https://japan-trip-planner-backend.onrender.com
- **Health Check:** https://japan-trip-planner-backend.onrender.com/health
- **Trips API:** https://japan-trip-planner-backend.onrender.com/api/trips

## Monitoring Deployment

### Manual Status Check

```bash
# Check frontend
curl -I https://japan-trip-planner-frontend.onrender.com

# Check backend
curl -I https://japan-trip-planner-backend.onrender.com

# Check health endpoint
curl https://japan-trip-planner-backend.onrender.com/health

# Check API
curl https://japan-trip-planner-backend.onrender.com/api/trips
```

### Automated Monitoring

Use the provided monitoring script:

```bash
# Start continuous monitoring
./monitor-deployment.sh
```

## Troubleshooting

### Service Shows 404
- **Cause:** Service not yet deployed or still building
- **Solution:** Wait 10-15 minutes for deployment completion

### "x-render-routing: no-server" Header
- **Cause:** No service exists at the URL
- **Solution:** Verify Blueprint deployment was initiated

### Build Failures
- **Check:** Build logs in Render dashboard
- **Common Issues:**
  - Missing dependencies in package.json
  - Environment variable configuration
  - Database connection issues

## Current Status

**Repository:** ✅ Ready
**render.yaml:** ✅ Committed
**Blueprint URL:** ✅ Generated
**Services:** ❌ Not yet deployed

## Next Steps

1. **Deploy via Blueprint:**
   ```bash
   open "https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"
   ```

2. **Monitor Progress:**
   ```bash
   ./monitor-deployment.sh
   ```

3. **Verify Services:**
   - Check all URLs respond with 200 status
   - Test application functionality
   - Verify database connectivity

## Terminal Commands Summary

```bash
# Complete deployment workflow
echo "Starting Render deployment..."

# Step 1: Open Blueprint deployment
open "https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"

# Step 2: Monitor deployment (in separate terminal)
./monitor-deployment.sh

# Step 3: Test services when ready
curl https://japan-trip-planner-frontend.onrender.com
curl https://japan-trip-planner-backend.onrender.com/health
```

## Support Resources

- **Render Documentation:** https://render.com/docs
- **Blueprint Guide:** https://render.com/docs/blueprint-spec
- **Dashboard:** https://dashboard.render.com
- **API Documentation:** https://api-docs.render.com