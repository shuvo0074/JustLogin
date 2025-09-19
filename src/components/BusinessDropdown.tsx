import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { selectBusinesses, selectSelectedBusiness, selectBusinessesLoading, setSelectedBusiness } from '../store/slices/businessesSlice';
import { Business } from '../types/business';

interface BusinessDropdownProps {
  style?: any;
}

const BusinessDropdown: React.FC<BusinessDropdownProps> = ({ style }) => {
  const dispatch = useDispatch<AppDispatch>();
  const businesses = useSelector(selectBusinesses);
  const selectedBusiness = useSelector(selectSelectedBusiness);
  const isLoading = useSelector(selectBusinessesLoading);
  
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectBusiness = (business: Business) => {
    dispatch(setSelectedBusiness(business));
    setIsOpen(false);
  };

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedBusiness?.id === item.id && styles.selectedItem
      ]}
      onPress={() => handleSelectBusiness(item)}
    >
      <Text style={[
        styles.itemText,
        selectedBusiness?.id === item.id && styles.selectedItemText
      ]}>
        {item.name}
      </Text>
      {item.description && (
        <Text style={[
          styles.itemDescription,
          selectedBusiness?.id === item.id && styles.selectedItemDescription
        ]}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading businesses...</Text>
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noBusinessesText}>No businesses available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonLabel}>Current Business:</Text>
            <Text style={styles.buttonText}>
              {selectedBusiness?.name || 'Select a business'}
            </Text>
          </View>
          <Text style={styles.arrow}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Business</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={businesses}
              keyExtractor={(item) => item.id}
              renderItem={renderBusinessItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  noBusinessesText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  dropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    minHeight: 50,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: '70%',
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  selectedItemText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedItemDescription: {
    color: '#1976d2',
  },
});

export default BusinessDropdown;
