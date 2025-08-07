import PlusIconBlack from "@/components/Icons/PlusIconBlack";
import { useHandlePartnerFormChange } from "@/customHooks/useHandlePartnerFormChange";
import { RootState } from "@/store/rootReducer";
import {
  setPartnerError,
  setPartnerImages,
  setPartnerLoading,
  setPartnerVideos,
  updatePartnerField,
} from "@/store/slices/partnerSlice";

import {
  Fontisto,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInUp, ZoomInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import { useEmailAuth } from "@/customHooks/useEmailAuth";
import {
  createPartnerIfNotExists,
  uploadPartnerImages,
  uploadPartnerVideos,
} from "@/helpers/firestore";
import { setCreatingUserData } from "@/store/slices/authSlice";
import { getAuth } from "firebase/auth";
import Video from "react-native-video";

export const categoriesList = [
  {
    id: 0,
    name: "Vêtements & Accessoires",
  },
  {
    id: 1,
    name: "Alimentaire",
  },
  {
    id: 2,
    name: "Transport",
  },
  { id: 3, name: "Technologie / Electronique" },
  {
    id: 4,
    name: "Autre",
  },
];

export type PhotoVideoMediaType = {
  uri: string;
  id: string;
  thumbnail?: any;
};

const Onboarding = () => {
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accepted, setAccepted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedImages, setSelectedImages] = useState<PhotoVideoMediaType[]>(
    []
  );
  const [selectedVideos, setSelectedVideos] = useState<PhotoVideoMediaType[]>(
    []
  );

  const userData = useSelector((state: RootState) => state.user.data);
  const partnerData = useSelector((state: RootState) => state.partner.data);
  const partnerLoading = useSelector(
    (state: RootState) => state.partner.loading
  );
  const dispatch = useDispatch();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [busy, setBusy] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<any>();
  const playerRef = useRef(null);
  const { error, signIn, signOut, loading, signUp } = useEmailAuth();

  const handleVideoPress = (videoUri: string) => {
    setCurrentVideo(videoUri);
  };

  const closePlayer = () => {
    setCurrentVideo(null);
  };

  const handleChange = useHandlePartnerFormChange();

  const handlePartnerChange = (field: string, value: any) => {
    dispatch(updatePartnerField({ field: field as any, value }));
  };

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    if (userData?.personalData === true) router.replace("/Users/SportChoice");
  }, []);

  const pickImage = async (id: number) => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Fixed mediaTypes
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 2,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        id: Math.random().toString(36).substring(7),
      }));

      setSelectedImages((prevImages) => {
        let updatedImages;
        // If user selected only one image, replace at the specified id
        if (newImages.length === 1) {
          updatedImages = [...prevImages];
          updatedImages[id] = newImages[0];
        }
        // If user selected two images, replace the entire array
        else if (newImages.length === 2) {
          updatedImages = newImages;
        } else {
          updatedImages = prevImages;
        }
        dispatch(setPartnerImages(updatedImages));
        return updatedImages;
      });
    }
  };

  const pickVideo = async (id: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera roll permissions!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 2,
    });

    if (!result.canceled) {
      // Process each video to get thumbnails
      const processedVideos = await Promise.all(
        result.assets.map(async (asset) => {
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
              time: 1000, // Get thumbnail at 1 second
              headers: {
                // Cloudinary-style crop (if using a CDN)
                "X-Crop": "square",
              },
            });
            return {
              uri: asset.uri,
              thumbnail: uri,
              id: Math.random().toString(36).substring(7),
            };
          } catch (e) {
            console.warn("Failed to generate thumbnail", e);
            return {
              uri: asset.uri,
              thumbnail: null,
              id: Math.random().toString(36).substring(7),
            };
          }
        })
      );

      setSelectedVideos((prev) => {
        let updated;
        if (processedVideos.length === 1) {
          updated = [...prev];
          updated[id] = processedVideos[0];
        } else {
          updated = processedVideos;
        }
        dispatch(setPartnerVideos(updated));
        return updated;
      });
    }
  };
  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      {busy && (
        <View className="absolute flex-1 z-20 top-0 bottom-0 left-0 right-0 items-center justify-center bg-black/80">
          {/* <BlurView
            tint="dark"
            reducedTransparencyFallbackColor="black"
            blurRadius={15}
            style={{ ...StyleSheet.absoluteFillObject }}
          /> */}
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[100px] h-[60px] mx-4 mt-4"
            resizeMode="contain"
          />
          <ActivityIndicator color={"white"} />
        </View>
      )}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-[20px] gap-4"
      >
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[66] h-[43] mx-4 mt-4"
          resizeMode="cover"
        />

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Raison Sociale{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handleChange("titre", text)}
            value={partnerData?.titre}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Adresse{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handlePartnerChange("adresse", text)}
            value={partnerData?.adresse}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Numéro{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>

          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handlePartnerChange("numero", text)}
            value={partnerData?.numero}
            keyboardType="number-pad"
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Site Web{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <View className="flex-row gap-2 bg-white p-2">
            <Text className="mt-3">https://</Text>
            <TextInput
              className="bg-white font-roboto-bold text-black border-b-2 min-w-[200px] border-blue-900 mr-4"
              onChangeText={(text) => handlePartnerChange("siteWeb", text)}
              value={partnerData?.siteWeb}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Catégorie{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-2"
            activeOpacity={0.67}
            onPress={() => {
              setShowCategories(true);
            }}
          >
            <Text className="font-roboto-bold">
              {categoriesList[selectedCategory].name}
            </Text>
            <Ionicons
              name={"chevron-down"}
              size={25}
              color={"rgba(0,0,0,0.7)"}
            />
          </TouchableOpacity>
        </View>
        {/* DROPDOWN MODAL */}
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

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Description{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold h-[120px] align-top"
            multiline
            onChangeText={(text) => handlePartnerChange("description", text)}
            value={partnerData?.description}
            maxLength={256}
          />
        </View>
        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Ajoutes tes photos{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <View className="flex-row items-center justify-between my-2">
            <TouchableOpacity
              className="rounded-[16px] bg-[#888686] items-center justify-center w-[40vw] h-[40vw] overflow-hidden"
              onPress={() => pickImage(0)}
            >
              {selectedImages.length === 0 ? (
                <PlusIconBlack />
              ) : (
                <Image
                  source={{ uri: selectedImages[0].uri }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-[16px] bg-[#888686] items-center justify-center w-[40vw] h-[40vw] overflow-hidden"
              onPress={() => pickImage(1)}
            >
              {selectedImages.length < 2 ? (
                <PlusIconBlack />
              ) : (
                <Image
                  source={{ uri: selectedImages[1].uri }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Ajoutes tes videos{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>

          <View className="flex-row items-center justify-between my-2">
            {[0, 1].map((index) => (
              <TouchableOpacity
                key={index}
                className="rounded-[16px] bg-[#888686] items-center justify-center w-[40vw] h-[40vw] overflow-hidden"
                onPress={() => {
                  if (selectedVideos[index]) {
                    setSelectedVideo(index);
                    handleVideoPress(selectedVideos[index].uri);
                  } else {
                    pickVideo(index);
                  }
                }}
              >
                {selectedVideos[index] ? (
                  <>
                    <Image
                      source={{ uri: selectedVideos[index].thumbnail }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute bg-black/50 rounded-full p-2">
                      <Fontisto name="play" size={24} color="white" />
                    </View>
                  </>
                ) : (
                  <PlusIconBlack />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Video Player Modal */}
          <Modal
            visible={!!currentVideo}
            transparent={true}
            animationType="slide"
          >
            <View className="flex-1 justify-center">
              <BlurView
                tint="dark"
                intensity={25}
                style={{ ...StyleSheet.absoluteFillObject }}
                reducedTransparencyFallbackColor="black"
              />

              {currentVideo && (
                <Video
                  style={{ width: "100%", height: "70%" }}
                  source={{ uri: selectedVideos[selectedVideo].uri }}
                />
              )}
              <TouchableOpacity
                className="mx-10 py-2 rounded-full my-4 border border-red flex-row items-center gap-x-2 justify-center"
                onPress={() => {
                  closePlayer();
                  pickVideo(selectedVideo);
                }}
              >
                <Text className="text-white/70 text-center font-roboto-bold text-[20px]">
                  Remplacer
                </Text>
                <MaterialIcons
                  name="video-library"
                  size={24}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
              <View className="absolute top-10 light-5 items-center justify-center mx-4">
                <Text className="font-inter-bold text-[24px] text-red -tracking-[0.3px]">
                  Video
                </Text>
              </View>
              <TouchableOpacity
                className="absolute top-10 right-5 items-center justify-center h-10 w-10 bg-white/20 rounded-full"
                onPress={closePlayer}
              >
                <Text className="text-white text-lg">✕</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <TouchableOpacity
          className="flex-row gap-x-2 items-center justify-center"
          onPress={() => router.navigate("/Extras/CGU")}
        >
          <Text className="text-center text-white/50 tracking-[-0.3px] font-roboto-condensed-semibold mt-2 ml-4">
            Conditions générales d&apos;utilisation
          </Text>
          <Octicons
            name="link-external"
            color={"rgba(255,255,255,0.5)"}
            size={22}
          />
        </TouchableOpacity>
        <View className="items-center justify-center my-2 flex-row ">
          <Switch
            trackColor={{ true: "#d83335", false: "#ddd" }}
            thumbColor={"white"}
            value={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <Text className="text-white text-center tracking-[-0.3px] font-roboto-condensed text-[14px]">
            J&apos;accepte les CGU
          </Text>
        </View>

        <TouchableOpacity
          className="mt-2 self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8"
          onPress={async () => {
            if (!accepted) {
              Toast.show({
                type: "error",
                text1: "CGU",
                text2:
                  "Vous devez lire et accepter les Conditions Générales d'Utilisation!",
                swipeable: true,
                visibilityTime: 5000,
              });
              return;
            }

            console.log({
              partnerData: partnerData.adresse,
              selectedImages: selectedImages.length,
              selectedVideos: selectedVideos.length,
            });

            if (
              !partnerData?.titre ||
              !partnerData?.adresse ||
              !partnerData?.numero ||
              !partnerData?.siteWeb ||
              !partnerData?.description ||
              selectedImages.length < 1 ||
              selectedVideos.length < 1
            ) {
              Toast.show({
                type: "info",
                text1: "Champs requis",
                text2: "Veuillez remplir tous les champs requis",
              });
              return;
            }
            console.log("email >>> ", partnerData?.email);
            if (!getAuth().currentUser) {
              console.log("Pas encore inscrit");
              return setShowPrompt(true);
            }

            setBusy(true);
            dispatch(setPartnerLoading(true));

            try {
              // Upload images and videos
              const uploadedImages = await uploadPartnerImages(selectedImages);
              const uploadedVideos = await uploadPartnerVideos(selectedVideos);

              // Update partner data with uploaded URLs
              const finalPartnerData = {
                ...partnerData,
                images: uploadedImages,
                videos: uploadedVideos,
                imageUrl: uploadedImages[0] || "",
                codePromo: `FIT${partnerData.titre
                  ?.toUpperCase()
                  .slice(0, 6)}${Date.now().toString().slice(-3)}`,
                personalData: true,
                acceptCGU: true,
              };

              console.log("creating partner data ...");
              await createPartnerIfNotExists(finalPartnerData);
              console.log("created partner data ...");
              router.replace("/Partner/ProfilPartenaire");
            } catch (error) {
              console.error("Partner creation error:", error);
              dispatch(setPartnerError("Failed to create partner"));
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Impossible de créer le compte partenaire",
              });
            } finally {
              setBusy(false);
              dispatch(setPartnerLoading(false));
            }

            // router.navigate("/Users/SportChoice");
          }}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            Je continue
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <Modal visible={showOverlay} transparent>
        <BlurView style={{ ...StyleSheet.absoluteFillObject }} />
        <View className="flex-1 items-center justify-center gap-y-4">
          <Text className="text-white text-[20px] font-inter-bold">
            Création de votre compte
          </Text>
          <ActivityIndicator color="white" />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        visible={showPrompt}
        transparent
        onRequestClose={() => {
          if (!loading) setShowPrompt(false);
        }}
      >
        <ScrollView
          style={{ ...StyleSheet.absoluteFillObject }}
          contentContainerStyle={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BlurView
            style={{ ...StyleSheet.absoluteFillObject }}
            tint="dark"
            intensity={4}
            blurRadius={4}
            reducedTransparencyFallbackColor="black"
          />
          <Pressable
            style={{ ...StyleSheet.absoluteFillObject }}
            onPress={() => {
              if (!loading) setShowPrompt(false);
            }}
          />
          <View />
          <Animated.View
            entering={ZoomInDown.duration(600)}
            className="bg-[#0f0e0c] p-4 h-[75vh] w-[95vw] rounded-t-[30px]"
          >
            <KeyboardAwareScrollView>
              <View className="h-1 bg-white/30 self-center w-14 rounded-full my-2" />
              <Text className="text-white font-roboto-bold text-[20px] text-center">
                Finalisation
              </Text>
              <View className="gap-y-2 px-6 py-2">
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                  Email
                </Text>
                <TextInput
                  className="bg-white rounded-lg"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={signUpForm.email}
                  onChangeText={(text) =>
                    setSignUpForm({ ...signUpForm, email: text })
                  }
                />
              </View>
              <View className="gap-y-2 px-6 py-2">
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                  Mot de passe
                </Text>
                <View className="flex-row items-center bg-white rounded-lg px-2">
                  <TextInput
                    className="flex-1 text-black font-roboto py-2"
                    value={signUpForm.password}
                    onChangeText={(text) =>
                      setSignUpForm({ ...signUpForm, password: text })
                    }
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="gap-y-2 px-6 py-2">
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                  Confirmer mot de passe
                </Text>
                <View className="flex-row items-center bg-white rounded-lg px-2">
                  <TextInput
                    className="flex-1 text-black font-roboto py-2"
                    value={signUpForm.confirmPassword}
                    onChangeText={(text) =>
                      setSignUpForm({ ...signUpForm, confirmPassword: text })
                    }
                    autoCapitalize="none"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                className="mt-8 mx-4 items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8"
                onPress={async () => {
                  if (loading || creatingUserData) return;
                  // setShowPrompt(false);
                  if (
                    signUpForm.email === "" ||
                    signUpForm.password === "" ||
                    signUpForm.confirmPassword === "" ||
                    signUpForm.password !== signUpForm.confirmPassword
                  ) {
                    Toast.show({
                      text1: "Inscription",
                      text2:
                        "Veuillez verifier vos informations: email et mot de passe!",
                      type: "error",
                    });
                    return;
                  }

                  try {
                    dispatch(setCreatingUserData(true));
                    // Step 1: Sign up the user (creates Firebase Auth user)
                    await signUp(signUpForm.email, signUpForm.password);

                    setTimeout(async () => {
                      if (error) {
                        Toast.show({
                          text1: "Inscription",
                          text2: "Erreur: " + error,
                          type: "error",
                        });
                        return;
                      }

                      try {
                        // Step 2: Create partner data in Firestore BEFORE signing in
                        console.log("creating partner data ...");
                        handlePartnerChange("email", signUpForm.email);

                        // Upload images and videos
                        const uploadedImages = await uploadPartnerImages(
                          selectedImages
                        );
                        const uploadedVideos = await uploadPartnerVideos(
                          selectedVideos
                        );

                        // Update partner data with uploaded URLs
                        const finalPartnerData = {
                          ...partnerData,
                          email: signUpForm.email,
                          images: uploadedImages,
                          videos: uploadedVideos,
                          imageUrl: uploadedImages[0] || "",
                          codePromo: `FIT${partnerData.titre
                            ?.toUpperCase()
                            .slice(0, 6)}${Date.now().toString().slice(-3)}`,
                          personalData: true,
                          acceptCGU: true,
                        };

                        await createPartnerIfNotExists(finalPartnerData);

                        console.log("created partner data ...");

                        // Step 3: Sign in AFTER data is created
                        // console.log("logging in...");
                        // await signIn(signUpForm.email, signUpForm.password);
                        // console.log("Logged in...");

                        setTimeout(() => {
                          if (error) {
                            Toast.show({
                              text1: "Connexion",
                              text2: "Erreur: " + error,
                              type: "error",
                            });
                            return;
                          }

                          setShowPrompt(false);
                          // The auth listener will handle the redirect
                        }, 100);
                        dispatch(setCreatingUserData(false));
                        // router.replace("/Partner/ProfilPartenaire");
                      } catch (dataCreationError) {
                        console.error(
                          "Partner creation error:",
                          dataCreationError
                        );
                        Toast.show({
                          type: "error",
                          text1: "Erreur",
                          text2: "Impossible de créer le compte partenaire",
                        });
                        dispatch(setCreatingUserData(false));
                      }
                    }, 100);
                  } catch (signUpError) {
                    console.log("SignUp failed:", signUpError);
                    Toast.show({
                      text1: "Inscription",
                      text2: "Erreur lors de l'inscription",
                      type: "error",
                    });
                    dispatch(setCreatingUserData(false));
                    return;
                  }
                }}
              >
                {loading || creatingUserData ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
                    Créer mon compte!
                  </Text>
                )}
              </TouchableOpacity>
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-[86] h-[53] mx-4 mt-8 self-center my-4"
                resizeMode="cover"
              />
            </KeyboardAwareScrollView>
          </Animated.View>
        </ScrollView>
        <Toast />
      </Modal>
    </SafeAreaView>
  );
};

export default Onboarding;
