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
import * as Notifications from 'expo-notifications';

// ✅ Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const VolunteerScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notifiedVictims, setNotifiedVictims] = useState<Set<string>>(new Set());
  const radius = 50 * 1609.34; // 50 miles in meters

  // ✅ Fetch volunteer's current location
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

  // ✅ Validate form before submission
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Volunteer Data to Backend
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('https://cuh-gilt.vercel.app/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, type: "volunteer", location }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", data.message);
          checkProximity();
        } else {
          Alert.alert("Error", data.error || "Failed to submit data.");
        }
      } catch (error) {
        console.error("Error submitting volunteer info:", error);
        Alert.alert("Error", "Something went wrong.");
      }
    }
  };

  // ✅ Check Proximity Between Volunteers and Victims & Send Notifications
  const checkProximity = async () => {
    try {
      const response = await fetch('https://cuh-gilt.vercel.app/api/help-requests');
      if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched Help Requests:", data);

      const volunteerCoords = location?.split(', ').map(parseFloat);
      if (!volunteerCoords) return;

      const volunteerLat = volunteerCoords[0];
      const volunteerLng = volunteerCoords[1];

      for (const victim of data) {
        const victimCoords = victim.location.split(', ').map(parseFloat);
        const victimLat = victimCoords[0];
        const victimLng = victimCoords[1];

        const distance = getDistance(volunteerLat, volunteerLng, victimLat, victimLng);

        if (distance <= radius && !notifiedVictims.has(victim.id)) {
          console.log(`🔔 Volunteer within range! Sending notification...`);
          await sendNotification(victim.id);
        }
      }
    } catch (error) {
      console.error("Error fetching help requests:", error);
    }
  };

  // ✅ Function to Send Notification to Nearby Volunteers (Ensures One Notification)
  const sendNotification = async (victimId: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Help Request Nearby!",
        body: "A person in need is within 50 miles of your location. Please check the map!",
      },
      trigger: null,
    });

    setNotifiedVictims((prev) => new Set(prev).add(victimId));
  };

  // ✅ Function to Calculate Distance Between Two Coordinates
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // ✅ Clear All Fields (EXCEPT LOCATION)
  const handleClear = () => {
    setName('');
    setPhone('');
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🤝 Volunteer</Text>

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

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>🟢 Submit Volunteer Info</Text>
      </TouchableOpacity>

      {/* Clear Button */}
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.buttonText}>🔄 Clear Fields</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Define Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a202c', padding: 20 },
  header: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  locationBox: { backgroundColor: '#374151', padding: 12, borderRadius: 8, marginBottom: 10 },
  locationText: { color: 'white', fontSize: 16 },
  errorText: { color: '#f87171', fontSize: 14, marginBottom: 10 },
  submitButton: { backgroundColor: '#16a34a', padding: 18, borderRadius: 8, marginBottom: 10 },
  clearButton: { backgroundColor: '#6b7280', padding: 18, borderRadius: 8, marginBottom: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
});

export default VolunteerScreen;
