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

onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return () => subscription.remove();
}); // auto refetch integration for React Native :contentReference[oaicite:5]{index=5}

export default function RootLayout() {
  useUserActive();
  const [fontsLoaded] = useFonts({
    // Essential fonts only - load others dynamically as needed
    "Kavivanar-Regular": require("../assets/fonts/Kavivanar-Regular.ttf"),
    "RobotoCondensed-Regular": require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    "RobotoCondensed-Bold": require("../assets/fonts/Roboto_Condensed-Bold.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
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
    if (fontsLoaded) SplashScreen.hide();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                {/* Define your Offline404 screen */}
                <Stack.Screen name="Offline404" />
              </Stack>
              <Toast />
            </GestureHandlerRootView>
          </PersistGate>
        </QueryClientProvider>
      </ErrorBoundary>
    </Provider>
  );
}
