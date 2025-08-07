import FriendShipIcon from "@/components/Icons/FriendShipIcon";
import HugIcon from "@/components/Icons/HugIcon";
import LightningIcon from "@/components/Icons/LightningIcon";
import MedalIcon from "@/components/Icons/MedalIcon";
import RunningPersonIcon from "@/components/Icons/RunningPersonIcon";
import SprintIcon from "@/components/Icons/SprintIcon";
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

// Define the mapping of selected numbers to their labels
const objectifsLabel: Record<number, string> = {
  1: "Relais longue distance (Relation sérieuse)",
  2: "Coéquipier d'entraînement (Amitié)",
  3: "Sprint à voir (On verra)",
  4: "Stretching câlin (Amitié caline)",
  5: "Cardio sans engagement (Rien de sérieux)",
  6: "Marathon libre (Relation libre)",
};

const SportsObjectives = () => {
  const [selected, setSelected] = useState(0);
  const userData = useSelector((state: RootState) => state.user.data);
  const [loading, setLoading] = useState(false);
  const handleChange = useHandleFormChange();

  const isSelected = (n: number) => {
    return n === selected;
  };

  useEffect(() => {
    if (userData?.objectifDuCoeur && userData.objectifDuCoeur !== "") {
      router.replace("/Users/VideoChallenge");
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (loading) return;

    if (selected === 0) {
      Toast.show({
        type: "error",
        text1: "Réponse invalide!",
        text2: "Veuillez choisir votre objectif sportif",
      });
      return;
    }

    try {
      setLoading(true);
      const selectedLabel = objectifsLabel[selected];
      handleChange("objectifDuCoeur", selectedLabel);
      await updateUserData({ objectifDuCoeur: selectedLabel });
      router.navigate("/Users/VideoChallenge");
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Une erreur s'est produite lors de la sauvegarde",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading if userData is not available
  if (!userData) {
    return (
      <SafeAreaView className="flex flex-1 bg-dark h-full w-full items-center justify-center">
        <ActivityIndicator size="large" color="#D32C1C" />
        <Text className="text-white text-center mt-4">Chargement de vos données...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-1 bg-dark h-full-w-full gap-2">
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
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[28px] mt-4 uppercase w-4/5 self-center">
          Quel est ton objectif sportif du coeur ?
        </Text>
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed-light-italic text-[20px] mb-4">
          Choisis ton style de relation
        </Text>

        {/* Row 1 */}
        <View className="flex-row items-center justify-evenly">
          <TouchableOpacity
            onPress={() => setSelected(1)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(1) ? "lightblue" : "white" }}
          >
            <RunningPersonIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Relais longue
              </Text>
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                distance
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (Relation sérieuse)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(2)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(2) ? "lightblue" : "white" }}
          >
            <FriendShipIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Coéquipier
              </Text>
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                d&apos;entraînement
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (Amitié)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View className="flex-row items-center justify-evenly">
          <TouchableOpacity
            onPress={() => setSelected(3)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(3) ? "lightblue" : "white" }}
          >
            <SprintIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Sprint à voir
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (On verra)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(4)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(4) ? "lightblue" : "white" }}
          >
            <HugIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Stretching câlin
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (Amitié caline)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View className="flex-row items-center justify-evenly">
          <TouchableOpacity
            onPress={() => setSelected(5)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(5) ? "lightblue" : "white" }}
          >
            <LightningIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Cardio sans
              </Text>
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                engagement
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (Rien de sérieux)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(6)}
            className="px-2 py-8 rounded-[16] flex-row items-center max-w-[45vw]"
            style={{ backgroundColor: isSelected(6) ? "lightblue" : "white" }}
          >
            <MedalIcon />
            <View className="items-center flex-1">
              <Text className="font-roboto-condensed text-[16px] text-center tracking-[-0.3px]">
                Marathon libre
              </Text>
              <Text className="font-roboto-condensed-extralight text-[12px] text-center">
                (Relation libre)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-6 self-center items-center justify-center rounded-full bg-[#D32C1C] py-2 px-8 w-[60vw]"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="-mt-1 mb-2 text-white font-roboto-bold tracking-[-0.3px] text-[20px]">
            Let&apos;s go!
          </Text>
          {loading && <ActivityIndicator color="white" />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SportsObjectives;
