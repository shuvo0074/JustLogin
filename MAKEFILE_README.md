# React Native Development Makefile

This Makefile provides a comprehensive set of commands for managing your React Native gym mobile app development workflow.

## Quick Start

```bash
# Show all available commands
make help

# Clean caches and start fresh
make reset

# Run the app on Android
make run-android

# Run the app on iOS
make run-ios
```

## Cache Management

React Native generates various caches that can cause issues. Use these commands to clean them:

```bash
# Clean Metro bundler cache
make clean-metro

# Clean Android Gradle cache
make clean-gradle

# Clean Node.js cache
make clean-node

# Clean all caches
make clean-all

# Check storage usage
make storage-info

# Clean temporary files
make storage-clean
```

## Development Workflow

```bash
# Start Metro server
make start

# Start with cache reset (useful when having bundling issues)
make start-reset

# Run on Android device/emulator
make run-android

# Run on iOS simulator
make run-ios

# Build release versions
make build-android-release
make build-ios-release
```

## Code Quality

```bash
# Run linting
make lint

# Auto-fix linting issues
make lint-fix

# Format code
make format

# Check formatting
make check-format
```

## Testing

```bash
# Run tests
make test

# Run tests in watch mode
make test-watch

# Run tests with coverage
make test-coverage
```

## Storage Management

```bash
# Show detailed storage usage
make storage-info

# Clean temporary files
make storage-clean

# Optimize storage usage
make storage-optimize
```

## Troubleshooting

If you encounter issues:

```bash
# Complete reset (removes node_modules)
make reset-hard

# Check system setup
make doctor

# Check for dependency issues
make check-deps

# Clean all caches and restart
make clean-all && make start-reset
```

## Custom Port

To run Metro on a custom port:

```bash
PORT=8082 make start-port
```

## Git Operations

```bash
# Clean untracked files
make git-clean

# Show detailed git status
make git-status
```

## Tips

- Use `make help` to see all available commands
- Most commands show progress and completion status
- Cache cleaning commands are safe to run frequently
- Use `make reset` for a quick project refresh
- Use `make reset-hard` only when necessary (removes node_modules)

## Common Issues Fixed by This Makefile

1. **Metro bundling errors** → `make clean-metro`
2. **Android build issues** → `make clean-gradle`
3. **iOS build issues** → `make clean-ios`
4. **Package installation problems** → `make reset`
5. **Storage space issues** → `make storage-optimize`
6. **Performance problems** → `make clean-all`
