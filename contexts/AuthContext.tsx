import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const CREDENTIALS_KEY = 'auth_credentials';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isBiometricEnabled: boolean;
  isBiometricAvailable: boolean;
  toggleBiometric: () => Promise<void>;
  signInWithBiometric: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [currentCredentials, setCurrentCredentials] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check biometric availability
    checkBiometricAvailability();
    loadBiometricPreference();

    return () => subscription.unsubscribe();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(hasHardware && isEnrolled);
  };

  const loadBiometricPreference = async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(enabled === 'true');
      if (enabled === 'true') {
        // Try to load stored credentials
        await getStoredCredentials();
      }
    } catch (error) {
      console.error('Error loading biometric preference:', error);
    }
  };

  const storeCredentials = async (email: string, password: string) => {
    try {
      const credentials = { email, password };
      await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials));
      setCurrentCredentials(credentials);
    } catch (error) {
      console.error('Error storing credentials:', error);
      throw new Error('Failed to store credentials securely');
    }
  };

  const getStoredCredentials = async () => {
    try {
      const credentialsStr = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      if (!credentialsStr) return null;
      
      const credentials = JSON.parse(credentialsStr);
      setCurrentCredentials(credentials);
      return credentials;
    } catch (error) {
      console.error('Error getting stored credentials:', error);
      return null;
    }
  };

  const toggleBiometric = async () => {
    if (!isBiometricEnabled) {
      // When enabling biometric, verify the user's identity first
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
        fallbackLabel: 'Use password instead',
      });

      if (result.success && session?.user?.email && currentCredentials) {
        // Store credentials securely when enabling biometric
        await storeCredentials(currentCredentials.email, currentCredentials.password);
        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
        setIsBiometricEnabled(true);
      }
    } else {
      // When disabling biometric, remove stored credentials and update preference
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
      setCurrentCredentials(null);
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
      setIsBiometricEnabled(false);
    }
  };

  const signInWithBiometric = async () => {
    if (!isBiometricEnabled || !isBiometricAvailable) {
      throw new Error('Biometric authentication is not available');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Verify your identity',
      fallbackLabel: 'Use password instead',
    });

    if (!result.success) {
      throw new Error('Biometric authentication failed');
    }

    // Get stored credentials
    const credentials = await getStoredCredentials();
    if (!credentials) {
      throw new Error('No stored credentials found');
    }

    // Sign in with stored credentials
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Store credentials in memory and securely if biometric is enabled
    setCurrentCredentials({ email, password });
    if (isBiometricEnabled) {
      await storeCredentials(email, password);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear credentials from memory
    setCurrentCredentials(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        loading, 
        signUp, 
        signIn, 
        signOut,
        isBiometricEnabled,
        isBiometricAvailable,
        toggleBiometric,
        signInWithBiometric,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 