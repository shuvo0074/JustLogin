export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for processing
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

export interface ProcessedUserProfile {
  fullName: string;
  emailDomain: string;
  daysSinceCreation: number;
  daysSinceUpdate: number;
  isRecentlyActive: boolean;
  preferenceScore?: number;
  ageGroup?: string;
  formattedMetadata: {
    createdAtFormatted: string;
    updatedAtFormatted: string;
    lastLoginFormatted?: string;
  };
}

export interface ProfileProcessingResult {
  success: boolean;
  processedProfile: ProcessedUserProfile;
  processingTime: number;
  validationErrors?: string[];
}
