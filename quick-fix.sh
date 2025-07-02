#!/bin/bash

# Quick Fix Script for EduLynx TypeScript Errors
echo "🛠️  EduLynx Quick Fix Script"
echo "============================"

# 1. Regenerate Prisma clients
echo "🔧 Step 1: Regenerating Prisma clients..."
echo "Main app Prisma client..."
npx prisma generate

echo "LMS Prisma client..."
cd packages/lynxlearn-lms
npx prisma generate
cd ../..

# 2. Start Docker if not running
echo "🐳 Step 2: Starting Docker containers..."
docker-compose up -d

# 3. Wait for database
echo "⏳ Step 3: Waiting for database..."
sleep 5

# 4. Push database schema
echo "📊 Step 4: Pushing database schema..."
npx prisma db push --force-reset

echo "LMS database schema..."
cd packages/lynxlearn-lms  
npx prisma db push --force-reset
cd ../..

# 5. Create basic demo user
echo "👤 Step 5: Creating demo user..."
cat > temp-create-user.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'admin@edulynx.com' },
      update: {},
      create: {
        email: 'admin@edulynx.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log('✅ Demo user created:', user.email);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
EOF

node temp-create-user.js
rm temp-create-user.js

# 6. Install missing dependencies
echo "📦 Step 6: Installing dependencies..."
npm install bcryptjs @types/bcryptjs

# 7. Start applications
echo "🚀 Step 7: Starting applications..."
echo "Starting main EduLynx app on port 3000..."
npm run dev &
MAIN_PID=$!

echo "Starting LynxLearn LMS on port 3001..."
cd packages/lynxlearn-lms
npm run dev &
LMS_PID=$!
cd ../..

echo ""
echo "✅ Setup Complete!"
echo "==================="
echo "🔗 Main App: http://localhost:3000"
echo "🎓 LMS: http://localhost:3001"
echo ""
echo "🔑 Demo Login:"
echo "   Email: admin@edulynx.com"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
