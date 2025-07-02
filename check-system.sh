#!/bin/bash

# Check Docker and Database Status
echo "🔍 EduLynx System Status Check"
echo "=============================="

# Check Docker
echo "🐳 Docker Status:"
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo "   ✅ Docker is running"
        
        # Check containers
        echo "📦 Container Status:"
        docker-compose ps
        
        # Start containers if not running
        echo "🚀 Starting containers..."
        docker-compose up -d
        
    else
        echo "   ❌ Docker is not running"
        echo "   Please start Docker Desktop first"
        exit 1
    fi
else
    echo "   ❌ Docker is not installed"
    exit 1
fi

# Check Node.js
echo ""
echo "🟢 Node.js Status:"
if command -v node &> /dev/null; then
    echo "   ✅ Node.js version: $(node --version)"
else
    echo "   ❌ Node.js is not installed"
    exit 1
fi

# Check npm
echo "📦 NPM Status:"
if command -v npm &> /dev/null; then
    echo "   ✅ NPM version: $(npm --version)"
else
    echo "   ❌ NPM is not installed"
    exit 1
fi

# Check if dependencies are installed
echo ""
echo "📚 Dependencies Status:"
if [ -d "node_modules" ]; then
    echo "   ✅ Main app dependencies installed"
else
    echo "   ❌ Main app dependencies missing"
    echo "   Running: npm install"
    npm install
fi

if [ -d "packages/lynxlearn-lms/node_modules" ]; then
    echo "   ✅ LMS dependencies installed"
else
    echo "   ❌ LMS dependencies missing"
    echo "   Running: cd packages/lynxlearn-lms && npm install"
    cd packages/lynxlearn-lms && npm install && cd ../..
fi

echo ""
echo "🎯 Ready to run quick-fix.sh!"
echo "   Run: chmod +x quick-fix.sh && ./quick-fix.sh"
