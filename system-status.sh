#!/bin/bash

# EduLynx System Status Check
echo "🚀 EduLynx System Status"
echo "========================"

# Check Docker containers
echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📊 Database Connection:"
npx prisma db seed --preview-feature > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Main database connection successful"
else
    echo "❌ Main database connection failed"
fi

cd packages/lynxlearn-lms
npx prisma db seed --preview-feature > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ LMS database connection successful"
else
    echo "❌ LMS database connection failed"
fi
cd ../..

echo ""
echo "🌐 Application Status:"
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Main app (port 3000) - Running"
else
    echo "❌ Main app (port 3000) - Not responding"
fi

curl -s http://localhost:3001 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ LMS app (port 3001) - Running"
else
    echo "❌ LMS app (port 3001) - Not responding"
fi

echo ""
echo "🔑 Demo Login Credentials:"
echo "   Email: admin@edulynx.com"
echo "   Password: admin123"

echo ""
echo "🔗 Access Links:"
echo "   Main App: http://localhost:3000"
echo "   LMS App: http://localhost:3001"
