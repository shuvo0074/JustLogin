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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

export const ProfileScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
  }, [logout, navigation]);

  if (isLoading) {
    return <LoadingSpinner message='Logging out...' />;
  }

  return (
    <ScrollView style={styles.container} testID="screen-Profile">
      <PageTitle title="Profile" variant="large" />

      <UserInfoCard user={user} showId={true} showTimestamps={true} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <Text style={styles.sectionDescription}>
          Manage your account information and preferences.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <Text style={styles.sectionDescription}>
          Control your privacy settings and security options.
        </Text>
      </View>

      <Button
        title="Logout"
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
});
