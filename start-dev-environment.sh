#!/bin/bash

# EduLynx Development Environment Setup Script
echo "🚀 Starting EduLynx Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Start database containers
echo "📦 Starting database containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client for main app
echo "🔧 Generating Prisma client for main app..."
npx prisma generate

# Generate Prisma client for LMS
echo "🔧 Generating Prisma client for LMS..."
cd packages/lynxlearn-lms
npx prisma generate
cd ../..

# Run database migrations for main app
echo "🔄 Running database migrations for main app..."
npx prisma db push

# Run database migrations for LMS  
echo "🔄 Running database migrations for LMS..."
cd packages/lynxlearn-lms
npx prisma db push
cd ../..

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Start both applications
echo "🌐 Starting main EduLynx application..."
npm run dev &

echo "🎓 Starting LynxLearn LMS..."
cd packages/lynxlearn-lms
npm run dev &
cd ../..

echo "✅ Development environment setup complete!"
echo ""
echo "🔗 Applications:"
echo "   Main EduLynx: http://localhost:3000"
echo "   LynxLearn LMS: http://localhost:3001"
echo ""
echo "📊 Database:"
echo "   PostgreSQL running on Docker"
echo ""
echo "⚠️  Note: If you see login errors, run the user creation script after setup."
