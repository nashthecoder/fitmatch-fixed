import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import ChevronDownWhite from "@/components/Icons/ChevronDownWhiteIcon";
import GlobeIcon from "@/components/Icons/GlobeIcon";
import PhotoVIdeoIcon from "@/components/Icons/Posts/PhotoVideoIcon";
import TagEventIcon from "@/components/Icons/Posts/TagEventIcon";
import TagPlaceIcon from "@/components/Icons/Posts/TagPlaceIcon";
import TagUserIcon from "@/components/Icons/Posts/TagUserIcon";
import BicepsIcon from "@/components/Icons/Quiz/BicepsIcon";
import WeightsIcon from "@/components/Icons/WeightsIcon";
import { db, firebaseApp } from "@/config/firebase"; // your config path
import { RootState } from "@/store/rootReducer";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import { getAuth } from "firebase/auth";
import {
  FieldValue,
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export type UserPost = {
  id: string;
  posterInfo: {
    uid: string;
    username: string;
    profilePicUrl?: string;
    verified?: boolean;
  };
  text: string;
  createdAt: Timestamp | FieldValue;
  mediaUrl: string;
  mediaType?: "photo" | "video" | "";
  thumbnailUrl?: string; // only if video
  taggedUsers: string[];
  taggedEventId?: string;
  taggedPlaceName?: string;
  likes: {
    count: number;
    by: string[]; // array of user UIDs
  };
  comments: {
    count: number;
    by: string[];
  };
  shares: {
    count: number;
    by: string[];
  };
};

const NewPost = () => {
  const { top } = useSafeAreaInsets();
  const userData = useSelector((state: RootState) => state.user.data);
  const [isPosting, setIsPosting] = useState(false);
  const queryClient = useQueryClient(); // Get the query client
  const storage = getStorage(firebaseApp);
  const horizontalScrollviewRef = useRef<ScrollView>(null);

  const [text, setText] = useState("");
  const [media, setMedia] = useState<{
    uri: string;
    type: "photo" | "video" | "";
    thumbnailUri?: string;
  } | null>();

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
      videoMaxDuration: 30,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      console.log(asset.uri);
      if (asset.type === "video") {
        const thumbnail = await VideoThumbnails.getThumbnailAsync(asset.uri, {
          time: 1500,
        });
        setMedia({
          uri: asset.uri,
          type: "video",
          thumbnailUri: thumbnail.uri,
        });
      } else {
        setMedia({
          uri: asset.uri,
          type: "photo",
        });
      }
    }
  };

  const uploadMediaAsync = async (uri: string, path: string) => {
    try {
      const response = await fetch(uri);
      console.log(response);
      const blob = await response.blob();
      console.log(blob);
      const fileRef = ref(storage, path);
      console.log(fileRef);
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Create mutation for posting
  const postMutation = useMutation({
    mutationFn: async (postData: Omit<UserPost, "id">) => {
      const userId = getAuth().currentUser!.uid;

      // Upload media if exists
      let mediaUrl = null;
      let thumbnailUrl = null;

      if (postData.mediaUrl === "" && media) {
        console.log({
          url: media.uri,
          path: `posts/${userId}/${Date.now()}_${media.type}`,
        });
        mediaUrl = await uploadMediaAsync(
          media.uri,
          `posts/${userId}/${Date.now()}_${media.type}`
        );

        if (media.type === "video" && media.thumbnailUri) {
          thumbnailUrl = await uploadMediaAsync(
            media.thumbnailUri,
            `posts/${userId}/${Date.now()}_thumbnail.jpg`
          );
        }
      }

      console.log({ mediaUrl, thumbnailUrl, mediaType: postData.mediaType });

      const newPost = {
        ...postData,
        posterInfo: {
          uid: userId,
          username: userData.nom + " " + userData.prenoms,
          profilePicUrl: userData?.profilePicUrl ?? "",
          verified: userData?.verified ?? false,
        },
        createdAt: serverTimestamp(),
        mediaUrl,
        thumbnailUrl,
      };

      await addDoc(collection(db, "posts"), newPost);
    },
    onSuccess: () => {
      // Invalidate the posts query to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Toast.show({
        type: "success",
        text1: "Succès!",
        text2: "Votre publication a été créé avec succès!",
      });
      // Reset form and navigate back
      setText("");
      setMedia(null);
      Vibration.vibrate(200);
      router.back();
    },
    onError: (error) => {
      console.error("Post upload failed:", error);
    },
    onSettled: () => setIsPosting(false),
  });

  const handlePost = async () => {
    if (isPosting) return;
    if (!text && (!media || media?.type === "")) return;

    setIsPosting(true);

    const postData: Omit<UserPost, "id"> = {
      text: text.trim(),
      mediaType: media?.type ?? "",
      mediaUrl: "", // Will be set in mutationFn
      thumbnailUrl: undefined,
      taggedUsers: [],
      taggedEventId: "",
      taggedPlaceName: "",
      likes: { count: 0, by: [] },
      comments: { count: 0, by: [] },
      shares: { count: 0, by: [] },
      posterInfo: {
        // Will be overwritten in mutationFn
        uid: "",
        username: "",
        profilePicUrl: "",
        verified: false,
      },
      createdAt: serverTimestamp(),
    };

    postMutation.mutate(postData);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f0e0c] justify-between">
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
        style={{ top: top + 8 }}
        resizeMode="cover"
        className="h-[48px] w-[93.45px]  absolute right-4"
      />
      <Animated.View
        entering={FadeInDown.duration(850).delay(150)}
        className="pt-14"
      >
        <Animated.Text className="text-white font-roboto-condensed text-[28px] mx-4 -tracking-[0.3px]">
          Créer une publication
        </Animated.Text>
        <ScrollView
          className="pb-6"
          contentContainerClassName="pb-[30vh]"
          ref={horizontalScrollviewRef}
        >
          <View className="mx-4 border border-white rounded-[30px] p-2 my-2">
            {/** Header Post */}
            <View className="flex-row gap-4 ">
              <View className="bg-[#e4e6e7] items-center justify-center h-24 w-24 rounded-full">
                <Image
                  source={require("@/assets/images/default-user-picture.png")}
                  className="h-20 w-20 rounded-full"
                />
              </View>
              <View>
                <Text className="font-roboto-condensed -tracking-|0.3px] text-white text-[24px] text-wrap max-w-[50vw] my-1 mx-2">
                  {userData.nom} {userData.prenoms}
                </Text>
                <View className="flex-row flex-wrap gap-x-4 gap-y-1  max-w-[60vw]">
                  <TouchableOpacity
                    className="flex-row bg-[#f22c2c] rounded-xl gap-2 items-center px-2"
                    activeOpacity={0.75}
                  >
                    <GlobeIcon />
                    <Text className="font-inter-semibold text-[14px] text-white">
                      Public
                    </Text>
                    <ChevronDownWhite />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row bg-[#f22c2c] rounded-xl gap-2 items-center px-2"
                    activeOpacity={0.75}
                  >
                    <WeightsIcon />
                    <Text className="font-inter-semibold text-[14px] text-white">
                      Sport associé
                    </Text>
                    <ChevronDownWhite />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row bg-[#f22c2c] rounded-xl gap-2 items-center px-2"
                    activeOpacity={0.75}
                  >
                    <BicepsIcon />
                    <Text className="font-inter-semibold text-[14px] text-white">
                      Humeur
                    </Text>
                    <ChevronDownWhite />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <ScrollView className="h-[17vh] mx-4 mt-4 mb-5">
              <TextInput
                placeholder="Quoi de neuf?"
                placeholderTextColor={"rgba(255,255,255,0.5)"}
                value={text}
                onChangeText={setText}
                className="p-2 text-white/60 text-[18px] font-roboto-condensed -tracking-[0.3px] align-top rounded-xl overflow-hidden bg-white/5 min-h-[16.5vh] max-w-[75vw]"
                multiline
                maxLength={500}
              />
            </ScrollView>
            <TouchableOpacity
              onPress={handlePost}
              className="absolute bottom-0 bg-red rounded-full py-1 px-2 right-0 w-[40vw] items-center justify-center flex-row gap-x-2"
              activeOpacity={0.6}
              style={{
                transform: [{ translateX: "-25%" }, { translateY: "50%" }],
              }}
              disabled={isPosting}
            >
              <Text className="text-white font-roboto-bold text-[25px] tracking-[-0.3px]">
                PUBLIER
              </Text>
              {isPosting && <ActivityIndicator color={"white"} />}
            </TouchableOpacity>
          </View>
          {media?.type && (
            <View className="border py-4 rounded-3xl mx-4 border-white items-center justify-center mt-10 mb-10">
              <ImageBackground
                source={{ uri: media?.thumbnailUri ?? media?.uri }}
                className="w-[80vw] h-[35vh] ml-2 mr-2 items-center justify-center"
                resizeMode="cover"
              >
                {media.type === "video" && (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    className="w-16 h-16 bg-black/70 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-2xl">▶</Text>
                  </TouchableOpacity>
                )}
              </ImageBackground>
              <TouchableOpacity
                hitSlop={8}
                activeOpacity={0.5}
                className="absolute h-12 w-12 bg-red-900/70  rounded-full items-center justify-center -top-5 right-4"
                onPress={() => {
                  setMedia({ type: "", uri: "", thumbnailUri: "" });
                  horizontalScrollviewRef?.current?.scrollTo({ x: 0 });
                }}
              >
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
      <View className="bg-[#d9d9d9] absolute bottom-0 h-[28vh] z-20 w-full gap-y-1">
        <View className="bg-[#4D4C4C] rounded-full my-1 self-center h-[5px] w-[60px]"></View>
        <TouchableOpacity
          onPress={pickMedia}
          className="bg-white/10 px-4 py-2 flex-row items-center gap-x-4 h-[50px] overflow-hidden"
        >
          <PhotoVIdeoIcon />
          <Text className="text-black font-roboto-condensed text-[20px]">
            Photo / Vidéo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white/10 px-4 py-2 flex-row items-center gap-x-4 h-[50px] overflow-hidden">
          <TagUserIcon />
          <Text className="text-black font-roboto-condensed text-[20px]">
            Identifier des personnes
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity className="bg-white/10 px-4 py-2 flex-row items-center gap-x-4  h-[50px] overflow-hidden">
          <Ionicons name="musical-notes-sharp" size={40} color="black" />
          <Text className="text-black font-roboto-condensed text-[20px]">
            Musique
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity className="bg-white/10 px-4  py-2 flex-row items-center gap-x-4  h-[50px] overflow-hidden">
          <TagEventIcon />
          <Text className="text-black font-roboto-condensed text-[20px] -ml-2">
            Identifier un évènement
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white/10 px-4 py-2 flex-row items-center gap-x-4  h-[50px] overflow-hidden">
          <TagPlaceIcon />
          <Text className="text-black font-roboto-condensed text-[20px]">
            Identifier un lieu
          </Text>
        </TouchableOpacity>
      </View>
      <Modal transparent visible={isPosting}>
        <BlurView
          tint="dark"
          intensity={15}
          reducedTransparencyFallbackColor="black"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <View className="flex-1 items-center justify-center gap-4">
          <Animated.Text
            entering={FadeInDown.duration(1000).delay(150)}
            className="font-roboto-bold text-white text-[18px]"
          >
            Création de la publication...
          </Animated.Text>
          <ActivityIndicator color={"red"} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NewPost;
