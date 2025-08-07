import PlusIconBlack from "@/components/Icons/PlusIconBlack";
import { parseDateType } from "@/helpers/dateTimePicker";
import { RootState } from "@/store/rootReducer";

import dayjs from "dayjs";

import {
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
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
import Animated, { ZoomInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DateTimePicker from "react-native-ui-datepicker";
import { useDispatch, useSelector } from "react-redux";

import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useHandleFormChange } from "@/customHooks/useHandleFormChange copy";
import { frenchCities } from "@/data/cities";
import { createUserIfNotExists } from "@/helpers/firestore";
import { setCreatingUserData } from "@/store/slices/authSlice";
import { getAuth } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const initialValues = {
  nom: "",
  prenoms: "",
  pseudo: "",
  naissance: "",
  ville: "",
  sex: 0,
};

export type PhotoMediaType = {
  uri: string;
  id: string;
};

const Onboarding = () => {
  const dispatch = useDispatch();
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );
  const [selected, setSelected] = useState(0);
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accepted, setAccepted] = useState(false);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState<PhotoMediaType | null>(null);

  const userData = useSelector((state: RootState) => state.user.data);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [busy, setBusy] = useState(false);

  const { error, signIn, signOut, loading, signUp } = useEmailAuth();

  const storage = getStorage();

  // Simplified photo upload for onboarding - single photo only
  const uploadPhoto = async (userId: string, photo: PhotoMediaType): Promise<string> => {
    try {
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      
      const maxSize = 10 * 1024 * 1024; // 10MB max
      if (blob.size > maxSize) {
        throw new Error("Photo trop volumineuse. Taille maximale: 10MB");
      }

      const timestamp = Date.now();
      const photoFilename = `profile_${timestamp}_${photo.id}.jpg`;
      const photoRef = ref(storage, `users/${userId}/photos/${photoFilename}`);

      const uploadResult = await uploadBytes(photoRef, blob, {
        contentType: "image/jpeg"
      });
      
      return await getDownloadURL(uploadResult.ref);
    } catch (error) {
      console.error("Photo upload failed:", error);
      throw error;
    }
  };

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const handleChange = useHandleFormChange();

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // Reduced welcome time
    setSelected(userData?.sex ?? initialValues.sex);
    // Redirect to sport choice if basic personal data is complete
    if (userData?.personalData === true) router.replace("/Users/SportChoice");
    if (currentUser && showWelcome) {
      Toast.show({
        type: "success",
        text1: "Bienvenue " + (currentUser.displayName ?? currentUser.email),
        text2: "Complétez vos informations de base",
        visibilityTime: 3000,
      });
    }
  }, []);

  useEffect(() => {
    handleChange("sex", selected);
  }, [selected]);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin d'accéder à votre galerie photo!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile photos
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage = {
        uri: result.assets[0].uri,
        id: Math.random().toString(36).substring(7),
      };

      setSelectedImage(newImage);
    }
  };
  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      {busy && (
        <View className="absolute flex-1 z-20 top-0 bottom-0 left-0 right-0 items-center justify-center bg-black/80">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[200px] h-[180px] mx-4 mt-4"
            resizeMode="cover"
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
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[24px] mb-4">
          Créons votre profil FitMatch
        </Text>
        <Text className="text-white/70 tracking-[-0.3px] text-center font-roboto-condensed text-[16px] mb-6 mx-4">
          Quelques informations de base pour commencer votre aventure
        </Text>

        {/* Gender Selection */}
        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-3">
            Vous êtes{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <View className="flex-row items-center justify-around">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center gap-2"
              onPress={() => setSelected(1)}
            >
              {selected === 1 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[14px] tracking-[-0.3]">
                Homme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center gap-2"
              onPress={() => setSelected(2)}
            >
              {selected === 2 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[14px] tracking-[-0.3]">
                Femme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center gap-2"
              onPress={() => setSelected(3)}
            >
              {selected === 3 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[14px] tracking-[-0.3]">
                Autre
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Name Fields */}
        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-2">
            Pseudo{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold p-3 rounded-lg"
            placeholder="Votre pseudo FitMatch"
            onChangeText={(text) => handleChange("pseudo", text)}
            value={userData?.pseudo}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-2">
            Prénom{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold p-3 rounded-lg"
            placeholder="Votre prénom"
            onChangeText={(text) => handleChange("prenoms", text)}
            value={userData?.prenoms}
          />
        </View>

        {/* Birth Date */}
        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-2">
            Date de naissance{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-3 rounded-lg"
            activeOpacity={0.67}
            onPress={() => {
              if (!showDatepicker)
                Toast.show({
                  type: "info",
                  text1: "Info",
                  text2: "Vous devez avoir plus de 18 ans!",
                  visibilityTime: 3000,
                });
              setShowDatepicker(!showDatepicker);
            }}
          >
            <Text className="font-roboto-bold">
              {userData?.naissance?.toLocaleDateString() || "Sélectionnez votre date de naissance"}
            </Text>
            <Ionicons name={"calendar"} size={25} color={"rgba(0,0,0,0.7)"} />
          </TouchableOpacity>
        </View>

        {showDatepicker && (
          <View className="p-4 bg-white m-4 rounded-lg">
            <DateTimePicker
              maxDate={dayjs().subtract(18, "years").toDate()}
              minDate={dayjs().subtract(100, "years").toDate()}
              mode="single"
              date={parseDateType(userData?.naissance)}
              onChange={({ date }) => {
                setShowDatepicker(false);
                handleChange("naissance", date);
              }}
              styles={{
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
              }}
            />
          </View>
        )}

        {/* City Selection */}
        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-2">
            Votre ville{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-3 rounded-lg"
            activeOpacity={0.67}
            onPress={() => setShowCityModal(true)}
          >
            <Text className="font-roboto-bold text-black">
              {userData?.ville ?? "Sélectionnez votre ville"}
            </Text>
            <Ionicons name="location" size={25} color={"rgba(0,0,0,0.7)"} />
          </TouchableOpacity>
        </View>

        {/* City Modal */}
        <Modal
          visible={showCityModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCityModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-[#0f0e0c] w-full rounded-xl p-4 h-[80%]">
              <Text className="text-lg font-roboto-light mb-4 text-white uppercase">
                Sélectionnez votre ville
              </Text>
              <TextInput
                className="border bg-gray-300 px-3 py-2 rounded-full mb-4 text-black font-roboto"
                placeholder="Rechercher une ville"
                placeholderTextColor="#888"
                onChangeText={(text) => {
                  setCitySearch(text);
                  const filtered = frenchCities.filter((city) =>
                    city.toLowerCase().includes(text.toLowerCase())
                  );
                  setFilteredCities(filtered);
                }}
                value={citySearch}
              />

              <ScrollView>
                {(citySearch ? filteredCities : frenchCities).map(
                  (city, index) => (
                    <TouchableOpacity
                      key={index}
                      className="py-2 border-b border-white/20 flex-row items-center gap-x-2"
                      onPress={() => {
                        handleChange("ville", city);
                        setCitySearch("");
                        setShowCityModal(false);
                      }}
                    >
                      <View className="h-4 w-4 rounded-full bg-white" />
                      <Text className="text-white text-base font-inter">
                        {city}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Profile Photo */}
        <View className="bg-[#2E2C2C] px-6 py-4 mx-4 rounded-lg">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px] mb-3">
            Photo de profil{" "}
            <Text className="text-red font-roboto-bold text-[16px]"> *</Text>
          </Text>
          <Text className="text-white/70 tracking-[-0.3px] font-roboto-condensed text-[12px] mb-3">
            Ajoutez une belle photo de vous pour commencer. Vous pourrez en ajouter d'autres plus tard.
          </Text>
          <TouchableOpacity
            className="rounded-[16px] bg-[#888686] items-center justify-center w-full h-[200px] overflow-hidden"
            onPress={pickImage}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage.uri }}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <View className="items-center justify-center">
                <PlusIconBlack />
                <Text className="text-white mt-2 text-center">
                  Appuyez pour ajouter une photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Terms and Conditions */}
        <TouchableOpacity
          className="flex-row gap-x-2 items-center justify-center mx-4"
          onPress={() => router.navigate("/Extras/CGU")}
        >
          <Text className="text-center text-white/50 tracking-[-0.3px] font-roboto-condensed-semibold mt-2">
            Conditions générales d&apos;utilisation
          </Text>
          <Octicons
            name="link-external"
            color={"rgba(255,255,255,0.5)"}
            size={20}
          />
        </TouchableOpacity>
        
        <View className="items-center justify-center my-2 flex-row gap-x-2 mx-4">
          <Switch
            trackColor={{ true: "#d83335", false: "#ddd" }}
            thumbColor={"white"}
            value={accepted}
            onValueChange={(value) => setAccepted(value)}
          />
          <Text className="text-white text-center tracking-[-0.3px] font-roboto-condensed text-[14px]">
            J&apos;accepte les CGU
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className="mt-4 self-center items-center justify-center rounded-[16] bg-[#D32C1C] py-3 px-8 mx-4"
          onPress={async () => {
            if (!accepted) {
              Toast.show({
                type: "error",
                text1: "CGU",
                text2:
                  "Vous devez lire et accepter les Conditions Générales d'Utilisation!",
                swipeable: true,
                visibilityTime: 4000,
              });
              return;
            }

            // Validate essential inputs only
            if (
              userData?.sex! <= 0 ||
              !userData?.pseudo ||
              !userData?.prenoms ||
              !userData?.naissance ||
              !userData?.ville ||
              !selectedImage
            ) {
              Toast.show({
                type: "info",
                text1: "Champs requis",
                text2: "Veuillez remplir tous les champs obligatoires",
                visibilityTime: 4000,
              });
              return;
            }

            if (!getAuth().currentUser) {
              return setShowPrompt(true);
            }

            setShowOverlay(true);
            setBusy(true);

            try {
              // Upload single photo
              const photoUrl = await uploadPhoto(
                getAuth().currentUser!.uid,
                selectedImage
              );

              // Update user data with essential info
              handleChange("profilePicUrl", photoUrl);
              handleChange("mesPhotos", [{ uri: photoUrl, id: selectedImage.id }]);
              handleChange("personalData", true);
              handleChange("acceptCGU", true);

              console.log("Uploaded photo URL: ", photoUrl);

              // Create/update user document
              if (userData) {
                await createUserIfNotExists("binome", userData);
              }

              setShowOverlay(false);
              setBusy(false);
              dispatch(setCreatingUserData(false));
              
              // Go directly to sport choice instead of all detailed screens
              router.navigate("/Users/SportChoice");
            } catch (error) {
              console.error("Upload error:", error);
              setShowOverlay(false);
              setBusy(false);
              
              let errorMessage = "Échec du téléchargement. Veuillez réessayer.";
              
              if (error instanceof Error) {
                if (error.message.includes("trop volumineux")) {
                  errorMessage = error.message;
                } else if (error.message.includes("network")) {
                  errorMessage = "Problème de connexion. Vérifiez votre internet.";
                }
              }
              
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: errorMessage,
                visibilityTime: 6000,
              });
            }
          }}
          disabled={busy}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[18px]">
            {busy ? "Création en cours..." : "Continuer mon aventure FitMatch !"}
          </Text>
        </TouchableOpacity>
        
        <Text className="text-white/50 text-center tracking-[-0.3px] font-roboto-condensed text-[12px] mx-4 mb-4">
          Ne vous inquiétez pas, vous pourrez compléter votre profil plus tard avec plus de photos, vidéos et préférences.
        </Text>
      </KeyboardAwareScrollView>

      {/* Loading Overlay */}
      <Modal visible={showOverlay} transparent>
        <View className="flex-1 items-center justify-center gap-y-4 bg-black/80">
          <Text className="text-white text-[20px] font-inter-bold">
            Création de votre compte
          </Text>
          <ActivityIndicator color="white" />
        </View>
      </Modal>

      {/* Sign Up Prompt Modal */}
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
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <Pressable
              style={{ ...StyleSheet.absoluteFillObject }}
              onPress={() => {
                if (!loading) setShowPrompt(false);
              }}
            />
            <View />
            <Animated.View
              entering={ZoomInDown.duration(600)}
              className="bg-[#0f0e0c] p-4 h-[60vh] w-[95vw] rounded-t-[30px]"
            >
              <KeyboardAwareScrollView>
                <View className="h-1 bg-white/30 self-center w-14 rounded-full my-2" />
                <Text className="text-white font-roboto-bold text-[20px] text-center mb-4">
                  Finalisation de votre compte
                </Text>
                <View className="gap-y-2 px-6 py-2">
                  <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                    Email
                  </Text>
                  <TextInput
                    className="bg-white rounded-lg p-3"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="votre@email.com"
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
                      className="flex-1 text-black font-roboto py-3"
                      placeholder="Mot de passe"
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
                      className="flex-1 text-black font-roboto py-3"
                      placeholder="Confirmer"
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
                  className="mt-8 mx-4 items-center justify-center rounded-[16] bg-[#D32C1C] py-3 px-8"
                  onPress={async () => {
                    if (loading || creatingUserData) return;

                    // Validate form
                    if (
                      signUpForm.email === "" ||
                      signUpForm.password === "" ||
                      signUpForm.confirmPassword === "" ||
                      signUpForm.password !== signUpForm.confirmPassword
                    ) {
                      Toast.show({
                        text1: "Inscription",
                        text2:
                          "Veuillez vérifier vos informations: email et mot de passe!",
                        type: "error",
                      });
                      return;
                    }

                    try {
                      dispatch(setCreatingUserData(true));

                      // Step 1: Sign up the user
                      await signUp(signUpForm.email, signUpForm.password);

                      if (error) {
                        throw new Error(error);
                      }

                      // Step 2: Prepare user data
                      handleChange("email", signUpForm.email);
                      handleChange("personalData", true);
                      handleChange("acceptCGU", true);
                      
                      const currentUser = getAuth().currentUser;
                      if (!currentUser) {
                        throw new Error("Utilisateur non authentifié");
                      }
                      const userId = currentUser.uid;

                      // Step 3: Upload photo
                      const photoUrl = await uploadPhoto(userId, selectedImage!);

                      // Update user data with media URLs
                      handleChange("mesPhotos", [{ uri: photoUrl, id: selectedImage!.id }]);
                      handleChange("profilePicUrl", photoUrl);

                      // Step 4: Create user document
                      if (userData) {
                        await createUserIfNotExists("binome", userData);
                      }

                      // Step 5: Sign in the user
                      await signIn(signUpForm.email, signUpForm.password);

                      // Success - auth listener will handle redirect
                      setShowPrompt(false);
                    } catch (err) {
                      console.error("Registration error:", err);
                      Toast.show({
                        text1: "Erreur",
                        text2: (err as Error).message || "Une erreur est survenue",
                        type: "error",
                      });
                    } finally {
                      dispatch(setCreatingUserData(false));
                    }
                  }}
                  disabled={loading || creatingUserData}
                >
                  {loading || creatingUserData ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[18px]">
                      Créer mon compte FitMatch !
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
          </View>
        </ScrollView>
        <Toast />
      </Modal>
    </SafeAreaView>
  );
};

export default Onboarding;
