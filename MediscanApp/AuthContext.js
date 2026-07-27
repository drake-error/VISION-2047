// MediscanApp/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './record'; 
import { Platform } from 'react-native'; // ⬅️ NEW: Import Platform to check environment

// 1. Create the Context
const AuthContext = createContext();

// Hook for easy access to auth data
export const useAuth = () => useContext(AuthContext);

// 2. The Provider Component
export const AuthProvider = ({ children }) => {
    // State to hold the current logged-in user object
    const [user, setUser] = useState(null); 
    // Set loading to true only for mobile/native, set to false immediately for web
    const [loading, setLoading] = useState(Platform.OS !== 'web'); // ⬅️ CRITICAL CHANGE

    // Listen for user login/logout changes
    useEffect(() => {
        // If we are on the web, skip the expensive, crashing auth listener setup
        if (Platform.OS === 'web') {
            setLoading(false); // Force web to render immediately
            return;
        }

        // ⬇️ This block only runs on iOS/Android (mobile/native)
        // This Firebase function runs whenever the user's auth status changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Stop loading once status is determined
        });

        // Cleanup subscription on component unmount
        return unsubscribe;
    }, []);

    // ⬇️ If we are on the web, and the user successfully logs in via the form,
    // we need to update the user object manually since the listener is disabled.
    // This is a web-only hack to make the AppNavigator switch screens.
    useEffect(() => {
        if (Platform.OS === 'web' && !loading) {
            // Check if the auth object has a current user after the login button is pressed
            if (auth && auth.currentUser !== user) {
                setUser(auth.currentUser);
            }
        }
    }, [loading, user]); // Run when loading status changes

    const value = {
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};