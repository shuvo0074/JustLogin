import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/LanguageContext';
import { PageTitle } from '../components/PageTitle';
import { Button } from '../components/Button';

export const AboutScreen: React.FC = () => {
  const { t } = useLanguage();
  
  const handleContactPress = () => {
    Linking.openURL('mailto:support@nsfgym.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.nsfgym.com');
  };

  return (
    <SafeAreaView style={styles.container} testID="screen-About">
      <ImageBackground
        source={{ uri: 'https://nsfgym.de/wp-content/uploads/2021/03/NSF-Slid-show.png' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <PageTitle title={t.aboutTitle} variant="large" style={styles.titleOverlay} />

          <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.aboutWelcome}</Text>
            <Text style={styles.sectionText}>
              {t.aboutWelcomeDescription}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.ourMission}</Text>
            <Text style={styles.sectionText}>
              {t.ourMissionDescription}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.features}</Text>
            <Text style={styles.sectionText}>
              {t.featuresList}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.version}</Text>
            <Text style={styles.sectionText}>1.0.0</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.contactUs}</Text>
            <Text style={styles.sectionText}>
              {t.contactUsDescription}
            </Text>
            
            <View style={styles.buttonContainer}>
              <Button
                title={t.emailSupport}
                variant="secondary"
                onPress={handleContactPress}
                style={styles.contactButton}
              />
              
              <Button
                title={t.visitWebsite}
                variant="secondary"
                onPress={handleWebsitePress}
                style={styles.contactButton}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 NSF GYM. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              Never Stop Fighting!
            </Text>
          </View>
        </View>
          </ScrollView>
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  titleOverlay: {
    color: '#e96315',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 20
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e96315',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 15,
    gap: 10,
  },
  contactButton: {
    marginVertical: 5,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
});
