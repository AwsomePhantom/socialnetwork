import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // New: track initial load

  useEffect(() => {
    // Check for saved user on app launch
    const loadStorageData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user_data');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsInitializing(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user_data');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
