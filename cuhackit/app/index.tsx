import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { MotiView } from 'moti';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🏠 Disaster Relief App</Text>

      {/* Buttons with Bounce Effect */}
      {[
        { label: "🔴 Find Help", color: "#dc2626", href: "/screens/FindHelpScreen" },
        { label: "🟢 Volunteer", color: "#16a34a", href: "/screens/VolunteerScreen" },
        { label: "🔵 View Map", color: "#2563eb", href: "/screens/ViewMapScreen" },
      ].map((button, index) => (
        <MotiView
          key={index}
          from={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 120 }}
          style={styles.buttonContainer}
        >
          <Link href={button.href} asChild>
            <TouchableOpacity style={[styles.button, { backgroundColor: button.color }]}>
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          </Link>
        </MotiView>
      ))}
    </View>
  );
};

// ✅ Define Styles (Matching VolunteerScreen.tsx)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c', // Dark Gray Background
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
