package com.contextlogin

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.fragment.app.FragmentActivity
import android.content.Context
import androidx.biometric.BiometricPrompt.AuthenticationCallback

class BiometricModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private var isPromiseResolved = false
    
    override fun getName(): String = "BiometricModule"
    
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        // Clean up any resources if needed
    }
    
      private fun safeResolvePromise(promise: Promise, result: Any) {
    if (!isPromiseResolved) {
      try {
        promise.resolve(result)
        isPromiseResolved = true
        android.util.Log.d("BiometricModule", "Promise resolved successfully")
      } catch (e: Exception) {
        android.util.Log.e("BiometricModule", "Error resolving promise: ${e.message}")
      }
    } else {
      android.util.Log.w("BiometricModule", "Promise already resolved, ignoring duplicate call")
    }
  }
    
      private fun safeRejectPromise(promise: Promise, code: String, message: String) {
    if (!isPromiseResolved) {
      try {
        promise.reject(code, message)
        isPromiseResolved = true
        android.util.Log.d("BiometricModule", "Promise rejected successfully: $code - $message")
      } catch (e: Exception) {
        android.util.Log.e("BiometricModule", "Error rejecting promise: ${e.message}")
      }
    } else {
      android.util.Log.w("BiometricModule", "Promise already resolved, ignoring duplicate call")
    }
  }
    
      @ReactMethod
  fun authenticateWithBiometrics(promise: Promise) {
    try {
      // Reset promise state
      isPromiseResolved = false
      
      android.util.Log.d("BiometricModule", "Starting biometric authentication...")
      
      val activity = currentActivity as? FragmentActivity
      if (activity == null) {
        android.util.Log.e("BiometricModule", "Activity not available")
        safeRejectPromise(promise, "NO_ACTIVITY", "Activity not available")
        return
      }
      
      android.util.Log.d("BiometricModule", "Activity found, checking thread...")
      
      // Always ensure we're on the main thread for UI operations
      if (isMainThread()) {
        android.util.Log.d("BiometricModule", "Already on main thread, starting authentication")
        startBiometricAuthentication(activity, promise)
      } else {
        android.util.Log.d("BiometricModule", "Not on main thread, switching to main thread")
        activity.runOnUiThread {
          android.util.Log.d("BiometricModule", "Now on main thread, starting authentication")
          startBiometricAuthentication(activity, promise)
        }
      }
    } catch (e: Exception) {
      android.util.Log.e("BiometricModule", "Error in authenticateWithBiometrics: ${e.message}")
      safeRejectPromise(promise, "AUTH_ERROR", "Failed to start biometric authentication: ${e.message}")
    }
  }
  
  private fun startBiometricAuthentication(activity: FragmentActivity, promise: Promise) {
    try {
      android.util.Log.d("BiometricModule", "startBiometricAuthentication called")
      
      // Check if activity is still valid
      if (activity.isFinishing || activity.isDestroyed) {
        android.util.Log.e("BiometricModule", "Activity is no longer valid")
        safeRejectPromise(promise, "ACTIVITY_INVALID", "Activity is no longer valid")
        return
      }
      
      android.util.Log.d("BiometricModule", "Creating BiometricPrompt...")
      
      // Set a timeout to prevent hanging
      val timeoutHandler = android.os.Handler(android.os.Looper.getMainLooper())
      val timeoutRunnable = Runnable {
        if (!isPromiseResolved) {
          android.util.Log.w("BiometricModule", "Authentication timeout")
          safeRejectPromise(promise, "TIMEOUT", "Authentication timeout")
        }
      }
      timeoutHandler.postDelayed(timeoutRunnable, 30000) // 30 second timeout
      
      // Store timeout handler for cancellation
      val timeoutKey = "timeout_${System.currentTimeMillis()}"
      
      // Send progress event to JavaScript
      sendEvent("onAuthenticationProgress", "Starting biometric authentication...")
      
      val biometricPrompt = BiometricPrompt(activity, object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
          android.util.Log.d("BiometricModule", "Authentication succeeded")
          
          try {
            // Create separate maps for event and promise
            val eventMap = createSuccessResultMap()
            val promiseMap = createSuccessResultMap()
            
            // Send completion event to JavaScript
            sendEvent("onAuthenticationComplete", eventMap)
            
            // Resolve the promise on main thread
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeResolvePromise(promise, promiseMap)
            }
          } catch (e: Exception) {
            android.util.Log.e("BiometricModule", "Error in onAuthenticationSucceeded: ${e.message}")
            // Still try to resolve the promise with a fresh map
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeResolvePromise(promise, createSuccessResultMap())
            }
          }
        }
        
        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
          android.util.Log.e("BiometricModule", "Authentication error: $errString (code: $errorCode)")
          
          try {
            // Handle specific error codes
            val errorMessage = when (errorCode) {
              BiometricPrompt.ERROR_CANCELED -> "Authentication cancelled by user"
              BiometricPrompt.ERROR_HW_NOT_PRESENT -> "Biometric hardware not available"
              BiometricPrompt.ERROR_HW_UNAVAILABLE -> "Biometric hardware unavailable"
              BiometricPrompt.ERROR_LOCKOUT -> "Too many failed attempts, try again later"
              BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "Biometric authentication permanently locked"
              BiometricPrompt.ERROR_NEGATIVE_BUTTON -> "Authentication cancelled by user"
              BiometricPrompt.ERROR_NO_BIOMETRICS -> "No biometric credentials enrolled"
              BiometricPrompt.ERROR_TIMEOUT -> "Authentication timeout"
              BiometricPrompt.ERROR_UNABLE_TO_PROCESS -> "Unable to process authentication"
              BiometricPrompt.ERROR_USER_CANCELED -> "Authentication cancelled by user"
              BiometricPrompt.ERROR_VENDOR -> "Vendor-specific error"
              else -> errString.toString()
            }
            
            // Create separate maps for event and promise rejection
            val eventMap = createErrorResultMap(errorMessage)
            
            // Send error event to JavaScript
            sendEvent("onAuthenticationComplete", eventMap)
            
            // Reject the promise on main thread
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeRejectPromise(promise, "AUTH_ERROR", errorMessage)
            }
          } catch (e: Exception) {
            android.util.Log.e("BiometricModule", "Error in onAuthenticationError: ${e.message}")
            // Still try to reject the promise
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeRejectPromise(promise, "AUTH_ERROR", "Authentication error occurred")
            }
          }
        }
        
        override fun onAuthenticationFailed() {
          android.util.Log.w("BiometricModule", "Authentication failed")
          
          try {
            // Create separate maps for event and promise rejection
            val eventMap = createErrorResultMap("Authentication failed")
            
            sendEvent("onAuthenticationComplete", eventMap)
            
            // Reject the promise on main thread
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeRejectPromise(promise, "AUTH_FAILED", "Authentication failed")
            }
          } catch (e: Exception) {
            android.util.Log.e("BiometricModule", "Error in onAuthenticationFailed: ${e.message}")
            // Still try to reject the promise
            android.os.Handler(android.os.Looper.getMainLooper()).post {
              safeRejectPromise(promise, "AUTH_FAILED", "Authentication failed")
            }
          }
        }
        

      })
      
      val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Biometric Authentication")
        .setSubtitle("Authenticate to access the app")
        .setNegativeButtonText("Cancel")
        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
        .build()
        
      try {
        biometricPrompt.authenticate(promptInfo)
      } catch (e: Exception) {
        android.util.Log.e("BiometricModule", "Error showing biometric prompt: ${e.message}")
        safeRejectPromise(promise, "PROMPT_ERROR", "Failed to show biometric prompt: ${e.message}")
      }
    } catch (e: Exception) {
      safeRejectPromise(promise, "AUTH_ERROR", "Failed to start biometric authentication: ${e.message}")
    }
  }
  
  @ReactMethod
  fun isBiometricsAvailable(promise: Promise) {
    try {
      val biometricManager = BiometricManager.from(reactApplicationContext)
      val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)
      promise.resolve(canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS)
    } catch (e: Exception) {
      promise.reject("BIOMETRIC_ERROR", "Error checking biometric availability: ${e.message}")
    }
  }
  
  @ReactMethod
  fun getSupportedBiometricTypes(promise: Promise) {
    try {
      val biometricManager = BiometricManager.from(reactApplicationContext)
      val canAuthenticate = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)
      
      val types = Arguments.createArray()
      if (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS) {
        types.pushString("fingerprint")
      }
      
      promise.resolve(types)
    } catch (e: Exception) {
      promise.reject("BIOMETRIC_ERROR", "Error getting supported types: ${e.message}")
    }
  }
    
      // Send events to JavaScript
  private fun sendEvent(eventName: String, params: Any?) {
    try {
      reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        ?.emit(eventName, params)
    } catch (e: Exception) {
      // Log error but don't crash the app
      android.util.Log.e("BiometricModule", "Error sending event: ${e.message}")
    }
  }

  // Check if we're on the main thread
  private fun isMainThread(): Boolean {
    return android.os.Looper.myLooper() == android.os.Looper.getMainLooper()
  }
  
  // Helper method to create a fresh success result map
  private fun createSuccessResultMap(): WritableMap {
    return Arguments.createMap().apply {
      putBoolean("success", true)
      putString("biometricType", "fingerprint")
      putDouble("confidence", 0.95)
    }
  }
  
  // Helper method to create a fresh error result map
  private fun createErrorResultMap(errorMessage: String): WritableMap {
    return Arguments.createMap().apply {
      putBoolean("success", false)
      putString("error", errorMessage)
    }
  }
}
