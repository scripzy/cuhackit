import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet 
} from 'react-native';

const FindHelpScreen: React.FC = () => {
  // Define state variables with explicit TypeScript types
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [helpType, setHelpType] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation Function
  const validateForm = (): boolean => {
    let newErrors: { [key: string]: string } = {}; // Ensures object has correct type

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must contain only letters';
    }
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!helpType.trim()) {
      newErrors.helpType = 'Please describe the type of help needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Handle Form Submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Help Request Submitted:', { name, phone, location, helpType });
      Alert.alert("Success", "Your help request has been submitted!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❗ Find Help</Text>

      {/* Name Input */}
      <Text style={styles.label}>📄 Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Phone Input */}
      <Text style={styles.label}>📞 Phone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* Location Input */}
      <Text style={styles.label}>📍 Location:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your location"
        value={location}
        onChangeText={setLocation}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      {/* Type of Help Input */}
      <Text style={styles.label}>🆘 Type of Help:</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the type of help you need"
        value={helpType}
        onChangeText={setHelpType}
      />
      {errors.helpType && <Text style={styles.errorText}>{errors.helpType}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>🔴 Submit Help Request</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.buttonText}>❌ Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Define Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c', // Equivalent to bg-gray-900
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#dc2626', // Red for emergency requests
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#6b7280', // Gray
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f87171', // Red error text
    marginBottom: 10,
    fontSize: 14,
  },
});

export default FindHelpScreen;
