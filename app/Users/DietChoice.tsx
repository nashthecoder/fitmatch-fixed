import { useHandleFormChange } from "@/customHooks/useHandleFormChange copy";
import { updateUserData } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const DietChoie = () => {
  const [selected, setSelected] = useState(0);
  const [dietChoice, setDietChoice] = useState("");
  const userData = useSelector((state: RootState) => state.user.data);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = useHandleFormChange();

  useEffect(() => {
    if (userData?.diet && userData?.diet !== "") {
      console.log("diet ", userData?.diet);
      router.replace("/Users/PersonalityChoice");
    }
  }, []);

  useEffect(() => {
    switch (selected) {
      case 1:
        setDietChoice("Classique équilibré");
        break;
      case 2:
        setDietChoice("Keto");
        break;
      case 3:
        setDietChoice("Paléo");
        break;
      case 4:
        setDietChoice("Végétarien");
        break;
      case 5:
        setDietChoice("Vegan");

        break;
      case 6:
        setDietChoice("Autre");

        break;
    }
  }, [selected]);

  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-[20px] gap-4"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[66] h-[43] m-4"
          resizeMode="cover"
        />
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[28px] mt-4">
          TON MODE D&apos;ALIMENTATION
        </Text>
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed-light-italic text-[20px] mb-4">
          Comment tu nourris ton énergie?
        </Text>
        <View className="my-4">
          <View className="flex-row items-center justify-evenly my-4">
            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(1)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 1 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Classique équilibré
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/classique.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(2)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 2 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Keto
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/keto.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-evenly my-4">
            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(3)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 3 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Paléo
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/paleo.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(4)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 4 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Végétarien
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/vegetarien.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-evenly my-4">
            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(5)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 5 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Végan
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/vegan.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setSelected(6)}
            >
              <View className="flex-row items-center my-2 gap-2">
                {selected === 6 ? (
                  <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                ) : (
                  <View className="w-[14] h-[14] rounded-full bg-white" />
                )}
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Autre
                </Text>
              </View>
              <Image
                source={require("@/assets/images/diet/autre.png")}
                className="w-[160px] h-[100px] rounded-[16px]"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="mt-6  flex-row self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 "
          onPress={async () => {
            if (selected === 0) {
              Toast.show({
                type: "error",
                text1: "Réponse invalide!",
                text2: "Veuillez choisir votre mode d'alimentation",
              });
              return;
            }
            setIsLoading(true);
            handleChange("diet", dietChoice);
            await updateUserData({ diet: dietChoice });
            setIsLoading(false);
            router.navigate("/Users/PersonalityChoice");
          }}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            On continue !
          </Text>
          {isLoading && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DietChoie;
