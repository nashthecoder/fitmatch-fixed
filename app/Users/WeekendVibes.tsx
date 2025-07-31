import AperoIcon from "@/components/Icons/AperoIcon";
import BeerIcon from "@/components/Icons/BeerIcon";
import CameraIcon from "@/components/Icons/CameraIcon";
import ClubbingIcon from "@/components/Icons/ClubbingIcon";
import ComputerIcon from "@/components/Icons/ComputerIcon";
import CuisineIcon from "@/components/Icons/CuisineIcon";
import FamilyIcon from "@/components/Icons/FamilyIcon";
import GamingIcon from "@/components/Icons/GamingIcon";
import PopcornIcon from "@/components/Icons/PopcornIcon";
import RoadtripIcon from "@/components/Icons/RoatripIcon";
import ShoppingIcon from "@/components/Icons/ShoppingIcon";
import SpartanRaceIcon from "@/components/Icons/SpartanRaceIcon";
import SurfIcon from "@/components/Icons/SurfIcon";
import TreeIcon from "@/components/Icons/TreeIcon";
import TrophyIcon from "@/components/Icons/TrophyIcon";
import YogaIcon from "@/components/Icons/YogaIcon";
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

const WeekendVibes = () => {
  const [selectedList, setSelectedList] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: RootState) => state.user.data);
  const [weekendVibesLabels, setWeekendVibesLabels] = useState<string[]>([]);
  const handleChange = useHandleFormChange();

  // Create a mapping of numbers to their corresponding labels
  const vibesMap: Record<number, string> = {
    1: "Soirée entre amis",
    2: "Voyages express",
    3: "Chill total à la maison",
    4: "Ateliers cuisine Healthy",
    5: "Road-trip ou micro-avanture",
    6: "Course d'obstacles, Spartan Race",
    7: "Competiton sportive",
    8: "Surf/Sport aquatique",
    9: "Apéro brunch prolongé",
    10: "Travail sur projets persos",
    11: "Bar entre copains",
    12: "Famille avant tout",
    13: "Clubbing et nuits blanches",
    14: "Shopping et flânerie",
    15: "Sessions gaming",
    16: "Shooting photo créatif",
    17: "Netflix & cocooning",
    18: "Rando et sport nature",
    19: "Yoga, méditation et bien-être",
  };

  const handleSelect = (n: number) => {
    setSelectedList((prevList) => {
      // If the number is already selected, remove it
      if (prevList.includes(n)) {
        return prevList.filter((item) => item !== n);
      }
      // If not selected and we have less than 6, add it
      if (prevList.length < 6) {
        return [...prevList, n];
      }
      // Otherwise return unchanged (already at max capacity)
      return prevList;
    });
  };

  // Update weekendVibesLabels whenever selectedList changes
  useEffect(() => {
    const newLabels = selectedList
      .map((num) => vibesMap[num])
      .filter((label) => label !== undefined);
    setWeekendVibesLabels(newLabels);
  }, [selectedList]);

  const isSelected = (n: number): boolean => {
    return selectedList.includes(n);
  };

  useEffect(() => {
    if (userData.weekendVibes && userData.weekendVibes.length > 0) {
      router.replace("/Users/SportsObjectives");
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
        <View>
          <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[28px] mt-2">
            TA VIBE DU WEEK-END
          </Text>
          <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed-light-italic text-[18px] mb-4">
            Comment tu vibres quand arrive le week-end ?
          </Text>
        </View>

        <View className="">
          <View className="mx-6">
            <Text className="text-white font-roboto-thin text-[12px]">
              Choisis les 6 caractéristiques qui te définissent le mieux
            </Text>
          </View>
          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(1)}
            >
              {isSelected(1) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Soirée entre amis
              </Text>
              <Image
                source={require("@/assets/images/weekend-vibes/soire.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(2)}
            >
              {isSelected(2) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Voyages express
              </Text>
              <Image
                source={require("@/assets/images/weekend-vibes/voyage-express.png")}
              />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(3)}
            >
              {isSelected(3) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Chill total
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  à la maison
                </Text>
              </View>
              <Image
                source={require("@/assets/images/weekend-vibes/chill.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(4)}
            >
              {isSelected(4) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Ateliers cuisine
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  healthy
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <CuisineIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(5)}
            >
              {isSelected(5) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Road-trip ou
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  micro-aventure
                </Text>
              </View>
              <RoadtripIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(6)}
            >
              {isSelected(6) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Courses d’obstacles
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Spartan Race
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <SpartanRaceIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(7)}
            >
              {isSelected(7) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Compétition sportive
                </Text>
              </View>
              <TrophyIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(8)}
            >
              {isSelected(8) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Surf / Sport
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  aquatique
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <SurfIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(9)}
            >
              {isSelected(9) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Apéro brunch
                </Text>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  prolongé
                </Text>
              </View>
              <AperoIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(10)}
            >
              {isSelected(10) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Travail sur
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  projets persos
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <ComputerIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(11)}
            >
              {isSelected(11) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Bar entre
                </Text>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  copains
                </Text>
              </View>
              <BeerIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(12)}
            >
              {isSelected(12) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Famille avant tout
                </Text>
              </View>
              <View className="flex-row items-center justify-center -mx-4">
                <FamilyIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(13)}
            >
              {isSelected(13) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Clubbing et
                </Text>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  nuits blanches
                </Text>
              </View>
              <ClubbingIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(14)}
            >
              {isSelected(14) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Shopping et flânerie
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <ShoppingIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(15)}
            >
              {isSelected(15) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Sessions gaming
                </Text>
              </View>
              <GamingIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(16)}
            >
              {isSelected(16) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Shooting photo
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  créatif
                </Text>
              </View>
              <View className="flex-row items-center justify-center -mx-4">
                <CameraIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(17)}
            >
              {isSelected(17) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Netflix & cocooning
                </Text>
              </View>
              <PopcornIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(18)}
            >
              {isSelected(18) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  Rando et sport
                </Text>
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  nature
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <TreeIcon />
              </View>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center my-1 justify-between mx-2">
            <TouchableOpacity
              className="flex-row items-center bg-[#2E2C2C] p-2 mx-2  gap-2 h-16 overflow-hidden w-[46vw]"
              onPress={() => handleSelect(19)}
            >
              {isSelected(19) ? (
                <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[20] h-[20] rounded-full bg-white" />
              )}
              <View>
                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  Yoga, méditation
                </Text>

                <Text
                  className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]"
                  numberOfLines={2}
                >
                  et bien-être
                </Text>
              </View>
              <YogaIcon />
            </TouchableOpacity>
            <View />
          </View>
        </View>

        <TouchableOpacity
          className="mt-6 self-center flex-row items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 "
          onPress={async () => {
            if (selectedList.length <= 0) {
              if (loading) return;
              Toast.show({
                type: "error",
                text1: "Réponse invalide!",
                text2:
                  "Veuillez choisir au plus six (06) réponses à la question",
              });
              return;
            }
            setLoading(true);
            handleChange("weekendVibes", weekendVibesLabels);
            await updateUserData({ weekendVibes: weekendVibesLabels });
            setLoading(false);
            router.navigate("/Users/SportsObjectives");
          }}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            Prêt pour le sprint suivant !
          </Text>
          {loading && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeekendVibes;
