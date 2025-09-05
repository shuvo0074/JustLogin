#!/bin/bash

echo "🚀 React Native Production Mode Runner"
echo "====================================="

# Build release APK
echo "📱 Building release APK..."
cd android && ./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "✅ Release APK built successfully!"
    
    # Install on device
    echo "📱 Installing release APK on device..."
    adb install -r app/build/outputs/apk/release/app-release.apk
    
    if [ $? -eq 0 ]; then
        echo "✅ App installed successfully!"
        echo "🎉 Your React Native app should now work without Metro dependency!"
        echo ""
        echo "The app is running in production mode with bundled JavaScript."
    else
        echo "❌ Failed to install release APK"
    fi
else
    echo "❌ Failed to build release APK"
fi
