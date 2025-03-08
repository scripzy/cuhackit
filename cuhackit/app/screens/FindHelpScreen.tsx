import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import * as Location from 'expo-location';

const FindHelpScreen: React.FC = () => {
  // Define state variables
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type_of_help, setTypeOfHelp] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ✅ Fetch user's location on mount
  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          location: 'Location permission denied',
        }));
        setLoadingLocation(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(`${userLocation.coords.latitude}, ${userLocation.coords.longitude}`);
      setLoadingLocation(false);
    };

    fetchLocation();
  }, []);

  // ✅ Validation Function
  const validateForm = (): boolean => {
    let newErrors: { [key: string]: string } = {};

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must contain only letters';
    }
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!location) {
      newErrors.location = 'Location is required';
    }
    if (!type_of_help.trim()) {
      newErrors.type_of_help = 'Please describe the type of help needed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Help Request to Backend
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('https://cuh-gilt.vercel.app/api/help-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, location, type_of_help }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", data.message);
        } else {
          Alert.alert("Error", data.error || "Failed to submit request.");
        }
      } catch (error) {
        console.error("Error submitting help request:", error);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  // ✅ Clear All Fields (EXCEPT LOCATION)
  const handleClear = () => {
    setName('');
    setPhone('');
    setTypeOfHelp('');
    setErrors({}); // Reset errors but keep location
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❗ Find Help</Text>

      <Text style={styles.label}>📄 Name:</Text>
      <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>📞 Phone:</Text>
      <TextInput style={styles.input} placeholder="Enter your phone number" keyboardType="numeric" value={phone} onChangeText={setPhone} maxLength={10} />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <Text style={styles.label}>📍 Location:</Text>
      <View style={styles.locationBox}>
        {loadingLocation ? <ActivityIndicator size="small" color="#ffffff" /> : <Text style={styles.locationText}>{location ? location : 'Fetching location...'}</Text>}
      </View>
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <Text style={styles.label}>🆘 Type of Help:</Text>
      <TextInput style={styles.input} placeholder="Describe the type of help you need" value={type_of_help} onChangeText={setTypeOfHelp} />
      {errors.type_of_help && <Text style={styles.errorText}>{errors.type_of_help}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>🔴 Submit Help Request</Text>
      </TouchableOpacity>

      {/* Clear Button */}
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.buttonText}>🔄 Clear Fields</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ **Define Styles**
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a202c', padding: 20 },
  header: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  locationBox: { backgroundColor: '#374151', padding: 12, borderRadius: 8, marginBottom: 10 },
  locationText: { color: 'white', fontSize: 16 },
  errorText: { color: '#f87171', fontSize: 14, marginBottom: 10 },
  submitButton: { backgroundColor: '#dc2626', padding: 18, borderRadius: 8, marginBottom: 10 },
  clearButton: { backgroundColor: '#6b7280', padding: 18, borderRadius: 8, marginBottom: 10 }, // ✅ New Clear Button
  buttonText: { color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
});

export default FindHelpScreen;
