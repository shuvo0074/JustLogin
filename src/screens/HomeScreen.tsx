import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserInfoCard } from '../components/UserInfoCard';
import { PageTitle } from '../components/PageTitle';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation';

export const HomeScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigation = useNavigation<AuthStackNavigationProp>();

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
  }, [logout, t]);

  if (isLoading) {
    return <LoadingSpinner message={t.loading} />;
  }

  return (
    <View style={styles.container} testID="screen-Home">
      <PageTitle title={t.welcome} />

      <UserInfoCard user={user} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#3c3c3c',
  },
}); 