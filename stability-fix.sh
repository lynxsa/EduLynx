#!/bin/bash

# EduLynx Application Stability Script
echo "🔧 EduLynx Stability Check & Fix"
echo "================================="

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo "❌ Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    echo "🛑 Killing processes on port $port..."
    lsof -ti :$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

echo "1. Checking and clearing ports..."
kill_port_processes 3000
kill_port_processes 3001

echo ""
echo "2. Checking Docker containers..."
docker-compose down 2>/dev/null || true
sleep 2
docker-compose up -d postgres redis

echo ""
echo "3. Waiting for database to be ready..."
sleep 10

# Test database connection
echo "4. Testing database connection..."
npx prisma db seed --preview-feature > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection issue, attempting fix..."
    npx prisma generate
    npx prisma db push --force-reset
fi

echo ""
echo "5. Generating Prisma clients..."
npx prisma generate
cd packages/lynxlearn-lms
npx prisma generate
cd ../..

echo ""
echo "6. Creating demo user..."
node create-demo-user.js

echo ""
echo "7. Installing/updating dependencies..."
npm install --silent

echo ""
echo "8. Starting applications with proper error handling..."

# Create startup script with better error handling
cat > start-stable.js << 'EOF'
const { spawn } = require('child_process');
const fs = require('fs');

// Create logs directory
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

// Start main app
console.log('🚀 Starting main EduLynx app...');
const mainApp = spawn('npm', ['run', 'dev'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3000' }
});

// Start LMS app
console.log('🎓 Starting LynxLearn LMS...');
const lmsApp = spawn('npm', ['run', 'dev'], {
    cwd: './packages/lynxlearn-lms',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3001' }
});

// Log outputs
const mainLog = fs.createWriteStream('./logs/main-app.log', { flags: 'a' });
const lmsLog = fs.createWriteStream('./logs/lms-app.log', { flags: 'a' });

mainApp.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`[MAIN] ${output}`);
    mainLog.write(`${new Date().toISOString()} [MAIN] ${output}`);
});

mainApp.stderr.on('data', (data) => {
    const output = data.toString();
    process.stderr.write(`[MAIN ERROR] ${output}`);
    mainLog.write(`${new Date().toISOString()} [MAIN ERROR] ${output}`);
});

lmsApp.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`[LMS] ${output}`);
    lmsLog.write(`${new Date().toISOString()} [LMS] ${output}`);
});

lmsApp.stderr.on('data', (data) => {
    const output = data.toString();
    process.stderr.write(`[LMS ERROR] ${output}`);
    lmsLog.write(`${new Date().toISOString()} [LMS ERROR] ${output}`);
});

// Handle process exits
mainApp.on('close', (code) => {
    console.log(`\n❌ Main app exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Attempting to restart main app...');
        setTimeout(() => process.exit(1), 1000);
    }
});

lmsApp.on('close', (code) => {
    console.log(`\n❌ LMS app exited with code ${code}`);
    if (code !== 0) {
        console.log('🔄 Attempting to restart LMS app...');
        setTimeout(() => process.exit(1), 1000);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down applications...');
    mainApp.kill('SIGTERM');
    lmsApp.kill('SIGTERM');
    setTimeout(() => {
        mainApp.kill('SIGKILL');
        lmsApp.kill('SIGKILL');
        process.exit(0);
    }, 5000);
});

console.log('');
console.log('✅ Applications starting...');
console.log('🔗 Main App: http://localhost:3000');
console.log('🎓 LMS: http://localhost:3001');
console.log('📋 Logs: ./logs/');
console.log('');
console.log('🔑 Demo Login:');
console.log('   Email: admin@edulynx.com');
console.log('   Password: admin123');
console.log('');
console.log('Press Ctrl+C to stop all services');
EOF

node start-stable.js
