import { RootState } from "@/store/rootReducer";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { DateType } from "react-native-ui-datepicker";
import { useSelector } from "react-redux";
import CloseIcon from "../Icons/CloseIcon";
import HandIcon from "../Icons/HandIcon";
import PencilIcon from "../Icons/PencilIncon";
import StarIcon from "../Icons/StarIcon";
import Spinner from "../shared/Spinner";

type EventData = {
  titre: string;
  date: DateType;
  emplacement: string;
  description: string;
  imageUrl?: string;
};

type Props = {
  visible?: boolean;
  onRequestClose?: () => void;
  onCreated?: () => void;
  event?: EventData;
  created: boolean;
  createdEventId: string;
  edit?: boolean;
};

const EventCreationModal = ({
  visible = false,
  onCreated,
  event,
  created,
  createdEventId,
  edit = false,
  onRequestClose,
}: Props) => {
  const {
    titre = "Nom de l'évènement",
    date = "",
    emplacement = "Emplacement",
    description = "",
    imageUrl,
  } = event || {};

  console.log(imageUrl);

  const partnerData = useSelector((state: RootState) => state.partner.data);

  return (
    <Modal transparent visible={visible}>
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex flex-1 bg-black/90 h-full w-full items-center justify-center"
      >
        <BlurView
          style={{ ...StyleSheet.absoluteFillObject }}
          intensity={25}
          tint="dark"
          reducedTransparencyFallbackColor="black"
        />
        <View className="flex-row justify-between items-center pr-10 pl-4 w-full absolute top-8">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[66] h-[43]"
            resizeMode="cover"
          />
          {created && (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => router.dismissTo("/Partner/ProfilPartenaire")}
            >
              <CloseIcon />
            </TouchableOpacity>
          )}
        </View>

        <Animated.Text
          entering={FadeInDown.duration(600)}
          exiting={FadeOut}
          className="text-center text-white text-[20px] mb-4 trakcing-[-0.3px] mt-8 font-roboto-bold"
        >
          Votre évènement est en cours de validation
        </Animated.Text>

        {!created && (
          <View className="absolute">
            <Spinner size={175} />
          </View>
        )}
        <ImageBackground
          source={require("@/assets/images/modalBG.png")}
          resizeMode="cover"
          className="w-[350] h-[580] items-center justify-start overflow-hidden"
          style={{
            borderColor: "#f6f1f1",
            borderWidth: 2,
            opacity: created ? 1 : 0.33,
          }}
        >
          <View className="top-0 mx-2 overflow-hidden">
            <Image
              source={{ uri: imageUrl! }}
              className="h-[20vh] w-[90vw] overflow-hidden mb-2"
              resizeMode="cover"
            />
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.0.9)",
              }}
            />
          </View>
          <Text className="text-[12px] font-inter-light text-white">
            {date?.toLocaleString()}
          </Text>

          <Text className="font-inter-bold text-white text-3xl">{titre}</Text>

          <Text className="text-[14px] font-roboto-condensed-light text-white tracking-[-0.3px]">
            Organisé par{" "}
            <Text className="font-roboto-condensed-medium">
              {partnerData.titre}
            </Text>
          </Text>

          <View className="flex-row items-center">
            <Image
              source={require("@/assets/images/profile-1.png")}
              className="h-[17] w-[17] rounded-full"
            />
            <Image
              source={require("@/assets/images/profile-2.png")}
              className="h-[17] w-[17] rounded-full"
            />
            <Image
              source={require("@/assets/images/profile-3.png")}
              className="h-[17] w-[17] rounded-full"
            />
            <Text className="text-white ml-2 font-roboto-condensed-light tracking-[-0.3px] text-[12px]">
              0 intéressés - 0 participants
            </Text>
          </View>
          <View className="flex-row items-center justify-evenly w-full mt-4">
            <TouchableOpacity className="w-[130] h-[30] rounded-[8px] bg-white flex-row items-center justify-center gap-2">
              <StarIcon />
              <Text className=" tracking-[-0.3px] font-roboto-condensed-light text-[12px]">
                Intéressé (e)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[130] h-[30] rounded-[8px] bg-white flex-row items-center justify-center gap-2">
              <HandIcon />
              <Text className=" tracking-[-0.3px] font-roboto-condensed-light text-[12px]">
                Je participe
              </Text>
            </TouchableOpacity>
          </View>
          <View className=" self-start pl-[20] pt-2">
            <View className="flex-row gap-2">
              <Image source={require("@/assets/images/mapIcon.png")} />
              <View>
                <Text
                  className="text-white"
                  style={{
                    fontStyle: "italic",
                    fontWeight: "100",
                    fontSize: 20,
                    letterSpacing: -0.3,
                  }}
                >
                  {emplacement}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 my-2 items-center ml-1">
              <AntDesign size={25} name="calendar" color="white" />
              <View>
                <Text className="text-white font-inter-light text-[13px] tracking-[-0.3px]">
                  {date?.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: "white",
              borderWidth: 1,
              width: "90%",
              marginTop: 20,
              marginBottom: 4,
            }}
          />

          <View className="self-start pl-4 pt-2 gap-2">
            <Text className="font-inter-semibold text-white tracking-[-0.3px] text-[13px]">
              A propos de l’évènement
            </Text>
            <Text className="text-white font-inter-light tracking-[-0.3px] text-[10px]">
              {description}
            </Text>
          </View>
        </ImageBackground>
        {created && createdEventId && (
          <TouchableOpacity
            className="rounded-[8px] bg-white items-center mt-4 px-6 py-2"
            onPress={() => {
              if (edit && onRequestClose) {
                return onRequestClose!();
              }
              router.replace({
                pathname: "/Events/EditEvent",
                params: { eventId: createdEventId },
              });
            }}
          >
            <PencilIcon />
            <Text>Modifier</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Modal>
  );
};

export default EventCreationModal;
