import { db } from "@/config/firebase";
import { getTimeAgo } from "@/helpers/timeAgo";
import { router, useLocalSearchParams } from "expo-router";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "react-native-video";

const { width } = Dimensions.get("window");

type Story = {
  id: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  createdAt: Timestamp;
  expiredOn: Timestamp;
  posterInfo: {
    uid: string;
    profilePicUrl?: string;
    username: string;
  };
};

export default function ViewStory() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const playerRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Get current story
  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.mediaType === "video";

  // Video player setup for video stories

  // Fetch stories based on userId or all active stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const now = Timestamp.now();

        let q;
        if (userId) {
          q = query(
            collection(db, "stories"),
            where("posterInfo.uid", "==", userId),
            where("expiredOn", ">", now)
          );
        } else {
          q = query(collection(db, "stories"), where("expiredOn", ">", now));
        }

        const querySnapshot = await getDocs(q);
        const fetchedStories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Story[];

        if (fetchedStories.length === 0) {
          setError(userId ? "Cette story a expiré" : "Aucune story disponible");
        } else {
          setStories(fetchedStories);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Erreur de chargement des stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [userId]);

  // Handle story progression
  useEffect(() => {
    if (!currentStory || loading) return;

    // Reset progress animation
    progressAnim.setValue(0);

    // Start 15s timer for current story
    Animated.timing(progressAnim, {
      toValue: width,
      duration: 15000,
      useNativeDriver: false,
    }).start();

    // Auto-advance to next story after 15s
    timerRef.current = setTimeout(() => {
      goToNextStory();
    }, 15000);

    // Play video if current story is video

    return () => {
      clearTimeout(timerRef.current!);
    };
  }, [currentIndex, currentStory, loading]);

  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // No more stories - go back
      router.back();
    }
  };

  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-red-500 px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Progress bars for each story */}
      <View className="flex-row px-2 pt-2 absolute top-4 left-0 right-0 z-10">
        {stories.map((_, index) => (
          <View
            key={index}
            className="h-1 bg-gray-500 mx-1 flex-1 rounded-full"
            style={{ opacity: index === currentIndex ? 1 : 0.5 }}
          >
            {index === currentIndex && (
              <Animated.View
                className="h-full bg-white rounded-full"
                style={{ width: progressAnim }}
              />
            )}
          </View>
        ))}
      </View>

      {/* Story content */}
      <View className="flex-1">
        {isVideo ? (
          <Video ref={playerRef} style={{ flex: 1 }} />
        ) : (
          <Image
            source={{ uri: currentStory.mediaUrl }}
            className="flex-1"
            resizeMode="contain"
          />
        )}
      </View>

      {/* User info header */}
      <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: currentStory.posterInfo.profilePicUrl || DEFAULT_AVATAR,
            }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="text-white font-bold">
              {currentStory.posterInfo.username}
            </Text>
            <Text className="text-white text-xs">
              {getTimeAgo(currentStory.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Navigation controls */}
      <View className="absolute top-0 bottom-0 left-0 right-0 flex-row">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={0.8}
          onPress={goToPrevStory}
        />
        <TouchableOpacity
          className="flex-1"
          activeOpacity={0.8}
          onPress={goToNextStory}
        />
      </View>

      {/* Close button */}
      <TouchableOpacity
        className="absolute top-4 right-4 z-10 p-2"
        onPress={() => router.back()}
      >
        <Text className="text-white text-lg">✕</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const DEFAULT_AVATAR = "https://example.com/default-avatar.jpg";
