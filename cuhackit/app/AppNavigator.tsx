// filepath: /Users/tristanyi/Desktop/comp-sci/cuhackitproj/cuhackit/cuhackit/app/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './index';
import FindHelpScreen from './screens/FindHelpScreen';
import VolunteerScreen from './screens/VolunteerScreen';
import ViewMapScreen from './screens/ViewMapScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FindHelp" component={FindHelpScreen} />
        <Stack.Screen name="Volunteer" component={VolunteerScreen} />
        <Stack.Screen name="ViewMap" component={ViewMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;