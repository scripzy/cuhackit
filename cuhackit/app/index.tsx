// src/screens/HomeScreen.js - Home screen UI
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-900 items-center justify-center p-5">
      {/* Header */}
      <Text className="text-white text-2xl font-bold mb-6">🏠 Disaster Relief App</Text>
      
      {/* Buttons */}
      <Link
        className="w-full bg-red-600 p-4 rounded-xl mb-4"
        href={"/screens/FindHelpScreen"}
      >
        🔴 Find Help
      </Link>
      
      <Link
        className="w-full bg-green-600 p-4 rounded-xl mb-4"
        href={"/screens/FindHelpScreen"}
      >
        <Text className="text-white text-center text-lg">🟢 Volunteer</Text>
      </Link>
      
      <Link
        className="w-full bg-blue-600 p-4 rounded-xl"
        href={"/screens/ViewMapScreen"}
      >
        <Text className="text-white text-center text-lg">🔵 View Map</Text>
      </Link>
    </View>
  );
};

export default HomeScreen;
