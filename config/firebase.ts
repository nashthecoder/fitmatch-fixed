// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Platform-specific imports
let auth: any;

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with platform-specific persistence
try {
  if (Platform.OS === 'web') {
    // For web, use the default Firebase Auth (browser persistence)
    const { getAuth } = require("firebase/auth");
    auth = getAuth(firebaseApp);
  } else {
    // For React Native platforms, use AsyncStorage persistence
    const { getReactNativePersistence, initializeAuth } = require("firebase/auth");
    const ReactNativeAsyncStorage = require("@react-native-async-storage/async-storage").default;
    
    auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  }
} catch (error) {
  console.warn('Firebase Auth initialization failed:', error);
  // Create a mock auth object for development
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {},
  };
}

export { auth };

// Initialize Firestore
export const db = getFirestore(firebaseApp);
