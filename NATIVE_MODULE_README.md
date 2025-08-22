# Native Module Implementation: Biometric Authentication

This document explains how the biometric authentication native module was implemented using manual bridging in React Native.

## Overview

The biometric authentication system consists of:
- **Native iOS Module** (Swift + Objective-C bridge)
- **Native Android Module** (Kotlin)
- **JavaScript Service Layer** (TypeScript)
- **React Component** (BiometricLoginButton)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                        │
├─────────────────────────────────────────────────────────────┤
│  BiometricLoginButton Component                            │
│  └── biometricAuthService                                  │
│      └── NativeModules.BiometricModule                    │
├─────────────────────────────────────────────────────────────┤
│                    Native Bridge                           │
├─────────────────────────────────────────────────────────────┤
│  iOS: BiometricModule.swift + BiometricModule.m           │
│  Android: BiometricModule.kt + BiometricPackage.kt        │
└─────────────────────────────────────────────────────────────┘
```

## Files Created/Modified

### iOS
- `ios/contextlogin/BiometricModule.swift` - Main Swift implementation
- `ios/contextlogin/BiometricModule.m` - Objective-C bridge header
- `ios/contextlogin/Info.plist` - Added Face ID usage description

### Android
- `android/app/src/main/java/com/contextlogin/BiometricModule.kt` - Main Kotlin implementation
- `android/app/src/main/java/com/contextlogin/BiometricPackage.kt` - Package registration
- `android/app/src/main/java/com/contextlogin/MainApplication.kt` - Added package to main app
- `android/app/build.gradle` - Added biometric dependencies

### JavaScript/TypeScript
- `src/types/biometric.ts` - Type definitions
- `src/services/biometricAuthService.ts` - Service layer
- `src/components/BiometricLoginButton.tsx` - UI component
- `src/services/authService.ts` - Enhanced with biometric support
- `src/screens/LoginScreen.tsx` - Added biometric button

## How It Works

### 1. Native Module Registration

#### iOS
The Swift class `BiometricModule` inherits from `RCTEventEmitter` and is exposed to React Native through the Objective-C bridge file `BiometricModule.m`.

#### Android
The Kotlin class `BiometricModule` is registered through `BiometricPackage` and added to `MainApplication.kt`.

### 2. Data Flow

1. **JavaScript → Native**: React Native calls native methods through `NativeModules.BiometricModule`
2. **Native → JavaScript**: Native module sends events using `sendEvent()` (Android) or `sendEvent(withName:body:)` (iOS)
3. **Real-time Updates**: Progress and completion events flow from native to JavaScript during authentication

### 3. Event System

The native module sends two types of events:
- `onAuthenticationProgress`: Real-time status updates
- `onAuthenticationComplete`: Final result (success/failure)

## Usage

### Basic Biometric Authentication

```typescript
import { biometricAuthService } from '../services/biometricAuthService';

// Check availability
const isAvailable = await biometricAuthService.checkAvailability();

// Authenticate
const result = await biometricAuthService.authenticate();

// Listen to progress
const subscription = biometricAuthService.onProgress((progress) => {
  console.log('Progress:', progress.message);
});

// Listen to completion
const completeSubscription = biometricAuthService.onComplete((result) => {
  if (result.success) {
    console.log('Authentication successful!');
  }
});
```

### Using the BiometricLoginButton Component

```typescript
<BiometricLoginButton
  onSuccess={(user) => {
    // Handle successful login
    navigation.navigate('Home');
  }}
  onError={(error) => {
    // Handle error
    Alert.alert('Error', error);
  }}
/>
```

## Manual Linking Process

### Why Manual Linking?

This native module requires manual linking because:
1. **Hardware Access**: Biometric sensors are platform-specific
2. **Custom Implementation**: Not a standard library
3. **Real-time Events**: Custom event system for progress updates
4. **Platform Differences**: iOS and Android have different biometric APIs

### Steps to Rebuild

After making changes to native code:

#### iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

#### Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Security Considerations

1. **Face ID Usage**: iOS requires `NSFaceIDUsageDescription` in Info.plist
2. **Biometric Strength**: Android uses `BIOMETRIC_STRONG` for high-security authentication
3. **Error Handling**: Proper error handling for failed authentication attempts
4. **User Consent**: Clear messaging about biometric usage

## Testing

### Unit Tests
- `src/components/__tests__/BiometricLoginButton.test.tsx` - Component tests
- Mock the `biometricAuthService` for testing

### Manual Testing
1. Test on physical devices (simulators don't have biometric sensors)
2. Test both iOS (Face ID/Touch ID) and Android (fingerprint)
3. Test error scenarios (wrong biometric, cancellation)

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure native modules are properly registered
2. **Build errors**: Clean and rebuild native projects
3. **Biometrics not working**: Check device capabilities and permissions
4. **Events not firing**: Verify event emitter setup

### Debug Steps

1. Check console logs for native module errors
2. Verify package registration in MainApplication
3. Ensure proper import statements
4. Check platform-specific permissions

## Future Enhancements

1. **Multiple Biometric Types**: Support for iris scanning, voice recognition
2. **Fallback Authentication**: PIN/password fallback when biometrics fail
3. **Biometric Enrollment**: Guide users through biometric setup
4. **Security Levels**: Different authentication strengths for different actions

## Dependencies

### iOS
- `LocalAuthentication` framework (built-in)

### Android
- `androidx.biometric:biometric:1.1.0`

### JavaScript
- `react-native` (built-in NativeModules)
- TypeScript for type safety

## Conclusion

This implementation demonstrates how to create a custom native module with:
- **Bidirectional communication** between native and JavaScript
- **Real-time event streaming** for user feedback
- **Platform-specific optimizations** for iOS and Android
- **Type-safe JavaScript interface** with TypeScript
- **Proper error handling** and user experience

The manual linking approach gives you full control over the native implementation while maintaining a clean JavaScript API.
