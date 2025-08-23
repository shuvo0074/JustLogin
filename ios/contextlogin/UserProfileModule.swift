import Foundation
import React
import React_RCTTurboModule

/**
 * UserProfileModule - Native iOS Module for React Native
 * 
 * This class creates a native module that:
 * 1. Receives data from JavaScript (React Native)
 * 2. Processes the data using native iOS/Swift logic
 * 3. Returns processed results back to JavaScript
 * 
 * Key Concepts:
 * - @objc: Makes the class accessible to Objective-C bridge
 * - RCTPromiseResolveBlock: React Native's way of handling async results
 * - RCTPromiseRejectBlock: React Native's way of handling errors
 * - Dictionary: Swift's way of handling key-value data from JavaScript
 * - DateFormatter: Native iOS date parsing and formatting
 */

@objc(UserProfileModule)
class UserProfileModule: NSObject, RCTTurboModule {
  
  /**
   * requiresMainQueueSetup - Threading Configuration
   * 
   * This method tells React Native whether this module needs to run on the main thread.
   * Returns false because our data processing doesn't involve UI updates.
   * 
   * @return Bool indicating if main queue setup is required
   * 
   * Why false:
   * - No UI operations in our module
   * - Data processing can happen on background threads
   * - Better performance for non-UI operations
   */
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  /**
   * processUserProfile - Main Data Processing Method
   * 
   * This method is exposed to JavaScript via the Objective-C bridge.
   * It demonstrates the complete data flow: JavaScript → Native → JavaScript
   * 
   * @param userProfile Dictionary containing user data from JavaScript
   * @param resolve Promise resolver for successful results
   * @param reject Promise rejecter for error handling
   * 
   * Data Flow:
   * 1. JavaScript sends UserProfile object (converted to Dictionary)
   * 2. Native code extracts and processes the data
   * 3. Results are packaged and sent back via resolve() or reject()
   */
  @objc
  func processUserProfile(_ userProfile: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    
    do {
      // STEP 1: Extract data from Dictionary (JavaScript object converted to Swift)
      // Dictionary is Swift's bridge for JavaScript objects
      guard let id = userProfile["id"] as? String,
            let email = userProfile["email"] as? String,
            let name = userProfile["name"] as? String,
            let createdAt = userProfile["createdAt"] as? String,
            let updatedAt = userProfile["updatedAt"] as? String else {
        // Error handling: Invalid data structure
        reject("INVALID_DATA", "Invalid user profile data", nil)
        return
      }
      
      // Extract optional fields (may not be present)
      let age = userProfile["age"] as? Int
      let ageGroup = age != nil ? getAgeGroup(age: age!) : nil
      
      // Extract optional preferences
      let preferences = userProfile["preferences"] as? [String: Any]
      let preferenceScore = preferences != nil ? calculatePreferenceScore(
        theme: preferences!["theme"] as? String ?? "light",
        notifications: preferences!["notifications"] as? Bool ?? false,
        language: preferences!["language"] as? String ?? "en"
      ) : nil
      
      // Extract optional metadata
      let metadata = userProfile["metadata"] as? [String: Any]
      let lastLogin = metadata?["lastLogin"] as? String ?? ""
      let isRecentlyActive = lastLogin.isEmpty ? isDateRecent(dateString: updatedAt) : isUserActive(lastLogin: lastLogin)
      
      // STEP 2: Process the data using native iOS/Swift logic
      let fullName = name
      
      // Email domain extraction
      let emailDomain = getEmailDomain(email: email)
      
      // Date calculations and formatting
      let daysSinceCreation = calculateDaysSince(dateString: createdAt)
      let daysSinceUpdate = calculateDaysSince(dateString: updatedAt)
      
      // STEP 3: Create result dictionary for JavaScript
      // Dictionary is automatically converted to JavaScript object
      var processedProfile: [String: Any] = [
        "fullName": fullName,
        "emailDomain": emailDomain,
        "daysSinceCreation": daysSinceCreation,
        "daysSinceUpdate": daysSinceUpdate,
        "isRecentlyActive": isRecentlyActive,
        "formattedMetadata": [
          "createdAtFormatted": formatDate(dateString: createdAt),
          "updatedAtFormatted": formatDate(dateString: updatedAt)
        ]
      ]
      
      // Add optional fields only if they exist
      if let ageGroup = ageGroup {
        processedProfile["ageGroup"] = ageGroup
      }
      if let preferenceScore = preferenceScore {
        processedProfile["preferenceScore"] = preferenceScore
      }
      if !lastLogin.isEmpty {
        processedProfile["formattedMetadata"] = [
          "createdAtFormatted": formatDate(dateString: createdAt),
          "updatedAtFormatted": formatDate(dateString: updatedAt),
          "lastLoginFormatted": formatDate(dateString: lastLogin)
        ]
      }
      
      let result: [String: Any] = [
        "success": true,
        "processedProfile": processedProfile,
        "processingTime": Date().timeIntervalSince1970 * 1000,
        "validationErrors": []
      ]
      
      // STEP 4: Send result back to JavaScript via Promise resolver
      // This completes the JavaScript → Native → JavaScript cycle
      resolve(result)
      
    } catch {
      // Error handling: Convert Swift errors to JavaScript-readable format
      reject("PROCESSING_ERROR", "Error processing user profile: \(error.localizedDescription)", error)
    }
  }
  
