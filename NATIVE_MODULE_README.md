# React Native Native Module Learning Project

This project demonstrates how to create and use native modules in React Native, specifically focusing on data transfer between JavaScript and native code.

## What This Project Demonstrates

### 1. **Data Transfer Pattern**
- **JavaScript → Native**: Sending complex user profile data structures
- **Native Processing**: Performing data validation, calculations, and formatting on the native side
- **Native → JavaScript**: Returning processed results back to React Native

### 2. **Data Classes/Structures**
- **TypeScript Interfaces**: Define data contracts for type safety
- **Native Data Handling**: Process complex nested objects in Kotlin/Swift
- **Bidirectional Communication**: Seamless data flow between JS and native

## Project Structure

```
src/
├── types/
│   └── userProfile.ts          # Data structure definitions
├── services/
│   └── userProfileService.ts   # JavaScript service layer
└── screens/
    └── HomeScreen.tsx          # Integrated with UserProfileService

android/app/src/main/java/com/contextlogin/
├── UserProfileModule.kt        # Android native module
└── UserProfilePackage.kt       # Android package registration

ios/contextlogin/
├── UserProfileModule.swift     # iOS native module
└── UserProfileModule.m         # iOS bridge
```

## Key Learning Concepts

### 1. **Data Serialization**
- JavaScript objects are automatically converted to native data structures
- `ReadableMap` (Android) and `NSDictionary` (iOS) handle the conversion
- Complex nested objects are supported out of the box

### 2. **Native Module Architecture**
- **Module Class**: Contains the actual business logic
- **Package Class**: Registers the module with React Native
- **Bridge**: Handles communication between JS and native

### 3. **Error Handling**
- Promise-based communication with proper error handling
- Native exceptions are caught and converted to JavaScript errors
- Validation and error reporting back to JS

## How It Works

### Step 1: JavaScript Side
```typescript
// Create user profile data
const userProfile: UserProfile = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-12-19T00:00:00Z',
  // Optional fields for enhanced processing
  age: 28,
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en'
  },
  metadata: {
    lastLogin: '2024-12-19T00:00:00Z'
  }
};

// Send to native module
const result = await UserProfileService.processUserProfile(userProfile);
```

### Step 2: Native Processing (Android Kotlin)
```kotlin
@ReactMethod
fun processUserProfile(userProfile: ReadableMap, promise: Promise) {
    // Extract data from ReadableMap
    val name = userProfile.getString("name") ?: ""
    val email = userProfile.getString("email") ?: ""
    val createdAt = userProfile.getString("createdAt") ?: ""
    val updatedAt = userProfile.getString("updatedAt") ?: ""
    
    // Extract optional fields (may not be present)
    val age = userProfile.getInt("age") // This will throw if not present, handle safely
    val ageGroup = if (userProfile.hasKey("age")) {
        when {
            age < 18 -> "Minor"
            age < 30 -> "Young Adult"
            age < 50 -> "Adult"
            else -> "Senior"
        }
    } else null
    
    // Process data using native logic
    val fullName = name
    val emailDomain = email.substringAfter("@", "unknown")
    val daysSinceCreation = calculateDaysSince(createdAt)
    val daysSinceUpdate = calculateDaysSince(updatedAt)
    
    // Create result and send back
    val result = Arguments.createMap().apply {
        putString("fullName", fullName)
        putString("emailDomain", emailDomain)
        putInt("daysSinceCreation", daysSinceCreation)
        putInt("daysSinceUpdate", daysSinceUpdate)
        // Add optional fields only if they exist
        if (ageGroup != null) {
            putString("ageGroup", ageGroup)
        }
    }
    promise.resolve(result)
}
```

### Step 3: Native Processing (iOS Swift)
```swift
@objc
func processUserProfile(_ userProfile: [String: Any], 
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    // Extract and process data
    let name = userProfile["name"] as? String ?? ""
    let email = userProfile["email"] as? String ?? ""
    let createdAt = userProfile["createdAt"] as? String ?? ""
    let updatedAt = userProfile["updatedAt"] as? String ?? ""
    
    // Extract optional fields
    let age = userProfile["age"] as? Int
    let ageGroup = age != nil ? getAgeGroup(age: age!) : nil
    
    // Process data using native logic
    let fullName = name
    let emailDomain = getEmailDomain(email: email)
    let daysSinceCreation = calculateDaysSince(dateString: createdAt)
    let daysSinceUpdate = calculateDaysSince(dateString: updatedAt)
    
    // Create result dictionary
    var processedProfile: [String: Any] = [
        "fullName": fullName,
        "emailDomain": emailDomain,
        "daysSinceCreation": daysSinceCreation,
        "daysSinceUpdate": daysSinceUpdate
    ]
    
    // Add optional fields only if they exist
    if let ageGroup = ageGroup {
        processedProfile["ageGroup"] = ageGroup
    }
    
    resolve(processedProfile)
}
```

