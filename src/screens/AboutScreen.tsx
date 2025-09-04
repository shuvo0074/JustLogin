import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { PageTitle } from '../components/PageTitle';
import { Button } from '../components/Button';

export const AboutScreen: React.FC = () => {
  const handleContactPress = () => {
    Linking.openURL('mailto:support@nsfgym.com');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.nsfgym.com');
  };

  return (
    <ScrollView style={styles.container} testID="screen-About">
      <PageTitle title="About NSF GYM" variant="large" />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Welcome to NSF GYM</Text>
          <Text style={styles.sectionText}>
            Never Stop Fighting - Your ultimate fitness companion. We believe in pushing boundaries, 
            breaking limits, and achieving greatness through dedication and hard work.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            To provide a comprehensive fitness platform that empowers individuals to reach their 
            full potential through innovative training methods, expert guidance, and unwavering support.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.sectionText}>
            • Personalized workout plans{'\n'}
            • Progress tracking{'\n'}
            • Expert trainer support{'\n'}
            • Community challenges{'\n'}
            • Nutrition guidance{'\n'}
            • 24/7 access to resources
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version</Text>
          <Text style={styles.sectionText}>1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
            Have questions or need support? We're here to help you on your fitness journey.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Email Support"
              variant="secondary"
              onPress={handleContactPress}
              style={styles.contactButton}
            />
            
            <Button
              title="Visit Website"
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
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
