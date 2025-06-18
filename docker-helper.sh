#!/bin/bash

# EduLynx Docker Management Script
# This script helps you manage your Docker containers and database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_color $RED "❌ Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    print_color $GREEN "✅ Docker is running"
}

# Function to start development database
start_dev_db() {
    print_color $BLUE "🚀 Starting development database..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    print_color $GREEN "✅ Development database started"
    print_color $YELLOW "📊 Database accessible at: localhost:5432"
    print_color $YELLOW "🌐 Adminer (DB GUI) accessible at: http://localhost:8080"
}

# Function to stop development database
stop_dev_db() {
    print_color $BLUE "🛑 Stopping development database..."
    docker-compose -f docker-compose.dev.yml down
    print_color $GREEN "✅ Development database stopped"
}

# Function to reset development database
reset_dev_db() {
    print_color $YELLOW "⚠️  This will delete all data in the development database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_color $BLUE "🗑️  Resetting development database..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.yml up -d postgres
        print_color $GREEN "✅ Development database reset"
    else
        print_color $YELLOW "❌ Database reset cancelled"
    fi
}

# Function to show database logs
show_db_logs() {
    print_color $BLUE "📋 Showing database logs..."
    docker-compose -f docker-compose.dev.yml logs -f postgres
}

# Function to run Prisma migrations
run_migrations() {
    print_color $BLUE "🔄 Running Prisma migrations..."
    npx prisma generate
    npx prisma db push
    print_color $GREEN "✅ Migrations completed"
}

# Function to seed database
seed_database() {
    print_color $BLUE "🌱 Seeding database with demo data..."
    npx prisma db seed
    print_color $GREEN "✅ Database seeded"
}

# Function to show help
show_help() {
    echo "EduLynx Docker Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start development database"
    echo "  stop        Stop development database" 
    echo "  restart     Restart development database"
    echo "  reset       Reset development database (deletes all data)"
    echo "  logs        Show database logs"
    echo "  migrate     Run Prisma migrations"
    echo "  seed        Seed database with demo data"
    echo "  status      Show Docker containers status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start    # Start the development database"
    echo "  $0 migrate  # Run database migrations"
    echo "  $0 seed     # Add demo data to database"
}

# Function to show status
show_status() {
    print_color $BLUE "📊 Docker containers status:"
    docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main script logic
case "${1:-}" in
    "start")
        check_docker
        start_dev_db
        ;;
    "stop")
        check_docker
        stop_dev_db
        ;;
    "restart")
        check_docker
        stop_dev_db
        start_dev_db
        ;;
    "reset")
        check_docker
        reset_dev_db
        ;;
    "logs")
        check_docker
        show_db_logs
        ;;
    "migrate")
        check_docker
        run_migrations
        ;;
    "seed")
        check_docker
        seed_database
        ;;
    "status")
        check_docker
        show_status
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_color $RED "❌ Unknown command: $1"
        show_help
        exit 1
        ;;
esac
