#!/bin/bash

# Docker startup script for Lemonade development environment

set -e

echo "🚀 Starting Lemonade development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping containers..."
    docker-compose down
    echo "✅ Containers stopped"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start the services
echo "📦 Starting PostgreSQL and NestJS application..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U lemonade_user -d lemonade; do
    echo "⏳ PostgreSQL is not ready yet. Waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Wait for application to be ready
echo "⏳ Waiting for application to be ready..."
until curl -f http://localhost:3000/health > /dev/null 2>&1; do
    echo "⏳ Application is not ready yet. Waiting..."
    sleep 2
done

echo "✅ Application is ready!"

echo ""
echo "🎉 Lemonade development environment is running!"
echo "📱 Application: http://localhost:3000"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "🔧 Development features:"
echo "   - Hot reload enabled"
echo "   - Source code mounted for live editing"
echo "   - Database connection ready"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep the script running
wait
