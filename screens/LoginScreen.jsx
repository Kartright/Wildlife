import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { signInUser } from '../authService';

export default function LoginScreen({ navigation }) {
  //Email and Password variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);


  // Sign in exisitng user and navigate to the home menu
  const handleLogin = async () => {
    try {
      const user = await signInUser(email, password);
      console.log("Signed in successfully", user);
      navigation.navigate("Home");
    } catch (error) {
      setLoginError(error.message);
      console.log(error.message);
    }
  };


  return (
    <View sytles={StyleSheet.container}>
      <Text sytles={styles.subtitle}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text sytels={styles.subtitle}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")}/>
      <Button title="Sign In" onPress={handleLogin}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: { fontSize: 18, marginTop: 10 },
  input: { borderWidth: 1, padding: 5, marginVertical: 5 },
});