import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient colors={['#1a202c', '#2d3748']} style={styles.container}>
      {/* Animated Title */}
      <MotiText 
        from={{ opacity: 0, translateY: -20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        transition={{ duration: 800 }}
        style={styles.header}
      >
        ⛈️ GoHelpMe
      </MotiText>

      {/* Buttons Positioned Towards the Top */}
      <View style={styles.buttonWrapper}>
        {[
          { label: "❗ Find Help", color: ["#e63946", "#dc2626"], href: "/screens/FindHelpScreen" },
          { label: "🤝 Volunteer", color: ["#16a34a", "#0f9d58"], href: "/screens/VolunteerScreen" },
          { label: "🗺️ View Map", color: ["#2563eb", "#1d4ed8"], href: "/screens/ViewMapScreen" },
        ].map((button, index) => (
          <MotiView
            key={index}
            from={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 120 }}
            style={styles.buttonContainer}
          >
            <Link href={button.href} asChild>
              <TouchableOpacity 
                activeOpacity={0.85} 
                style={styles.touchable}
              >
                <LinearGradient
                  colors={button.color}
                  start={[0, 1]}
                  end={[1, 0]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{button.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </MotiView>
        ))}
      </View>

      {/* Footer with Emergency Contacts & Logos */}
      <View style={styles.footer}>
        <Image source={require('../assets/images/duke.png')} style={styles.logo} />
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerTitle}>Emergency Assistance</Text>
          <Text style={styles.footerSubtitle}>Need urgent help? Call 📞 911</Text>
        </View>
        <Image source={require('../assets/images/clemson.png')} style={styles.logo} />
      </View>
    </LinearGradient>
  );
};

// ✅ Enhanced Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, 
    justifyContent: 'space-between',
  },
  header: {
    color: 'white',
    fontSize: 50, // Slightly smaller title for balance
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: 40, 
    left: 0,
    right: 0,
  },
  buttonWrapper: {
    marginTop: 110, // Adjusted for new button size
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '88%', // Smaller width for a cleaner look
    marginBottom: 18, // Adjusted spacing
  },
  touchable: {
    width: '100%',
    borderRadius: 12,
  },
  button: {
    paddingVertical: 35, // Smaller button height
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 28, // Slightly smaller text
    fontWeight: 'bold',
  },
  // 📌 Styled Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 22, // Reduced footer height slightly
    backgroundColor: '#2d3748',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10, 
  },
  footerTextContainer: {
    alignItems: 'center',
    flex: 1, 
  },
  footerTitle: {
    color: 'white',
    fontSize: 22, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerSubtitle: {
    color: '#d1d5db',
    fontSize: 16, 
    textAlign: 'center',
  },
  logo: {
    width: 55, // Slightly smaller logos
    height: 55,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
