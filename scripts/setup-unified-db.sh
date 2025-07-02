#!/bin/bash

# Comprehensive database setup script for EduLynx ecosystem
echo "🚀 Setting up EduLynx database with all microservice schemas..."

# Drop and recreate database to start fresh
echo "📦 Recreating database..."
psql -h localhost -U lynxdb_admin -d postgres -c "DROP DATABASE IF EXISTS lynxacademydb;"
psql -h localhost -U lynxdb_admin -d postgres -c "CREATE DATABASE lynxacademydb;"

echo "✅ Database recreated successfully!"

# Create a unified schema file that combines all service schemas
echo "📝 Creating unified schema..."

# First, run curriculum service migration to get its tables
echo "🎓 Setting up curriculum tables..."
cd /Users/derahmanyelo/Documents/GitHub/EduLynx/packages/curriculum-service
npx prisma migrate reset --force --skip-seed
npx prisma migrate dev --name curriculum_tables --create-only
npx prisma db push

# Add assessment service tables (without resetting)
echo "📝 Adding assessment tables..."
cd /Users/derahmanyelo/Documents/GitHub/EduLynx/packages/assessment-service
npx prisma db push

# Add career service tables (without resetting)
echo "💼 Adding career tables..."
cd /Users/derahmanyelo/Documents/GitHub/EduLynx/packages/career-service
npx prisma db push

echo "🎉 Database setup complete! All microservice tables are ready."
echo "📊 Ready to seed data..."
