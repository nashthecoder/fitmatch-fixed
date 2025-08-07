import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { isDesktop, isTablet } from "@/helpers/responsive";
import { useResponsive } from "@/customHooks/useResponsive";
import GearIcon from "../Icons/GearIcon";
import HandShakeIcon from "../Icons/HandShakeIcon";

const HeaderBar = () => {
  const { spacing } = useResponsive();
  
  // Responsive dimensions
  const getLogoSize = () => {
    if (isDesktop()) return { width: 80, height: 52 };
    if (isTablet()) return { width: 73, height: 47 };
    return { width: 66, height: 43 };
  };

  const getIconSize = () => {
    if (isDesktop()) return 36;
    if (isTablet()) return 34;
    return 32;
  };

  const getHeaderHeight = () => {
    if (isDesktop()) return 70;
    if (isTablet()) return 65;
    return 60;
  };

  const getMarginTop = () => {
    if (isDesktop()) return 12;
    if (isTablet()) return 10;
    return 8;
  };

  const getHitSlop = () => ({ top: 8, bottom: 8, left: 8, right: 8 });

  return (
    <View 
      className="flex-row items-center justify-between absolute z-10 w-full overflow-hidden"
      style={{ 
        height: getHeaderHeight(),
        marginTop: getMarginTop(),
        paddingHorizontal: spacing(16),
        maxWidth: isDesktop() ? 1200 : undefined,
        alignSelf: isDesktop() ? 'center' : 'stretch',
      }}
      accessibilityRole="banner"
      accessibilityLabel="Header navigation"
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={getLogoSize()}
        resizeMode="cover"
      />
      <View 
        className="flex-row items-center" 
        style={{ 
          gap: spacing(12)
        }}
        accessibilityRole="toolbar"
        accessibilityLabel="Header actions"
      >
        <TouchableOpacity
          hitSlop={getHitSlop()}
          onPress={() => router.navigate("/(root)/Home/NewPost")}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
          accessibilityHint="Opens the new post creation screen"
        >
          <AntDesign name="plus" size={getIconSize()} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity 
          hitSlop={getHitSlop()}
          accessibilityRole="button"
          accessibilityLabel="Partnerships"
          accessibilityHint="View partnership options"
        >
          <HandShakeIcon />
        </TouchableOpacity>
        <TouchableOpacity 
          hitSlop={getHitSlop()}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          accessibilityHint="Open app settings"
        >
          <GearIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(HeaderBar);
