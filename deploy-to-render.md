# Deploy Japan Trip Planner to Render - Terminal Instructions

## 🚀 Terminal-Only Deployment Guide

### Prerequisites ✅
- ✅ Git (2.41.0)
- ✅ Node.js (22.19.0) + NPM (10.9.3)
- ✅ GitHub Authentication (taylorkchan)
- ✅ Repository: https://github.com/taylorkchan/japan-trip-planner
- ✅ render.yaml configuration ready

### Deployment Method: Render Blueprint

**Blueprint URL:** https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner

## 📋 Services to be Deployed

### 1. PostgreSQL Database
- **Name**: japan-trip-planner-db
- **Plan**: Free
- **Region**: Oregon

### 2. Backend Service
- **Name**: japan-trip-planner-backend
- **Type**: Web Service (Node.js)
- **Source**: `Source Code/backend`
- **Build**: `npm ci && npx prisma generate`
- **Start**: `npm start`
- **Health Check**: `/health`
- **Port**: 10000

### 3. Frontend Service
- **Name**: japan-trip-planner-frontend
- **Type**: Static Site
- **Source**: `Source Code/frontend`
- **Build**: `npm ci && npm run build`
- **Publish**: `./dist`
- **SPA Routing**: Enabled

## 🔧 Environment Variables (Auto-configured)

```bash
# Backend Service
NODE_ENV=production
PORT=10000
USE_SUPABASE=false
DATABASE_URL=[auto-connected from database]
JWT_SECRET=super_secure_production_jwt_secret_2024_japan_trip_planner
CORS_ORIGIN=[auto-connected from frontend]
```

## 🌐 Terminal Deployment Steps

### Option 1: Using curl with Render API (requires account)
```bash
# 1. Create Render account first
curl -X POST https://dashboard.render.com/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'

# 2. Get API token from: https://dashboard.render.com/account/api-keys

# 3. Deploy Blueprint
curl -X POST https://api.render.com/v1/blueprints \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "https://github.com/taylorkchan/japan-trip-planner",
    "autoDeploy": "yes"
  }'
```

### Option 2: One-Click Deploy URL
```bash
# Open this URL in any browser (minimal interaction)
echo "Deploy URL: https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"

# Or use curl to open browser automatically
open "https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"
```

## 📊 Expected Results

After deployment completion (~10-15 minutes):

### Live URLs:
- **Frontend**: `https://japan-trip-planner-frontend.onrender.com`
- **Backend API**: `https://japan-trip-planner-backend.onrender.com`
- **Database**: Auto-connected via private network

### Health Checks:
```bash
# Test frontend
curl -I https://japan-trip-planner-frontend.onrender.com

# Test backend health
curl https://japan-trip-planner-backend.onrender.com/health

# Test backend API
curl https://japan-trip-planner-backend.onrender.com/api/trips
```

## 🔍 Monitoring Commands

```bash
# Check deployment status via Render API
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.render.com/v1/services

# Monitor logs
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  https://api.render.com/v1/services/SERVICE_ID/logs
```

## 🎯 Success Criteria

- ✅ All 3 services deployed successfully
- ✅ Database connected and accessible
- ✅ Frontend loads without errors
- ✅ Backend API responds to health checks
- ✅ HTTPS enabled automatically
- ✅ Auto-deploy on git push enabled

## 📞 Next Steps

1. **Deploy**: Use Blueprint URL above
2. **Verify**: Run health check commands
3. **Test**: Access live application URLs
4. **Monitor**: Check logs and metrics

**Estimated deployment time: 10-15 minutes**