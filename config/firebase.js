// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9cJ5WFNeKOvujmvgfjZ3yrmhAI6TR2WI",
  authDomain: "f-i-t-match-po1xi1.firebaseapp.com",
  databaseURL:
    "https://f-i-t-match-po1xi1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "f-i-t-match-po1xi1",
  storageBucket: "f-i-t-match-po1xi1.firebasestorage.app", // Corrected storageBucket format
  messagingSenderId: "300620800683",
  appId: "1:300620800683:web:7ebd71aab7720dc1264dee",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(firebaseApp);
