import LocalAuthentication
import React

@objc(BiometricModule)
class BiometricModule: RCTEventEmitter {
  
  private var resolveBlock: RCTPromiseResolveBlock?
  private var rejectBlock: RCTPromiseRejectBlock?
  
  override func supportedEvents() -> [String]! {
    return ["onAuthenticationProgress", "onAuthenticationComplete"]
  }
  
  @objc
  func authenticateWithBiometrics(_ resolve: @escaping RCTPromiseResolveBlock, 
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.resolveBlock = resolve
    self.rejectBlock = reject
    
    let context = LAContext()
    var error: NSError?
    
    // Send progress update to JavaScript
    self.sendEvent(withName: "onAuthenticationProgress", body: "Starting biometric authentication...")
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, 
                           localizedReason: "Authenticate to access the app") { [weak self] success, error in
        DispatchQueue.main.async {
          if success {
            // Send completion event to JavaScript
            self?.sendEvent(withName: "onAuthenticationComplete", body: [
              "success": true,
              "biometricType": self?.getBiometricTypeString(context.biometryType) ?? "unknown",
              "confidence": 0.95
            ])
            
            // Resolve the promise
            self?.resolveBlock?([
              "success": true,
              "biometricType": self?.getBiometricTypeString(context.biometryType) ?? "unknown",
              "confidence": 0.95
            ])
          } else {
            // Send error event to JavaScript
            self?.sendEvent(withName: "onAuthenticationComplete", body: [
              "success": false,
              "error": error?.localizedDescription ?? "Unknown error"
            ])
            
            self?.rejectBlock?("AUTH_ERROR", "Biometric authentication failed", error)
          }
        }
      }
    } else {
      self.rejectBlock?("NOT_AVAILABLE", "Biometric authentication not available", error)
    }
  }
  
  @objc
  func isBiometricsAvailable(_ resolve: @escaping RCTPromiseResolveBlock, 
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?
    let available = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    resolve(available)
  }
  
  @objc
  func getSupportedBiometricTypes(_ resolve: @escaping RCTPromiseResolveBlock, 
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    let context = LAContext()
    var error: NSError?
    
    var types: [String] = []
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      switch context.biometryType {
      case .touchID:
        types.append("fingerprint")
      case .faceID:
        types.append("face")
      case .none:
        break
      @unknown default:
        break
      }
    }
    
    resolve(types)
  }
  
  private func getBiometricTypeString(_ biometryType: LABiometryType) -> String {
    switch biometryType {
    case .touchID:
      return "fingerprint"
    case .faceID:
      return "face"
    case .none:
      return "none"
    @unknown default:
      return "unknown"
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
