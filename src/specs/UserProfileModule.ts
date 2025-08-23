import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  processUserProfile(userProfile: {
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
  }): Promise<{
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
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('UserProfileModule');
