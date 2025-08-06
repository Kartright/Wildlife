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
import UserDetailsScreen from '../screens/UserDetailsScreen.jsx';


const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();


function AuthNavigator() {
  	return(
    	<AuthStack.Navigator screenOptions={{ headerShown: false }}>
      		<AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      		<AuthStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
    	</AuthStack.Navigator>
  	);
};


function AppNavigator() {
    return (
    	<AppStack.Navigator>
        	<AppStack.Screen name="Home" component={HomeScreen} options={{ title: 'Wildlife' }} />
        	<AppStack.Screen name="Detail" component={DetailScreen} options={{ title: 'Place Details' }} />
        	<AppStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        	<AppStack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Add Location' }} />
			<AppStack.Screen name="UserDetails" component={UserDetailsScreen} options={{ title: 'Details' }} />
      	</AppStack.Navigator>
  	);
};


export default function Index() {
  	const user = useAuth();
  	console.log(user);
  	return(
    	<>
    		{user ? <AppNavigator /> : <AuthNavigator />}
    	</>
  	);
};
