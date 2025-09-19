import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PageTitle } from '../components/PageTitle';
import BusinessDropdown from '../components/BusinessDropdown';

export const HomeScreen: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingSpinner message={t.loading} />;
  }

  // Sample gym data
  const gymData = {
    workoutsThisWeek: 4,
    totalWorkouts: 127,
    membershipDaysLeft: 23,
    currentStreak: 3,
    nextClass: {
      name: 'HIIT Training',
      time: '18:30',
      instructor: 'Sarah M.',
    },
    upcomingClasses: [
      { name: 'Yoga Flow', time: '19:00', day: t.tomorrow },
      { name: 'Strength Training', time: '07:00', day: t.wednesday },
      { name: 'Cardio Blast', time: '17:30', day: t.friday },
    ],
    recentAchievements: [
      'Completed 5K run',
      'New bench press PR',
      '30-day streak!',
    ],
  };

  return (
    <SafeAreaView style={styles.container} testID="screen-Home">
      <ImageBackground
        source={{ uri: 'https://nsfgym.de/wp-content/uploads/2021/03/s2.jpg' }}
        style={styles.coverImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <PageTitle title={t.welcomeBack.replace('{name}', user?.name || 'Member')} style={styles.titleOverlay} />
          {/* Business Selection Dropdown */}
          <BusinessDropdown style={styles.businessDropdown} />
        </View>
      </ImageBackground>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.quickStats}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{gymData.workoutsThisWeek}</Text>
              <Text style={styles.statLabel}>{t.thisWeek}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{gymData.totalWorkouts}</Text>
              <Text style={styles.statLabel}>{t.totalWorkouts}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{gymData.membershipDaysLeft}</Text>
              <Text style={styles.statLabel}>{t.daysLeft}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{gymData.currentStreak}</Text>
              <Text style={styles.statLabel}>{t.dayStreak}</Text>
            </View>
          </View>
        </View>

        {/* Next Class */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.nextClass}</Text>
          <View style={styles.nextClassCard}>
            <Text style={styles.className}>{gymData.nextClass.name}</Text>
            <Text style={styles.classTime}>{gymData.nextClass.time}</Text>
            <Text style={styles.classInstructor}>{t.with} {gymData.nextClass.instructor}</Text>
          </View>
        </View>

        {/* Upcoming Classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.upcomingClasses}</Text>
          {gymData.upcomingClasses.map((classItem, index) => (
            <View key={index} style={styles.classItem}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classDay}>{classItem.day}</Text>
              </View>
              <Text style={styles.classTime}>{classItem.time}</Text>
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.recentAchievements}</Text>
          {gymData.recentAchievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Text style={styles.achievementText}>🏆 {achievement}</Text>
            </View>
          ))}
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
  coverImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  titleOverlay: {
    color: '#e96315',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 30,
    marginBottom: 0
  },
  businessDropdown: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 10,
    width: Dimensions.get('screen').width - 40,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 99, 21, 0.6)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(233, 99, 21, 0.2)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(233, 99, 21, 0.4)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e96315',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  nextClassCard: {
    backgroundColor: 'rgba(233, 99, 21, 0.2)',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 99, 21, 0.4)',
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  classTime: {
    fontSize: 16,
    color: '#e96315',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  classInstructor: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  classItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(233, 99, 21, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 99, 21, 0.3)',
  },
  classInfo: {
    flex: 1,
  },
  classDay: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  achievementItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(233, 99, 21, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 99, 21, 0.3)',
  },
  achievementText: {
    fontSize: 14,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 