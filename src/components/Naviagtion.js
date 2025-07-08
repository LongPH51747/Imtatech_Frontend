// Navigation.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import EditUser from './EditUser';
import PlantGuide from './PlantGuide';
import TransactionHistory from './TransactionHistory';
import Address from './Address';
import Profile from '../screens/Profile';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="EditUser" component={EditUser} />
        <Stack.Screen name="PlantGuide" component={PlantGuide} />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;