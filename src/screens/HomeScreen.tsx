import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserInfoCard } from '../components/UserInfoCard';
import { PageTitle } from '../components/PageTitle';
import { UserProfileService } from '../services/userProfileService';
import { UserProfile, ProfileProcessingResult } from '../types/userProfile';

export const HomeScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [profileResult, setProfileResult] = useState<ProfileProcessingResult | null>(null);
  const [isProcessingProfile, setIsProcessingProfile] = useState(false);
  const [platformInfo, setPlatformInfo] = useState<any>(null);

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }, [logout]);

  const handleProcessProfile = async () => {
    if (!user) return;

    setIsProcessingProfile(true);
    try {
      // Create user profile from auth user data
      const userProfile: UserProfile = {
        id: user.id || 'unknown',
        email: user.email || 'unknown@example.com',
        name: user.name || 'Unknown User',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
        // Optional fields for enhanced processing
        age: 25, // Default age for demonstration
        preferences: {
          theme: 'light', // Default theme
          notifications: true, // Default to enabled
          language: 'en', // Default language
        },
        metadata: {
          lastLogin: new Date().toISOString(),
        },
      };

      const result = await UserProfileService.processUserProfile(userProfile);
      setProfileResult(result);
      Alert.alert('Success', 'User profile processed successfully using native module!');
    } catch (error) {
      Alert.alert('Error', `Failed to process profile: ${error}`);
      console.error('Profile processing error:', error);
    } finally {
      setIsProcessingProfile(false);
    }
  };

  const handleCheckPlatform = () => {
    const info = UserProfileService.getPlatformInfo();
    setPlatformInfo(info);
  };

  useEffect(() => {
    console.log('user', user);
    // Check platform info when component mounts
    handleCheckPlatform();
  }, [user]);

  const renderProfileResult = () => {
    if (!profileResult) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Native Module Processing Result:</Text>
        <View style={styles.resultGrid}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Full Name:</Text>
            <Text style={styles.resultValue}>{profileResult.processedProfile.fullName}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Email Domain:</Text>
            <Text style={styles.resultValue}>{profileResult.processedProfile.emailDomain}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Days Since Creation:</Text>
            <Text style={styles.resultValue}>{profileResult.processedProfile.daysSinceCreation}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Days Since Update:</Text>
            <Text style={styles.resultValue}>{profileResult.processedProfile.daysSinceUpdate}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Recently Active:</Text>
            <Text style={styles.resultValue}>
              {profileResult.processedProfile.isRecentlyActive ? 'Yes' : 'No'}
            </Text>
          </View>
          {profileResult.processedProfile.ageGroup && (
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Age Group:</Text>
              <Text style={styles.resultValue}>{profileResult.processedProfile.ageGroup}</Text>
            </View>
          )}
          {profileResult.processedProfile.preferenceScore && (
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Preference Score:</Text>
              <Text style={styles.resultValue}>{profileResult.processedProfile.preferenceScore}</Text>
            </View>
          )}
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Created At:</Text>
            <Text style={styles.resultValue}>
              {profileResult.processedProfile.formattedMetadata.createdAtFormatted}
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Updated At:</Text>
            <Text style={styles.resultValue}>
              {profileResult.processedProfile.formattedMetadata.updatedAtFormatted}
            </Text>
          </View>
          {profileResult.processedProfile.formattedMetadata.lastLoginFormatted && (
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Last Login:</Text>
              <Text style={styles.resultValue}>
                {profileResult.processedProfile.formattedMetadata.lastLoginFormatted}
              </Text>
            </View>
          )}
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Processing Time:</Text>
            <Text style={styles.resultValue}>{profileResult.processingTime}ms</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPlatformInfo = () => {
    if (!platformInfo) return null;

    return (
      <View style={styles.platformContainer}>
        <Text style={styles.platformTitle}>Native Module Status:</Text>
        <View style={styles.platformGrid}>
          <View style={styles.platformItem}>
            <Text style={styles.platformLabel}>Platform:</Text>
            <Text style={styles.platformValue}>{platformInfo.platform}</Text>
          </View>
          <View style={styles.platformItem}>
            <Text style={styles.platformLabel}>Module Available:</Text>
            <Text style={[
              styles.platformValue, 
              { color: platformInfo.moduleAvailable ? '#28a745' : '#dc3545' }
            ]}>
              {platformInfo.moduleAvailable ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.platformItem}>
            <Text style={styles.platformLabel}>Module Name:</Text>
            <Text style={styles.platformValue}>{platformInfo.moduleName}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message='Logging out...' />;
  }

  return (
    <ScrollView style={styles.container} testID="screen-Home">
      <PageTitle title="Welcome!" />

      <UserInfoCard user={user} />

      {renderPlatformInfo()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.profileButton, isProcessingProfile && styles.profileButtonDisabled]}
          onPress={handleProcessProfile}
          disabled={isProcessingProfile}
        >
          <Text style={styles.profileButtonText}>
            {isProcessingProfile ? 'Processing...' : 'Process Profile with Native Module'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderProfileResult()}

      <Button
        title="Logout"
        variant="danger"
        onPress={handleLogout}
        loading={isLoading}
        disabled={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  profileButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  platformContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  platformGrid: {
    gap: 10,
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  platformValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  resultGrid: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
}); 