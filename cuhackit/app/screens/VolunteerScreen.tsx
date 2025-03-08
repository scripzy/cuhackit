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

const VolunteerScreen: React.FC = () => {
  // Define state variables with explicit TypeScript types
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Request location permission & fetch user's location
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

  // Validation Function
  const validateForm = (): boolean => {
    let newErrors: { [key: string]: string } = {}; // Ensures object has correct type

    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must contain only letters';
    }
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('https://cuh-gilt.vercel.app/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, phone, type: "volunteer", location }),
        });
  
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", data.message);
        } else {
          Alert.alert("Error", data.error || "Failed to submit data.");
        }
      } catch (error) {
        console.error("Error submitting volunteer info:", error);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤝 Volunteer</Text>

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

      {/* Location Display */}
      <Text style={styles.label}>📍 Location:</Text>
      <View style={styles.locationBox}>
        {loadingLocation ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.locationText}>
            {location ? location : 'Fetching location...'}
          </Text>
        )}
      </View>
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>🟢 Submit Volunteer Info</Text>
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
  locationBox: {
    backgroundColor: '#374151', // Gray background for location display
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  locationText: {
    color: 'white',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#16a34a', // Green
    padding: 18, // Same padding as Find Help
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#dc2626', // Red
    padding: 18, // Same padding as Find Help
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20, // Bigger text to match Find Help
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f87171', // Red error text
    marginBottom: 10,
    fontSize: 14,
  },
});

export default VolunteerScreen;