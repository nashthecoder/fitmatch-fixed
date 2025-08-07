import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { getResponsivePadding, getResponsiveSpacing, isDesktop, isTablet } from "@/helpers/responsive";
import GearIcon from "../Icons/GearIcon";
import HandShakeIcon from "../Icons/HandShakeIcon";

const HeaderBar = () => {
  const { width } = useWindowDimensions();
  
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

  return (
    <View 
      className="flex-row items-center justify-between absolute z-10 w-full overflow-hidden"
      style={{ 
        height: getHeaderHeight(),
        marginTop: getMarginTop(),
        paddingHorizontal: isDesktop() ? 24 : isTablet() ? 20 : 16,
        maxWidth: isDesktop() ? 1200 : undefined,
        alignSelf: isDesktop() ? 'center' : 'stretch',
      }}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={getLogoSize()}
        resizeMode="cover"
      />
      <View 
        className="flex-row items-center" 
        style={{ 
          gap: isDesktop() ? 20 : isTablet() ? 16 : 12 
        }}
      >
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.navigate("/(root)/Home/NewPost")}
        >
          <AntDesign name="plus" size={getIconSize()} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <HandShakeIcon />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <GearIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
