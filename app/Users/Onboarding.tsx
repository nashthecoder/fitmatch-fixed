import PlusIconBlack from "@/components/Icons/PlusIconBlack";
import { parseDateType } from "@/helpers/dateTimePicker";
import { RootState } from "@/store/rootReducer";

import dayjs from "dayjs";

import {
  Fontisto,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
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
import Animated, { ZoomInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import DateTimePicker from "react-native-ui-datepicker";
import { useDispatch, useSelector } from "react-redux";

import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useHandleFormChange } from "@/customHooks/useHandleFormChange copy";
import { frenchCities, frenchCountries } from "@/data/cities";
import { createUserIfNotExists } from "@/helpers/firestore";
import { setCreatingUserData } from "@/store/slices/authSlice";
import { getAuth } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Video from "react-native-video";

const lightDatePickerStyles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
  },
  header: {
    backgroundColor: "#000",
  },
  headerLabel: {
    color: "#000000",
    fontWeight: "bold",
  },
  weekDayLabel: {
    color: "#333333",
  },
  dayText: {
    color: "#000000",
  },
  day: {
    borderColor: "#ccc",
  },
  selectedDay: {
    backgroundColor: "#007aff", // iOS blue
    borderRadius: 5,
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  disabledDayText: {
    color: "#d3d3d3", // light gray to show it's disabled
  },
  arrow: {
    tintColor: "#000",
  },
};

const initalValues = {
  nom: "",
  prenoms: "",
  naissance: "",
  ville: "",
  nationalite: "",
  photosUrl: [],
  videosUrl: [],
  sex: 0,
};

export type PhotoVideoMediaType = {
  uri: string;
  id: string;
  thumbnail?: any;
};

