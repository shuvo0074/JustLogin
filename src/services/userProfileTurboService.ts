import UserProfileModule from '../specs/UserProfileModule';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  age?: number;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  metadata?: {
    lastLogin?: string;
  };
}

export interface ProcessedUserProfile {
  success: boolean;
  processedProfile: {
    fullName: string;
    emailDomain: string;
    daysSinceCreation: number;
    daysSinceUpdate: number;
    isRecentlyActive: boolean;
    ageGroup?: string;
    preferenceScore?: number;
    formattedMetadata: {
      createdAtFormatted: string;
      updatedAtFormatted: string;
      lastLoginFormatted?: string;
    };
  };
  processingTime: number;
  validationErrors: any[];
}

export class UserProfileTurboService {
  /**
   * Process user profile using Turbo Module
   * This method calls the native module directly through the Turbo Module system
   * 
   * @param userProfile The user profile data to process
   * @returns Promise with processed profile data
   */
  static async processUserProfile(userProfile: UserProfile): Promise<ProcessedUserProfile> {
    try {
      // Call the native module through Turbo Module system
      const result = await UserProfileModule.processUserProfile(userProfile);
      return result;
    } catch (error) {
      // Fallback error handling
      console.error('Error processing user profile with Turbo Module:', error);
      throw error;
    }
  }
}
