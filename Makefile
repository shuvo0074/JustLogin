# React Native Gym Mobile App - Development Makefile
# This Makefile provides convenient commands for development, building, and maintenance

# Color codes for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
BLUE=\033[0;34m
NC=\033[0m # No Color

.PHONY: help clean clean-all clean-metro clean-gradle clean-node clean-watchman \
        install install-android install-ios \
        run-android run-ios run-android-release run-ios-release \
        build-android build-ios build-android-release build-ios-release \
        start start-reset start-port \
        metro-status metro-logs metro-port metro-pid metro-kill metro-health metro-restart \
        test test-watch test-coverage \
        lint lint-fix \
        format check-format \
        doctor check-deps \
        storage-clean storage-info storage-optimize \
        git-clean git-status \
        reset reset-hard \
        detect-ip set-backend-ip auto-set-ip reset-backend-ip show-backend-config \
        build-release install-release run-release fix-localhost-errors reset-gradle \
        debug-device debug-metro debug-network debug-logs debug-reload debug-all \
        help

# Default target
help: ## Show this help message
	@echo "React Native Gym Mobile App - Development Commands"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Cache Cleaning:"
	@echo "  clean-metro          Clean Metro bundler cache"
	@echo "  clean-gradle         Clean Android Gradle cache"
	@echo "  clean-node           Clean Node.js cache"
	@echo "  clean-watchman       Clean Watchman cache"
	@echo "  clean                Clean common caches (Metro, Node, Watchman)"
	@echo "  clean-all            Clean all caches (including Gradle, iOS)"
	@echo ""
	@echo "Installation:"
	@echo "  install              Install all dependencies"
	@echo "  install-android      Install Android dependencies"
	@echo "  install-ios          Install iOS dependencies"
	@echo ""
	@echo "Running:"
	@echo "  run-android          Run on Android device/emulator"
	@echo "  run-ios              Run on iOS simulator"
	@echo "  run-android-release  Run Android release build"
	@echo "  run-ios-release      Run iOS release build"
	@echo ""
	@echo "Building:"
	@echo "  build-android        Build Android APK"
	@echo "  build-ios            Build iOS app"
	@echo "  build-android-release Build Android release APK"
	@echo "  build-ios-release    Build iOS release app"
	@echo ""
	@echo "Metro Server:"
	@echo "  start                Start Metro development server"
	@echo "  start-reset          Start Metro with cache reset"
	@echo "  start-port           Start Metro on custom port (PORT=8082 make start-port)"
	@echo ""
	@echo "Metro Monitoring:"
	@echo "  metro-status         Check Metro service status"
	@echo "  metro-logs           Show Metro server logs"
	@echo "  metro-port           Check Metro port usage"
	@echo "  metro-pid            Get Metro process ID"
	@echo "  metro-kill           Kill Metro process"
	@echo "  metro-health         Comprehensive Metro health check"
	@echo "  metro-restart        Restart Metro server"
	@echo ""
	@echo "Testing:"
	@echo "  test                 Run tests"
	@echo "  test-watch           Run tests in watch mode"
	@echo "  test-coverage        Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint                 Run ESLint"
	@echo "  lint-fix             Run ESLint with auto-fix"
	@echo "  format               Format code with Prettier"
	@echo "  check-format         Check code formatting"
	@echo ""
	@echo "Storage Management:"
	@echo "  storage-info         Show storage usage information"
	@echo "  storage-clean        Clean temporary and cache files"
	@echo "  storage-optimize     Optimize storage usage"
	@echo ""
	@echo "Git Operations:"
	@echo "  git-clean            Clean untracked files"
	@echo "  git-status           Show detailed git status"
	@echo ""
	@echo "System:"
	@echo "  doctor               Run React Native doctor"
	@echo "  check-deps           Check for outdated dependencies"
	@echo "  reset                Reset project (clean caches, reinstall)"
	@echo "  reset-hard           Hard reset (remove node_modules, clean all)"
	@echo "  reset-gradle         Complete Gradle cache reset (for corruption issues)"
	@echo ""
	@echo "Network & Backend:"
	@echo "  detect-ip            Detect laptop's local IP address"
	@echo "  set-backend-ip       Set backend IP for phone connectivity"
	@echo "  auto-set-ip          Auto-detect and set laptop's IP"
	@echo "  reset-backend-ip     Reset backend IP to localhost"
	@echo "  show-backend-config  Show current backend configuration"
	@echo ""
	@echo "Debugging:"
	@echo "  debug-device         Check device connection and app status"
	@echo "  debug-metro          Check Metro server status"
	@echo "  debug-network        Test network connectivity from device"
	@echo "  debug-logs           Show recent React Native logs"
	@echo "  debug-reload         Reload the React Native app"
	@echo "  debug-all            Run all debug checks"
	@echo ""

# Cache Cleaning Tasks
clean-metro: ## Clean Metro bundler cache
	@echo "🧹 Cleaning Metro cache..."
	@rm -rf /tmp/metro-cache
	@rm -rf /tmp/haste-map-*
	@rm -rf /tmp/metro-*
	@rm -rf node_modules/.cache/metro-*
	@rm -rf $HOME/.metro
	@echo "✅ Metro cache cleaned"

clean-gradle: ## Clean Android Gradle cache
	@echo "🧹 Cleaning Gradle cache..."
	@rm -rf ~/.gradle/caches
	@rm -rf android/.gradle
	@rm -rf android/build
	@rm -rf android/app/build
	@cd android && ./gradlew clean 2>/dev/null || echo "⚠️  Gradle clean failed, but cache directories cleaned"
	@echo "✅ Gradle cache cleaned"

clean-node: ## Clean Node.js cache
	@echo "🧹 Cleaning Node.js cache..."
	@npm cache clean --force
	@rm -rf node_modules/.cache
	@rm -rf .npm
	@rm -rf .yarn/cache
	@echo "✅ Node.js cache cleaned"

clean-watchman: ## Clean Watchman cache
	@echo "🧹 Cleaning Watchman cache..."
	@watchman watch-del-all 2>/dev/null || true
	@rm -rf /usr/local/var/run/watchman/*
	@echo "✅ Watchman cache cleaned"

clean-ios: ## Clean iOS build artifacts
	@echo "🧹 Cleaning iOS build artifacts..."
	@rm -rf ios/build
	@rm -rf ios/Pods
	@rm -rf ios/Podfile.lock
	@cd ios && pod cache clean --all 2>/dev/null || true
	@echo "✅ iOS build artifacts cleaned"

clean: clean-metro clean-node clean-watchman ## Clean common caches
	@echo "✅ All common caches cleaned"

clean-all: clean clean-gradle clean-ios ## Clean all caches
	@echo "✅ All caches cleaned"

# Installation Tasks
install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	@npm install
	@echo "✅ Dependencies installed"

install-android: ## Install Android dependencies
	@echo "🤖 Installing Android dependencies..."
	@cd android && ./gradlew
	@echo "✅ Android dependencies installed"

install-ios: ## Install iOS dependencies
	@echo "🍎 Installing iOS dependencies..."
	@cd ios && pod install
	@echo "✅ iOS dependencies installed"

# Running Tasks
run-android: ## Run on Android device/emulator
	@echo "🤖 Running on Android..."
	@npx react-native run-android

run-ios: ## Run on iOS simulator
	@echo "🍎 Running on iOS..."
	@npx react-native run-ios

run-android-release: ## Run Android release build
	@echo "🤖 Running Android release build..."
	@npx react-native run-android --variant=release

run-ios-release: ## Run iOS release build
	@echo "🍎 Running iOS release build..."
	@npx react-native run-ios --configuration=Release

# Building Tasks
build-android: ## Build Android APK
	@echo "🤖 Building Android APK..."
	@cd android && ./gradlew assembleDebug
	@echo "✅ Android APK built: android/app/build/outputs/apk/debug/app-debug.apk"

build-ios: ## Build iOS app
	@echo "🍎 Building iOS app..."
	@cd ios && xcodebuild -workspace gym-mobile-app.xcworkspace -scheme gym-mobile-app -configuration Debug -sdk iphonesimulator
	@echo "✅ iOS app built"

build-android-release: ## Build Android release APK
	@echo "🤖 Building Android release APK..."
	@cd android && ./gradlew assembleRelease
	@echo "✅ Android release APK built: android/app/build/outputs/apk/release/app-release.apk"

build-ios-release: ## Build iOS release app
	@echo "🍎 Building iOS release app..."
	@cd ios && xcodebuild -workspace gym-mobile-app.xcworkspace -scheme gym-mobile-app -configuration Release -sdk iphoneos
	@echo "✅ iOS release app built"

# Metro Server Tasks
start: ## Start Metro development server
	@echo "🚀 Starting Metro development server..."
	@npx react-native start

start-reset: ## Start Metro with cache reset
	@echo "🚀 Starting Metro with cache reset..."
	@npx react-native start --reset-cache

start-port: ## Start Metro on custom port (usage: PORT=8082 make start-port)
	@echo "🚀 Starting Metro on port $(PORT)..."
	@npx react-native start --port $(PORT)

# Metro Monitoring Tasks
metro-status: ## Check Metro service status
	@echo "🔍 Checking Metro service status..."
	@if pgrep -f "node.*metro" > /dev/null; then \
		echo "✅ Metro is running"; \
		ps aux | grep "node.*metro" | grep -v grep | head -1; \
	else \
		echo "❌ Metro is not running"; \
		echo "💡 Start Metro with: make start"; \
	fi

metro-logs: ## Show Metro server logs
	@echo "📋 Metro server logs:"
	@echo "===================="
	@if pgrep -f "node.*metro" > /dev/null; then \
		METRO_PID=$$(pgrep -f "node.*metro" | head -1); \
		if [ -n "$$METRO_PID" ]; then \
			echo "📊 Metro Process ID: $$METRO_PID"; \
			echo "📝 Recent logs:"; \
			tail -f /proc/$$METRO_PID/fd/1 2>/dev/null || echo "❌ Cannot access Metro logs (process may not have log files)"; \
		else \
			echo "❌ Could not find Metro process"; \
		fi; \
	else \
		echo "❌ Metro is not running"; \
		echo "💡 Start Metro with: make start"; \
	fi

metro-port: ## Check Metro port usage
	@echo "🔌 Metro port usage:"
	@echo "==================="
	@echo "📡 Checking port 8081 (default Metro port):"
	@netstat -tlnp 2>/dev/null | grep :8081 || ss -tlnp 2>/dev/null | grep :8081 || echo "❌ Port 8081 not in use"
	@echo ""
	@echo "📡 Checking port 8082 (alternative Metro port):"
	@netstat -tlnp 2>/dev/null | grep :8082 || ss -tlnp 2>/dev/null | grep :8082 || echo "❌ Port 8082 not in use"
	@echo ""
	@echo "🔍 Metro-related processes:"
	@ps aux | grep "node.*metro" | grep -v grep || echo "❌ No Metro processes found"

metro-pid: ## Get Metro process ID
	@echo "🆔 Metro process information:"
	@echo "============================"
	@if pgrep -f "node.*metro" > /dev/null; then \
		echo "📊 Metro Process Details:"; \
		ps aux | head -1; \
		ps aux | grep "node.*metro" | grep -v grep; \
		echo ""; \
		echo "📈 Process count:"; \
		pgrep -f "node.*metro" | wc -l; \
	else \
		echo "❌ No Metro processes found"; \
	fi

metro-kill: ## Kill Metro process
	@echo "🛑 Killing Metro process..."
	@if pgrep -f "node.*metro" > /dev/null; then \
		METRO_PIDS=$$(pgrep -f "node.*metro"); \
		echo "📊 Found Metro processes: $$METRO_PIDS"; \
		kill $$METRO_PIDS 2>/dev/null || true; \
		sleep 2; \
		if pgrep -f "node.*metro" > /dev/null; then \
			echo "⚠️  Force killing Metro processes..."; \
			kill -9 $$METRO_PIDS 2>/dev/null || true; \
		fi; \
		if pgrep -f "node.*metro" > /dev/null; then \
			echo "❌ Could not kill all Metro processes"; \
		else \
			echo "✅ Metro processes killed successfully"; \
		fi; \
	else \
		echo "❌ No Metro processes found to kill"; \
	fi

metro-health: ## Comprehensive Metro health check
	@echo "🏥 Metro Health Check:"
	@echo "====================="
	@echo "🔍 Service Status:"
	@if pgrep -f "node.*metro" > /dev/null; then \
		echo "✅ Metro is running"; \
	else \
		echo "❌ Metro is not running"; \
	fi
	@echo ""
	@echo "🔌 Port Status:"
	@if netstat -tlnp 2>/dev/null | grep :8081 > /dev/null || ss -tlnp 2>/dev/null | grep :8081 > /dev/null; then \
		echo "✅ Port 8081 is in use"; \
	else \
		echo "❌ Port 8081 is not in use"; \
	fi
	@echo ""
	@echo "💾 Cache Status:"
	@if [ -d "/tmp/metro-cache" ]; then \
		echo "📁 Metro cache exists: $$(du -sh /tmp/metro-cache 2>/dev/null | cut -f1)"; \
	else \
		echo "❌ Metro cache not found"; \
	fi
	@echo ""
	@echo "📊 Process Information:"
	@if pgrep -f "node.*metro" > /dev/null; then \
		METRO_COUNT=$$(pgrep -f "node.*metro" | wc -l); \
		echo "📈 Metro processes: $$METRO_COUNT"; \
		METRO_PID=$$(pgrep -f "node.*metro" | head -1); \
		if [ -n "$$METRO_PID" ]; then \
			METRO_UPTIME=$$(ps -p $$METRO_PID -o etime= 2>/dev/null | tr -d ' '); \
			echo "⏱️  Metro uptime: $$METRO_UPTIME"; \
		fi; \
	else \
		echo "❌ No Metro processes"; \
	fi
	@echo ""
	@echo "🔧 Recommendations:"
	@if ! pgrep -f "node.*metro" > /dev/null; then \
		echo "💡 Start Metro: make start"; \
	fi
	@if ! netstat -tlnp 2>/dev/null | grep :8081 > /dev/null && ! ss -tlnp 2>/dev/null | grep :8081 > /dev/null; then \
		echo "💡 Port 8081 is free, Metro can use it"; \
	fi

metro-restart: metro-kill start ## Restart Metro server
	@echo "🔄 Metro restart complete"

# Testing Tasks
test: ## Run tests
	@echo "🧪 Running tests..."
	@npm test

test-watch: ## Run tests in watch mode
	@echo "🧪 Running tests in watch mode..."
	@npm run test:watch

test-coverage: ## Run tests with coverage
	@echo "🧪 Running tests with coverage..."
	@npm run test:coverage

# Code Quality Tasks
lint: ## Run ESLint
	@echo "🔍 Running ESLint..."
	@npx eslint . --ext .js,.jsx,.ts,.tsx

lint-fix: ## Run ESLint with auto-fix
	@echo "🔧 Running ESLint with auto-fix..."
	@npx eslint . --ext .js,.jsx,.ts,.tsx --fix

format: ## Format code with Prettier
	@echo "💅 Formatting code..."
	@npx prettier --write "**/*.{js,jsx,ts,tsx,json,md}"

check-format: ## Check code formatting
	@echo "🔍 Checking code formatting..."
	@npx prettier --check "**/*.{js,jsx,ts,tsx,json,md}"

# Storage Management Tasks
storage-info: ## Show storage usage information
	@echo "💾 Storage Usage Information:"
	@echo "=============================="
	@echo "Node modules size:"
	@du -sh node_modules 2>/dev/null || echo "Not found"
	@echo ""
	@echo "Android build size:"
	@du -sh android/build 2>/dev/null || echo "Not found"
	@echo ""
	@echo "iOS build size:"
	@du -sh ios/build 2>/dev/null || echo "Not found"
	@echo ""
	@echo "Metro cache size:"
	@du -sh /tmp/metro-cache 2>/dev/null || echo "Not found"
	@echo ""
	@echo "Gradle cache size:"
	@du -sh ~/.gradle/caches 2>/dev/null || echo "Not found"
	@echo ""
	@echo "Total project size:"
	@du -sh . --exclude=node_modules

storage-clean: ## Clean temporary and cache files
	@echo "🧹 Cleaning temporary and cache files..."
	@rm -rf .tmp
	@rm -rf .cache
	@rm -rf coverage
	@rm -rf .nyc_output
	@rm -rf android/app/build/tmp
	@rm -rf ios/build/tmp
	@find . -name "*.log" -type f -delete
	@find . -name ".DS_Store" -type f -delete
	@find . -name "Thumbs.db" -type f -delete
	@echo "✅ Temporary files cleaned"

storage-optimize: ## Optimize storage usage
	@echo "🔧 Optimizing storage usage..."
	@npm prune
	@npm dedupe
	@cd android && ./gradlew cleanBuildCache
	@rm -rf android/.gradle/build-cache
	@echo "✅ Storage optimized"

# Git Operations
git-clean: ## Clean untracked files
	@echo "🧹 Cleaning untracked files..."
	@git clean -fd
	@git clean -fdX
	@echo "✅ Untracked files cleaned"

git-status: ## Show detailed git status
	@echo "📊 Git Status:"
	@echo "=============="
	@git status --porcelain
	@echo ""
	@echo "📈 Git Statistics:"
	@git diff --stat
	@echo ""
	@echo "🌿 Current Branch:"
	@git branch --show-current
	@echo ""
	@echo "📝 Recent Commits:"
	@git log --oneline -5

# System Tasks
doctor: ## Run React Native doctor
	@echo "🔍 Running React Native doctor..."
	@npx @react-native-community/cli doctor

check-deps: ## Check for outdated dependencies
	@echo "📦 Checking for outdated dependencies..."
	@npm outdated
	@echo ""
	@echo "📦 Checking for security vulnerabilities..."
	@npm audit

# Reset Tasks
reset: clean install ## Reset project (clean caches, reinstall)
	@echo "🔄 Project reset complete"

reset-hard: ## Hard reset (remove node_modules, clean all)
	@echo "⚠️  Performing hard reset..."
	@rm -rf node_modules
	@rm -rf android/build
	@rm -rf android/app/build
	@rm -rf ios/build
	@rm -rf ios/Pods
	@make clean-all
	@make install
	@echo "✅ Hard reset complete"

# Network and Backend Configuration
detect-ip: ## Detect and display the laptop's local IP address
	@echo "🔍 Detecting local IP address..."
	@ip route get 1 | awk '{print $$7}' | head -1

set-backend-ip: ## Set backend IP for phone connectivity (usage: make set-backend-ip IP=192.168.1.100)
	@echo "🌐 Setting backend IP to $(IP)..."
	@if [ -z "$(IP)" ]; then \
		echo "❌ Error: Please provide IP address. Usage: make set-backend-ip IP=192.168.1.100"; \
		exit 1; \
	fi
	@echo "REACT_NATIVE_BACKEND_IP=$(IP)" > .env.local
	@echo "✅ Backend IP set to $(IP) in .env.local"
	@echo "📱 Your phone can now connect to: http://$(IP):8080"

auto-set-ip: ## Automatically detect and set the laptop's IP for phone connectivity
	@echo "🔍 Auto-detecting IP address..."
	@IP=$$(ip route get 1 | awk '{print $$7}' | head -1); \
	echo "🌐 Detected IP: $$IP"; \
	echo "REACT_NATIVE_BACKEND_IP=$$IP" > .env.local; \
	echo "✅ Backend IP set to $$IP in .env.local"; \
	echo "📱 Your phone can now connect to: http://$$IP:8080"

reset-backend-ip: ## Reset backend IP to default (localhost)
	@echo "🔄 Resetting backend IP to localhost..."
	@rm -f .env.local
	@echo "✅ Backend IP reset to localhost"

show-backend-config: ## Show current backend configuration
	@echo "🔧 Current Backend Configuration:"
	@echo "================================"
	@if [ -f .env.local ]; then \
		echo "📄 .env.local found:"; \
		cat .env.local; \
	else \
		echo "📄 No .env.local found (using default)"; \
	fi
	@echo ""
	@echo "🔗 API Base URL: http://$$(grep REACT_NATIVE_BACKEND_IP .env.local 2>/dev/null | cut -d'=' -f2 || echo "localhost"):8080"

# ============================================================================
# PRODUCTION BUILD COMMANDS (FIX FOR localhost:8081 ERRORS)
# ============================================================================

build-release: ## Build release APK (production mode, no Metro dependency)
	@echo "$(GREEN)🔨 Building release APK (production mode)...$(NC)"
	cd android && ./gradlew assembleRelease
	@echo "$(GREEN)✅ Release APK built successfully! (No localhost:8081 errors)$(NC)"

install-release: ## Install release APK
	@echo "$(GREEN)📱 Installing release APK...$(NC)"
	adb install -r android/app/build/outputs/apk/release/app-release.apk
	@echo "$(GREEN)✅ Release APK installed$(NC)"

run-release: build-release install-release ## Build, install and run release version (FIXES localhost:8081 errors)
	@echo "$(GREEN)🚀 Starting release app (production mode, no Metro dependency)...$(NC)"
	adb shell am force-stop com.contextlogin
	adb shell am start -n com.contextlogin/.MainActivity
	@echo "$(GREEN)🎉 App is running in production mode! No more localhost:8081 errors!$(NC)"

reset-gradle: ## Complete Gradle cache reset (use when Gradle is corrupted)
	@echo "$(RED)⚠️  Performing complete Gradle reset...$(NC)"
	@pkill -f gradle 2>/dev/null || true
	@rm -rf ~/.gradle
	@rm -rf android/.gradle
	@rm -rf android/build
	@rm -rf android/app/build
	@echo "$(GREEN)✅ Complete Gradle reset done. Run 'make clean-gradle' next.$(NC)"

# ============================================================================
# DEBUGGING COMMANDS
# ============================================================================

debug-device: ## Check device connection and status
	@echo "$(BLUE)📱 Checking device connection...$(NC)"
	adb devices
	@echo ""
	@echo "$(BLUE)📋 Checking app status...$(NC)"
	adb shell dumpsys activity activities | grep -A 2 -B 2 contextlogin | head -10

debug-metro: ## Check Metro server status
	@echo "$(BLUE)🚀 Checking Metro server...$(NC)"
	@if pgrep -f "react-native start" > /dev/null; then \
		echo "$(GREEN)✅ Metro is running$(NC)"; \
	else \
		echo "$(RED)❌ Metro is not running$(NC)"; \
	fi
	@echo ""
	@echo "$(BLUE)📊 Metro process details:$(NC)"
	pgrep -f "react-native start" -l || echo "No Metro process found"

debug-network: ## Test network connectivity from device to laptop
	@echo "$(BLUE)🌐 Testing network connectivity...$(NC)"
	@echo "Testing ping from device to laptop:"
	adb shell ping -c 2 $$(grep REACT_NATIVE_BACKEND_IP .env.local 2>/dev/null | cut -d'=' -f2 || echo "10.144.43.24") || echo "$(RED)❌ Cannot ping laptop from device$(NC)"

debug-logs: ## Show recent React Native logs
	@echo "$(BLUE)📝 Recent React Native logs:$(NC)"
	adb logcat -s ReactNativeJS:V -d -T 10 2>/dev/null || echo "No recent React Native logs found"

debug-reload: ## Reload the React Native app
	@echo "$(BLUE)🔄 Reloading app...$(NC)"
	adb shell am broadcast -a "com.facebook.react.devsupport.RELOAD"
	@echo "$(GREEN)✅ App reload signal sent$(NC)"

debug-all: debug-device debug-metro debug-network debug-logs ## Run all debug checks
	@echo "$(GREEN)✅ Debug check complete!$(NC)"
