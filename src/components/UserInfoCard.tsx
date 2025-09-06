import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserInfoCardProps {
  user: UserInfo | null;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  showId?: boolean;
  showTimestamps?: boolean;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  containerStyle,
  labelStyle,
  valueStyle,
  showId = true,
  showTimestamps = false,
}) => {
  const { t } = useLanguage();
  
  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{t.nameLabel}</Text>
      <Text style={[styles.value, valueStyle]}>{user.name}</Text>
      
      <Text style={[styles.label, labelStyle]}>{t.emailLabel}</Text>
      <Text style={[styles.value, valueStyle]}>{user.email}</Text>
      
      {showId && (
        <>
          <Text style={[styles.label, labelStyle]}>{t.userIdLabel}</Text>
          <Text style={[styles.value, valueStyle]}>{user.id}</Text>
        </>
      )}

      {showTimestamps && user.createdAt && (
        <>
          <Text style={[styles.label, labelStyle]}>{t.createdLabel}</Text>
          <Text style={[styles.value, valueStyle]}>{user.createdAt}</Text>
        </>
      )}

      {showTimestamps && user.updatedAt && (
        <>
          <Text style={[styles.label, labelStyle]}>{t.updatedLabel}</Text>
          <Text style={[styles.value, valueStyle]}>{user.updatedAt}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
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
    // Glossy effect
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  value: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 