# EduLynx - Complete Education Management System

A comprehensive education management platform consisting of two main
applications:

1. **EduLynx Academy** - Main student management system
2. **LynxLearn LMS** - Learning Management System

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- PostgreSQL client tools (for database backups)

### 1. Clone and Setup

```bash
git clone https://github.com/lynxsa/EduLynx.git
cd EduLynx
pnpm install
```

### 2. Start Databases

```bash
# Start main EduLynx database
docker run --name lynxacademy-postgres \
  -e POSTGRES_DB=lynxacademydb \
  -e POSTGRES_USER=lynxacademy \
  -e POSTGRES_PASSWORD=lynxacademy123 \
  -p 5432:5432 \
  -d postgres:15-alpine

# Start LynxLearn LMS database
docker run --name lynxlearn-postgres \
  -e POSTGRES_DB=lynxlearn_db \
  -e POSTGRES_USER=lynxlearn_admin \
  -e POSTGRES_PASSWORD=lynxlearn2025 \
  -p 5433:5432 \
  -d postgres:14
```

### 3. Setup LynxLearn LMS Database

```bash
cd packages/lynxlearn-lms
npx prisma db push
cd ../..
node create-lms-users.js
```

### 4. Start Applications

```bash
# Start main EduLynx application (port 3000)
npm run dev

# Start LynxLearn LMS (port 3001)
cd packages/lynxlearn-lms
npm run dev
```

## 📱 Applications

### EduLynx Academy (Main Application)

- **URL**: http://localhost:3000
- **Database**: lynxacademydb (PostgreSQL on port 5432)
- **Description**: Main student management system with comprehensive features

### LynxLearn LMS

- **URL**: http://localhost:3001
- **Database**: lynxlearn_db (PostgreSQL on port 5433)
- **Description**: Learning Management System for course delivery

## 🔐 Demo Credentials

### EduLynx Academy

- **Admin**: admin@lynxacademy.co.za / adminpass
- **Teacher**: teacher@lynxacademy.co.za / teacherpass
- **Student**: student@lynxacademy.co.za / studentpass

### LynxLearn LMS

- **Admin**: admin@lynxlearn.co.za / admin123
- **Teacher**: teacher@lynxlearn.co.za / teacher123
- **Student**: student@lynxlearn.co.za / student123

## 📊 Database Management

### Backup Databases

```bash
# Manual backup (recommended)
PGPASSWORD=lynxacademy123 pg_dump -h localhost -p 5432 -U lynxacademy -d lynxacademydb > database-backups/lynxacademydb-backup.sql
PGPASSWORD=lynxlearn2025 pg_dump -h localhost -p 5433 -U lynxlearn_admin -d lynxlearn_db > database-backups/lynxlearn_db-backup.sql

# Using scripts (if available)
node scripts/backup-databases.js
```

### Restore Databases

```bash
# Restore main database
PGPASSWORD=lynxacademy123 psql -h localhost -p 5432 -U lynxacademy -d lynxacademydb < database-backups/lynxacademydb-backup.sql

# Restore LMS database
PGPASSWORD=lynxlearn2025 psql -h localhost -p 5433 -U lynxlearn_admin -d lynxlearn_db < database-backups/lynxlearn_db-backup.sql
```

## 🏗️ Project Structure

```
EduLynx/
├── packages/
│   └── lynxlearn-lms/          # LynxLearn LMS application
│       ├── app/                # Next.js 14 app directory
│       ├── components/         # React components
│       ├── prisma/            # Database schema
│       └── package.json
├── scripts/                   # Utility scripts
│   ├── backup-databases.js    # Database backup script
│   └── restore-databases.js   # Database restore script
├── database-backups/          # Database backup files
│   ├── README.md             # Database backup guide
│   ├── lynxacademydb-backup-*.sql
│   └── lynxlearn_db-backup-*.sql
├── create-lms-users.js       # LMS demo user creation
├── package.json              # Main package file
└── README.md                 # This file
```

## 🛠️ Development

### Environment Variables

#### LynxLearn LMS (packages/lynxlearn-lms/.env)

```env
DATABASE_URL="postgresql://lynxlearn_admin:lynxlearn2025@localhost:5433/lynxlearn_db?schema=public"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"
```

### Database Schemas

#### LynxLearn LMS (Prisma Schema)

- Located in: `packages/lynxlearn-lms/prisma/schema.prisma`
- Models: User, School, Course, Enrollment, etc.
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
