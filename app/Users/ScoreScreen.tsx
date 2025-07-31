import GearIcon from "@/components/Icons/GearIcon";
import { RootState } from "@/store/rootReducer";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const ScoreScreen = () => {
  const userData = useSelector((state: RootState) => state.user.data);
  console.log(
    "User data ",
    userData.frequence,
    userData.totalPoints,
    userData.category
  );

  useEffect(() => {
    Vibration.vibrate(300);
    setTimeout(() => {
      Vibration.vibrate(500);
    }, 250);
  }, []);

  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-[20px] gap-4"
      >
        <View className="flex-row items-center justify-between pr-4">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[66] h-[43] m-4"
            resizeMode="cover"
          />
          <TouchableOpacity hitSlop={8}>
            <GearIcon />
          </TouchableOpacity>
        </View>
        <ImageBackground
          source={require("@/assets/images/score-bg.png")}
          className="w-[90vw] h-[600px] self-center rounded-[16px] overflow-hidden pt-4 mb-[24vh]"
          resizeMode="cover"
        >
          <Animated.Text
            entering={FadeInUp.duration(600)}
            className="text-center text-[24px] text-white tracking-[-0.3px] font-roboto-semicondensed-light"
          >
            Vous êtes un
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(500).duration(1200)}
            className="text-center text-[24px] text-white tracking-[-0.3px] font-roboto-semicondensed-bold uppercase"
          >
            {userData.category}
          </Animated.Text>
          <Text className="text-white text-center my-2">
            Le podium n’est pas loin ! A vous de jouer !
          </Text>
          <View className="self-center mt-4">
            <CircularProgress
              value={userData?.percentage!}
              activeStrokeColor={"#f36c62"}
              inActiveStrokeColor="#37363b"
              activeStrokeWidth={20}
              inActiveStrokeWidth={20}
              circleBackgroundColor="#FFF"
              showProgressValue
              valueSuffix="%"
              title={`${userData?.totalPoints}  points`}
              radius={80}
            />
          </View>
          <Image
            source={require("@/assets/images/progress.png")}
            className="w-[85vw] h-[80] self-center rounded-[16px] overflow-hidden mb-4"
            resizeMode="cover"
          />
          <View className="self-center gap-y-2 w-[60vw]">
            <TouchableOpacity
              className="bg-white rounded-full p-4 items-center"
              onPress={() => router.navigate("/(root)/ProfileScreen")}
            >
              <Text className="text-[#CE0000] font-roboto-semicondensed-extrabold text-[1.2rem]">
                Afficher sur mon profil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-transparent border border-[#FF0000] rounded-full px-4 py-3 items-center"
              onPress={() => {
                // router.dismissAll();
                router.replace("/SwipePage");
              }}
            >
              <Text className="text-[#FFF] font-roboto text-[1.2rem]">
                Passer
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>

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
              De nouveaux Matchs te suivent.
            </Text>
            <View className="max-w-[67vw]">
              <Text className="text-left" numberOfLines={2}>
                <Text className="font-bold text-[12px]">Avec </Text>
                <Text className="text-[14px] font-bold text-[#D32C1C] ">
                  Protimum Nutrition
                </Text>
              </Text>
              <Text className="font-bold text-[12px]">
                profite pour augmenter tes protéines!
              </Text>
              <TouchableOpacity className="py-2 mt-2 bg-[#B00000] rounded-[6px] w-[28vw] self-center">
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
            source={require("@/assets/images/protimum-nutrition.png")}
            className="h-[90px]"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScoreScreen;
