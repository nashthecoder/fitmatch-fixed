import { db } from "@/config/firebase";
import { sendLike } from "@/helpers/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

type UserProfile = {
  uid: string;
  name: string;
  age: number;
  photoURL: string;
  personalData: boolean;
};

const SWIPE_THRESHOLD = width * 0.3;

interface SwipeCardProps {
  profile: UserProfile;
  index: number;
  currentIndex: number;
  onSwipe: (direction: "left" | "right") => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  index,
  currentIndex,
  onSwipe,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: () => {
        scale.value = withSpring(1.05);
      },
      onActive: (event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      },
      onEnd: (event) => {
        const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;
        const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;

        if (shouldSwipeRight) {
          translateX.value = withTiming(width * 1.5, { duration: 300 });
          translateY.value = withTiming(
            event.translationY + event.velocityY * 0.1,
            { duration: 300 }
          );
          runOnJS(onSwipe)("right");
        } else if (shouldSwipeLeft) {
          translateX.value = withTiming(-width * 1.5, { duration: 300 });
          translateY.value = withTiming(
            event.translationY + event.velocityY * 0.1,
            { duration: 300 }
          );
          runOnJS(onSwipe)("left");
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          scale.value = withSpring(1);
        }
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-width, 0, width],
      [-30, 0, 30],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    const cardOffset = index - currentIndex;
    const stackScale = interpolate(
      cardOffset,
      [0, 1, 2],
      [1, 0.95, 0.9],
      Extrapolate.CLAMP
    );

    const stackTranslateY = interpolate(
      cardOffset,
      [0, 1, 2],
      [0, -10, -20],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + stackTranslateY },
        { rotate: `${rotation}deg` },
        { scale: scale.value * stackScale },
      ],
      opacity: cardOffset === 0 ? opacity : 1,
      zIndex: 100 - cardOffset, // Higher zIndex for newer cards
    };
  });

  if (index < currentIndex || index > currentIndex + 2) {
    return null;
  }

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      enabled={index === currentIndex}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: profile.photoURL }} style={styles.image} />
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

interface SwipeDirectionProps {
  direction: "left" | "right" | null;
}

const SwipeDirection: React.FC<SwipeDirectionProps> = ({ direction }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    if (direction) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1);

      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0.5, { duration: 300 });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [direction]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!direction) return null;

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      {direction === "left" && (
        <FontAwesome name="times-circle" size={80} color="red" />
      )}
      {direction === "right" && (
        <FontAwesome name="heart" size={80} color="green" />
      )}
    </Animated.View>
  );
};

export default function SwipePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, "users"),
          where("personalData", "==", true)
        );
        const querySnapshot = await getDocs(usersQuery);

        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({
            uid: doc.id,
            name: `${data.prenoms} ${data.nom}`,
            age: calculateAge(data.naissance),
            photoURL: data.profilePicUrl,
            personalData: data.personalData,
          });
        });

        setProfiles(users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const calculateAge = (birthDate: string) => {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const handleSwipe = async (direction: "left" | "right") => {
    setSwipeDirection(direction);
    Vibration.vibrate(50);

    if (direction === "right") {
      // Send like when swiping right
      await sendLike(profiles[currentIndex].uid);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      const nextIndex = currentIndex + 1;

      if (nextIndex >= profiles.length) {
        // No more profiles, redirect to home
        router.replace("/(root)/Home");
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 300);
  };

  const handleSkip = () => {
    router.replace("/(root)/Home");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Loading profiles...</Text>
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>No profiles available</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Skip button at top right */}
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>

        <View style={styles.cardContainer}>
          {profiles.map((profile, index) => (
            <SwipeCard
              key={profile.uid}
              profile={profile}
              index={index}
              currentIndex={currentIndex}
              onSwipe={handleSwipe}
            />
          ))}
        </View>

        <SwipeDirection direction={swipeDirection} />

        {/* Progress indicators */}
        <View style={styles.indicatorContainer}>
          {profiles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index < currentIndex && styles.indicatorPassed,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    position: "relative",
    width: width * 0.85,
    height: height * 0.6,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: "85%",
    resizeMode: "cover",
  },
  name: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: "600",
  },
  iconContainer: {
    position: "absolute",
    top: height * 0.15,
    alignSelf: "center",
    zIndex: 10,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transform: [{ scale: 1.2 }],
  },
  indicatorPassed: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 100,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