const Onboarding = () => {
  const dispatch = useDispatch();
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );
  const [selected, setSelected] = useState(0);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
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
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const [showDatepicker, setShowDatepicker] = useState(false);

  const [showWelcome, setShowWelcome] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [busy, setBusy] = useState(false);

  const [currentVideo, setCurrentVideo] = useState<any>();
  const playerRef = useRef(null);
  const { error, signIn, signOut, loading, signUp } = useEmailAuth();

  const storage = getStorage();

  const uploadMedia = async (
    userId: string,
    mediaItems: PhotoVideoMediaType[],
    folder: "mesPhotos" | "mesVideos"
  ): Promise<PhotoVideoMediaType[]> => {
    const uploadPromises = mediaItems.map(async (mediaItem) => {
      // Upload main media file
      const mediaFilename = `${folder}_${Date.now()}_${
        mediaItem.id
      }.${mediaItem.uri.split(".").pop()}`;
      const mediaRef = ref(
        storage,
        `users/${userId}/${folder}/${mediaFilename}`
      );

      const mediaResponse = await fetch(mediaItem.uri);
      const mediaBlob = await mediaResponse.blob();
      const mediaUpload = uploadBytesResumable(mediaRef, mediaBlob);
      await mediaUpload;
      const mediaUrl = await getDownloadURL(mediaUpload.snapshot.ref);

      // Upload thumbnail if it exists
      let thumbnailUrl = null;
      if (mediaItem.thumbnail) {
        const thumbFilename = `thumb_${mediaFilename}`;
        const thumbRef = ref(
          storage,
          `users/${userId}/${folder}/thumbs/${thumbFilename}`
        );

        const thumbResponse = await fetch(mediaItem.thumbnail);
        const thumbBlob = await thumbResponse.blob();
        const thumbUpload = uploadBytesResumable(thumbRef, thumbBlob);
        await thumbUpload;
        thumbnailUrl = await getDownloadURL(thumbUpload.snapshot.ref);
      }

      return {
        id: mediaItem.id,
        uri: mediaUrl,
        thumbnail: thumbnailUrl,
      };
    });

    return Promise.all(uploadPromises);
  };

  const handleVideoPress = (videoUri: string) => {
    setCurrentVideo(videoUri);
  };

  const closePlayer = () => {
    setCurrentVideo(null);
  };

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const handleChange = useHandleFormChange();

  useEffect(() => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    setSelected(userData?.sex ?? initalValues.sex);
    if (userData?.personalData === true) router.replace("/Users/SportChoice");
    if (currentUser && showWelcome) {
      Toast.show({
        type: "success",
        text1: "Bienvenue " + (currentUser.displayName ?? currentUser.email),
        text2: "Veuillez remplir vos données personnels",
      });
    }
  }, []);

  useEffect(() => {
    handleChange("sex", selected);
  }, [selected]);

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
        // If user selected only one image, replace at the specified id
        if (newImages.length === 1) {
          const updatedImages = [...prevImages];
          updatedImages[id] = newImages[0];
          return updatedImages;
        }
        // If user selected two images, replace the entire array
        else if (newImages.length === 2) {
          return newImages;
        }
        // Fallback (shouldn't happen due to selectionLimit)
        return prevImages;
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
        if (processedVideos.length === 1) {
          const updated = [...prev];
          updated[id] = processedVideos[0];
          return updated;
        }
        return processedVideos;
      });
    }
  };
  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      {busy && (
        <View className="absolute flex-1 z-20 top-0 bottom-0 left-0 right-0 items-center justify-center bg-black/80">
          {/* <BlurView
            blurType="dark"
            reducedTransparencyFallbackColor="black"
            blurRadius={15}
            style={{ ...StyleSheet.absoluteFillObject }}
          /> */}
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
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[20px] mb-4">
          Informations personnelles
        </Text>
        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Tu es{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center my-2 gap-2"
              onPress={() => setSelected(1)}
            >
              {selected === 1 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Homme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center my-2 gap-2"
              onPress={() => setSelected(2)}
            >
              {selected === 2 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Femme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center my-2 gap-2"
              onPress={() => setSelected(3)}
            >
              {selected === 3 ? (
                <View className="w-[14] h-[14] rounded-full bg-red border-4 border-white" />
              ) : (
                <View className="w-[14] h-[14] rounded-full bg-white" />
              )}
              <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
                Autre
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Pseudo{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handleChange("pseudo", text)}
            value={userData?.pseudo}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Nom{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handleChange("nom", text)}
            value={userData?.nom}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Prénom(s){" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TextInput
            className="bg-white font-roboto-bold"
            onChangeText={(text) => handleChange("prenoms", text)}
            value={userData?.prenoms}
          />
        </View>

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Né(e) le{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-2"
            activeOpacity={0.67}
            onPress={() => {
              if (!showDatepicker)
                Toast.show({
                  type: "info",
                  text1: "Info",
                  text2: "Vous devez avoir plus de 18 ans!",
                  text2Style: { fontSize: 15 },
                  text1Style: { fontSize: 16 },
                });
              setShowDatepicker(!showDatepicker);
            }}
          >
            <Text className="font-roboto-bold">
              {userData?.naissance?.toLocaleString().split(" ")[0]}
            </Text>
            <Ionicons name={"calendar"} size={25} color={"rgba(0,0,0,0.7)"} />
          </TouchableOpacity>
        </View>
        {showDatepicker && (
          <View className="p-4 bg-[white] m-4">
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
                  backgroundColor: "#007aff", // iOS blue
                  borderRadius: "50%",
                },
                selected_label: { color: "white" },
              }}
            />
          </View>
        )}

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Où habites-tu?{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-2"
            activeOpacity={0.67}
            onPress={() => setShowCityModal(true)}
          >
            <Text className="font-roboto-bold text-black">
              {userData?.ville ?? "Sélectionne une ville"}
            </Text>
            <Ionicons name="location" size={25} color={"rgba(0,0,0,0.7)"} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showCityModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCityModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-[#0f0e0c] w-full rounded-xl p-4 h-[80%]">
              <Text className="text-lg font-roboto-light mb-4 text-white uppercase">
                Sélectionne ta ville
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

        <View className="bg-[#2E2C2C] px-6 py-2">
          <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
            Nationalité{" "}
            <Text className="text-red font-roboto-bold text-[20px]"> *</Text>
          </Text>
          <TouchableOpacity
            className="bg-white h-12 w-full flex-row items-center justify-between px-2"
            activeOpacity={0.67}
            onPress={() => setShowCountryModal(true)}
          >
            <Text className="font-roboto-bold text-black">
              {userData?.nationalite ?? "Sélectionne une nationalité"}
            </Text>
            <Ionicons name="flag" size={25} color={"rgba(0,0,0,0.7)"} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={showCountryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-[#0f0e0c] w-full rounded-xl p-4 h-[80%]">
              <Text className="text-lg font-roboto-light mb-4 text-white uppercase">
                Sélectionne ta nationalité
              </Text>
              <TextInput
                className="border bg-gray-300 px-3 py-2 rounded-full mb-4 text-black font-roboto"
                placeholder="Rechercher un pays"
                placeholderTextColor="#888"
                onChangeText={(text) => {
                  setCountrySearch(text);
                  const filtered = frenchCountries.filter((country) =>
                    country.toLowerCase().includes(text.toLowerCase())
                  );
                  setFilteredCountries(filtered);
                }}
                value={countrySearch}
              />

              <ScrollView>
                {(countrySearch ? filteredCountries : frenchCountries).map(
                  (country: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      className="py-2 border-b border-white/20 flex-row items-center gap-x-2"
                      onPress={() => {
                        handleChange("nationalite", country);
                        setCountrySearch("");
                        setShowCountryModal(false);
                      }}
                    >
                      <View className="h-4 w-4 rounded-full bg-white" />
                      <Text className="text-white text-base font-inter">
                        {country}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

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
                blurType="dark"
                blurAmount={25}
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

            // Validate inputs
            if (
              userData?.sex! <= 0 ||
              userData?.nom === "" ||
              userData.prenoms === "" ||
              userData?.naissance === "" ||
              userData?.ville === "" ||
              userData.nationalite === "" ||
              selectedImages.length === 0
            ) {
              Toast.show({
                type: "info",
                text1: "Champs requis",
                text2: "Veuillez remplir tous les champs requis",
              });
              return;
            }

            if (!getAuth().currentUser) {
              return setShowPrompt(true);
            }

            setShowOverlay(true);
            setBusy(true);

            try {
              // Upload media files with their full structure
              const [uploadedPhotos, uploadedVideos] = await Promise.all([
                uploadMedia(
                  getAuth().currentUser!.uid,
                  selectedImages,
                  "mesPhotos"
                ),
                uploadMedia(
                  getAuth().currentUser!.uid,
                  selectedVideos,
                  "mesVideos"
                ),
              ]);

              // Update user data with the complete media objects
              handleChange("mesPhotos", uploadedPhotos);
              handleChange("mesVideos", uploadedVideos);
              handleChange("profilePicUrl", uploadedPhotos[0].uri);
              handleChange("personalData", true);
              handleChange("acceptCGU", true);

              console.log("uploaded photos >>> ", uploadedPhotos);
              console.log("uploaded videos >>> ", uploadedVideos);

              // Create/update user document
              await createUserIfNotExists("binome", userData);

              setShowOverlay(false);
              setBusy(false);
              dispatch(setCreatingUserData(false));
              router.navigate("/Users/SportChoice");
            } catch (error) {
              console.error("Upload error:", error);
              setShowOverlay(false);
              setBusy(false);
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2:
                  "Échec du téléchargement des médias. Veuillez réessayer.",
              });
            }
          }}
          disabled={busy}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            {busy ? "Traitement..." : "Je continue"}
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
            blurType="dark"
            blurAmount={4}
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
                        "Veuillez verifier vos informations: email et mot de passe!",
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
                    const userId = getAuth().currentUser!.uid;
                    console.log("User ID >> ", userId);

                    // Step 3: Upload media files
                    const [uploadedPhotos, uploadedVideos] = await Promise.all([
                      uploadMedia(userId, selectedImages, "mesPhotos"),
                      uploadMedia(userId, selectedVideos, "mesVideos"),
                    ]);

                    console.log("uploaded photos >>> ", uploadedPhotos);
                    console.log("uploaded videos >>> ", uploadedVideos);

                    // Update user data with media URLs
                    handleChange("mesPhotos", uploadedPhotos);
                    handleChange("mesVideos", uploadedVideos);
                    handleChange("profilePicUrl", uploadedPhotos[0].uri);

                    // Step 4: Create user document
                    await createUserIfNotExists("binome", userData);

                    // Step 5: Sign in the user
                    await signIn(signUpForm.email, signUpForm.password);

                    // Success - auth listener will handle redirect
                    setShowPrompt(false);
                  } catch (err) {
                    console.error("Registration error:", err);
                    Toast.show({
                      text1: "Erreur",
                      text2: err.message || "Une erreur est survenue",
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
