import BellIcon from "@/components/Icons/TabBar/BellIcon";
import HeartIcon from "@/components/Icons/TabBar/HeartIcon";
import HomeIcon from "@/components/Icons/TabBar/HomeIcon";
import MessageBubbleIcon from "@/components/Icons/TabBar/MessageBubbleIcon";
import ProfileIcon from "@/components/Icons/TabBar/ProfileIcon";
import SearchIcon from "@/components/Icons/TabBar/SearchIcon";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f0e0c",
          borderTopWidth: 2,
          paddingBottom: insets.bottom, // Adjust based on device safe area
          paddingTop: 5,
          height: 60 + insets.bottom, // increase height to account for it
          borderColor: "white",
          overflow: "hidden",
        },

        // tabBarBackground: () => (
        //   <View className="h-[60] w-full overflow-hidden">
        //     <BlurView
        //       blurType="dark"
        //       reducedTransparencyFallbackColor="black"
        //       style={{ position: "absolute", height: 60, width: "100%" }}
        //       blurAmount={10}
        //     />
        //   </View>
        // ),
        tabBarShowLabel: false,
      }}
      initialRouteName="Home"
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: () => {
            return (
              <View className="mt-4">
                <HomeIcon />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          tabBarIcon: () => {
            return <SearchIcon />;
          },
        }}
      />

      <Tabs.Screen
        name="NotificationsScreen"
        options={{
          tabBarIcon: () => {
            return <BellIcon />;
          },
        }}
      />

      <Tabs.Screen
        name="FavoritesScreen"
        options={{
          tabBarIcon: () => {
            return <HeartIcon />;
          },
        }}
      />
      <Tabs.Screen
        name="MessageScreen"
        options={{
          tabBarIcon: () => {
            return <MessageBubbleIcon />;
          },
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        options={{
          tabBarIcon: () => {
            return <ProfileIcon />;
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
