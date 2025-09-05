import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserInfoCard } from '../components/UserInfoCard';
import { PageTitle } from '../components/PageTitle';
import { LanguagePicker } from '../components/LanguagePicker';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogout = useCallback(async () => {
    Alert.alert(
      t.logoutConfirm,
      t.logoutConfirmMessage,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }, [logout, navigation, t]);

  if (isLoading) {
    return <LoadingSpinner message={t.loading} />;
  }

  const screenWidth = Dimensions.get('window').width;
  const profilePictureRadius = screenWidth / 2;

  return (
    <SafeAreaView style={styles.container} testID="screen-Profile">
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
          <Image
            source={{ uri: 'https://nsfgym.de/wp-content/uploads/2021/03/Slid-show.png' }}
            style={styles.coverPhoto}
            resizeMode="cover"
          />
        </View>

        {/* Profile Picture */}
        <View style={[styles.profilePictureContainer, { top: -profilePictureRadius / 2 }]}>
          <Image
            source={{ uri: 'https://nsfgym.de/wp-content/uploads/2021/03/Slid-show.png' }}
            style={[styles.profilePicture, { 
              width: profilePictureRadius, 
              height: profilePictureRadius,
              borderRadius: profilePictureRadius / 2 
            }]}
            resizeMode="cover"
          />
        </View>

        <PageTitle title={user?.name.toString() || ''} variant="large" style={styles.profileTitle} />

        <UserInfoCard user={user} showId={true} showTimestamps={true} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.accountSettings}</Text>
          <Text style={styles.sectionDescription}>
            {t.accountSettingsDescription}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.privacySecurity}</Text>
          <Text style={styles.sectionDescription}>
            {t.privacySecurityDescription}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          <Text style={styles.sectionDescription}>
            {t.languageDescription}
          </Text>
          <LanguagePicker style={styles.languagePicker} />
        </View>

        <Button
          title={t.logout}
          variant="danger"
          onPress={handleLogout}
          loading={isLoading}
          disabled={isLoading}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  coverPhotoContainer: {
    position: 'relative',
    marginBottom: 0,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  profilePictureContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: -50, // Negative margin to reduce space
    zIndex: 1,
  },
  profilePicture: {
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileTitle: {
    textAlign: 'center',
    marginTop: 0,
    color: '#e96315',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e96315',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
  languagePicker: {
    marginTop: 10,
  },
});
