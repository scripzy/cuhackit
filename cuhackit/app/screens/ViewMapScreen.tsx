import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const ViewMapScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [volunteerRegions, setVolunteerRegions] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [helpRegions, setHelpRegions] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const radius = 50 * 1609.34; // Default radius of 50 miles converted to meters

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

  // Simulated data for volunteers and victims
  useEffect(() => {
    if (location) {
      setVolunteerRegions([{ latitude: location.latitude, longitude: location.longitude }]);
      setHelpRegions([{ latitude: location.latitude + 0.2, longitude: location.longitude - 0.2 }]);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗺️ View Map</Text>

      {/* Map Key (Moved Above the Map) */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendHeader}>📌 Map Key:</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "rgba(255, 0, 0, 0.8)" }]} />
          <Text style={styles.legendText}>Victims of Natural Disasters</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "rgba(0, 255, 0, 0.8)" }]} />
          <Text style={styles.legendText}>Available Volunteers</Text>
        </View>
      </View>

      {/* Map & Loading Indicator */}
      {loading || !location ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
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
              radius={radius}
              strokeColor="rgba(0, 255, 0, 0.8)"
              fillColor="rgba(0, 255, 0, 0.3)"
            />
          ))}

          {/* Help Request Highlight (Red) */}
          {helpRegions.map((region, index) => (
            <Circle
              key={`help-${index}`}
              center={region}
              radius={radius}
              strokeColor="rgba(255, 0, 0, 0.8)"
              fillColor="rgba(255, 0, 0, 0.3)"
            />
          ))}
        </MapView>
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
  legendContainer: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10, // Keeps it above the map
    alignItems: 'center',
  },
  legendHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    color: 'white',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
});

export default ViewMapScreen;
