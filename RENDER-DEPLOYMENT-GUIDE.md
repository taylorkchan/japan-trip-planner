# Render.com Terminal-Only Deployment Guide

Complete guide for deploying Japan Trip Planner to Render using only terminal commands.

## Prerequisites

- Render account with API key
- Payment method added to Render account (required for API deployments)
- GitHub repository: https://github.com/taylorkchan/japan-trip-planner
- Git repository up to date with latest code

## Step 1: Prepare Configuration

### 1.1 Create render.yaml

Create `render.yaml` in project root:

```yaml
services:
  # Backend API Service
  - type: web
    name: japan-trip-planner-backend
    env: node
    region: oregon
    plan: free
    rootDir: Source Code/backend
    buildCommand: npm ci && npx prisma generate
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: USE_SUPABASE
        value: false
      - key: DATABASE_URL
        fromDatabase:
          name: japan-trip-planner-db
          property: connectionString
      - key: JWT_SECRET
        value: super_secure_production_jwt_secret_2024_japan_trip_planner
      - key: CORS_ORIGIN
        fromService:
          type: web
          name: japan-trip-planner-frontend
          property: host

  # Frontend Web App
  - type: web
    name: japan-trip-planner-frontend
    env: static
    rootDir: Source Code/frontend
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  # PostgreSQL Database
  - name: japan-trip-planner-db
    plan: free
    region: oregon
```

### 1.2 Commit and Push

```bash
git add render.yaml
git commit -m "Deploy: Add Render configuration"
git push origin master
```

## Step 2: Get Render API Token

### 2.1 Generate API Token
```bash
# Open Render dashboard to get API key
open "https://dashboard.render.com/u/settings/api"

# Create new API key and copy it
```

### 2.2 Set Environment Variable
```bash
export RENDER_API_TOKEN="your_api_token_here"
```

## Step 3: Get Owner ID

```bash
# Get your Render owner ID
curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Accept: application/json" \
  "https://api.render.com/v1/owners" | jq '.[] | .owner'

# Save the owner ID for next steps
export RENDER_OWNER_ID="tea-xxxxxxxxxxxxxxxx"
```

**Example output:**
```json
{
  "email": "your.email@example.com",
  "id": "tea-d4n5uv8gjchc73br4l70",
  "name": "My Workspace",
  "type": "team"
}
```

## Step 4: Create PostgreSQL Database

```bash
curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "ownerId": "'$RENDER_OWNER_ID'",
    "name": "japan-trip-planner-db",
    "region": "oregon",
    "plan": "free",
    "databaseUser": "japan_trip_user",
    "databaseName": "japan_trip_planner",
    "version": "16"
  }' \
  "https://api.render.com/v1/postgres" | jq '{id: .id, name: .name, status: .status}'
```

**Example output:**
```json
{
  "id": "dpg-d4odprq4d50c738qfl1g-a",
  "name": "japan-trip-planner-db",
  "status": "unknown"
}
```

Save the database ID:
```bash
export DB_ID="dpg-xxxxxxxxxxxxxxxx-a"
```

## Step 5: Create Backend Service

```bash
curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "type": "web_service",
    "ownerId": "'$RENDER_OWNER_ID'",
    "name": "japan-trip-planner-backend",
    "repo": "https://github.com/taylorkchan/japan-trip-planner",
    "branch": "master",
    "rootDir": "Source Code/backend",
    "serviceDetails": {
      "env": "node",
      "region": "oregon",
      "buildCommand": "npm ci && npx prisma generate",
      "startCommand": "npm start",
      "healthCheckPath": "/health",
      "envSpecificDetails": {
        "buildCommand": "npm ci && npx prisma generate",
        "startCommand": "npm start"
      },
      "envVars": [
        {
          "key": "NODE_ENV",
          "value": "production"
        },
        {
          "key": "PORT",
          "value": "10000"
        },
        {
          "key": "USE_SUPABASE",
          "value": "false"
        },
        {
          "key": "JWT_SECRET",
          "value": "super_secure_production_jwt_secret_2024_japan_trip_planner"
        },
        {
          "key": "DATABASE_URL",
          "fromDatabase": {
            "name": "japan-trip-planner-db",
            "property": "connectionString"
          }
        }
      ]
    }
  }' \
  "https://api.render.com/v1/services" | jq '{id: .id, name: .name, type: .type, url: .serviceDetails.url}'
```

