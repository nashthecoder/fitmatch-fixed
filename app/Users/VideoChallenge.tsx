import DownloadIcon from "@/components/Icons/DownloadIcon";
import { updateUserData, uploadVideoChallenge } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { setUserData } from "@/store/slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Video } from "react-native-video";
import { useDispatch, useSelector } from "react-redux";

const VideoChallenge = () => {
  const [uploading, setUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoPlayerRef = useRef(null);
  const userData = useSelector((state: RootState) => state.user.data);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const MAX_DURATION = 30; // 30 seconds maximum

  const pickVideo = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Toast.show({
          type: "info",
          text1: "Permission required",
          text2: "We need access to your media library to upload videos",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: MAX_DURATION,
      });

      if (!result.canceled) {
        const selectedVideo = result.assets[0];
        if (
          selectedVideo.duration &&
          selectedVideo.duration > MAX_DURATION * 1000
        ) {
          Toast.show({
            type: "error",
            text1: "Video too long",
            text2: `Please select a video under ${MAX_DURATION} seconds`,
          });
          return;
        }
        setVideoUri(selectedVideo.uri);
        setVideoDuration(
          selectedVideo.duration ? selectedVideo.duration / 1000 : 0
        );
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Toast.show({
        type: "error",
        text1: "Failed to pick video",
      });
    }
  };

  const recordVideo = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Toast.show({
          type: "info",
          text1: "Permission required",
          text2: "We need access to your camera to record videos",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
        videoMaxDuration: MAX_DURATION,
      });

      if (!result.canceled) {
        const recordedVideo = result.assets[0];
        setVideoUri(recordedVideo.uri);
        setVideoDuration(
          recordedVideo.duration ? recordedVideo.duration / 1000 : 0
        );
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Toast.show({
        type: "error",
        text1: "Failed to record video",
      });
    }
  };

  const handleVideoUpload = async () => {
    if (!videoUri || uploading) return;

    try {
      setUploading(true);

      // Check duration again before upload
      if (videoDuration > MAX_DURATION) {
        Toast.show({
          type: "error",
          text1: "Video too long",
          text2: `Please select a video under ${MAX_DURATION} seconds`,
        });
        return;
      }

      const { videoUrl, thumbnailUrl } = await uploadVideoChallenge(videoUri);

      // Update user data with the new video
      const updatedUserData = {
        ...userData,
        videoChallenge: videoUrl,
        videoThumbnail: thumbnailUrl,
      };

      dispatch(setUserData(updatedUserData));
      await updateUserData({
        videoChallenge: videoUrl,
      });

      // Success feedback
      Vibration.vibrate(200);
      Toast.show({
        type: "success",
        text1: "Bravo",
        text2: "Ton video challenge est uploadé avec succès",
      });

      router.navigate("/Users/MiniQuiz");
    } catch (error) {
      console.error("Upload failed:", error);
      Toast.show({
        type: "error",
        text1: "Failed to upload video challenge",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex flex-1 bg-dark h-full w-full gap-2">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-[20px] gap-4"
      >
        <View className="flex-row items-center justify-between pr-4">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[66] h-[43] m-4"
            resizeMode="cover"
          />
        </View>

        {/* Video Preview Section */}
        <View className="items-center">
          {videoUri ? (
            <View className="h-[224px] w-[224px] bg-black rounded-full overflow-hidden">
              <Video
                ref={videoPlayerRef}
                source={{ uri: videoUri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
                paused={false}
                repeat={true}
                controls={false}
              />
              <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
                <Text className="text-white text-xs">
                  {videoDuration.toFixed(1)}s
                </Text>
              </View>
            </View>
          ) : (
            <View className="h-[224px] w-[224px] bg-[#D9D9D9] rounded-full items-center justify-center">
              <Text className="text-[#460000] font-roboto-condensed text-[1.7rem] tracking-[-0.3px] text-center">
                CERTIFICATION
              </Text>
              <Text
                className="text-[#B20000] mt-2 tracking-[-0.3px] text-[2.5rem] text-center font-roboto-condensed-extralight-italic"
                style={{ lineHeight: 28 }}
              >
                Challenge vidéo
              </Text>
              <View
                className="bg-[#940303] px-4 py-2 rounded-[13] absolute bottom-0"
                style={{
                  transform: [
                    { rotateZ: "-6.46deg" },
                    { translateX: 20 },
                    { translateY: "20%" },
                  ],
                }}
              >
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[1.125rem]">
                  1 mois PREMIUM offert
                </Text>
              </View>
            </View>
          )}

          {videoUri && (
            <TouchableOpacity
              className="mt-4 bg-[#D32C1C] rounded-full px-6 py-2"
              onPress={handleVideoUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-roboto-condensed text-[1.2rem]">
                  Upload Video
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Rest of your component remains the same */}
        <View className="mx-8 mt-8 mb-4 flex-row items-center justify-between">
          <Text
            className="tracking-[-0.3px] text-white font-roboto-condensed text-[0.95rem] max-w-[67vw]"
            numberOfLines={4}
          >
            Montre-nous ta passion en vidéo ! Envoie 15 sec de toi en pleine
            action sportive et gagne 1 mois Premium offert. La vidéo sera
            visible par les utilisateurs sur ton profil.
          </Text>
          <DownloadIcon />
        </View>

        <View className="self-center gap-y-2 w-[60vw]">
          <TouchableOpacity
            className="bg-white rounded-full p-4 items-center"
            onPress={recordVideo}
            disabled={uploading}
          >
            <Text className="text-[#CE0000] font-roboto-semicondensed-extrabold text-[1.2rem]">
              Prendre une vidéo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-full p-4 items-center"
            onPress={pickVideo}
            disabled={uploading}
          >
            <Text className="text-[#CE0000] font-roboto-semicondensed-extrabold text-[1.2rem]">
              Choisir une vidéo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border border-[#FF0000] rounded-full px-4 py-3 items-center"
            onPress={async () => {
              if (loading) return;
              setLoading(true);
              dispatch(setUserData({ ...userData, videoChallenge: "pass" }));
              await updateUserData({ videoChallenge: "pass" });
              setLoading(false);
              router.navigate("/Users/MiniQuiz");
            }}
            disabled={uploading}
          >
            <Text className="text-[#FFF] font-roboto text-[1.2rem]">
              Passer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Premium BOOST section */}
        {/* ... keep your existing premium boost section ... */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VideoChallenge;
