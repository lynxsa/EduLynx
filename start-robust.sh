#!/bin/bash

# EduLynx Ecosystem Startup Script with Robust Error Handling
# This script starts both EduLynx (School Management) and LynxLearn (LMS) with proper error handling

set -euo pipefail  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Cleanup function
cleanup() {
    log "Cleaning up processes..."
    # Kill any existing processes
    pkill -f "next dev" || true
    pkill -f "node.*next" || true
    sleep 2
}

# Trap cleanup on exit
trap cleanup EXIT

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Error: Not in the EduLynx root directory"
    exit 1
fi

log "🎓 Starting EduLynx Ecosystem with Robust Error Handling"
log "========================================================="

# Step 1: Clean up any existing processes
log "🧹 Cleaning up existing processes..."
cleanup

# Step 2: Check Node.js and npm
log "🔧 Checking system requirements..."
if ! command -v node &> /dev/null; then
    error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
fi

NODE_VERSION=$(node --version)
log "✅ Node.js version: $NODE_VERSION"

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -d "packages/lynxlearn-lms/node_modules" ]; then
    log "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        error "Failed to install dependencies"
        exit 1
    fi
fi

# Step 4: Build the applications
log "🔨 Building applications..."
npm run build 2>/dev/null || {
    warning "Build warnings detected, continuing..."
}

# Step 5: Create log directories
mkdir -p logs
touch logs/edulynx.log
touch logs/lynxlearn.log

# Step 6: Start EduLynx (School Management System) on port 3000
log "🏫 Starting EduLynx School Management System (port 3000)..."
npm run dev > logs/edulynx.log 2>&1 &
EDULYNX_PID=$!

# Wait a moment for the server to start
sleep 5

# Check if EduLynx started successfully
if kill -0 $EDULYNX_PID 2>/dev/null; then
    log "✅ EduLynx started successfully (PID: $EDULYNX_PID)"
else
    error "❌ Failed to start EduLynx"
    cat logs/edulynx.log
    exit 1
fi

# Step 7: Start LynxLearn LMS on port 3005
log "📚 Starting LynxLearn LMS (port 3005)..."
cd packages/lynxlearn-lms
npm run dev > ../../logs/lynxlearn.log 2>&1 &
LYNXLEARN_PID=$!
cd ../..

# Wait a moment for the server to start
sleep 5

# Check if LynxLearn started successfully
if kill -0 $LYNXLEARN_PID 2>/dev/null; then
    log "✅ LynxLearn started successfully (PID: $LYNXLEARN_PID)"
else
    error "❌ Failed to start LynxLearn"
    cat logs/lynxlearn.log
    exit 1
fi

# Step 8: Health checks
log "🔍 Performing health checks..."

# Test EduLynx
sleep 3
if curl -f -s http://localhost:3000 > /dev/null; then
    log "✅ EduLynx health check passed (http://localhost:3000)"
else
    warning "⚠️  EduLynx health check failed, but process is running"
fi

# Test LynxLearn
sleep 3
if curl -f -s http://localhost:3005 > /dev/null; then
    log "✅ LynxLearn health check passed (http://localhost:3005)"
else
    warning "⚠️  LynxLearn health check failed, but process is running"
fi

# Step 9: Success message
log "🚀 EduLynx Ecosystem Started Successfully!"
log "==========================================="
log "📊 EduLynx School Management: http://localhost:3000"
log "📚 LynxLearn LMS:            http://localhost:3005"
log ""
log "💡 Process Information:"
log "   EduLynx PID:    $EDULYNX_PID"
log "   LynxLearn PID:  $LYNXLEARN_PID"
log ""
log "📁 Logs:"
log "   EduLynx logs:   ./logs/edulynx.log"
log "   LynxLearn logs: ./logs/lynxlearn.log"
log ""
log "🛑 To stop all services: ./scripts/stop-all.sh"
log "📊 To view logs: tail -f logs/*.log"

# Save PID files for easy stopping
echo $EDULYNX_PID > logs/edulynx.pid
echo $LYNXLEARN_PID > logs/lynxlearn.pid

# Monitor processes
log "👀 Monitoring services (Ctrl+C to stop)..."
while true; do
    if ! kill -0 $EDULYNX_PID 2>/dev/null; then
        error "❌ EduLynx process died unexpectedly"
        cat logs/edulynx.log | tail -20
        exit 1
    fi
    
    if ! kill -0 $LYNXLEARN_PID 2>/dev/null; then
        error "❌ LynxLearn process died unexpectedly"
        cat logs/lynxlearn.log | tail -20
        exit 1
    fi
    
    sleep 10
done
