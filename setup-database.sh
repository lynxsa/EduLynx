#!/bin/bash

# Database setup script for EduLynx
echo "🚀 Setting up EduLynx database..."

# Database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="lynxacademydb"
DB_USER="lynxdb_admin"
DB_PASS="lynxacadmy2025"

# Check if PostgreSQL is installed and running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database and user if they don't exist
echo "📝 Creating database and user..."

# Connect as postgres user to create database and user
psql -h $DB_HOST -p $DB_PORT -U postgres << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database and user created successfully"
else
    echo "❌ Failed to create database and user"
    exit 1
fi

echo "🎯 Database setup completed!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
