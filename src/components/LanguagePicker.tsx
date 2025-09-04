import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Language, useLanguage } from '../contexts/LanguageContext';

interface LanguagePickerProps {
  style?: any;
}

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ style }) => {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languageOptions.find(option => option.code === language);

  const handleLanguageSelect = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setModalVisible(false);
  };

  const renderLanguageOption = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        item.code === language && styles.selectedOption,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
      testID={`language-option-${item.code}`}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text style={[
        styles.optionText,
        item.code === language && styles.selectedOptionText,
      ]}>
        {item.name}
      </Text>
      {item.code === language && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
        testID="language-picker-button"
      >
        <View style={styles.pickerContent}>
          <Text style={styles.flag}>{currentLanguage?.flag}</Text>
          <Text style={styles.pickerText}>{currentLanguage?.name}</Text>
          <Text style={styles.arrow}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        testID="language-picker-modal"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.language}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                testID="close-language-picker"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languageOptions}
              renderItem={renderLanguageOption}
              keyExtractor={(item) => item.code}
              style={styles.optionsList}
              testID="language-options-list"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  pickerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e96315',
    padding: 15,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    color: '#e96315',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e96315',
    width: '100%',
    maxWidth: 300,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#fff3e0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  selectedOptionText: {
    color: '#e96315',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#e96315',
    fontWeight: 'bold',
  },
});
