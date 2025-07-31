import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import GaleryIcon from "@/components/Icons/GaleryIcon";
import EventCreationModal from "@/components/modals/EventCreationModal";
import { db } from "@/config/firebase";
import { parseDateType } from "@/helpers/dateTimePicker";
import { uploadMediaAsync } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";
import { useSelector } from "react-redux";

export interface Event {
  id: string;
  name: string;
  dateTime: string;
  location: string;
  visibility: "public" | "private";
  description: string;
  coverImageUrl?: string;
  organizerInfo: {
    uid: string;
    username: string;
    profilePicUrl?: string;
  };
  participants: {
    count: number;
    users: string[];
  };
  createdAt: Timestamp;
}

const NewEvent = () => {
  const { top } = useSafeAreaInsets();
  const userData = useSelector((state: RootState) => state.user.data);
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ uri: string }[]>([]);
  const [eventDataForModal, setEventDataForModal] = useState<any>();
  const [createdEventId, setCreatedEventId] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [showDatepicker, setShowDatepicker] = useState(false);

  const pickEventImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log("Selected images!");
      console.log(selectedImages);
      setSelectedImages(result.assets.map((a) => ({ uri: a.uri })));
    }
  };

  const [eventData, setEventData] = useState({
    name: "",
    dateTime: dayjs().toDate() as DateType,
    location: "",
    visibility: "public" as "public" | "private",
    description: "",
    coverImage: null as { uri: string } | null,
  });

  const handleCreateEvent = async () => {
    if (
      !eventData.name.trim() ||
      !eventData.dateTime ||
      !eventData.location.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Champs requis",
        text2: "Remplissez nom, date et lieu.",
      });
      return;
    }

    setIsCreating(true);

    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) throw new Error("Utilisateur non connecté");

      // 1. Upload des images
      const uploadedImageUrls: string[] = [];
      for (const image of selectedImages) {
        const url = await uploadMediaAsync(
          image.uri,
          `evenement_images/${
            currentUser.uid
          }/${Date.now()}_${Math.random()}.webp`
        );
        uploadedImageUrls.push(url);
      }

      const createdEvent = {
        titre: eventData.name.trim(),
        date: eventData.dateTime,
        emplacement: eventData.location.trim(),
        description: eventData.description.trim(),
        imageUrl: uploadedImageUrls[0] || selectedImages[0].uri,
      };
      setEventDataForModal(createdEvent);

      const firstImageUrl = uploadedImageUrls[0] || "";
      setShowModal(true); // ✅ Utilise la popup

      // 2. Création de la structure Firestore
      const docRef = await addDoc(collection(db, "Evenements"), {
        codePromo: "",
        created_at: new Date().toLocaleString("fr-FR", {
          timeZone: "Africa/Nairobi", // Madagascar is UTC+3
        }),
        date: eventData.dateTime,
        description: eventData.description.trim(),
        emplacement: eventData.location.trim(),
        imageUrls: uploadedImageUrls,
        lieu: "France", // à rendre dynamique si nécessaire
        partenaireId: currentUser.uid,
        titre: eventData.name.trim(),
        valide: false,
      });

      setCreatedEventId(docRef.id);

      Toast.show({
        type: "success",
        text1: "Événement créé !",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de créer l'événement.");
    } finally {
      setIsCreating(false);
    }
  };

  const defaultStyle = useDefaultStyles();
  const DatePickerStyle = {
    ...defaultStyle,

    header: {
      backgroundColor: "#000",
      tintColor: "white",
      borderRadius: 30,
      marginBottom: 10,
    },
    year_selector_label: { color: "white", fontWeight: "bold" },
    month_selector_label: { color: "white", fontWeight: "bold" },
    button_next: {
      tintColor: "white",
      backgroundColor: "white",
      borderRadius: "50%",
      marginRight: 10,
    },
    button_prev: {
      tintColor: "white",
      backgroundColor: "white",
      borderRadius: "50%",
      marginLeft: 10,
    },
    button_prev_image: { tintColor: "black" },
    button_next_image: { tintColor: "black" },

    day_label: { color: "black", fontWeight: "bold" },
    outside_label: { color: "gray" },
    disabled_label: { color: "lightgray" },
    selected: {
      backgroundColor: "#007aff", // iOS blue
      borderRadius: "50%",
    },
    selected_label: { color: "white" },
  };

  return (
    <SafeAreaView className={`flex flex-1 bg-dark`}>
      <TouchableOpacity
        className={`bg-dark h-[36px] w-[36px| lef-0 justify-center items-center absolute z-10 p-3`}
        style={{ top: top + 12 }}
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <BackBTNIcon />
      </TouchableOpacity>
      <Image
        source={require("@/assets/images/logo.png")}
        className="absolute top-2 right-4 w-[93] h-[48]"
        style={{ marginTop: top }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust depending on your header height
      >
        <ScrollView
          className="flex-1 mt-16"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-white text-[28px] font-roboto-condensed mx-6 tracking-[-0.3px] mb-2">
            Créer un événement
          </Text>
          <ImageBackground
            source={
              selectedImages.length > 0
                ? { uri: selectedImages[0].uri }
                : require("@/assets/images/coverImageDefault.png")
            }
            className="w-full h-[200px] border border-red"
            resizeMode="cover"
          >
            <TouchableOpacity
              className="p-2 bg-[#6B0000] absolute bottom-4 right-4 flex-row items-center justify-around gap-2 rounded-[8px]"
              onPress={pickEventImages}
            >
              <Text className="text-[13px] text-white font-roboto-condensed tracking-[-0.3px] mx-2 mb-2">
                Importer une image de couverture
              </Text>
              <GaleryIcon />
            </TouchableOpacity>
          </ImageBackground>

          <View className="mx-4 mt-6 mb-2 rounded-[16] bg-[#B8B7B7] h-[55] justify-center">
            <TextInput
              className="mx-3 font-roboto-condensed-bold tracking-[-0.3px] text-[18px]"
              placeholder="Nom de l'événement"
              placeholderTextColor={"black"}
              value={eventData.name}
              onChangeText={(text) =>
                setEventData((prev) => ({ ...prev, name: text }))
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setShowDatepicker(!showDatepicker);
            }}
            className="mx-4 pl-6 my-2 rounded-[16] bg-[#B8B7B7] flex-row items-center h-[55]"
          >
            <View className="w-[25] h-[25] items-center justify-center mr-4">
              <Image
                source={require("@/assets/images/icons/calendarIcon.png")}
              />
            </View>
            <Text className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]">
              {eventData.dateTime?.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {showDatepicker && (
            <View className="p-4 bg-[#b8b7b7] m-4">
              <DateTimePicker
                minDate={dayjs().toDate()}
                mode="single"
                date={parseDateType(eventData?.dateTime)}
                onChange={({ date }) => {
                  setShowDatepicker(false);
                  setEventData((prev) => ({ ...prev, dateTime: date }));
                }}
                timePicker
                styles={{ ...DatePickerStyle }}
              />
            </View>
          )}

          <View className="mx-4 pl-6 my-2 rounded-[16] bg-[#B8B7B7] flex-row items-center h-[55]">
            <View className="w-[25] h-[25] items-center justify-center mr-4">
              <Image
                source={require("@/assets/images/icons/mapMarkerIcon.png")}
              />
            </View>
            <TextInput
              className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px] text-black"
              placeholder="Lieu de l'événement"
              placeholderTextColor={"black"}
              value={eventData.location}
              onChangeText={(text) =>
                setEventData((prev) => ({ ...prev, location: text }))
              }
            />
          </View>

          <View className="mx-4 mt-2 mb-2 rounded-[16] bg-[#B8B7B7] h-[120] ">
            <TextInput
              className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]"
              placeholder="Détails de l'événement"
              placeholderTextColor={"black"}
              multiline
              value={eventData.description}
              onChangeText={(text) =>
                setEventData((prev) => ({ ...prev, description: text }))
              }
            />
          </View>
          <TouchableOpacity
            className="mt-6 self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 flex-row gap-2"
            onPress={handleCreateEvent}
            disabled={isCreating}
          >
            <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
              {isCreating ? "Création..." : "Créer un événement"}
            </Text>
            {isCreating && <ActivityIndicator color="white" size="small" />}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <EventCreationModal
        visible={showModal}
        event={eventDataForModal}
        created={!isCreating}
        createdEventId={createdEventId}
      />
    </SafeAreaView>
  );
};

export default NewEvent;
