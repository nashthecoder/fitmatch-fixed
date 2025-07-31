import LikesComponent from "@/components/LikesComponent";
import { calculateAge } from "@/helpers/timeAgo";
import { UserData } from "@/store/slices/userSlice";
import { AntDesign, Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import { db } from "../../config/firebase"; // Adjust path to your firebase config

const PublicProfile = () => {
  const { userId }: { userId: string } = useLocalSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = Dimensions.get("window");

  // Inside your component:
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          throw new Error("No user ID provided");
        }

        const userDocRef = doc(db, "users", userId as string);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as UserData;
          setUserData(data);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        setError(err?.message!);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 w-screen h-screen items-center justify-center bg-black">
        <ActivityIndicator size="large" color={"white"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      <ScrollView className="bg-[#2e2c2c]" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-2 bg-black">
          <Text
            style={{ fontSize: 32, letterSpacing: -0.3 }}
            className="text-white font-roboto-condensed"
          >
            {userData.pseudo || `${userData.prenoms} ${userData.nom}`},{" "}
            {calculateAge(userData?.naissance as Timestamp)}
          </Text>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 66, height: 45 }}
          />
        </View>
        <View className="w-[100vw] h-[100vw] bg-white/50">
          <View className="m-4 absolute top-2 left-0 right-0 flex-row justify-between">
            <CircularProgress
              value={userData?.percentage}
              activeStrokeColor={"#f36c62"}
              inActiveStrokeColor="#37363b"
              activeStrokeWidth={10}
              inActiveStrokeWidth={10}
              circleBackgroundColor="#FFF"
              showProgressValue
              valueSuffix="%"
              radius={40}
            />

            <TouchableOpacity hitSlop={8}>
              <Entypo name="dots-three-vertical" size={25} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="w-[100vw] h-[100vw]"
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* Photos */}
            {userData.mesPhotos?.map((photo, index) => (
              <View key={`photo-${index}`} className="w-[100vw] h-[100vw]">
                <Image
                  source={{ uri: photo.uri }} // Assuming PhotoVideoMediaType has a url property
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}

            {/* Videos */}
            {userData.mesVideos?.map((video, index) => (
              <View key={`video-${index}`} className="w-[100vw] h-[100vw]">
                <Video
                  source={{ uri: video.uri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  paused={currentIndex !== userData?.mesPhotos?.length! + index} // Only play when visible
                  repeat
                  controls
                />
              </View>
            ))}
            {userData.mesPhotos?.length === 0 &&
              userData.mesVideos?.length === 0 && (
                <View className="w-[100vw] h-[100vw] items-center justify-center z-10">
                  <Text className="text-white font-inter-bold text-[20px]">
                    Aucune image disponible
                  </Text>
                </View>
              )}
          </ScrollView>
          {/* Pagination indicators */}
          {(userData.mesPhotos?.length || 0) +
            (userData.mesVideos?.length || 0) >
            1 && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
              {Array.from({
                length:
                  (userData.mesPhotos?.length || 0) +
                  (userData.mesVideos?.length || 0),
              }).map((_, index) => (
                <View
                  key={`indicator-${index}`}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}
          <View className="absolute bottom-0 left-0 right-0">
            <LikesComponent userId={userId} />
          </View>
        </View>
        <View className="flex-row items-center gap-6 p-4 bg-black w-full">
          <FontAwesome6
            name="quote-left"
            size={35}
            color="rgba(255,255,255,1)"
          />
          <Text className="text-white font-roboto-bold text-[20px] -tracking-|0.3px]">
            A propos de moi
          </Text>
        </View>
        <View className="w-[100vw] bg-black py-4">
          <Text className="font-roboto-condensed-light-italic text-white text-|18px] -tracking-[0.3px] px-4 text-wrap bg-black">
            {userData?.bio ?? "Pas de bio"}
          </Text>
        </View>

        <View className="bg-black w-[100vw] p-4 my-2">
          <View className="flex-row items-center gap-2">
            <AntDesign name="search1" color="white" size={30} />
            <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
              Je chercher:{" "}
            </Text>
          </View>
          <Text className="text-white font-roboto-condensed-light-italic text-[18px] ml-12 my-2">
            {userData.objectifDuCoeur}
          </Text>
        </View>

        <View className="bg-black w-[100vw] p-4 my-2">
          <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
            Bon à savoir:{" "}
          </Text>
          <View className="flex-row items-center gap-2 ml-12 my-2">
            <Ionicons name="barbell" color="white" size={30} />
            <Text className="font-roboto-condensed-light text-[20px] text-white -tracking-[0.3px]">
              {userData.sportExtreme}
            </Text>
          </View>
        </View>

        <View className="bg-black w-[100vw] p-4 my-2">
          <View className="flex-row items-center gap-2 my-2">
            <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
              Nationalité:{" "}
            </Text>
            <Text className="font-roboto-light text-white text-[18px] -tracking-[0.3px]">
              {userData.nationalite}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 my-2">
            <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
              Mode d&apos;alimentation:{" "}
            </Text>
            <Text className="font-roboto-light text-white text-[18px] -tracking-[0.3px]">
              {userData.diet}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 my-2 flex-wrap">
            <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
              Ce qui me définit le mieux:{" "}
            </Text>
            <View className="flex-1">
              <Text className="font-roboto-light text-white text-[18px] -tracking-[0.3px] text-end text-wrap">
                {userData.personality}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 my-2 flex-wrap">
            <Text className="font-roboto-bold text-[20px] text-white -tracking-[0.3px]">
              Vibe du week-end:{" "}
            </Text>
            <View className="flex-1">
              <Text className="font-roboto-light text-white text-[18px] -tracking-[0.3px] text-end text-wrap">
                {userData.weekendVibes?.map((vibe) => {
                  return "- " + vibe + ",\n";
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Add more fields as needed */}
    </SafeAreaView>
  );
};

export default PublicProfile;
