import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';

export const HomeScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingSpinner message={t.loading} />;
  }

  return (
    <SafeAreaView style={styles.container} testID="screen-Home">
      <View style={styles.content}>
        <PageTitle title={t.welcome} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
}); 