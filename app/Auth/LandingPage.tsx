import { getCurrentUserData } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#0F0E0C]">
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        className="h-full"
        resizeMode="cover"
      >
        <Image
          source={require("@/assets/images/landingImage.png")}
          className="self-center w-[95vw] absolute bottom-10"
          resizeMode="cover"
        />
        <Animated.View
          entering={FadeInDown.duration(1000).delay(150)}
          className="self-center w-[323px]"
        >
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[300px] self-center mt-[48px]"
            resizeMode="contain"
          />
          <View className="flex-row justify-between items-center">
            <Animated.Text
              entering={FadeInDown.duration(600).delay(600)}
              className="text-[#D0A0A0] font-kavivanar text-[32px] mx-5"
              style={{ letterSpacing: -0.3 }}
            >
              Moins de swipe
            </Animated.Text>
            <View />
          </View>
          <View className="flex-row justify-between items-center">
            <View />
            <Animated.Text
              entering={FadeInDown.duration(600).delay(1200)}
              className="text-[#D0A0A0] font-kavivanar text-[32px] text-end mr-6"
              style={{ letterSpacing: -0.3 }}
            >
              Plus de sueur
            </Animated.Text>
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.duration(600).delay(1800)}
          className={"absolute bottom-6 self-center "}
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
            style={{ marginBottom: insets.bottom + 28 }}
          >
            <Text className="font-roboto-semicondensed-extrabold  text-white text-[24px] text-center">
              Je commence l&apos;aventure !
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
