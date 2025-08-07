// app/_layout.tsx
import useUserActive from "@/customHooks/useUserActive";
import { persistor, store } from "@/store/store";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Network from "expo-network";
import { SplashScreen, Stack, router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, AppState, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css";
// Import your Offline404 screen at app/Offline404.tsx
// which shows "404" and "Vous n'êtes pas connecté à Internet"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

// Platform-specific online manager setup
if (Platform.OS !== 'web') {
  onlineManager.setEventListener((setOnline) => {
    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected);
    });
    return () => subscription.remove();
  });
} else {
  // For web, use the browser's online/offline events
  onlineManager.setEventListener((setOnline) => {
    // Check if window is available (browser environment)
    if (typeof window !== 'undefined') {
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else {
      // Fallback for server-side rendering
      return () => {};
    }
  });
}

// Component that uses Redux hooks - must be inside Provider
function AppContent() {
  useUserActive();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* Define your Offline404 screen */}
        <Stack.Screen name="Offline404" />
      </Stack>
      <Toast />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  // Always load fonts, but with fallback for web
  const [fontsLoaded] = useFonts({
    "Kavivanar-Regular": require("../assets/fonts/Kavivanar-Regular.ttf"),
    "RobotoCondensed-Regular": require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    "RobotoCondensed-Bold": require("../assets/fonts/Roboto_Condensed-Bold.ttf"),
    "RobotoCondensed-Light": require("../assets/fonts/Roboto_Condensed-Light.ttf"),
    "RobotoCondensed-LightItalic": require("../assets/fonts/Roboto_Condensed-LightItalic.ttf"),
    "RobotoCondensed-Medium": require("../assets/fonts/Roboto_Condensed-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
    "Inter_18pt-Regular": require("../assets/fonts/Inter/Inter_18pt-Regular.ttf"),
    "Inter_18pt-Bold": require("../assets/fonts/Inter/Inter_18pt-Bold.ttf"),
    "Reddit_Sans-Bold": require("../assets/fonts/reddit-sans/RedditSans-Bold.ttf"),
  });

  useEffect(() => {
    const sub = AppState.addEventListener("change", (status) => {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    // subscribe to online state and redirect if offline
    const unsubscribe = onlineManager.subscribe((isOnline) => {
      if (isOnline === false) {
        router.replace("/Offline404");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      // Platform-specific splash screen handling
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync();
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
            <AppContent />
          </PersistGate>
        </QueryClientProvider>
      </ErrorBoundary>
    </Provider>
  );
}
