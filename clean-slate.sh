#!/bin/bash

# 🧹 EduLynx Complete Clean Slate Script
# This script will reset caches and prepare for the massive overhaul

echo "🚀 Starting EduLynx Complete Overhaul..."
echo "⚠️  This will reset all caches and prepare for clean rebuild"

# Stop any running processes
echo "🛑 Stopping any running processes..."
pkill -f "next"
pkill -f "prisma"

# Clear all caches
echo "🧹 Clearing development caches..."

# NPM/Yarn caches
npm cache clean --force 2>/dev/null || true
yarn cache clean 2>/dev/null || true
pnpm store prune 2>/dev/null || true

# Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Prisma cache
rm -rf prisma/generated 2>/dev/null || true

# TypeScript cache
rm -rf .tsbuildinfo
rm -rf tsconfig.tsbuildinfo

# Build artifacts
rm -rf dist
rm -rf build
rm -rf out

# Log files
rm -rf logs
rm -rf *.log

# Temporary files
rm -rf tmp
rm -rf temp

echo "✅ Cache cleanup complete!"

# Backup current problematic files
echo "📦 Creating backup of current problematic pages..."
mkdir -p ./backup/$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backup/$(date +%Y%m%d_%H%M%S)"

# Backup problematic dashboard files
if [ -d "src/app/(dashboard)" ]; then
    cp -r "src/app/(dashboard)" "$BACKUP_DIR/dashboard_backup"
    echo "✅ Dashboard backed up to $BACKUP_DIR"
fi

# Create workspace structure
echo "🏗️ Setting up monorepo workspace structure..."

# Create package.json for workspace
cat > package.json << 'EOF'
{
  "name": "edulynx-ecosystem",
  "version": "2.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "reset": "./scripts/reset-caches.sh"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "test": {
      "dependsOn": ["^test"]
    },
    "clean": {
      "cache": false
    }
  }
}
EOF

# Create directory structure
echo "📁 Creating workspace directories..."
mkdir -p packages/edulynx-admin
mkdir -p packages/lynxlearn-lms
mkdir -p packages/ui-primitives
mkdir -p packages/curriculum-service
mkdir -p packages/assessment-service
mkdir -p packages/career-service
mkdir -p packages/ai-service
mkdir -p apps/docs
mkdir -p tools/docker
mkdir -p tools/scripts
mkdir -p tools/ci
mkdir -p shared/types
mkdir -p shared/utils
mkdir -p shared/constants

echo "🎯 Workspace structure created!"

# Create workspace README
cat > README.md << 'EOF'
# 🚀 EduLynx Education Ecosystem

> Revolutionary South African Education Management Platform with Integrated LMS

## 🏗️ Architecture

This is a monorepo containing:

- **EduLynx Admin** - School management dashboard
- **LYNXLearn LMS** - Learning management micro-frontend
- **Shared Services** - Curriculum, Assessment, Career, AI services
- **UI Primitives** - Shared component library

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build all packages
npm run build
```

## 📦 Packages

- `packages/edulynx-admin` - Main admin dashboard
- `packages/lynxlearn-lms` - LMS micro-frontend
- `packages/ui-primitives` - Shared UI components
- `packages/curriculum-service` - Curriculum management
- `packages/assessment-service` - Quiz and assessment system
- `packages/career-service` - Career guidance system
- `packages/ai-service` - ProfLynx AI integration

## 🛠️ Development

This project uses:
- **Turborepo** for monorepo management
- **Next.js 14+** for web applications
- **Prisma** for database management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Jest** for testing

## 🎯 Goals

Transform South African education with:
- World-class school management
- Integrated LMS with CAPS curriculum
- AI-powered tutoring (ProfLynx)
- Career guidance for students
- Real-time analytics and insights

---

**Built with ❤️ for South African Education**
EOF

echo "✅ Clean slate preparation complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: npm install"
echo "2. Set up individual package configurations"
echo "3. Implement UI primitives library"
echo "4. Build EduLynx admin dashboard"
echo "5. Create LYNXLearn LMS micro-frontend"
echo ""
echo "🚀 Ready for the biggest application overhaul yet!"
echo "💪 LET'S GOOOOOOOOOOOOOOOO!!!!!!!!!!!!"
