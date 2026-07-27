// MediscanApp/LoginScreen.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './record'; // Your initialized Firebase Auth instance

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isRegistering) {
                // Registration Logic
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "Account created! You are now logged in.");
            } else {
                // Login Logic
                await signInWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "Successfully logged in!");
            }
        } catch (error) {
            // Display Firebase error messages to the user
            const errorCode = error.code;
            const errorMessage = error.message.replace(/Firebase: /, ''); // Clean up the message
            
            Alert.alert("Authentication Failed", errorMessage);
            console.error(errorCode, errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistering ? 'Register Account' : 'Sign In'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={loading ? "Processing..." : (isRegistering ? "Register" : "Sign In")}
                onPress={handleAuth}
                disabled={loading || !email || !password}
                color="#007bff"
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                    {isRegistering ? "Already have an account?" : "Need an account?"}
                </Text>
                <Button
                    title={isRegistering ? "Sign In" : "Register"}
                    onPress={() => setIsRegistering(!isRegistering)}
                    color="#6c757d"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    switchContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    switchText: {
        marginBottom: 10,
        fontSize: 16,
    },
});

export default LoginScreen;