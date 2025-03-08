import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';

const ViewMapScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [volunteerRegions, setVolunteerRegions] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [helpRegions, setHelpRegions] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [radius, setRadius] = useState<number>(50); // Default radius in miles

  // Convert miles to meters
  const getRadiusInMeters = (miles: number) => miles * 1609.34;

  // Request location permission & get user's location
  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
      setLoading(false);
    };

    fetchLocation();
  }, []);

  // Simulating data submission (normally, you'd fetch this from a backend)
  useEffect(() => {
    if (location) {
      setVolunteerRegions([{ latitude: location.latitude, longitude: location.longitude }]);
      setHelpRegions([{ latitude: location.latitude + 0.2, longitude: location.longitude - 0.2 }]);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗺️ View Map</Text>

      {/* Radius Selector Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>📍 Select Radius:</Text>
        <RNPickerSelect
          onValueChange={(value) => setRadius(value)}
          items={[
            { label: '10 miles', value: 10 },
            { label: '25 miles', value: 25 },
            { label: '50 miles', value: 50 },
            { label: '100 miles', value: 100 },
          ]}
          value={radius}
          placeholder={{ label: "Select a Radius", value: null }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false} // Fixes Android styling
        />
      </View>

      {/* Map & Loading Indicator */}
      {loading || !location ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.5, // Zoom level
              longitudeDelta: 0.5,
            }}
          >
            {/* User Location Marker */}
            <Marker coordinate={location} title="You are here" />

            {/* Volunteer Highlight (Green) */}
            {volunteerRegions.map((region, index) => (
              <Circle
                key={`volunteer-${index}`}
                center={region}
                radius={getRadiusInMeters(radius)}
                strokeColor="rgba(0, 255, 0, 0.5)"
                fillColor="rgba(0, 255, 0, 0.2)"
              />
            ))}

            {/* Help Request Highlight (Red) */}
            {helpRegions.map((region, index) => (
              <Circle
                key={`help-${index}`}
                center={region}
                radius={getRadiusInMeters(radius)}
                strokeColor="rgba(255, 0, 0, 0.5)"
                fillColor="rgba(255, 0, 0, 0.2)"
              />
            ))}
          </MapView>

          {/* Legend for Map */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>🟢 Volunteers Available</Text>
            <Text style={styles.legendText}>🔴 People Needing Help</Text>
          </View>
        </>
      )}
    </View>
  );
};

// ✅ Define Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c', // Dark gray background
    paddingTop: 40,
  },
  header: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dropdownContainer: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  map: {
    flex: 1,
  },
  legendContainer: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  legendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

// ✅ Fix for Dropdown Not Displaying on Android
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#1f2937',
    paddingRight: 30, // To ensure text is not cut off
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#1f2937',
    paddingRight: 30, // To ensure text is not cut off
  },
});

export default ViewMapScreen;
