#import <React/RCTBridgeModule.h>

/**
 * UserProfileModule.m - Objective-C Bridge for Swift Module
 * 
 * This file serves as a bridge between React Native and our Swift UserProfileModule.
 * It's necessary because React Native's bridge system is built on Objective-C,
 * but we're implementing our module in Swift.
 * 
 * Key Concepts:
 * - RCT_EXTERN_MODULE: Exposes Swift class to React Native
 * - RCT_EXTERN_METHOD: Exposes Swift methods to React Native
 * - Bridge: Connects JavaScript ↔ Objective-C ↔ Swift
 * 
 * Why we need this:
 * 1. React Native's bridge system expects Objective-C interfaces
 * 2. Swift classes need @objc annotation to be accessible
 * 3. This file provides the Objective-C interface that React Native can understand
 * 4. It acts as a "translator" between the two languages
 */

@interface RCT_EXTERN_MODULE(UserProfileModule, NSObject)

/**
 * RCT_EXTERN_METHOD - Method Exposure
 * 
 * This macro exposes the Swift processUserProfile method to React Native.
 * It tells React Native:
 * - What the method name is
 * - What parameters it takes
 * - How to call it from JavaScript
 * 
 * Parameter Types:
 * - NSDictionary *userProfile: JavaScript object converted to native dictionary
 * - RCTPromiseResolveBlock resolve: Promise resolver for successful results
 * - RCTPromiseRejectBlock reject: Promise rejecter for error handling
 * 
 * JavaScript Usage:
 * NativeModules.UserProfileModule.processUserProfile(userProfile)
 *   .then(result => { /* handle success */ })
 *   .catch(error => { /* handle error */ })
 */
RCT_EXTERN_METHOD(processUserProfile:(NSDictionary *)userProfile
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
