import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, TextInputProps } from 'react-native';
import { InputField } from './InputField';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  showToggle?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showToggle = true,
  ...props
}) => {
  // Explicitly set initial state to false
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const EyeIcon = useCallback(() => (
    <TouchableOpacity
      style={styles.eyeButton}
      onPress={toggleVisibility}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={styles.eyeIcon}>
        {isVisible ? '🙉' : '🙈'}
      </Text>
    </TouchableOpacity>
  ), [isVisible, toggleVisibility]);

  return (
    <InputField
      {...props}
      secureTextEntry={!isVisible}
      rightComponent={showToggle ? <EyeIcon /> : undefined}
    />
  );
};

const styles = StyleSheet.create({
  eyeButton: {
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
    marginTop: -8,
  },
}); 