Save the backend service ID:
```bash
export BACKEND_ID="srv-xxxxxxxxxxxxxxxx"
```

## Step 6: Create Frontend Service

```bash
curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "type": "static_site",
    "ownerId": "'$RENDER_OWNER_ID'",
    "name": "japan-trip-planner-frontend",
    "repo": "https://github.com/taylorkchan/japan-trip-planner",
    "branch": "master",
    "rootDir": "Source Code/frontend",
    "buildCommand": "npm ci && npm run build",
    "staticPublishPath": "./dist",
    "routes": [
      {
        "type": "rewrite",
        "source": "/*",
        "destination": "/index.html"
      }
    ]
  }' \
  "https://api.render.com/v1/services" | jq '{id: .id, name: .name, type: .type, url: .serviceDetails.url}'
```

Save the frontend service ID:
```bash
export FRONTEND_ID="srv-xxxxxxxxxxxxxxxx"
```

## Step 7: Monitor Deployments

### 7.1 Monitor Backend Deployment

```bash
# Get latest deploy ID
BACKEND_DEPLOY_ID=$(curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services/$BACKEND_ID/deploys?limit=1" | \
  jq -r '.[0].id')

# Monitor status
watch -n 10 'curl -s -H "Authorization: Bearer '$RENDER_API_TOKEN'" \
  "https://api.render.com/v1/services/'$BACKEND_ID'/deploys/'$BACKEND_DEPLOY_ID'" | \
  jq "{status: .status, createdAt: .createdAt}"'
```

### 7.2 Monitor Frontend Deployment

```bash
# Get latest deploy ID
FRONTEND_DEPLOY_ID=$(curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services/$FRONTEND_ID/deploys?limit=1" | \
  jq -r '.[0].id')

# Monitor status
watch -n 10 'curl -s -H "Authorization: Bearer '$RENDER_API_TOKEN'" \
  "https://api.render.com/v1/services/'$FRONTEND_ID'/deploys/'$FRONTEND_DEPLOY_ID'" | \
  jq "{status: .status, createdAt: .createdAt}"'
```

### 7.3 Automated Monitoring Script

```bash
#!/bin/bash
# monitor-deployments.sh

for i in {1..30}; do
  echo "=== Check $i/30 ($(date '+%H:%M:%S')) ==="

  # Check backend
  BACKEND_STATUS=$(curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
    "https://api.render.com/v1/services/$BACKEND_ID/deploys/$BACKEND_DEPLOY_ID" | \
    jq -r '.status')
  echo "Backend:  $BACKEND_STATUS"

  # Check frontend
  FRONTEND_STATUS=$(curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
    "https://api.render.com/v1/services/$FRONTEND_ID/deploys/$FRONTEND_DEPLOY_ID" | \
    jq -r '.status')
  echo "Frontend: $FRONTEND_STATUS"

  # Check if both are live
  if [[ "$BACKEND_STATUS" == "live" ]] && [[ "$FRONTEND_STATUS" == "live" ]]; then
    echo ""
    echo "🎉 Both services are LIVE!"
    break
  fi

  echo ""
  sleep 30
done
```

## Step 8: Verify Deployment

```bash
# Test frontend
curl -I https://japan-trip-planner-frontend.onrender.com

# Test backend health
curl -s https://japan-trip-planner-backend.onrender.com/health | jq .

# Test backend API
curl -s https://japan-trip-planner-backend.onrender.com/api/trips | jq .
```

