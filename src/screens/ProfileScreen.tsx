import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
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

  return (
    <ScrollView style={styles.container} testID="screen-Profile">
      <PageTitle title={t.profileTitle} variant="large" />

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
    padding: 20,
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
