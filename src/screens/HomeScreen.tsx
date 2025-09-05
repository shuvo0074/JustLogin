import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
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
      <ImageBackground
        source={{ uri: 'https://nsfgym.de/wp-content/uploads/2021/03/s2.jpg' }}
        style={styles.coverImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <PageTitle title={t.welcome} style={styles.titleOverlay} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
  },
  coverImage: {
    flex: 1,
    width: '100%',
    height: '105%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for better text readability
  },
  titleOverlay: {
    color: '#e96315',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
}); 