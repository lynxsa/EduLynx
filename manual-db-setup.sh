#!/bin/bash

# Manual Database Creation Script
echo "🛠️  Manual Database Setup"
echo "========================="

# Start fresh database
echo "1. Starting fresh PostgreSQL container..."
docker run --name edulynx_db_manual -e POSTGRES_DB=edulynx_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=edulynx_password_2024 -p 5432:5432 -d postgres:15-alpine

# Wait for startup
echo "2. Waiting for database to start..."
sleep 15

# Create basic user table manually
echo "3. Creating user table manually..."
docker exec -i edulynx_db_manual psql -U postgres -d edulynx_db << 'EOF'
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create a basic demo user
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "isActive") 
VALUES (
  'admin-001',
  'admin@edulynx.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Admin',
  'User',
  'ADMIN',
  true
) ON CONFLICT (email) DO NOTHING;

SELECT * FROM "User";
EOF

echo ""
echo "✅ Basic database setup complete!"
echo "🔑 Demo user created with hashed password for 'admin123'"
echo "📊 Database URL: postgresql://postgres:edulynx_password_2024@localhost:5432/edulynx_db"
