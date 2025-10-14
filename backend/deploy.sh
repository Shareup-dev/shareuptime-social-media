#!/bin/bash

# ShareUpTime Backend Deployment Script
# This script handles the deployment of the ShareUpTime backend to production

set -e  # Exit on any error

echo "🚀 Starting ShareUpTime Backend Deployment..."

# Configuration
APP_NAME="shareuptime-backend"
DOCKER_IMAGE="shareuptime/backend"
DOCKER_TAG=${1:-latest}
COMPOSE_FILE="docker-compose.prod.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_requirements() {
    log_info "Checking deployment requirements..."
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    
    if [ ! -f ".env.production" ]; then
        log_warn ".env.production not found. Make sure to create it from .env.production.example"
        log_warn "Continuing with existing environment variables..."
    fi
    
    if [ ! -f "Dockerfile" ]; then
        log_error "Dockerfile not found"
        exit 1
    fi
    
    log_info "Requirements check passed ✅"
}

# Build Docker image
build_image() {
    log_info "Building Docker image: $DOCKER_IMAGE:$DOCKER_TAG"
    
    docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    
    if [ $? -eq 0 ]; then
        log_info "Docker image built successfully ✅"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
}

# Run tests before deployment
run_tests() {
    log_info "Running tests..."
    
    npm test
    
    if [ $? -eq 0 ]; then
        log_info "All tests passed ✅"
    else
        log_error "Tests failed. Aborting deployment."
        exit 1
    fi
}

# Deploy with Docker Compose
deploy() {
    log_info "Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose -f $COMPOSE_FILE down
    
    # Pull latest images (except our app)
    docker-compose -f $COMPOSE_FILE pull postgres redis nginx
    
    # Start services
    docker-compose -f $COMPOSE_FILE up -d
    
    if [ $? -eq 0 ]; then
        log_info "Deployment completed successfully ✅"
    else
        log_error "Deployment failed"
        exit 1
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for services to start
    sleep 30
    
    # Check if API is responding
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost/health > /dev/null; then
            log_info "Health check passed ✅"
            return 0
        fi
        
        log_warn "Health check attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    docker-compose -f $COMPOSE_FILE ps
    
    echo ""
    log_info "Service URLs:"
    echo "  🌐 API: http://localhost"
    echo "  💾 Database: localhost:5432"
    echo "  🚀 Redis: localhost:6379"
    echo "  📊 Admin Panel: http://localhost/api/admin/performance?key=your_admin_key"
}

# Rollback function
rollback() {
    log_warn "Rolling back deployment..."
    
    # This would restore from backup in a real scenario
    docker-compose -f $COMPOSE_FILE down
    
    # Here you would restore previous version
    log_info "Rollback completed"
}

# Backup function
backup() {
    log_info "Creating backup..."
    
    # Create backup directory
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Backup database
    docker exec shareuptime-postgres pg_dump -U social_admin shareup_social > $BACKUP_DIR/database.sql
    
    # Backup uploads
    docker cp shareuptime-api:/app/uploads $BACKUP_DIR/
    
    log_info "Backup created in $BACKUP_DIR"
}

# Main deployment flow
main() {
    case ${2:-deploy} in
        "test")
            run_tests
            ;;
        "build")
            check_requirements
            build_image
            ;;
        "deploy")
            check_requirements
            run_tests
            backup
            build_image
            deploy
            health_check
            show_status
            ;;
        "rollback")
            rollback
            ;;
        "status")
            show_status
            ;;
        "backup")
            backup
            ;;
        *)
            echo "Usage: $0 [tag] [command]"
            echo "Commands:"
            echo "  deploy   - Full deployment (default)"
            echo "  test     - Run tests only"
            echo "  build    - Build Docker image only"
            echo "  rollback - Rollback deployment"
            echo "  status   - Show deployment status"
            echo "  backup   - Create backup"
            exit 1
            ;;
    esac
}

# Trap errors and cleanup
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "Deployment failed. Check logs above."
        log_info "You can rollback using: $0 rollback"
    fi
}

trap cleanup EXIT

# Run main function
main "$@"