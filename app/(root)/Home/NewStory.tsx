import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import PhotoVIdeoIcon from "@/components/Icons/Posts/PhotoVideoIcon";
import { firebaseApp } from "@/config/firebase";
import { uploadMediaAsync } from "@/helpers/firestore"; // Your existing helper
import { RootState } from "@/store/rootReducer";
import { BlurView } from "@react-native-community/blur";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "react-native-video";
import { useSelector } from "react-redux";

const db = getFirestore(firebaseApp);

export default function NewStory() {
  const queryClient = useQueryClient();
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  const user = getAuth().currentUser;
  const userData = useSelector((state: RootState) => state.user.data);

  const storyMutation = useMutation({
    mutationFn: async () => {
      if (!media) throw new Error("No media selected");

      const userId = user?.uid!;
      const mediaType = media.type;

      const now = Date.now();
      const filePath = `stories/${userId}/${now}_${mediaType}`;
      const mediaUrl = await uploadMediaAsync(media.uri, filePath);

      const newStory = {
        mediaType,
        mediaUrl,
        createdAt: serverTimestamp(),
        expiredOn: Timestamp.fromDate(
          new Date(Date.now() + 24 * 60 * 60 * 1000)
        ),
        posterInfo: {
          uid: userId,
          nom: userData.nom,
          prenoms: userData.prenoms,
          profilePicUrl: userData.profilePicUrl,
        },
      };

      await addDoc(collection(db, "stories"), newStory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setMedia(null);
      router.back();
    },
    onError: (err) => {
      console.error("Story upload failed:", err);
    },
    onSettled: () => setIsPosting(false),
  });

  const pickMedia = async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.8,
      allowsEditing: true,
      videoMaxDuration: 30, // max 30s
    });

    if (!canceled && assets.length > 0) {
      const asset = assets[0];
      if (asset.duration && asset.duration > 30_000) {
        alert("Vidéo trop longue. Max: 30 secondes.");
        return;
      }
      setMedia(asset);
    }
  };

  const handleStoryPost = () => {
    if (isPosting || !media) return;
    setIsPosting(true);
    storyMutation.mutate();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0f0e0c] justify-between ">
      <TouchableOpacity
        className="bg-dark h-[36px] w-[36px] justify-center items-center absolute z-10 p-3 mt-4"
        style={{ top: 10, left: 10 }}
        onPress={() => router.back()}
      >
        <BackBTNIcon />
      </TouchableOpacity>

      <View className="flex-1 justify-center items-center px-6">
        {media ? (
          media.type === "image" ? (
            <Image
              source={{ uri: media.uri }}
              className="w-[300px] h-[400px] rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Video
              source={{ uri: media.uri }}
              resizeMode="contain"
              style={{ width: 300, height: 400, borderRadius: 20 }}
            />
          )
        ) : (
          <Text className="text-white text-center font-roboto-condensed text-xl">
            Aucun média sélectionné
          </Text>
        )}
      </View>

      <View className="bg-[#d9d9d9] bottom-0 h-[36vh] z-10 w-full gap-y-1 px-4 py-4">
        <TouchableOpacity
          onPress={pickMedia}
          className="bg-white/10 px-4 py-2 flex-row items-center gap-x-4 h-[50px] rounded-xl"
        >
          <PhotoVIdeoIcon />
          <Text className="text-black font-roboto-condensed text-[20px]">
            Photo / Vidéo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleStoryPost}
          className="bg-[#f22c2c] mt-4 rounded-full py-3 px-4 flex-row items-center justify-center"
          disabled={!media || isPosting}
        >
          {isPosting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-[20px] font-roboto-bold">
              PUBLIER LA STORY
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal transparent visible={isPosting}>
        <BlurView
          blurType="dark"
          blurAmount={15}
          reducedTransparencyFallbackColor="black"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <View className="flex-1 items-center justify-center gap-4">
          <Animated.Text
            entering={FadeInDown.duration(1000).delay(150)}
            className="font-roboto-bold text-white text-[18px]"
          >
            Création de la story...
          </Animated.Text>
          <ActivityIndicator color={"red"} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
