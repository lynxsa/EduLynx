#!/bin/bash

# Stop all EduLynx services
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log "🛑 Stopping EduLynx Ecosystem Services..."

# Stop by PID files if they exist
if [ -f "logs/edulynx.pid" ]; then
    EDULYNX_PID=$(cat logs/edulynx.pid)
    if kill -0 $EDULYNX_PID 2>/dev/null; then
        log "Stopping EduLynx (PID: $EDULYNX_PID)..."
        kill $EDULYNX_PID
        sleep 2
    fi
    rm -f logs/edulynx.pid
fi

if [ -f "logs/lynxlearn.pid" ]; then
    LYNXLEARN_PID=$(cat logs/lynxlearn.pid)
    if kill -0 $LYNXLEARN_PID 2>/dev/null; then
        log "Stopping LynxLearn (PID: $LYNXLEARN_PID)..."
        kill $LYNXLEARN_PID
        sleep 2
    fi
    rm -f logs/lynxlearn.pid
fi

# Force kill any remaining Next.js processes
log "Cleaning up any remaining processes..."
pkill -f "next dev" || true
pkill -f "node.*next" || true

# Check ports are free
sleep 3
if lsof -i :3000 > /dev/null 2>&1; then
    warning "Port 3000 still in use"
else
    log "✅ Port 3000 is free"
fi

if lsof -i :3005 > /dev/null 2>&1; then
    warning "Port 3005 still in use"
else
    log "✅ Port 3005 is free"
fi

log "🎯 All EduLynx services stopped successfully!"
