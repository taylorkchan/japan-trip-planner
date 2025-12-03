#!/bin/bash

# Render API Deployment Script for Japan Trip Planner
# Deploys backend, frontend, and database using Render API

set -e  # Exit on any error

echo "🚀 Japan Trip Planner - Render API Deployment"
echo "=============================================="
echo ""

# Configuration
RENDER_API_BASE="https://api.render.com/v1"
REPO_URL="https://github.com/taylorkchan/japan-trip-planner"
SERVICE_NAME_PREFIX="japan-trip-planner"

# Check for API token
if [ -z "$RENDER_API_TOKEN" ]; then
    echo "❌ Error: RENDER_API_TOKEN environment variable not set"
    echo ""
    echo "To get your API token:"
    echo "1. Go to https://dashboard.render.com/u/settings/api"
    echo "2. Create a new API key"
    echo "3. Export it: export RENDER_API_TOKEN='your_token_here'"
    echo ""
    exit 1
fi

echo "✅ API token found"
echo ""

# Function to make API requests
api_request() {
    local method=$1
    local endpoint=$2
    local data=$3

    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $RENDER_API_TOKEN" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -d "$data" \
            "$RENDER_API_BASE$endpoint"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $RENDER_API_TOKEN" \
            -H "Accept: application/json" \
            "$RENDER_API_BASE$endpoint"
    fi
}

# Test API connectivity
echo "🔍 Testing API connectivity..."
if api_request "GET" "/services?limit=1" > /dev/null 2>&1; then
    echo "✅ API connection successful"
else
    echo "❌ API connection failed"
    exit 1
fi
echo ""

# Step 1: Create PostgreSQL Database
echo "📦 Creating PostgreSQL database..."
DB_PAYLOAD='{
    "name": "'$SERVICE_NAME_PREFIX'-db",
    "region": "oregon",
    "plan": "free",
    "databaseUser": "japan_trip_user",
    "databaseName": "japan_trip_planner"
}'

DB_RESPONSE=$(api_request "POST" "/postgres" "$DB_PAYLOAD")
DB_ID=$(echo "$DB_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$DB_ID" ]; then
    echo "✅ Database created successfully (ID: $DB_ID)"
else
    echo "⚠️  Database creation response: $DB_RESPONSE"
fi
echo ""

# Step 2: Create Backend Service (Node.js)
echo "🔧 Creating backend service..."
BACKEND_PAYLOAD='{
    "name": "'$SERVICE_NAME_PREFIX'-backend",
    "type": "web_service",
    "repo": "'$REPO_URL'",
    "branch": "master",
    "rootDir": "Source Code/backend",
    "runtime": "node",
    "region": "oregon",
    "plan": "free",
    "buildCommand": "npm ci && npx prisma generate",
    "startCommand": "npm start",
    "healthCheckPath": "/health",
    "envVars": [
        {
            "key": "NODE_ENV",
            "value": "production"
        },
        {
            "key": "PORT",
            "value": "10000"
        }
    ]
}'

if [ -n "$DB_ID" ]; then
    # Add database connection if DB was created
    BACKEND_PAYLOAD=$(echo "$BACKEND_PAYLOAD" | sed 's/]$/,{"key":"DATABASE_URL","fromDatabase":{"name":"'$SERVICE_NAME_PREFIX'-db","property":"connectionString"}}]/')
fi

BACKEND_RESPONSE=$(api_request "POST" "/services" "$BACKEND_PAYLOAD")
BACKEND_ID=$(echo "$BACKEND_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$BACKEND_ID" ]; then
    echo "✅ Backend service created successfully (ID: $BACKEND_ID)"
else
    echo "⚠️  Backend creation response: $BACKEND_RESPONSE"
fi
echo ""

# Step 3: Create Frontend Service (Static Site)
echo "🎨 Creating frontend service..."
FRONTEND_PAYLOAD='{
    "name": "'$SERVICE_NAME_PREFIX'-frontend",
    "type": "static_site",
    "repo": "'$REPO_URL'",
    "branch": "master",
    "rootDir": "Source Code/frontend",
    "buildCommand": "npm ci && npm run build",
    "publishPath": "./dist",
    "region": "oregon",
    "pullRequestPreviewsEnabled": "no",
    "routes": [
        {
            "type": "rewrite",
            "source": "/*",
            "destination": "/index.html"
        }
    ]
}'