  /**
   * getAgeGroup - Business Logic Method
   * 
   * This method demonstrates custom business logic that could be:
   * - Too complex for JavaScript
   * - Performance-critical
   * - Platform-specific
   * - Using native iOS libraries
   * 
   * @param age User's age
   * @return String representing age group category
   */
  private func getAgeGroup(age: Int) -> String {
    switch age {
    case 0..<18:
      return "Minor"
    case 18..<30:
      return "Young Adult"
    case 30..<50:
      return "Adult"
    default:
      return "Senior"
    }
  }
  
  /**
   * getEmailDomain - String Processing Logic
   * 
   * Demonstrates native Swift string manipulation capabilities.
   * This could be extended to use iOS's URL parsing or validation.
   * 
   * @param email Full email address
   * @return String containing just the domain part
   */
  private func getEmailDomain(email: String) -> String {
    if let atIndex = email.firstIndex(of: "@") {
      let domain = String(email[email.index(after: atIndex)...])
      return domain.isEmpty ? "unknown" : domain
    }
    return "unknown"
  }
  
  /**
   * calculatePreferenceScore - Business Logic Method
   * 
   * Shows how native code can implement complex scoring algorithms
   * that might be performance-critical or business-specific.
   * 
   * @param theme User's theme preference
   * @param notifications Whether notifications are enabled
   * @param language User's language preference
   * @return Integer preference score
   */
  private func calculatePreferenceScore(theme: String, notifications: Bool, language: String) -> Int {
    var score = 0
    if theme == "dark" { score += 10 }
    if notifications { score += 20 }
    if language == "en" { score += 15 }
    return score
  }
  
  /**
   * isUserActive - Date Processing Logic
   * 
   * Demonstrates native iOS date handling and business logic.
   * This could be extended to use iOS's Calendar framework or other native features.
   * 
   * @param lastLogin ISO date string from JavaScript
   * @return Boolean indicating if user is considered active
   */
  private func isUserActive(lastLogin: String) -> Bool {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    
    guard let lastLoginDate = dateFormatter.date(from: lastLogin) else { return false }
    
    let currentDate = Date()
    let timeInterval = currentDate.timeIntervalSince(lastLoginDate)
    let days = timeInterval / (24 * 60 * 60)
    
    return days <= 30
  }
  
  /**
   * isDateRecent - Date Processing Logic
   * 
   * Demonstrates native iOS date handling and business logic.
   * This could be extended to use iOS's Calendar framework or other native features.
   * 
   * @param dateString ISO date string from JavaScript
   * @return Boolean indicating if date is considered recent
   */
  private func isDateRecent(dateString: String) -> Bool {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    
    guard let date = dateFormatter.date(from: dateString) else { return false }
    
    let currentDate = Date()
    let timeInterval = currentDate.timeIntervalSince(date)
    let days = timeInterval / (24 * 60 * 60)
    
    return days <= 7 // Consider a date recent if it's within the last 7 days
  }
  
  /**
   * calculateDaysSince - Date Calculation Utility
   * 
   * Shows how native code can perform complex date calculations
   * that might be cumbersome in JavaScript.
   * 
   * @param dateString ISO date string to calculate days from
   * @return Number of days since the given date
   */
  private func calculateDaysSince(dateString: String) -> Int {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    
    guard let date = dateFormatter.date(from: dateString) else { return 0 }
    
    let currentDate = Date()
    let timeInterval = currentDate.timeIntervalSince(date)
    let days = Int(timeInterval / (24 * 60 * 60))
    
    return days
  }
  
  /**
   * formatDate - Date Formatting Utility
   * 
   * Demonstrates native iOS date formatting capabilities.
   * Could be extended to use iOS's locale-specific formatting or Calendar framework.
   * 
   * @param dateString ISO date string to format
   * @return Formatted date string for display
   */
  private func formatDate(dateString: String) -> String {
    let inputFormatter = DateFormatter()
    inputFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    inputFormatter.timeZone = TimeZone(abbreviation: "UTC")
    
    guard let date = inputFormatter.date(from: dateString) else { return "Unknown" }
    
    let outputFormatter = DateFormatter()
    outputFormatter.dateFormat = "MMM dd, yyyy"
    
    return outputFormatter.string(from: date)
  }
}
