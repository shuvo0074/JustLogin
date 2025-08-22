package com.contextlogin

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.abs

/**
 * UserProfileModule - Native Android Module for React Native
 * 
 * This class extends ReactContextBaseJavaModule to create a native module that:
 * 1. Receives data from JavaScript (React Native)
 * 2. Processes the data using native Android/Kotlin logic
 * 3. Returns processed results back to JavaScript
 * 
 * Key Concepts:
 * - ReactContextBaseJavaModule: Base class for native modules
 * - @ReactMethod: Annotation that exposes methods to JavaScript
 * - ReadableMap: React Native's way of passing objects from JS to native
 * - Promise: React Native's way of handling async results
 * - Arguments: Helper class for creating bridge-compatible data structures
 */
class UserProfileModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    /**
     * getName() - Module Identifier
     * 
     * This method returns the name that JavaScript will use to access this module.
     * JavaScript code will call: NativeModules.UserProfileModule.methodName()
     * 
     * @return String name that identifies this module in React Native
     */
    override fun getName(): String {
        return "UserProfileModule"
    }

    /**
     * processUserProfile - Main Data Processing Method
     * 
     * This method is exposed to JavaScript via @ReactMethod annotation.
     * It demonstrates the complete data flow: JavaScript → Native → JavaScript
     * 
     * @param userProfile ReadableMap containing user data from JavaScript
     * @param promise Promise object for returning results to JavaScript
     * 
     * Data Flow:
     * 1. JavaScript sends UserProfile object
     * 2. Native code extracts and processes the data
     * 3. Results are packaged and sent back via promise.resolve()
     */
    @ReactMethod
    fun processUserProfile(userProfile: ReadableMap, promise: Promise) {
        try {
            // STEP 1: Extract data from ReadableMap (JavaScript object converted to native)
            // ReadableMap is React Native's bridge for JavaScript objects
            val id = userProfile.getString("id") ?: ""
            val email = userProfile.getString("email") ?: ""
            val name = userProfile.getString("name") ?: ""
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
            
            // Extract optional preferences
            val preferences = userProfile.getMap("preferences")
            val preferenceScore = if (preferences != null) {
                val theme = preferences.getString("theme") ?: "light"
                val notifications = preferences.getBoolean("notifications") ?: false
                val language = preferences.getString("language") ?: "en"
                calculatePreferenceScore(theme, notifications, language)
            } else null
            
            // Extract optional metadata
            val metadata = userProfile.getMap("metadata")
            val lastLogin = metadata?.getString("lastLogin") ?: ""
            val isRecentlyActive = if (lastLogin.isNotEmpty()) {
                isUserActive(lastLogin)
            } else {
                // If no lastLogin, check if updatedAt is recent
                isDateRecent(updatedAt)
            }

            // STEP 2: Process the data using native Android/Kotlin logic
            val fullName = name
            
            // Email domain extraction
            val emailDomain = email.substringAfter("@", "unknown")
            
            // Date calculations and formatting
            val daysSinceCreation = calculateDaysSince(createdAt)
            val daysSinceUpdate = calculateDaysSince(updatedAt)
            
            // STEP 3: Create result object using Arguments helper class
            // Arguments.createMap() creates bridge-compatible data structures
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putMap("processedProfile", Arguments.createMap().apply {
                    putString("fullName", fullName)
                    putString("emailDomain", emailDomain)
                    putInt("daysSinceCreation", daysSinceCreation)
                    putInt("daysSinceUpdate", daysSinceUpdate)
                    putBoolean("isRecentlyActive", isRecentlyActive)
                    
                    // Add optional fields only if they exist
                    if (ageGroup != null) {
                        putString("ageGroup", ageGroup)
                    }
                    if (preferenceScore != null) {
                        putDouble("preferenceScore", preferenceScore.toDouble())
                    }
                    
                    putMap("formattedMetadata", Arguments.createMap().apply {
                        putString("createdAtFormatted", formatDate(createdAt))
                        putString("updatedAtFormatted", formatDate(updatedAt))
                        if (lastLogin.isNotEmpty()) {
                            putString("lastLoginFormatted", formatDate(lastLogin))
                        }
                    })
                })
                putDouble("processingTime", System.currentTimeMillis().toDouble())
                putArray("validationErrors", Arguments.createArray())
            }
            
            // STEP 4: Send result back to JavaScript via Promise
            // This completes the JavaScript → Native → JavaScript cycle
            promise.resolve(result)
            
        } catch (e: Exception) {
            // Error handling: Convert native exceptions to JavaScript-readable format
            val errorResult = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("error", e.message ?: "Unknown error")
            }
            promise.resolve(errorResult)
        }
    }

    /**
     * calculatePreferenceScore - Business Logic Method
     * 
     * This method demonstrates custom business logic that could be:
     * - Too complex for JavaScript
     * - Performance-critical
     * - Platform-specific
     * - Using native Android libraries
     * 
     * @param theme User's theme preference
     * @param notifications Whether notifications are enabled
     * @param language User's language preference
     * @return Calculated preference score
     */
    private fun calculatePreferenceScore(theme: String, notifications: Boolean, language: String): Int {
        var score = 0
        if (theme == "dark") score += 10
        if (notifications) score += 20
        if (language == "en") score += 15
        return score
    }

    /**
     * isUserActive - Date Processing Logic
     * 
     * Demonstrates native date handling and business logic.
     * This could be extended to use Android's Calendar API or other native features.
     * 
     * @param lastLogin ISO date string from JavaScript
     * @return Boolean indicating if user is considered active
     */
    private fun isUserActive(lastLogin: String): Boolean {
        return try {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
            val lastLoginDate = dateFormat.parse(lastLogin)
            val currentDate = Date()
            val diffInMillis = abs(currentDate.time - (lastLoginDate?.time ?: 0))
            val diffInDays = diffInMillis / (24 * 60 * 60 * 1000)
            diffInDays <= 30
        } catch (e: Exception) {
            false
        }
    }

    /**
     * isDateRecent - Date Processing Logic
     * 
     * Checks if the given date string is within the last 7 days.
     * 
     * @param dateString ISO date string to check
     * @return Boolean indicating if the date is recent
     */
    private fun isDateRecent(dateString: String): Boolean {
        return try {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
            val date = dateFormat.parse(dateString)
            val currentDate = Date()
            val diffInMillis = abs(currentDate.time - (date?.time ?: 0))
            val diffInDays = diffInMillis / (24 * 60 * 60 * 1000)
            diffInDays <= 7
        } catch (e: Exception) {
            false
        }
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
    private fun calculateDaysSince(dateString: String): Int {
        return try {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
            val date = dateFormat.parse(dateString)
            val currentDate = Date()
            val timeInterval = abs(currentDate.time - (date?.time ?: 0))
            val days = timeInterval / (24 * 60 * 60 * 1000)
            days.toInt()
        } catch (e: Exception) {
            0
        }
    }

    /**
     * formatDate - Date Formatting Utility
     * 
     * Demonstrates native date formatting capabilities.
     * Could be extended to use Android's locale-specific formatting.
     * 
     * @param dateString ISO date string to format
     * @return Formatted date string for display
     */
    private fun formatDate(dateString: String): String {
        return try {
            val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault())
            val date = dateFormat.parse(dateString)
            val outputFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            "Unknown"
        }
    }
}
