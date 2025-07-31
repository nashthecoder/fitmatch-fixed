import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import ChevronDownIcon from "@/components/Icons/ChevronDownIcon";
import GaleryIcon from "@/components/Icons/GaleryIcon";
import AdCreationModal from "@/components/modals/AdCreationModal";
import { db } from "@/config/firebase";
import { uploadMediaAsync } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export interface Ad {
  id: string;
  productName: string;
  productType: string;
  description: string;
  distributionType: "popup" | "static" | "homepage";
  coverImageUrl?: string;
  advertiserInfo: {
    uid: string;
    username: string;
    profilePicUrl?: string;
  };
  clicks: {
    count: number;
    users: string[];
  };
  impressions: {
    count: number;
  };
  createdAt: Timestamp;
  isActive: boolean;
}

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NewAd = () => {
  const { top } = useSafeAreaInsets();
  const userData = useSelector((state: RootState) => state.user.data);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selected, setSelected] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  const [adData, setAdData] = useState({
    productName: "",
    productType: "",
    description: "",
    distributionType: "",
    coverImage: null as { uri: string } | null,
  });

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAdData((prev) => ({
        ...prev,
        coverImage: { uri: result.assets[0].uri },
      }));
    }
  };

  const handleCreateAd = async () => {
    if (!adData.productName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom pour le produit");
      return;
    }
    if (!adData.description.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une description");
      return;
    }

    setIsCreating(true);

    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      let coverImageUrl = "";
      if (adData.coverImage) {
        coverImageUrl = await uploadMediaAsync(
          adData.coverImage.uri,
          `ads/${currentUser.uid}/${Date.now()}_cover.jpg`
        );
      }

      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // add 1 month

      const newAd = {
        titre: adData.productName.trim(),
        description: adData.description.trim(),
        image_url: coverImageUrl,
        location: "Page swiper", // static for now, or allow selection
        partenaire: currentUser.uid,
        duration: "1",
        end_date: formatDate(endDate),
        created_at: serverTimestamp(),
        valide: false,
        productType: adData.productType,
      };

      await addDoc(collection(db, "Ads"), newAd);

      Toast.show({
        type: "success",
        text1: "Succès!",
        text2: "Votre publicité a été créée avec succès!",
      });

      router.back();
    } catch (error) {
      console.error("Erreur lors de la création de la publicité:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de la publicité"
      );
    } finally {
      setIsCreating(false);
    }
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
      <ScrollView className="flex-1 mt-16">
        <Text className="text-white text-[28px] font-roboto-condensed mx-6 tracking-[-0.3px] mb-2">
          Créer une publicité
        </Text>
        <ImageBackground
          source={
            adData.coverImage
              ? { uri: adData.coverImage.uri }
              : require("@/assets/images/coverImageDefault.png")
          }
          className="w-full h-[180px] border border-red"
          resizeMode="cover"
        >
          <TouchableOpacity
            className="p-2 bg-[#6B0000] absolute bottom-4 right-4 flex-row items-center justify-around gap-2 rounded-[8px]"
            onPress={pickCoverImage}
          >
            <Text className="text-[13px] text-white font-roboto-condensed tracking-[-0.3px] mx-2 mb-2">
              Importer une image de couverture
            </Text>
            <GaleryIcon />
          </TouchableOpacity>
        </ImageBackground>

        <KeyboardAvoidingView className="mx-4 mt-6 mb-2 rounded-[16] bg-[#B8B7B7] h-[55] justify-center">
          <TextInput
            className="mx-3 font-roboto-condensed-bold tracking-[-0.3px] text-[18px] text-black"
            placeholder="Nom du produit"
            placeholderTextColor={"black"}
            value={adData.productName}
            onChangeText={(text) =>
              setAdData((prev) => ({ ...prev, productName: text }))
            }
          />
        </KeyboardAvoidingView>

        <KeyboardAvoidingView className="mx-4 mt-2 mb-2 rounded-[16] bg-[#B8B7B7] h-[55] justify-center">
          <TextInput
            className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px] text-black"
            placeholderTextColor={"black"}
            placeholder="Type de produit"
            value={adData.productType}
            onChangeText={(text) =>
              setAdData((prev) => ({ ...prev, productType: text }))
            }
          />
        </KeyboardAvoidingView>

        <KeyboardAvoidingView className="mx-4 mt-2 mb-2 rounded-[16] bg-[#B8B7B7] h-[120] ">
          <TextInput
            className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]"
            placeholderTextColor={"black"}
            placeholder="Description du produit"
            multiline
            value={adData.description}
            onChangeText={(text) =>
              setAdData((prev) => ({ ...prev, description: text }))
            }
          />
        </KeyboardAvoidingView>

        <TouchableOpacity
          activeOpacity={0.7}
          className="mx-4 mt-2 mb-2 rounded-[16] bg-[#B8B7B7] h-[55] flex-row items-center justify-between pr-6"
          onPress={() => setShowChoices(!showChoices)}
        >
          <Text className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]">
            {selected === 0 && "Choix de diffusion"}
            {selected === 1 && "Statique"}
            {selected === 2 && "Page d'accueil"}
            {selected === 3 && "Page Swiper"}
          </Text>

          <ChevronDownIcon />
        </TouchableOpacity>
        {showChoices && (
          <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-6 my-2 gap-2"
              onPress={() => {
                setSelected(1);
                setAdData((prev) => ({
                  ...prev,
                  distributionType: "Statique",
                }));
                setShowChoices(false);
              }}
            >
              {selected === 1 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Statique
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-6 my-2 gap-2"
              onPress={() => {
                setSelected(2);
                setAdData((prev) => ({
                  ...prev,
                  distributionType: "Page d'accueil",
                }));
                setShowChoices(false);
              }}
            >
              {selected === 2 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Page d&apos;accueil
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center px-6 my-2 gap-2"
              onPress={() => {
                setSelected(3);
                setAdData((prev) => ({
                  ...prev,
                  distributionType: "Page swiper",
                }));
                setShowChoices(false);
              }}
            >
              {selected === 3 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Page swiper
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <TouchableOpacity
          className="mt-6 self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 flex-row gap-2"
          onPress={handleCreateAd}
          disabled={isCreating}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            {isCreating ? "Création..." : "Créer une publicité"}
          </Text>
          {isCreating && <ActivityIndicator color="white" size="small" />}
        </TouchableOpacity>
      </ScrollView>
      <AdCreationModal visible={showModal} />
    </SafeAreaView>
  );
};

export default NewAd;
