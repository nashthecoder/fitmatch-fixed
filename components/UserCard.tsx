import { sendLike, unlikeProfile } from "@/helpers/firestoreLikesActions";
import { calculateAge } from "@/helpers/timeAgo";
import { getResponsiveFontSize, isDesktop, isTablet } from "@/helpers/responsive";
import { UserData } from "@/store/slices/userSlice";
import { useResponsive } from "@/customHooks/useResponsive";

// Import your functions
import { Entypo } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";

const UserCard = ({ user: item, index }: { user: UserData; index: number }) => {
  const { width } = useWindowDimensions();
  const { spacing } = useResponsive();
  const [isLiked, setIsLiked] = React.useState(false); // Track like state locally
  console.log(item);

  if (!item) return null;

  // Responsive dimensions
  const getCardWidth = () => {
    if (isDesktop()) return Math.min(300, width * 0.25);
    if (isTablet()) return width * 0.4;
    return width * 0.45;
  };

  const getCardHeight = () => {
    const cardWidth = getCardWidth();
    return cardWidth * 1.1; // Maintain aspect ratio
  };

  const getNameFontSize = () => {
    return getResponsiveFontSize(22);
  };

  const getHitSlop = () => ({ top: 8, bottom: 8, left: 8, right: 8 });

  const handleLike = async () => {
    try {
      await sendLike(item.uid!);
      setIsLiked(true);
      Toast.show({
        type: "success",
        text1: "Like sent!",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        visibilityTime: 2000,
      });
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikeProfile(item.uid);
      setIsLiked(false);
      Toast.show({
        type: "success",
        text1: "Like removed",
        visibilityTime: 2000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        visibilityTime: 2000,
      });
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(150 * index)}
      className="bg-white rounded-[20px] overflow-hidden my-2 mx-1"
      style={{ 
        width: getCardWidth(),
        maxWidth: isDesktop() ? 320 : undefined,
      }}
      accessibilityRole="button"
      accessibilityLabel={`User profile: ${item?.nom} ${item?.prenoms}, ${calculateAge(item?.naissance as Timestamp)} years old`}
    >
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: "/Users/PublicProfile",
            params: { userId: item.uid },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`View profile of ${item?.nom} ${item?.prenoms}`}
        accessibilityHint="Opens the user's profile page"
      >
        <ImageBackground
          source={{ uri: item?.profilePicUrl }}
          style={{
            height: getCardHeight(),
            margin: 2,
            borderRadius: 18,
            overflow: "hidden",
          }}
          contentFit="cover"
          placeholder={require("@/assets/images/default-user-picture.png")}
        >
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
          <View className="absolute bottom-2 flex-1 w-full">
            <Text 
              className="text-wrap mx-4 text-white font-roboto-condensed-bold"
              style={{ fontSize: getNameFontSize() }}
              accessibilityRole="text"
            >
              {item?.nom} {item?.prenoms},
              {calculateAge(item?.naissance as Timestamp)}
            </Text>
            <View 
              className="bg-white rounded-[12px] px-2 mt-2 mx-2 flex-row items-center justify-evenly"
              accessibilityRole="toolbar"
              accessibilityLabel="User actions"
            >
              <TouchableOpacity 
                onPress={handleUnlike}
                hitSlop={getHitSlop()}
                accessibilityRole="button"
                accessibilityLabel="Unlike user"
                accessibilityHint="Remove like from this user"
              >
                <Entypo
                  name="cross"
                  size={isDesktop() ? 40 : isTablet() ? 37 : 35}
                  color={isLiked ? "gray" : "red"}
                />
              </TouchableOpacity>
              <View
                style={{ 
                  width: 2, 
                  height: isDesktop() ? 28 : isTablet() ? 26 : 24, 
                  backgroundColor: "#a24646" 
                }}
                accessibilityRole="none"
              />
              <TouchableOpacity 
                onPress={handleLike}
                hitSlop={getHitSlop()}
                accessibilityRole="button"
                accessibilityLabel="Like user"
                accessibilityHint="Send like to this user"
              >
                <Entypo 
                  name="heart" 
                  size={isDesktop() ? 35 : isTablet() ? 32 : 30} 
                  color="red" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(UserCard);
