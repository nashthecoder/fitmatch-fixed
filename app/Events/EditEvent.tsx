import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import GaleryIcon from "@/components/Icons/GaleryIcon";
import EventCreationModal from "@/components/modals/EventCreationModal";
import { db } from "@/config/firebase";
import { parseDateType } from "@/helpers/dateTimePicker";
import { uploadMediaAsync } from "@/helpers/firestore";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

const EditEvent = () => {
  const { top } = useSafeAreaInsets();
  const { eventId }: { eventId: string } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ uri: string }[]>([]);
  const [eventDataForModal, setEventDataForModal] = useState<any>();
  const [originalEventData, setOriginalEventData] = useState<any>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [showDatepicker, setShowDatepicker] = useState(false);

  const [eventData, setEventData] = useState({
    name: "",
    dateTime: dayjs().toDate() as DateType,
    location: "",
    visibility: "public" as "public" | "private",
    description: "",
    coverImage: null as { uri: string } | null,
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!eventId) return;

        const docRef = doc(db, "Evenements", eventId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setOriginalEventData(data);

          console.log("date >>> ", data.date);

          const milliseconds =
            data.date.seconds * 1000 +
            Math.floor(data.date.nanoseconds / 1_000_000);

          setEventData({
            name: data.titre || "",
            dateTime: data.date
              ? dayjs(milliseconds).toDate()
              : dayjs().toDate(),
            location: data.emplacement || "",
            visibility: "public",
            description: data.description || "",
            coverImage: data.imageUrls?.[0] ? { uri: data.imageUrls[0] } : null,
          });

          if (data.imageUrls?.[0]) {
            setSelectedImages([{ uri: data.imageUrls[0] }]);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Événement introuvable",
            text2: "L'événement que vous essayez de modifier n'existe pas.",
          });
          router.back();
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible de charger les données de l'événement.",
        });
        router.back();
      }
    };

    fetchEventData();
  }, [eventId]);

  const pickEventImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map((a) => ({ uri: a.uri })));
    }
  };

  const handleUpdateEvent = async () => {
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

    setIsUpdating(true);

    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) throw new Error("Utilisateur non connecté");

      // Upload new images if any were selected
      let uploadedImageUrls = originalEventData?.imageUrls || [];
      if (
        selectedImages.length > 0 &&
        selectedImages[0].uri !== uploadedImageUrls[0]
      ) {
        uploadedImageUrls = [];
        for (const image of selectedImages) {
          const url = await uploadMediaAsync(
            image.uri,
            `evenement_images/${
              currentUser.uid
            }/${Date.now()}_${Math.random()}.webp`
          );
          uploadedImageUrls.push(url);
        }
      }

      const updatedEvent = {
        titre: eventData.name.trim(),
        date: eventData.dateTime,
        emplacement: eventData.location.trim(),
        description: eventData.description.trim(),
        imageUrl: uploadedImageUrls[0] || "",
      };
      setEventDataForModal(updatedEvent);

      // Update the event in Firestore
      const docRef = doc(db, "Evenements", eventId as string);
      await updateDoc(docRef, {
        date: eventData.dateTime,
        description: eventData.description.trim(),
        emplacement: eventData.location.trim(),
        imageUrls: uploadedImageUrls,
        titre: eventData.name.trim(),
        updated_at: new Date().toLocaleString("fr-FR"),
      });

      setShowModal(true);
      Toast.show({
        type: "success",
        text1: "Événement mis à jour !",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de mettre à jour l'événement.");
    } finally {
      setIsUpdating(false);
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
      backgroundColor: "#007aff",
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
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          className="flex-1 mt-16"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-white text-[28px] font-roboto-condensed mx-6 tracking-[-0.3px] mb-2">
            Modifier l&apos;événement
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
                Changer l'image de couverture
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
            onPress={handleUpdateEvent}
            disabled={isUpdating}
          >
            <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
              {isUpdating
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Text>
            {isUpdating && <ActivityIndicator color="white" size="small" />}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <EventCreationModal
        visible={showModal}
        event={eventDataForModal}
        created={!isUpdating}
        createdEventId={eventId}
        onRequestClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
};

export default EditEvent;
