import { Platform } from 'react-native';
import { UserProfile, ProfileProcessingResult } from '../types/userProfile';
import UserProfileModule from '../specs/UserProfileModule';

export class UserProfileService {
  /**
   * Process user profile data using native module
   * @param userProfile - The user profile data to process
   * @returns Promise with processed profile result
   */
  static async processUserProfile(userProfile: UserProfile): Promise<ProfileProcessingResult> {
    try {
      if (!UserProfileModule) {
        throw new Error(`UserProfileModule not available on ${Platform.OS}`);
      }

      const result = await UserProfileModule.processUserProfile(userProfile);
      return result;
    } catch (error) {
      console.error('Error processing user profile:', error);
      throw error;
    }
  }

  /**
   * Check if the native module is available
   * @returns boolean indicating if module is available
   */
  static isAvailable(): boolean {
    return !!UserProfileModule;
  }

  /**
   * Get platform-specific information
   * @returns object with platform details
   */
  static getPlatformInfo() {
    return {
      platform: Platform.OS,
      moduleAvailable: this.isAvailable(),
      moduleName: 'UserProfileModule'
    };
  }
}
