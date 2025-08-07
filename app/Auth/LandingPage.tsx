import { getCurrentUserData } from "@/helpers/firestore";
import { getResponsiveFontSize, getResponsiveImageSize, isDesktop, isTablet } from "@/helpers/responsive";
import { RootState } from "@/store/rootReducer";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive dimensions
  const getLogoSize = () => {
    if (isDesktop()) return { width: 400, height: 'auto' };
    if (isTablet()) return { width: 350, height: 'auto' };
    return { width: 300, height: 'auto' };
  };

  const getContainerWidth = () => {
    if (isDesktop()) return Math.min(500, width * 0.4);
    if (isTablet()) return Math.min(400, width * 0.6);
    return Math.min(323, width * 0.85);
  };

  const getTaglineFontSize = () => {
    return getResponsiveFontSize(32);
  };

  const getBottomImageWidth = () => {
    if (isDesktop()) return '80vw';
    if (isTablet()) return '90vw';
    return '95vw';
  };

  return (
    <View className="flex-1 bg-[#0F0E0C]">
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        className="h-full"
        resizeMode="cover"
      >
        <Image
          source={require("@/assets/images/landingImage.png")}
          className="self-center absolute bottom-10"
          style={{ width: getBottomImageWidth() }}
          resizeMode="cover"
        />
        <Animated.View
          entering={FadeInDown.duration(1000).delay(150)}
          className="self-center items-center justify-center"
          style={{ 
            width: getContainerWidth(),
            marginTop: isDesktop() ? 80 : isTablet() ? 60 : 48,
          }}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            className="self-center"
            style={getLogoSize()}
            resizeMode="contain"
          />
          <View className="w-full mt-8">
            <Animated.Text
              entering={FadeInDown.duration(600).delay(600)}
              className="text-[#D0A0A0] font-kavivanar mx-5"
              style={{ 
                fontSize: getTaglineFontSize(),
                letterSpacing: -0.3,
                textAlign: isDesktop() ? 'center' : 'left',
              }}
            >
              Moins de swipe
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.duration(600).delay(1200)}
              className="text-[#D0A0A0] font-kavivanar text-end mr-6 mt-2"
              style={{ 
                fontSize: getTaglineFontSize(),
                letterSpacing: -0.3,
                textAlign: isDesktop() ? 'center' : 'right',
              }}
            >
              Plus de sueur
            </Animated.Text>
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(600).delay(1800)}
          className="absolute self-center"
          style={{
            bottom: insets.bottom + (isDesktop() ? 100 : isTablet() ? 80 : 50),
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              console.log(currentUser);
              if (currentUser) {
                const userData = await getCurrentUserData();
                if (userData?.userType === "binome") {
                  router.navigate("/Users/Onboarding");
                } else router.navigate("/Partner/ProfilPartenaire");
              }
              router.navigate("/Auth/Login");
            }}
            className="py-2 rounded-[16px] items-center justify-center bg-red px-6"
            style={{ 
              paddingVertical: isDesktop() ? 16 : isTablet() ? 14 : 12,
              paddingHorizontal: isDesktop() ? 32 : isTablet() ? 28 : 24,
            }}
          >
            <Text 
              className="font-roboto-semicondensed-extrabold text-white text-center"
              style={{ fontSize: getResponsiveFontSize(24) }}
            >
              Je commence l&apos;aventure !
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
