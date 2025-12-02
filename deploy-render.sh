#!/bin/bash

# Render Deployment Script for Japan Trip Planner
# Usage: ./deploy-render.sh YOUR_RENDER_API_TOKEN

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Render API token"
    echo "Usage: ./deploy-render.sh YOUR_RENDER_API_TOKEN"
    echo ""
    echo "Get your token from: https://dashboard.render.com/account/api-keys"
    exit 1
fi

RENDER_API_TOKEN="$1"
echo "🚀 Starting deployment to Render..."

# Step 1: Create PostgreSQL Database
echo ""
echo "📊 Creating PostgreSQL database..."
DB_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/postgres" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "japan-trip-planner-db",
    "plan": "free",
    "region": "oregon"
  }')

if echo "$DB_RESPONSE" | grep -q '"id"'; then
    echo "✅ Database created successfully!"
    DB_ID=$(echo "$DB_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   Database ID: $DB_ID"
else
    echo "❌ Database creation failed:"
    echo "$DB_RESPONSE"
    exit 1
fi

# Wait for database to be ready
echo "⏳ Waiting for database initialization (30 seconds)..."
sleep 30

# Step 2: Deploy Backend Service
echo ""
echo "🔧 Deploying backend service..."
BACKEND_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "japan-trip-planner-backend",
    "repo": "https://github.com/taylorkchan/japan-trip-planner",
    "branch": "master",
    "rootDir": "Source Code/backend",
    "env": "node",
    "plan": "free",
    "region": "oregon",
    "buildCommand": "npm ci && npx prisma generate",
    "startCommand": "npm start",
    "healthCheckPath": "/health",
    "envVars": [
      {"key": "NODE_ENV", "value": "production"},
      {"key": "PORT", "value": "10000"},
      {"key": "USE_SUPABASE", "value": "false"},
      {"key": "JWT_SECRET", "value": "super_secure_production_jwt_secret_2024_japan_trip_planner"}
    ]
  }')

if echo "$BACKEND_RESPONSE" | grep -q '"id"'; then
    echo "✅ Backend service created successfully!"
    BACKEND_ID=$(echo "$BACKEND_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    BACKEND_URL=$(echo "$BACKEND_RESPONSE" | grep -o '"serviceUrl":"[^"]*"' | cut -d'"' -f4)
    echo "   Service ID: $BACKEND_ID"
    echo "   URL: $BACKEND_URL"
else
    echo "❌ Backend service creation failed:"
    echo "$BACKEND_RESPONSE"
    exit 1
fi

# Step 3: Deploy Frontend Service
echo ""
echo "🎨 Deploying frontend service..."
FRONTEND_RESPONSE=$(curl -s -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "static_site",
    "name": "japan-trip-planner-frontend",
    "repo": "https://github.com/taylorkchan/japan-trip-planner",
    "branch": "master",
    "rootDir": "Source Code/frontend",
    "buildCommand": "npm ci && npm run build",
    "publishPath": "./dist",
    "headers": [],
    "routes": [
      {"type": "rewrite", "source": "/*", "destination": "/index.html"}
    ]
  }')

if echo "$FRONTEND_RESPONSE" | grep -q '"id"'; then
    echo "✅ Frontend service created successfully!"
    FRONTEND_ID=$(echo "$FRONTEND_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    FRONTEND_URL=$(echo "$FRONTEND_RESPONSE" | grep -o '"serviceUrl":"[^"]*"' | cut -d'"' -f4)
    echo "   Service ID: $FRONTEND_ID"
    echo "   URL: $FRONTEND_URL"
else
    echo "❌ Frontend service creation failed:"
    echo "$FRONTEND_RESPONSE"
    exit 1
fi

# Step 4: Configure Database Connection
echo ""
echo "🔗 Connecting database to backend..."
DB_CONFIG_RESPONSE=$(curl -s -X PATCH "https://api.render.com/v1/services/$BACKEND_ID" \
  -H "Authorization: Bearer $RENDER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "envVars": [
      {"key": "DATABASE_URL", "fromDatabase": {"name": "japan-trip-planner-db", "property": "connectionString"}}
    ]
  }')

echo "✅ Database connection configured!"

# Summary
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Service Summary:"
echo "   🗄️  Database: japan-trip-planner-db"
echo "   ⚙️  Backend:  $BACKEND_URL"
echo "   🎨 Frontend: $FRONTEND_URL"
echo ""
echo "⏳ Services are deploying (10-15 minutes)"
echo "   Monitor progress at: https://dashboard.render.com"
echo ""
echo "🔍 Health Check Commands:"
echo "   curl $FRONTEND_URL"
echo "   curl $BACKEND_URL/health"
echo ""
echo "✨ Your Japan Trip Planner is going live!"