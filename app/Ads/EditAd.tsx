import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import ChevronDownIcon from "@/components/Icons/ChevronDownIcon";
import GaleryIcon from "@/components/Icons/GaleryIcon";
import { db } from "@/config/firebase";
import { uploadMediaAsync } from "@/helpers/firestore";

const EditAd = () => {
  const { adId }: { adId: string } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();

  const [adData, setAdData] = useState<{
    productName: string;
    productType: string;
    description: string;
    distributionType: string;
    coverImage: { uri: string } | null;
    coverImageUrl: string;
  }>({
    productName: "",
    productType: "",
    description: "",
    distributionType: "",
    coverImage: null,
    coverImageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const docRef = doc(db, "Ads", adId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdData({
            productName: data.titre || "",
            productType: data.productType || "",
            description: data.description || "",
            distributionType: data.location || "",
            coverImageUrl: data.image_url || "",
            coverImage: null,
          });

          if (data.location === "Statique") setSelected(1);
          else if (data.location === "Page d'accueil") setSelected(2);
          else if (data.location === "Page swiper") setSelected(3);
        } else {
          Alert.alert("Erreur", "Publicité introuvable");
          router.back();
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        Alert.alert("Erreur", "Impossible de charger la publicité");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [adId]);

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

  const handleUpdateAd = async () => {
    setUpdating(true);

    try {
      const updates: any = {
        titre: adData.productName.trim(),
        productType: adData.productType.trim(),
        description: adData.description.trim(),
        location: adData.distributionType,
      };

      if (adData.coverImage) {
        const currentUser = getAuth().currentUser;
        if (!currentUser) throw new Error("Utilisateur non connecté");

        updates.image_url = await uploadMediaAsync(
          adData.coverImage.uri,
          `ads/${currentUser.uid}/${Date.now()}_cover.jpg`
        );
      }

      await updateDoc(doc(db, "Ads", adId), updates);

      Toast.show({
        type: "success",
        text1: "Modifié",
        text2: "Votre publicité a été mise à jour avec succès",
      });
      router.back();
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      Alert.alert("Erreur", "Impossible de mettre à jour la publicité");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-dark">
      <TouchableOpacity
        className="bg-dark h-[36px] w-[36px] justify-center items-center absolute z-10 p-3"
        style={{ top: top + 12 }}
        onPress={() => router.back()}
      >
        <BackBTNIcon />
      </TouchableOpacity>

      <ScrollView className="mt-16">
        <Text className="text-white text-[28px] font-roboto-condensed mx-6 tracking-[-0.3px] mb-2">
          Modifier une publicité
        </Text>

        <ImageBackground
          source={
            adData.coverImage
              ? { uri: adData.coverImage.uri }
              : adData.coverImageUrl
              ? { uri: adData.coverImageUrl }
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
              Changer l&apos;image de couverture
            </Text>
            <GaleryIcon />
          </TouchableOpacity>
        </ImageBackground>

        {["productName", "productType"].map((field: string, i) => (
          <KeyboardAvoidingView
            key={field}
            className="mx-4 mt-4 rounded-[16] bg-[#B8B7B7] h-[55] justify-center"
          >
            <TextInput
              placeholderTextColor="black"
              className={`mx-3 font-roboto-condensed${
                field === "productName" ? "-bold" : ""
              } tracking-[-0.3px] text-[18px] text-black`}
              placeholder={
                field === "productName" ? "Nom du produit" : "Type de produit"
              }
              value={adData[field]}
              onChangeText={(text) =>
                setAdData((prev) => ({ ...prev, [field]: text }))
              }
            />
          </KeyboardAvoidingView>
        ))}

        <KeyboardAvoidingView className="mx-4 mt-4 rounded-[16] bg-[#B8B7B7] h-[120]">
          <TextInput
            placeholderTextColor="black"
            placeholder="Description du produit"
            multiline
            className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]"
            value={adData.description}
            onChangeText={(text) =>
              setAdData((prev) => ({ ...prev, description: text }))
            }
          />
        </KeyboardAvoidingView>

        <TouchableOpacity
          activeOpacity={0.7}
          className="mx-4 mt-4 rounded-[16] bg-[#B8B7B7] h-[55] flex-row items-center justify-between pr-6"
          onPress={() => setShowChoices(!showChoices)}
        >
          <Text className="mx-3 font-roboto-condensed tracking-[-0.3px] text-[18px]">
            {selected === 0 && "Choix de diffusion"}
            {selected === 1 && "Statique"}
            {selected === 2 && "Page d'accueil"}
            {selected === 3 && "Page swiper"}
          </Text>
          <ChevronDownIcon />
        </TouchableOpacity>

        {showChoices && (
          <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
            {["Statique", "Page d'accueil", "Page swiper"].map((option, i) => (
              <TouchableOpacity
                key={option}
                className="flex-row items-center px-6 my-2 gap-2"
                onPress={() => {
                  setSelected(i + 1);
                  setAdData((prev) => ({ ...prev, distributionType: option }));
                  setShowChoices(false);
                }}
              >
                <View
                  className={`w-[14] h-[14] rounded-full ${
                    selected === i + 1
                      ? "bg-red border-4 border-white"
                      : "bg-white"
                  }`}
                />
                <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <TouchableOpacity
          className="mt-6 self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 flex-row gap-2"
          onPress={handleUpdateAd}
          disabled={updating}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            {updating ? "Mise à jour..." : "Mettre à jour la publicité"}
          </Text>
          {updating && <ActivityIndicator color="white" size="small" />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAd;