## Step 9: Manage Services

### List All Services
```bash
curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services?limit=50" | \
  jq '.[] | {id: .service.id, name: .service.name, type: .service.type, url: .service.serviceDetails.url}'
```

### List All Databases
```bash
curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/postgres?limit=50" | \
  jq '.[] | {id: .postgres.id, name: .postgres.name, status: .postgres.status}'
```

### Trigger Manual Deployment
```bash
# Backend
curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "clear"}' \
  "https://api.render.com/v1/services/$BACKEND_ID/deploys" | jq .

# Frontend
curl -s -X POST \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "clear"}' \
  "https://api.render.com/v1/services/$FRONTEND_ID/deploys" | jq .
```

## Step 10: Delete Resources (Cleanup)

### Delete Backend Service
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services/$BACKEND_ID"
```

### Delete Frontend Service
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services/$FRONTEND_ID"
```

### Delete Database
```bash
curl -s -X DELETE \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/postgres/$DB_ID"
```

### Verify Cleanup
```bash
# Should return 0
curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services?limit=50" | jq 'length'

curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/postgres?limit=50" | jq 'length'
```

## Important Notes

1. **Payment Information Required**: As of 2025, Render's API requires payment information to be added to your account before creating services, even for free tier services.

2. **API Rate Limits**: Be aware of Render's API rate limits when making multiple requests.

3. **Environment Variables**: Never commit sensitive environment variables to Git. Use `.env` files locally and API for deployment.

4. **Database Connection**: The DATABASE_URL is automatically injected by Render when using `fromDatabase` configuration.

5. **Health Checks**: The backend service includes a `/health` endpoint that Render uses to determine if the service is running correctly.

## Troubleshooting

### Error: "Payment information is required"
**Solution**: Add a payment method at https://dashboard.render.com/billing

### Error: "name already in use"
**Solution**: Service or database with that name already exists. Either delete it or use a different name.

### Error: "free plan servers are not supported"
**Solution**: Remove the `plan` field or use Blueprint deployment via the web interface.

### Error: "must include serviceDetails when creating"
**Solution**: Ensure your request includes the `serviceDetails` object with required fields.

### Build Fails
**Solution**: Check build logs in dashboard or via API:
```bash
curl -s -H "Authorization: Bearer $RENDER_API_TOKEN" \
  "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID" | \
  jq '.events'
```

## Alternative: Blueprint URL Deployment

If API deployment fails, use the Blueprint URL (requires browser):

```bash
# Open Blueprint deployment URL
open "https://render.com/deploy?repo=https://github.com/taylorkchan/japan-trip-planner"
```

This method:
- Reads the `render.yaml` file from your repository
- Creates all services at once
- Doesn't require API token
- Requires clicking "Apply" in the browser

## Expected URLs After Deployment

- **Frontend**: https://japan-trip-planner-frontend.onrender.com
- **Backend**: https://japan-trip-planner-backend.onrender.com
- **Health Check**: https://japan-trip-planner-backend.onrender.com/health
- **API**: https://japan-trip-planner-backend.onrender.com/api/trips

## Summary of Commands

```bash
# Complete deployment in one go
export RENDER_API_TOKEN="your_token"
export RENDER_OWNER_ID="your_owner_id"

# Create database
DB_RESPONSE=$(curl -s -X POST ...)
export DB_ID=$(echo $DB_RESPONSE | jq -r '.id')

# Create backend
BACKEND_RESPONSE=$(curl -s -X POST ...)
export BACKEND_ID=$(echo $BACKEND_RESPONSE | jq -r '.id')

# Create frontend
FRONTEND_RESPONSE=$(curl -s -X POST ...)
export FRONTEND_ID=$(echo $FRONTEND_RESPONSE | jq -r '.id')

# Monitor until live
./monitor-deployments.sh
```

---

**Deployment completed successfully!** 🎉

Your application is now live on Render.com
