import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <PageTitle title={t.aboutTitle} variant="large" />

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
    flexGrow: 1,
  },
  content: {
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
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666666',
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
