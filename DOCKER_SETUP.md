# EduLynx Docker Setup Guide

This guide will help you set up and manage your EduLynx application with Docker and PostgreSQL database.

## 🐳 Docker Status

Your Docker setup is ready! Here's what's currently running:

- ✅ Docker Desktop is installed and running
- ✅ PostgreSQL container `lynxacademydb` is running on port 5432
- ✅ Database connection is configured and working
- ✅ Prisma schema is synced with the database

## 🚀 Quick Start

### 1. Ensure Docker is Running
```bash
# Check Docker status
docker ps

# You should see your PostgreSQL container running
```

### 2. Test Database Connection
```bash
# Generate Prisma client
npx prisma generate

# Check database schema
npx prisma db push
```

### 3. Start Development Server
```bash
# Start the Next.js development server
npm run dev
```

### 4. Access Your Application
- **Application**: http://localhost:3000
- **Sign-in Page**: http://localhost:3000/sign-in

## 📊 Database Management

### Using the Docker Helper Script
We've created a helpful script to manage your Docker containers:

```bash
# Make the script executable (first time only)
chmod +x docker-helper.sh

# Show available commands
./docker-helper.sh help

# Start development database
./docker-helper.sh start

# Show database logs
./docker-helper.sh logs

# Show container status
./docker-helper.sh status
```

### Manual Docker Commands
```bash
# Check running containers
docker ps

# View database logs
docker logs lynxacademydb

# Stop database container
docker stop lynxacademydb

# Start database container
docker start lynxacademydb

# Remove container (⚠️ This will delete all data!)
docker rm lynxacademydb
```

## 🔧 Environment Configuration

Your current database configuration in `.env`:
```
DATABASE_URL="postgresql://lynxacademy:lynx121213@localhost:5432/lynxacademydb"
```

### Alternative Development Setup
If you want to use the new Docker Compose setup for development:

```bash
# Start development database with Adminer
docker-compose -f docker-compose.dev.yml up -d

# Access Adminer (Database GUI) at http://localhost:8080
# Server: postgres
# Username: edulynx_dev  
# Password: dev_password_123
# Database: edulynx_dev_db
```

## 🔑 Demo User Credentials

Your database already contains demo users. Use these credentials to test:

- **Admin**: `admin@lynxacademy.co.za` / `adminpass`
- **Teacher**: `teacher1@lynxacademy.co.za` / `teacherpass`  
- **Parent**: `parent1@lynxacademy.co.za` / `parentpass`
- **Student**: `student1@lynxacademy.co.za` / `studentpass`

## 🛠️ Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop application
# Or use command line (macOS)
open -a Docker
```

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check database logs for errors
docker logs lynxacademydb

# Restart the database container
docker restart lynxacademydb
```

### Port Conflicts
If port 5432 is already in use:
```bash
# Find what's using port 5432
lsof -i :5432

# Stop the conflicting service or change the port in docker-compose.yml
```

### Reset Database
⚠️ **Warning**: This will delete all data!
```bash
# Stop and remove container with data
docker stop lynxacademydb
docker rm lynxacademydb

# Remove the volume (optional, to completely reset)
docker volume rm lynxacademydb_data

# Start fresh container
docker-compose up -d postgres
```

## 📦 Production Deployment

For production deployment:
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

## 🔍 Health Checks

Check if your services are healthy:
```bash
# Database health
docker exec lynxacademydb pg_isready -U lynxacademy -d lynxacademydb

# Application health (when running)
curl http://localhost:3000/api/health
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deploying-to-docker)

---

**✅ Your EduLynx application is now properly configured with Docker!**

The database is running, connected, and ready for development. 🎉
