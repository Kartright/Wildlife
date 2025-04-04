import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { signUpUser } from '../authService';

export default function SignUpScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [signUpError, setSignUpError] = useState(null);

    const handleSignUp = async () => {
        console.log("Signing someone in!");
        try{
            const user = await signUpUser(email, password, username);
            console.log("Signed up successfully", user);
            navigation.navigate("Home");
        } catch (error) {
            setSignUpError(error.message);
            console.log(error.message);
        }
    };

    return(
        <View styles={styles.container}>
            <Text styles={styles.subtitle}>Username</Text>
            <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            />
            <Text styles={styles.subtitle}>Email</Text>
            <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            />
            <Text styles={styles.subtitle}>Password</Text>
            <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            />
            <Button title="Sign Up" onPress={handleSignUp}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    subtitle: { fontSize: 18, marginTop: 10 },
    input: { borderWidth: 1, padding: 5, marginVertical: 5 },
});