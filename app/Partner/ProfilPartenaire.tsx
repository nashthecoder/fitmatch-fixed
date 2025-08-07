import ChevronDownIcon from "@/components/Icons/ChevronDownIcon";
import GaleryIcon from "@/components/Icons/GaleryIcon";
import PencilIcon from "@/components/Icons/PencilIcon";
import PlusIcon from "@/components/Icons/PlusIcon";
import PlusIconWhite from "@/components/Icons/PlusIconWhite";
import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useGoogleSignIn } from "@/customHooks/useGoogleSignIn";
import { useHandlePartnerFormChange } from "@/customHooks/useHandlePartnerFormChange";
import {
  getCurrentPartnerData,
  updatePartnerDataFirestore,
  uploadPartnerImages,
} from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { setUser } from "@/store/slices/authSlice";
import {
  resetPartnerData,
  setPartnerData,
  updatePartnerField,
} from "@/store/slices/partnerSlice";
import { resetUserData } from "@/store/slices/userSlice";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { categoriesList } from "./Onboarding";

interface ImageType {
  uri: string;
  id: string;
}

const ProfilPartenaire = () => {
  const { top } = useSafeAreaInsets();
  const dispatch = useDispatch();
  const partnerData = useSelector((state: RootState) => state.partner.data);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [pageMode, setPageMode] = useState<"edit" | "view">("view");
  const [isSaving, setSaving] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    partnerData.categorie
  );

  const [busy, setBusy] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const { signOut: signOutGoogle } = useGoogleSignIn();
  const { signOut: signOutEmail } = useEmailAuth();

  const handlePartnerChange = useHandlePartnerFormChange();

  const pickImage = async (type: "profile" | "cover") => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    let result;
    // Launch image picker
    if (type === "profile") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setUploadingProfile(true);
        console.log("🔄 Starting profile image upload...");
        try {
          const uploadedImages = await uploadPartnerImages([
            { uri: result.assets[0].uri, id: "profile" },
          ]);
          console.log("✅ Profile image uploaded:", uploadedImages[0]);

          // Update Firestore with the new profile image URL
          await updatePartnerDataFirestore({
            imageUrl: uploadedImages[0],
          });
          console.log("✅ Firestore updated with profile image");

          // Update Redux store
          dispatch(
            updatePartnerField({ field: "imageUrl", value: uploadedImages[0] })
          );

          // Refetch to ensure sync
          await refetchPartnerData();
          console.log("✅ Partner data refetched");
        } catch (error) {
          console.error("❌ Profile image upload failed:", error);
          Alert.alert("Erreur", "Impossible de télécharger l'image de profil");
        }
        setUploadingProfile(false);
      }
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (!result.canceled) {
        setUploadingCover(true);
        console.log("🔄 Starting cover image upload...");
        try {
          const uploadedImages = await uploadPartnerImages([
            { uri: result.assets[0].uri, id: "cover" },
          ]);
          console.log("✅ Cover image uploaded:", uploadedImages[0]);

          // Update images array - put cover image as the first image for easy access
          const updatedImages = [
            uploadedImages[0],
            ...(partnerData.images?.filter((_, index) => index !== 0) || []),
          ];

          // Update Firestore with the new cover image
          await updatePartnerDataFirestore({
            images: updatedImages,
          });
          console.log("✅ Firestore updated with cover image");

          // Update Redux store
          dispatch(
            updatePartnerField({ field: "images", value: updatedImages })
          );

          // Refetch to ensure sync
          await refetchPartnerData();
          console.log("✅ Partner data refetched");
        } catch (error) {
          console.error("❌ Cover image upload failed:", error);
          Alert.alert(
            "Erreur",
            "Impossible de télécharger l'image de couverture"
          );
        }
        setUploadingCover(false);
      }
    }
  };

  const refetchPartnerData = async () => {
    console.log("🔄 Refetching partner data...");
    try {
      const data = await getCurrentPartnerData();
      if (data) {
        console.log("✅ Partner data fetched:", {
          titre: data.titre,
          imageUrl: data.imageUrl,
          imagesCount: data.images?.length || 0,
        });
        dispatch(setPartnerData(data));
      } else {
        console.log("⚠️ No partner data found");
      }
    } catch (error) {
      console.error("❌ Error refetching partner data:", error);
    }
  };

  useEffect(() => {
    console.log("📋 ProfilPartenaire useEffect - Current partnerData:", {
      titre: partnerData.titre,
      imageUrl: partnerData.imageUrl,
      imagesCount: partnerData.images?.length || 0,
    });

    if (!partnerData.titre) {
      console.log("🔄 Loading partner data from Firestore...");
      (async () => {
        const data = await getCurrentPartnerData();
        if (data) {
          console.log("✅ Loaded partner data:", {
            titre: data.titre,
            imageUrl: data.imageUrl,
            imagesCount: data.images?.length || 0,
          });
          dispatch(setPartnerData(data));
        } else {
          console.log("⚠️ No partner data found in Firestore");
        }
      })();
    }
  }, [dispatch, partnerData.titre]);

  return (
    <SafeAreaView className={`flex flex-1 bg-dark`}>
      <Modal visible={isSaving} transparent animationType="fade">
        <Pressable
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />
        <View className="flex-1 items-center justify-center">
          <View className="p-2 bg-white/80 rounded-xl">
            <Text className="text-black font-roboto-condensed text-[14px]">
              Enregistrement...
            </Text>
          </View>
        </View>
      </Modal>
      {busy && (
        <View className="absolute z-10 flex-1 h-screen w-screen bg-white items-center justify-center">
          <Text>
            Deconnexion <ActivityIndicator />
          </Text>
        </View>
      )}
      {logoutConfirmVisible && (
        <View className="absolute inset-0 bg-black/80 justify-center items-center px-6 z-50">
          <View className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mt-48">
            <Text className="text-white text-[18px] font-bold mb-2 text-center">
              Voulez-vous vous déconnecter ?
            </Text>
            <Text className="text-gray-300 text-center text-[14px] leading-5 mb-4">
              Vous serez redirigé vers la page d’accueil et devrez vous
              reconnecter pour accéder à votre compte.
            </Text>

            <View className="flex-row justify-between gap-4">
              <TouchableOpacity
                onPress={() => setLogoutConfirmVisible(false)}
                className="flex-1 py-3 bg-gray-600 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-[16px]">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setBusy(true);
                  setLogoutConfirmVisible(false);
                  dispatch(setUser(null));
                  dispatch(resetUserData());
                  dispatch(resetPartnerData());
                  try {
                    await signOutGoogle();
                    await signOutEmail();
                  } catch (e: any) {
                    console.warn(e);
                  }
                  setBusy(false);
                  router.dismissAll();
                  router.dismissTo("/Auth/LandingPage");
                }}
                className="flex-1 py-3 bg-red-700 rounded-xl items-center"
              >
                <Text className="text-white font-bold text-[16px]">
                  Se déconnecter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* DEBUG SECTION - Remove in production */}
      {/* <View className="bg-gray-800 p-2 m-2 rounded">
        <Text className="text-white text-xs mb-1">🔧 Debug Info:</Text>
        <Text className="text-white text-xs">imageUrl: {partnerData?.imageUrl || 'null'}</Text>
        <Text className="text-white text-xs">images: {partnerData?.images?.length || 0} items</Text>
        <TouchableOpacity 
          className="bg-blue-500 p-1 rounded mt-1"
          onPress={() => {
            console.log('🔍 Manual refresh triggered');
            refetchPartnerData();
          }}
        >
          <Text className="text-white text-xs text-center">Refresh Data</Text>
        </TouchableOpacity>
      </View> */}

      <ScrollView className="flex-1 mt-4">
        <ImageBackground
          source={
            partnerData?.images && partnerData.images.length > 0
              ? { uri: partnerData.images[0] }
              : require("@/assets/images/coverImageDefault.png")
          }
          className="w-full h-[200px] border border-red"
          resizeMode="cover"
        >
          {uploadingCover && (
            <View className="absolute w-full h-[200px] items-center justify-center">
              <ActivityIndicator size={"large"} color={"red"} />
            </View>
          )}
          <TouchableOpacity
            onPress={() => pickImage("cover")}
            className="p-2 bg-[#6B0000] absolute bottom-4 right-4 flex-row items-center justify-around gap-2 rounded-[8px]"
          >
            <Text className="text-[13px] text-white font-roboto-condensed tracking-[-0.3px] mx-2">
              Importer une image de couverture
            </Text>
            <GaleryIcon />
          </TouchableOpacity>
        </ImageBackground>
        <View className="flex-row items-center p-4 gap-x-4">
          <TouchableOpacity
            className="bg-white rounded-full w-[120px] h-[120px] items-center justify-center"
            onPress={() => pickImage("profile")}
            activeOpacity={0.8}
          >
            {partnerData?.imageUrl ? (
              <View className="border-2 border-red rounded-full">
                <Image
                  source={{ uri: partnerData.imageUrl }}
                  className="w-[120px] h-[120px] rounded-full"
                />
              </View>
            ) : (
              <PlusIcon />
            )}
            {uploadingProfile && (
              <View className="absolute w-[120px] h-[120px] items-center justify-center">
                <ActivityIndicator size={"large"} color="red" />
              </View>
            )}
          </TouchableOpacity>
          <View>
            {pageMode === "view" ? (
              <>
                <Text className="text-white font-roboto-bold text-[18px] tracking-[-0.3px] my-3">
                  {partnerData?.titre ?? "Nom du partenaire"}
                </Text>
                <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[13px] my-3">
                  {partnerData?.description ?? "Description"}
                </Text>
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Nom du partenaire"
                  value={partnerData?.titre}
                  onChangeText={(text) =>
                    dispatch(
                      updatePartnerField({ field: "titre", value: text })
                    )
                  }
                  className="text-white font-roboto-bold text-[18px] tracking-[-0.3px] border-b border-white/60"
                  placeholderTextColor={"white"}
                />
                <TextInput
                  placeholder="Description du partenaire"
                  value={partnerData?.description}
                  onChangeText={(text) =>
                    dispatch(
                      updatePartnerField({ field: "description", value: text })
                    )
                  }
                  placeholderTextColor={"white"}
                  className="text-white font-roboto-condensed tracking-[-0.3px] text-[13px] border-b border-white/60"
                  multiline
                />
              </>
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-2  ml-[60]">
          <Pressable
            className="bg-[#D9D9D9] rounded-[5px] pl-4 pr-4 flex-row items-center gap-4"
            onPress={() => {
              if (pageMode === "edit") setShowCategories(true);
            }}
          >
            <Text className="font-roboto-medium text-[13px] text-center">
              {categoriesList[partnerData?.categorie || 0].name}
            </Text>
            {pageMode === "edit" && <ChevronDownIcon />}
          </Pressable>
          <Modal
            visible={showCategories}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCategories(false)}
          >
            <BlurView style={{ ...StyleSheet.absoluteFillObject }} />
            <Pressable
              className="flex-1 bg-black/50 justify-center"
              onPress={() => setShowCategories(false)}
            >
              <View className="bg-[#2E2C2C] mx-6 mt-2 rounded-md py-2">
                {categoriesList.map((value, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInUp.delay(10 * index)}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="px-4 py-2"
                      onPress={() => {
                        setShowCategories(false);
                        setSelectedCategory(value.id);
                        handlePartnerChange("categorie", value.id);
                      }}
                    >
                      <View className="flex-row items-center my-2 gap-2">
                        {selectedCategory === value.id ? (
                          <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
                        ) : (
                          <View className="w-[14] h-[14] rounded-full bg-white" />
                        )}
                        <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                          {value.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Pressable>
          </Modal>
          <TouchableOpacity
            className="rounded-[5px] bg-white items-center justify-center"
            style={{ height: 32, width: 32, marginRight: 20 }}
            onPress={async () => {
              if (pageMode === "view") {
                setPageMode("edit");
              } else {
                try {
                  setSaving(true);
                  await updatePartnerDataFirestore({
                    titre: partnerData?.titre,
                    description: partnerData?.description,
                    numero: partnerData?.numero,
                    adresse: partnerData?.adresse,
                    siteWeb: partnerData?.siteWeb,
                    categorie: partnerData?.categorie,
                  });
                  setPageMode("view");
                  setSaving(false);
                } catch (error) {
                  console.error("Failed to update partner data:", error);
                  setSaving(false);
                }
              }
            }}
          >
            {pageMode === "view" ? <PencilIcon /> : <Text>Fait!</Text>}
          </TouchableOpacity>
        </View>
        <View className="pl-[60] mt-2 gap-y-1">
          <View className="flex-row items-center gap-x-1">
            <View className="w-[25] h-[25] items-center justify-center">
              <Image source={require("@/assets/images/icons/phoneIcon.png")} />
            </View>
            <View className="flex-row items-center gap-x-2">
              <Text className="text-white font-roboto text-[14px] tracking-[-0.3]">
                +33
              </Text>
              {pageMode === "view" ? (
                <Text className="text-white font-roboto-semibold-italic">
                  {partnerData?.numero}
                </Text>
              ) : (
                <TextInput
                  onChangeText={(text) => {
                    dispatch(
                      updatePartnerField({ field: "numero", value: text })
                    );
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor={"white"}
                  value={partnerData?.numero}
                  className="text-white font-roboto-condensed tracking-[-0.3px] text-[14px] border-b border-white/60 w-[30vw]"
                />
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-x-1">
            <View className="w-[25] h-[25] items-center justify-center">
              <Image
                source={require("@/assets/images/icons/mapIcon.png")}
                className="mr-1"
              />
            </View>
            {pageMode === "view" ? (
              <Text className="text-white font-roboto text-[14px] tracking-[-0.3]">
                {partnerData?.adresse ?? "Adresse du partenaire"}
              </Text>
            ) : (
              <TextInput
                placeholder="Adresse du partenaire"
                value={partnerData?.adresse}
                onChangeText={(text) =>
                  dispatch(
                    updatePartnerField({ field: "adresse", value: text })
                  )
                }
                className="text-white font-roboto text-[14px] tracking-[-0.3px] border-b border-white/60"
                placeholderTextColor={"white"}
              />
            )}
          </View>

          {/* <View className="flex-row items-center gap-x-1">
            <View className="w-[25] h-[25] items-center justify-center">
              <Image source={require("@/assets/images/icons/clockIcon.png")} />
            </View>
            <Text className="text-white font-roboto text-[14px] tracking-[-0.3]">
              Du lundi au samedi de 09h - 19h{" "}
              <Text className="text-[#00C123]">(actuellement ouvert)</Text>
            </Text>
          </View> */}

          <View className="flex-row items-center gap-x-1">
            <View className="w-[25] h-[25] items-center justify-center">
              <Image source={require("@/assets/images/icons/worldIcon.png")} />
            </View>
            {pageMode === "view" ? (
              <Text
                className="text-white font-roboto text-[14px] tracking-[-0.3]"
                onPress={() =>
                  Linking.openURL(partnerData?.siteWeb || "https://example.com")
                }
              >
                {partnerData?.siteWeb || "www.example.com"}
              </Text>
            ) : (
              <TextInput
                placeholder="Siteweb du partenaire"
                value={partnerData?.siteWeb}
                onChangeText={(text) =>
                  dispatch(
                    updatePartnerField({ field: "siteWeb", value: text })
                  )
                }
                className="text-white font-roboto text-[14px] tracking-[-0.3px] border-b border-white/60"
                keyboardType="url"
                autoCapitalize="none"
                placeholderTextColor={"white"}
              />
            )}
          </View>
        </View>

        <View className="flex-row items-center justify-around px-2 my-4">
          <TouchableOpacity
            className="h-[44] w-[47vw] bg-[#ABA8A8] rounded-[6] items-center justify-center"
            onPress={() => router.navigate("/Events/EventList")}
          >
            <Text className="text-center text-black font-roboto-bold text-[18px] tracking-[-0.3px]">
              Vos évènements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[44] w-[47vw] bg-[#ABA8A8] rounded-[6] justify-center items-center"
            onPress={() => router.navigate("/Ads/AdList")}
          >
            <Text className="text-center text-black font-roboto-bold text-[18px] tracking-[-0.3px]">
              Vos publicités
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-evenly mt-4">
          <TouchableOpacity
            className="rounded-[12] border-2 border-white p-4 w-[42vw] items-center"
            onPress={() => router.navigate("/Events/NewEvent")}
          >
            <PlusIconWhite />
            <Text className="text-white text-center font-roboto-condensed text-[20px] tracking-[-0.3px]">
              Créer un évènement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-[12] border-2 border-white p-4 w-[42vw] items-center"
            onPress={() => router.navigate("/Ads/NewAd")}
          >
            <PlusIconWhite />
            <Text className="text-white text-center font-roboto-condensed text-[20px] tracking-[-0.3px]">
              Créer une publicité
            </Text>
          </TouchableOpacity>
        </View>
        <View className="m-8">
          <TouchableOpacity
            onPress={async () => {
              setBusy(true);
              setLogoutConfirmVisible(false);
              dispatch(setUser(null));
              dispatch(resetUserData());
              dispatch(resetPartnerData());
              try {
                await signOutGoogle();
                await signOutEmail();
              } catch (e: any) {
                console.warn(e);
              }
              setBusy(false);
              router.dismissAll();
              router.dismissTo("/Auth/LandingPage");
            }}
            className="flex-1 py-3 bg-red-700 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-[16px]">
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilPartenaire;
