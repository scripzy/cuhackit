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
  const radius = 50 * 1609.34; // 50 miles converted to meters

  // ✅ Fetch User Location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching user location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  // ✅ Fetch Help Requests from Backend
  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await fetch('https://cuh-gilt.vercel.app/api/help-requests');

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Help Requests:", data); // ✅ Debugging Log

        setHelpRegions(data.map((h: any) => ({
          latitude: parseFloat(h.location.split(', ')[0]),
          longitude: parseFloat(h.location.split(', ')[1]),
        })));
      } catch (error) {
        console.error("Error fetching help requests:", error);
      }
    };

    fetchHelpRequests();
    const interval = setInterval(fetchHelpRequests, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch Volunteers from Backend
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch('https://cuh-gilt.vercel.app/api/users');

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Volunteers:", data); // ✅ Debugging Log

        setVolunteerRegions(data.map((v: any) => ({
          latitude: parseFloat(v.location.split(', ')[0]),
          longitude: parseFloat(v.location.split(', ')[1]),
        })));
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      }
    };

    fetchVolunteers();
    const interval = setInterval(fetchVolunteers, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗺️ View Map</Text>

      {/* 📌 Map Key */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendHeader}>📌 Map Key:</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "rgba(255, 0, 0, 0.8)" }]} />
          <Text style={styles.legendText}>Victims of Natural Disasters</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "rgba(0, 0, 255, 0.8)" }]} />
          <Text style={styles.legendText}>Available Volunteers</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "rgba(128, 0, 128, 0.8)" }]} />
          <Text style={styles.legendText}>Active Volunteers Near Victims</Text>
        </View>
      </View>

      {/* 🗺️ Map & Loading Indicator */}
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
          {/* 📍 User Location Marker */}
          <Marker coordinate={location} title="You are here" />

          {/* 🔵 Volunteer Highlights */}
          {volunteerRegions.map((region, index) => (
            <Circle
              key={`volunteer-${index}`}
              center={region}
              radius={radius}
              strokeColor="rgba(0, 0, 255, 0.8)" // Blue border
              fillColor="rgba(0, 0, 255, 0.1)"   // Transparent blue fill
            />
          ))}

          {/* 🔴 Help Request Highlights */}
          {helpRegions.map((region, index) => (
            <Circle
              key={`help-${index}`}
              center={region}
              radius={radius}
              strokeColor="rgba(255, 0, 0, 0.8)" // Red border
              fillColor="rgba(255, 0, 0, 0.1)"   // Transparent red fill
            />
          ))}

          {/* 🟣 Overlapping Regions (Active Volunteers Near Victims) */}
          {helpRegions.map((helpRegion, hIndex) =>
            volunteerRegions.map((volunteerRegion, vIndex) => {
              const distance = Math.sqrt(
                Math.pow(helpRegion.latitude - volunteerRegion.latitude, 2) +
                Math.pow(helpRegion.longitude - volunteerRegion.longitude, 2)
              );

              // Render the purple highlight if the volunteer is within the help request radius
              if (distance < radius / 111139) { // Convert meters to degrees
                return (
                  <Circle
                    key={`overlap-${hIndex}-${vIndex}`}
                    center={helpRegion} // Center on help request
                    radius={radius}
                    strokeColor="rgba(128, 0, 128, 0.8)" // Purple border
                    fillColor="rgba(128, 0, 128, 0.1)"   // Transparent purple fill
                  />
                );
              }
              return null;
            })
          )}
        </MapView>
      )}
    </View>
  );
};

// ✅ Styles
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
    marginBottom: 10,
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
