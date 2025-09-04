import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';

interface PageTitleProps {
  title: string;
  style?: TextStyle;
  variant?: 'large' | 'medium' | 'small';
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  style,
  variant = 'large',
}) => {
  return (
    <Text style={[styles.title, styles[variant], style]}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  large: {
    fontSize: 28,
    marginBottom: 40,
  },
  medium: {
    fontSize: 24,
    marginBottom: 30,
  },
  small: {
    fontSize: 20,
    marginBottom: 20,
  },
}); 