import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { UserInfoCard } from '../components/UserInfoCard';
import { PageTitle } from '../components/PageTitle';

export const HomeScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();

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