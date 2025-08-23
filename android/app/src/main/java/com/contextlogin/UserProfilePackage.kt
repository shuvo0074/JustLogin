package com.contextlogin

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.facebook.react.turbomodule.core.interfaces.TurboModulePackage

/**
 * UserProfilePackage - React Native Package Registration
 * 
 * This class implements ReactPackage interface and is responsible for:
 * 1. Registering our custom native module with React Native
 * 2. Making the UserProfileModule available to JavaScript code
 * 3. Handling the bridge between JavaScript and native Android code
 * 
 * Why we need this:
 * - React Native needs to know about our custom native modules
 * - This package acts as a "container" that holds our native modules
 * - It's manually registered in MainApplication.kt (not auto-linked)
 * - Without this package, JavaScript can't access our native functionality
 */
class UserProfilePackage : ReactPackage, TurboModulePackage {
    
    /**
     * createNativeModules - Core Package Method
     * 
     * This method is called by React Native during app initialization.
     * It returns a list of all native modules that this package provides.
     * 
     * @param reactContext The React Native application context
     * @return List of native modules to register
     * 
     * What happens here:
     * 1. React Native calls this method when the app starts
     * 2. We create an instance of our UserProfileModule
     * 3. React Native registers it and makes it available to JavaScript
     * 4. JavaScript can then call NativeModules.UserProfileModule.methodName()
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // Create and return our custom native module
        // The reactContext is passed to the module for access to app resources
        return listOf(UserProfileModule(reactContext))
    }

    /**
     * createViewManagers - UI Component Registration
     * 
     * This method is for registering custom native UI components.
     * Since our UserProfileModule only provides data processing (no UI),
     * we return an empty list.
     * 
     * @param reactContext The React Native application context
     * @return List of view managers (empty in our case)
     * 
     * When you would use this:
     * - If you were creating custom native UI components
     * - For custom buttons, text inputs, or other visual elements
     * - Our module is purely functional, so no UI needed
     */
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        // Return empty list since we don't have custom UI components
        // Our module only provides data processing functionality
        return emptyList()
    }

    /**
     * getModule - Turbo Module Method
     * 
     * This method is called by Turbo Module system to get module instances.
     * It returns a TurboModule instance for the given module name.
     * 
     * @param moduleName The name of the module to get
     * @param reactContext The React Native application context
     * @return TurboModule instance or null if not found
     */
    override fun getModule(moduleName: String, reactContext: ReactApplicationContext): TurboModule? {
        return when (moduleName) {
            "UserProfileModule" -> UserProfileModule(reactContext)
            else -> null
        }
    }
}
