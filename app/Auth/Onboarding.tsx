import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useHandlePartnerFormChange } from "@/customHooks/useHandlePartnerFormChange";
import { RootState } from "@/store/rootReducer";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOut,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

const Onboarding = () => {
  // const [loading, setLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.user.data);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPrompt, setShowPrompt] = useState(false);
  const handleChange = useHandlePartnerFormChange();
  const { signIn, signUp, error, loading } = useEmailAuth();
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );

  return (
    <View className="flex-1 bg-[#0F0E0C]">
      {loading && (
        <Animated.View
          exiting={FadeOut}
          className="flex-1 h-screen w-screen z-10 items-center justify-center absolute bg-black/50"
        >
          <Text className="text-center my-2 text-white font-roboto-bold">
            Creation de votre compte partenaire
          </Text>
          <ActivityIndicator size={"large"} color={"red"} />
        </Animated.View>
      )}
      <ImageBackground
        className="flex-1 h-full items-center justify-center"
        source={require("@/assets/images/onboardingBg.png")}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          className="absolute top-10 left-8 w-[67px] h-[48px]"
        />
        <View className="gap-y-12 max-w-[90vw]">
          <Text
            className="font-roboto-condensed text-[30px] text-white text-center"
            style={{ letterSpacing: -0.3 }}
          >
            Envie de transpirer à deux ou de booster votre marque ?
          </Text>
          <View className="flex-row items-center justify-between w-full">
            <Animated.View entering={FadeInLeft.duration(600)}>
              <TouchableOpacity
                className="bg-[#D32C1C] rounded-[16px] w-[43vw] py-5"
                onPress={async () => {
                  router.navigate("/Partner/Onboarding");
                }}
              >
                <Text className="text-white text-[16px] text-center tracking-[-0.3px]">
                  Je suis une
                </Text>

                <Text className="text-white text-[16px] text-center px-4 tracking-[-0.3px]">
                  marque partenaire
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View entering={FadeInRight.duration(600).delay(600)}>
              <TouchableOpacity
                className="bg-[#D32C1C] rounded-[16px] w-[43vw] py-5"
                onPress={async () => {
                  router.replace("/Users/Onboarding");
                }}
              >
                <Text className="text-white text-[16px] text-center px-4 tracking-[-0.3px]">
                  Trouver mon
                </Text>
                <Text className="text-white text-[16px] text-center px-4 tracking-[-0.3px]">
                  binôme Fitmatch
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <View className="absolute bottom-8 w-full bg-transparent p-4 gap-4">
          <Text
            className="text-[#E5E5E5] font-light text-[12px]"
            style={{ letterSpacing: -0.3 }}
          >
            Sponsorisé
          </Text>
          <View className="bg-white px-4 h-[160px] overflow-hidden pb-4 pt-10 flex-row items-center gap-2">
            <View className="max-w-[56vw]">
              <Text className="font-extrabold text-[12px]">
                Matière durable
              </Text>
              <View className="max-w-[67vw]">
                <Text className="text-left" numberOfLines={2}>
                  <Text className="font-bold text-[#D32C1C] text-[12px]">
                    Idéal pour sportif{" "}
                  </Text>
                  <Text className="text-[14px] font-bold">
                    Sneakers Pegasus 41
                  </Text>
                </Text>
                <Text className="font-bold text-[12px]">
                  Chaussure de running sur route pour homme
                </Text>
                <TouchableOpacity
                  className="py-2 mt-2 bg-[#B00000] rounded-[6px] w-[28vw] self-center"
                  onPress={() => Linking.openURL("https://google.com")}
                >
                  <Text
                    className="text-white text-[15px] text-center"
                    style={{ letterSpacing: -0.3 }}
                  >
                    DECOUVRIR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={require("@/assets/images/sneakers.png")}
              className="w-[30vw] h-[140px] -mt-5"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Onboarding;
