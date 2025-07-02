#!/bin/bash

# Database Setup and Fix Script
echo "🔧 Fixing Database Connection Issues..."

# Stop and remove existing containers
echo "1. Cleaning up existing containers..."
docker-compose down postgres redis 2>/dev/null || true
docker rm -f edulynx_postgres edulynx_redis 2>/dev/null || true
docker volume rm edulynx_postgres_data edulynx_redis_data 2>/dev/null || true

# Create a simpler Docker compose setup
echo "2. Creating simplified database setup..."
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: edulynx_postgres_simple
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: edulynx_db
      POSTGRES_USER: edulynx_user
      POSTGRES_PASSWORD: edulynx_password_2024
    volumes:
      - postgres_simple_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: edulynx_redis_simple
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_simple_data:/data

volumes:
  postgres_simple_data:
  redis_simple_data:
EOF

# Start the simplified setup
echo "3. Starting simplified database containers..."
docker-compose -f docker-compose.simple.yml up -d

# Wait for database to be ready
echo "4. Waiting for database to initialize..."
sleep 15

# Test connection
echo "5. Testing database connection..."
docker exec -it edulynx_postgres_simple psql -U edulynx_user -d edulynx_db -c "SELECT version();"

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    
    # Push schema
    echo "6. Pushing database schema..."
    npx prisma db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Schema created successfully!"
        
        # Generate client
        echo "7. Generating Prisma client..."
        npx prisma generate
        
        # Create demo user
        echo "8. Creating demo user..."
        node create-demo-user.js
        
        echo ""
        echo "✅ Database setup complete!"
        echo "🔗 You can now start the applications"
    else
        echo "❌ Schema creation failed"
    fi
else
    echo "❌ Database connection failed"
fi