### Step 4: Return to JavaScript
```typescript
// Receive processed result
const result: ProfileProcessingResult = await UserProfileService.processUserProfile(userProfile);

console.log(result.processedProfile.fullName); // "John Doe"
console.log(result.processedProfile.emailDomain); // "example.com"
console.log(result.processedProfile.daysSinceCreation); // 350
console.log(result.processedProfile.daysSinceUpdate); // 0
```

## Data Processing Examples

### 1. **Age Group Classification** (Optional)
- **Input**: Age number (e.g., 28)
- **Native Logic**: Age range classification
- **Output**: "Young Adult" (only if age is provided)

### 2. **Preference Scoring** (Optional)
- **Input**: Theme, notifications, language preferences
- **Native Logic**: Scoring algorithm based on user choices
- **Output**: Numerical preference score (only if preferences are provided)

### 3. **Date Calculations**
- **Input**: ISO date strings (createdAt, updatedAt)
- **Native Logic**: Date parsing and calculations
- **Output**: Days since creation/update, formatted dates

### 4. **Email Domain Extraction**
- **Input**: Full email address
- **Native Logic**: String parsing
- **Output**: Domain part only

### 5. **Activity Status**
- **Input**: Last login date or update date
- **Native Logic**: Date comparison logic
- **Output**: Boolean indicating if user is recently active

## Current Data Model

### UserProfile Interface
```typescript
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Optional fields for enhanced processing
  age?: number;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  metadata?: {
    lastLogin: string;
  };
}
```

### ProcessedUserProfile Interface
```typescript
export interface ProcessedUserProfile {
  fullName: string;
  emailDomain: string;
  daysSinceCreation: number;
  daysSinceUpdate: number;
  isRecentlyActive: boolean;
  preferenceScore?: number;        // Optional
  ageGroup?: string;               // Optional
  formattedMetadata: {
    createdAtFormatted: string;
    updatedAtFormatted: string;
    lastLoginFormatted?: string;   // Optional
  };
}
```

## When to Use Native Modules

### **Good Use Cases:**
- **Complex Data Processing**: Heavy computations, data validation
- **Platform-Specific Logic**: Different behavior for iOS/Android
- **Performance-Critical Operations**: Large data sets, real-time processing
- **Native Library Integration**: Using platform-specific libraries

### **Not Recommended For:**
- **Simple UI Updates**: Better handled in React Native
- **Basic Data Manipulation**: JavaScript is sufficient
- **Frequent Small Operations**: Bridge overhead isn't worth it

## Testing the Module

### 1. **Test in HomeScreen**
```bash
# Navigate to the HomeScreen after login
# Press "Check Platform Info" to verify module availability
# Press "Process Profile with Native Module" to test data processing
```

### 2. **Run Unit Tests**
```bash
# Run all tests
npm test

# Run specific service tests
npm test -- --testPathPattern=userProfileService
```

### 3. **Manual Testing**
- Test with different user data combinations
- Try various email formats
- Test with and without optional fields
- Verify date calculations and formatting

## Common Issues and Solutions

### 1. **Module Not Found**
- Ensure package is registered in MainApplication.kt
- Check import statements
- Verify module name matches exactly

### 2. **Data Type Mismatches**
- Use proper React Native bridge types
- Handle nullable values appropriately
- Validate data before processing

### 3. **Build Errors**
- Clean and rebuild project
- Check native dependencies
- Verify platform-specific code

### 4. **Optional Field Handling**
- Always check if optional fields exist before processing
- Use conditional logic for optional data
- Provide sensible defaults when fields are missing

## Next Steps for Learning

1. **Add More Data Processing**: Implement additional algorithms
2. **Error Handling**: Add more sophisticated error scenarios
3. **Performance Testing**: Measure bridge overhead vs. benefits
4. **Platform Differences**: Implement different logic for iOS/Android
5. **Async Operations**: Add background processing capabilities
6. **Data Validation**: Add more robust input validation
7. **Caching**: Implement result caching for performance

## Resources

- [React Native Native Modules Guide](https://reactnative.dev/docs/native-modules-android)
- [Android Bridge Documentation](https://reactnative.dev/docs/native-modules-android#argument-types)
- [iOS Bridge Documentation](https://reactnative.dev/docs/native-modules-ios#argument-types)

This project serves as a foundation for understanding native module development in React Native, focusing on practical data processing scenarios that you might encounter in real-world applications. The current implementation demonstrates handling of both required and optional fields, making it a robust example of real-world native module development.
