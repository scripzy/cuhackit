import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { MotiView } from 'moti';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Title at the Absolute Top */}
      <Text style={styles.header}>⛈️ GoHelpMe</Text>

      {/* Extra Large Buttons Positioned Towards the Top */}
      <View style={styles.buttonWrapper}>
        {[
          { label: "🔴 Find Help", color: "#dc2626", href: "/screens/FindHelpScreen" },
          { label: "🟢 Volunteer", color: "#16a34a", href: "/screens/VolunteerScreen" },
          { label: "🗺️ View Map", color: "#2563eb", href: "/screens/ViewMapScreen" },
        ].map((button, index) => (
          <MotiView
            key={index}
            from={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 8, stiffness: 100 }}
            style={styles.buttonContainer}
          >
            <Link href={button.href} asChild>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: button.color }]}
                activeOpacity={0.8} // Makes button press more interactive
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            </Link>
          </MotiView>
        ))}
      </View>
    </View>
  );
};

// ✅ Improved Styling for Maximum Visibility & 3D Effect
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c', // Dark Gray Background
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjusted to push everything up
  },
  header: {
    color: 'white',
    fontSize: 55, // Bigger Title
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 20, // Pushes it to the very top
    left: 0,
    right: 0,
  },
  buttonWrapper: {
    marginTop: 80, // Moves buttons closer to the top
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '90%', // Slightly smaller for better spacing
    marginBottom: 30, // More space between buttons
  },
  button: {
    paddingVertical: 40, // Extra Large Buttons
    borderRadius: 12, // Rounded buttons
    alignItems: 'center',
    shadowColor: "#000", // 3D Button Effect
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // For Android shadow effect
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 34, // Bigger text inside buttons
    fontWeight: 'bold',
  },
});

export default HomeScreen;
