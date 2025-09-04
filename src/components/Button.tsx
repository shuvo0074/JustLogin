import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  containerStyle,
  textStyle,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    containerStyle,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={`button-${title.toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#007AFF'}
          size="small"
        />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 50,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  // Text styles for variants
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  dangerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Text styles for sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled state
  disabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
  text: {
    fontWeight: 'bold',
  },
}); 