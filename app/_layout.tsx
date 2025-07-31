// app/_layout.tsx
import useUserActive from "@/customHooks/useUserActive";
import { persistor, store } from "@/store/store";
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
    // Kavivanar
    "Kavivanar-Regular": require("../assets/fonts/Kavivanar-Regular.ttf"),

    // Roboto Condensed
    "RobotoCondensed-Black": require("../assets/fonts/Roboto_Condensed-Black.ttf"),
    "RobotoCondensed-BlackItalic": require("../assets/fonts/Roboto_Condensed-BlackItalic.ttf"),
    "RobotoCondensed-Bold": require("../assets/fonts/Roboto_Condensed-Bold.ttf"),
    "RobotoCondensed-BoldItalic": require("../assets/fonts/Roboto_Condensed-BoldItalic.ttf"),
    "RobotoCondensed-ExtraBold": require("../assets/fonts/Roboto_Condensed-ExtraBold.ttf"),
    "RobotoCondensed-ExtraBoldItalic": require("../assets/fonts/Roboto_Condensed-ExtraBoldItalic.ttf"),
    "RobotoCondensed-ExtraLight": require("../assets/fonts/Roboto_Condensed-ExtraLight.ttf"),
    "RobotoCondensed-ExtraLightItalic": require("../assets/fonts/Roboto_Condensed-ExtraLightItalic.ttf"),
    "RobotoCondensed-Italic": require("../assets/fonts/Roboto_Condensed-Italic.ttf"),
    "RobotoCondensed-Light": require("../assets/fonts/Roboto_Condensed-Light.ttf"),
    "RobotoCondensed-LightItalic": require("../assets/fonts/Roboto_Condensed-LightItalic.ttf"),
    "RobotoCondensed-Medium": require("../assets/fonts/Roboto_Condensed-Medium.ttf"),
    "RobotoCondensed-MediumItalic": require("../assets/fonts/Roboto_Condensed-MediumItalic.ttf"),
    "RobotoCondensed-Regular": require("../assets/fonts/Roboto_Condensed-Regular.ttf"),
    "RobotoCondensed-SemiBold": require("../assets/fonts/Roboto_Condensed-SemiBold.ttf"),
    "RobotoCondensed-SemiBoldItalic": require("../assets/fonts/Roboto_Condensed-SemiBoldItalic.ttf"),
    "RobotoCondensed-Thin": require("../assets/fonts/Roboto_Condensed-Thin.ttf"),
    "RobotoCondensed-ThinItalic": require("../assets/fonts/Roboto_Condensed-ThinItalic.ttf"),

    // Roboto SemiCondensed
    "RobotoSemiCondensed-Black": require("../assets/fonts/Roboto_SemiCondensed-Black.ttf"),
    "RobotoSemiCondensed-BlackItalic": require("../assets/fonts/Roboto_SemiCondensed-BlackItalic.ttf"),
    "RobotoSemiCondensed-Bold": require("../assets/fonts/Roboto_SemiCondensed-Bold.ttf"),
    "RobotoSemiCondensed-BoldItalic": require("../assets/fonts/Roboto_SemiCondensed-BoldItalic.ttf"),
    "RobotoSemiCondensed-ExtraBold": require("../assets/fonts/Roboto_SemiCondensed-ExtraBold.ttf"),
    "RobotoSemiCondensed-ExtraBoldItalic": require("../assets/fonts/Roboto_SemiCondensed-ExtraBoldItalic.ttf"),
    "RobotoSemiCondensed-ExtraLight": require("../assets/fonts/Roboto_SemiCondensed-ExtraLight.ttf"),
    "RobotoSemiCondensed-ExtraLightItalic": require("../assets/fonts/Roboto_SemiCondensed-ExtraLightItalic.ttf"),
    "RobotoSemiCondensed-Italic": require("../assets/fonts/Roboto_SemiCondensed-Italic.ttf"),
    "RobotoSemiCondensed-Light": require("../assets/fonts/Roboto_SemiCondensed-Light.ttf"),
    "RobotoSemiCondensed-LightItalic": require("../assets/fonts/Roboto_SemiCondensed-LightItalic.ttf"),
    "RobotoSemiCondensed-Medium": require("../assets/fonts/Roboto_SemiCondensed-Medium.ttf"),
    "RobotoSemiCondensed-MediumItalic": require("../assets/fonts/Roboto_SemiCondensed-MediumItalic.ttf"),
    "RobotoSemiCondensed-Regular": require("../assets/fonts/Roboto_SemiCondensed-Regular.ttf"),
    "RobotoSemiCondensed-SemiBold": require("../assets/fonts/Roboto_SemiCondensed-SemiBold.ttf"),
    "RobotoSemiCondensed-SemiBoldItalic": require("../assets/fonts/Roboto_SemiCondensed-SemiBoldItalic.ttf"),
    "RobotoSemiCondensed-Thin": require("../assets/fonts/Roboto_SemiCondensed-Thin.ttf"),
    "RobotoSemiCondensed-ThinItalic": require("../assets/fonts/Roboto_SemiCondensed-ThinItalic.ttf"),

    // Roboto
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("../assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("../assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-ExtraBoldItalic": require("../assets/fonts/Roboto-ExtraBoldItalic.ttf"),
    "Roboto-ExtraLightItalic": require("../assets/fonts/Roboto-ExtraLightItalic.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("../assets/fonts/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("../assets/fonts/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-SemiBoldItalic": require("../assets/fonts/Roboto-SemiBoldItalic.ttf"),
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("../assets/fonts/Roboto-ThinItalic.ttf"),

    "Inter_18pt-Regular": require("../assets/fonts/Inter/Inter_18pt-Regular.ttf"),
    "Inter_18pt-Medium": require("../assets/fonts/Inter/Inter_18pt-Medium.ttf"),
    "Inter_18pt-Light": require("../assets/fonts/Inter/Inter_18pt-Light.ttf"),
    "Inter_18pt-Bold": require("../assets/fonts/Inter/Inter_18pt-Bold.ttf"),
    "Inter_18pt-SemiBold": require("../assets/fonts/Inter/Inter_18pt-SemiBold.ttf"),
    "Inter_18pt-Thin": require("../assets/fonts/Inter/Inter_18pt-Thin.ttf"),

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
    </Provider>
  );
}
