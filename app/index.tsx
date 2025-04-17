import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import useAuth from '../authService';
import HomeScreen from '../screens/HomeScreen.jsx';
import DetailScreen from '../screens/DetailScreen.jsx';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddLocationScreen from '../screens/AddLocationScreen';

const Stack = createStackNavigator();

export default function Index() {
  const user = useAuth();

  return (

      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Wildlife' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Place Details' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Add Location' }} />
      </Stack.Navigator>

  );
}
