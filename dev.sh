#!/bin/bash

# React Native Development Helper Script
# Provides quick access to common development commands

set -e

PROJECT_NAME="React Native Gym Mobile App"
MAKEFILE_PATH="./Makefile"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if Makefile exists
check_makefile() {
    if [ ! -f "$MAKEFILE_PATH" ]; then
        print_error "Makefile not found at $MAKEFILE_PATH"
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "$PROJECT_NAME - Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Quick Commands:"
    echo "  dev         Start development (clean + run Android)"
    echo "  fresh       Fresh start (reset + run Android)"
    echo "  clean       Clean all caches"
    echo "  build       Build Android APK"
    echo "  test        Run tests"
    echo "  lint        Run linting"
    echo "  format      Format code"
    echo "  storage     Show storage info"
    echo "  doctor      Run React Native doctor"
    echo ""
    echo "Network & Backend:"
    echo "  ip          Detect laptop's IP address"
    echo "  set-ip      Set backend IP (usage: ./dev.sh set-ip 192.168.1.100)"
    echo "  auto-ip     Auto-detect and set laptop's IP"
    echo "  reset-ip    Reset backend IP to localhost"
    echo "  config      Show backend configuration"
    echo ""
    echo "Use 'make help' for all available commands"
}

# Main logic
main() {
    check_makefile

    case "${1:-help}" in
        "dev")
            print_info "Starting development mode..."
            make clean
            make run-android
            ;;
        "fresh")
            print_info "Fresh project start..."
            make reset
            make run-android
            ;;
        "clean")
            print_info "Cleaning all caches..."
            make clean-all
            ;;
        "build")
            print_info "Building Android APK..."
            make build-android
            ;;
        "test")
            print_info "Running tests..."
            make test
            ;;
        "lint")
            print_info "Running linting..."
            make lint
            ;;
        "format")
            print_info "Formatting code..."
            make format
            ;;
        "storage")
            print_info "Checking storage usage..."
            make storage-info
            ;;
        "doctor")
            print_info "Running React Native doctor..."
            make doctor
            ;;
        "ip")
            print_info "Detecting laptop IP address..."
            make detect-ip
            ;;
        "set-ip")
            if [ -z "$2" ]; then
                print_error "Please provide IP address. Usage: ./dev.sh set-ip 192.168.1.100"
                exit 1
            fi
            print_info "Setting backend IP to $2..."
            make set-backend-ip IP="$2"
            ;;
        "auto-ip")
            print_info "Auto-detecting and setting laptop IP..."
            make auto-set-ip
            ;;
        "reset-ip")
            print_info "Resetting backend IP to localhost..."
            make reset-backend-ip
            ;;
        "config")
            print_info "Showing backend configuration..."
            make show-backend-config
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"
