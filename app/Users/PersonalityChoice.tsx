import ChevronDownIcon from "@/components/Icons/ChevronDownIcon";
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

const choiceTexts = [
  "",
  "Déterminé(e)",
  "Battant(e) jusqu’au bout",
  "Ambitieux(se)",
  "Positif(ve) par nature",
  "Compétiteur(rice)",
  "Aventurier(ère)",
  "Créatif(ve)",
  "Zen sous pression",
  "Team player (Esprit d’équipe)",
  "Passionné(e)",
  "Persévérant(e)",
  "Esprit libre",
  "Ultra exigeant(e)",
  "Bavard(e) sans filtre",
  "Impulsif(ve) mais passionné(e)",
  "Tête en l’air mais adorable",
  "Toujours en retard...sauf pour l’apéro",
  "Mauvais perdant(e) assumé(e)",
  "Trop franc(he) mais sincère",
  "Obsédé(e) du planning",
];

const PersonalityChoice = () => {
  const [selected, setSelected] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.user.data);
  const handleChange = useHandleFormChange();

  const showChoiceText = () => {
    return choiceTexts[selected];
  };

  useEffect(() => {
    if (userData?.personality && userData.personality !== "") {
      router.replace("/Users/WeekendVibes");
    }
  }, []);

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
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[28px] my-8">
          CE QUI TE DEFINIT LE MIEUX
        </Text>
        <View className="bg-[#2E2C2C] px-6 py-2 mx-4">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Choisis ce qui te ressemble vraiment, sans tricher !
          </Text>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-2 py-2 mt-2 mb-4"
            onPress={() => setShowChoices(!showChoices)}
          >
            <Text className="text-black font-roboto-condensed text-[13px] tracking-[-0.3]">
              {showChoiceText()}
            </Text>
            <ChevronDownIcon />
          </TouchableOpacity>
        </View>
        {showChoices &&
          choiceTexts.map((choiceText, index) => {
            if (index === 0) return;
            return (
              <Animated.View key={index} entering={FadeInUp.delay(10 * index)}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="bg-[#2E2C2C] px-6 py-2 mx-6"
                  onPress={() => {
                    setShowChoices(false);
                    setSelected(index);
                  }}
                >
                  <View className="flex-row items-center my-2 gap-2">
                    {selected === index ? (
                      <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                    ) : (
                      <View className="w-[14] h-[14] rounded-full bg-white" />
                    )}
                    <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                      {choiceText}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

        <TouchableOpacity
          className="mt-6 self-center flex-row items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 "
          onPress={async () => {
            if (loading) return;
            if (selected === 0) {
              Toast.show({
                type: "error",
                text1: "Réponse invalide!",
                text2: "Veuillez faire votre choix",
              });
              return;
            }
            setLoading(true);
            handleChange("personality", choiceTexts[selected]);
            await updateUserData({ personality: choiceTexts[selected] });
            setLoading(false);
            router.navigate("/Users/WeekendVibes");
          }}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            Validé !
          </Text>
          {loading && <ActivityIndicator size={"large"} color={"white"} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalityChoice;
