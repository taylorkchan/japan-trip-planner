#!/bin/bash

# Render Deployment Monitor Script
# Monitor Japan Trip Planner deployment progress

FRONTEND_URL="https://japan-trip-planner-frontend.onrender.com"
BACKEND_URL="https://japan-trip-planner-backend.onrender.com"
HEALTH_URL="$BACKEND_URL/health"
API_URL="$BACKEND_URL/api/trips"

echo "🚀 Japan Trip Planner Deployment Monitor"
echo "==========================================="
echo ""

check_service() {
    local url=$1
    local name=$2
    local timeout=10

    echo -n "🔍 Checking $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" 2>/dev/null)

    case $response in
        200)
            echo "✅ Live (200 OK)"
            return 0
            ;;
        404)
            echo "⏳ Still deploying (404)"
            return 1
            ;;
        503|502|500)
            echo "🔧 Service starting ($response)"
            return 1
            ;;
        000)
            echo "🔌 No response (timeout)"
            return 1
            ;;
        *)
            echo "⚠️  Unexpected status ($response)"
            return 1
            ;;
    esac
}

monitor_loop() {
    local max_attempts=30  # 15 minutes with 30-second intervals
    local attempt=1
    local frontend_ready=false
    local backend_ready=false
    local health_ready=false

    echo "⏰ Starting monitoring (checking every 30 seconds)..."
    echo ""

    while [ $attempt -le $max_attempts ]; do
        echo "📊 Check #$attempt ($(date '+%H:%M:%S')):"

        # Check Frontend
        if ! $frontend_ready; then
            if check_service "$FRONTEND_URL" "Frontend"; then
                frontend_ready=true
            fi
        else
            echo "🔍 Checking Frontend... ✅ Live (verified)"
        fi

        # Check Backend
        if ! $backend_ready; then
            if check_service "$BACKEND_URL" "Backend"; then
                backend_ready=true
            fi
        else
            echo "🔍 Checking Backend... ✅ Live (verified)"
        fi

        # Check Health Endpoint (if backend is ready)
        if $backend_ready && ! $health_ready; then
            if check_service "$HEALTH_URL" "Health API"; then
                health_ready=true
            fi
        elif $health_ready; then
            echo "🔍 Checking Health API... ✅ Live (verified)"
        fi

        echo ""

        # Check if all services are ready
        if $frontend_ready && $backend_ready && $health_ready; then
            echo "🎉 All services are live and ready!"
            echo ""
            echo "🌐 Live URLs:"
            echo "   Frontend: $FRONTEND_URL"
            echo "   Backend:  $BACKEND_URL"
            echo "   Health:   $HEALTH_URL"
            echo "   API:      $API_URL"
            echo ""
            echo "✅ Deployment completed successfully!"
            return 0
        fi

        if [ $attempt -lt $max_attempts ]; then
            echo "⏳ Waiting 30 seconds before next check..."
            sleep 30
        fi

        attempt=$((attempt + 1))
    done

    echo "⚠️  Timeout reached. Some services may still be deploying."
    echo "   Continue monitoring manually or check Render dashboard."
    return 1
}

# Start monitoring
monitor_loop