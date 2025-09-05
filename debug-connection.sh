#!/bin/bash

echo "🔍 React Native Connection Debug Script"
echo "========================================"

# Check device connection
echo "📱 Checking device connection..."
adb devices

# Check if Metro is running
echo ""
echo "🚀 Checking Metro server..."
if pgrep -f "react-native start" > /dev/null; then
    echo "✅ Metro is running"
else
    echo "❌ Metro is not running"
fi

# Check network connectivity
echo ""
echo "🌐 Testing network connectivity..."
adb shell ping -c 2 10.144.43.24 || echo "❌ Cannot ping laptop from device"

# Check app status
echo ""
echo "📋 Checking app status..."
adb shell dumpsys activity activities | grep -A 2 -B 2 contextlogin | head -10

# Check React Native logs
echo ""
echo "📝 Recent React Native logs:"
adb logcat -s ReactNativeJS:V -d -T 10 2>/dev/null || echo "No recent React Native logs found"

# Try to reload the app
echo ""
echo "🔄 Attempting to reload app..."
adb shell am broadcast -a "com.facebook.react.devsupport.RELOAD"

echo ""
echo "✅ Debug check complete!"
