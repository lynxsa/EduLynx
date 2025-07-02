#!/bin/bash

echo "🚀 Starting EduLynx Applications - Stable Mode"
echo "=============================================="

# Create logs directory
mkdir -p logs

# Function to start app with retries
start_with_retry() {
    local app_name=$1
    local command=$2
    local port=$3
    local max_retries=3
    local retry_count=0

    while [ $retry_count -lt $max_retries ]; do
        echo "🔄 Starting $app_name (attempt $((retry_count + 1))/$max_retries)..."
        
        if $command > logs/${app_name}.log 2>&1 & then
            local pid=$!
            sleep 5
            
            # Check if process is still running
            if kill -0 $pid 2>/dev/null; then
                echo "✅ $app_name started successfully on port $port (PID: $pid)"
                return 0
            else
                echo "❌ $app_name failed to start"
                wait $pid
            fi
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $max_retries ]; then
            echo "⏳ Waiting 5 seconds before retry..."
            sleep 5
        fi
    done
    
    echo "💥 Failed to start $app_name after $max_retries attempts"
    return 1
}

# Start main app
echo "📱 Starting main EduLynx application..."
if start_with_retry "main-app" "npm run dev" "3000"; then
    echo "✅ Main app started successfully"
else
    echo "❌ Failed to start main app"
    exit 1
fi

# Start LMS app
echo "🎓 Starting LynxLearn LMS..."
if start_with_retry "lms-app" "cd packages/lynxlearn-lms && npm run dev" "3001"; then
    echo "✅ LMS app started successfully"
else
    echo "❌ Failed to start LMS app"
    exit 1
fi

echo ""
echo "🎉 Both applications are running!"
echo "================================="
echo "🔗 Main App: http://localhost:3000"
echo "🎓 LMS: http://localhost:3001"
echo ""
echo "🔑 Demo Login:"
echo "   Email: admin@edulynx.com"
echo "   Password: admin123"
echo ""
echo "📋 Logs available in ./logs/"
echo "   Main App: ./logs/main-app.log"
echo "   LMS: ./logs/lms-app.log"
echo ""
echo "Press Ctrl+C to stop"

# Wait for user interrupt
trap 'echo "🛑 Stopping applications..."; pkill -f "npm run dev"; exit 0' INT
wait