FRONTEND_RESPONSE=$(api_request "POST" "/services" "$FRONTEND_PAYLOAD")
FRONTEND_ID=$(echo "$FRONTEND_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$FRONTEND_ID" ]; then
    echo "✅ Frontend service created successfully (ID: $FRONTEND_ID)"
else
    echo "⚠️  Frontend creation response: $FRONTEND_RESPONSE"
fi
echo ""

# Step 4: Trigger Deployments
echo "🚀 Triggering deployments..."

if [ -n "$BACKEND_ID" ]; then
    echo "   Deploying backend..."
    BACKEND_DEPLOY=$(api_request "POST" "/services/$BACKEND_ID/deploys" '{}')
    echo "   Backend deployment initiated"
fi

if [ -n "$FRONTEND_ID" ]; then
    echo "   Deploying frontend..."
    FRONTEND_DEPLOY=$(api_request "POST" "/services/$FRONTEND_ID/deploys" '{}')
    echo "   Frontend deployment initiated"
fi

echo ""

# Step 5: Show Status
echo "📊 Deployment Summary:"
echo "======================"

if [ -n "$DB_ID" ]; then
    echo "🗄️  Database: $SERVICE_NAME_PREFIX-db (ID: $DB_ID)"
fi

if [ -n "$BACKEND_ID" ]; then
    echo "🔧 Backend:  $SERVICE_NAME_PREFIX-backend (ID: $BACKEND_ID)"
    echo "   URL: https://$SERVICE_NAME_PREFIX-backend.onrender.com"
fi

if [ -n "$FRONTEND_ID" ]; then
    echo "🎨 Frontend: $SERVICE_NAME_PREFIX-frontend (ID: $FRONTEND_ID)"
    echo "   URL: https://$SERVICE_NAME_PREFIX-frontend.onrender.com"
fi

echo ""
echo "⏰ Deployments are now in progress..."
echo "   Monitor status at: https://dashboard.render.com"
echo ""

# Step 6: Start monitoring
echo "🔍 Starting deployment monitoring..."
echo ""

# Monitor function
monitor_service() {
    local service_id=$1
    local service_name=$2
    local url=$3
    local max_attempts=20
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo -n "   $service_name (attempt $attempt/$max_attempts): "

        # Check service status via API
        service_status=$(api_request "GET" "/services/$service_id" | grep -o '"serviceState":"[^"]*"' | cut -d'"' -f4)

        case "$service_status" in
            "available")
                # Test the actual URL
                http_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null)
                if [ "$http_status" = "200" ]; then
                    echo "✅ Live and responding"
                    return 0
                else
                    echo "🔧 Service available but not responding ($http_status)"
                fi
                ;;
            "building")
                echo "🏗️  Building..."
                ;;
            "deploying")
                echo "🚀 Deploying..."
                ;;
            *)
                echo "⏳ Status: $service_status"
                ;;
        esac

        sleep 30
        attempt=$((attempt + 1))
    done

    echo "⚠️  Timeout reached for $service_name"
    return 1
}

# Monitor both services
if [ -n "$BACKEND_ID" ]; then
    monitor_service "$BACKEND_ID" "Backend" "https://$SERVICE_NAME_PREFIX-backend.onrender.com/health" &
    BACKEND_PID=$!
fi

if [ -n "$FRONTEND_ID" ]; then
    monitor_service "$FRONTEND_ID" "Frontend" "https://$SERVICE_NAME_PREFIX-frontend.onrender.com" &
    FRONTEND_PID=$!
fi

# Wait for monitoring to complete
if [ -n "$BACKEND_PID" ]; then
    wait $BACKEND_PID
fi

if [ -n "$FRONTEND_PID" ]; then
    wait $FRONTEND_PID
fi

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify services at dashboard: https://dashboard.render.com"
echo "   2. Test application functionality"
echo "   3. Configure custom domain if needed"