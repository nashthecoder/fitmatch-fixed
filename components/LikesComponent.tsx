import {
  sendLike,
  sendMessageRequest,
  sendSuperLike,
  unlikeProfile,
} from "@/helpers/firestoreLikesActions";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const LikesComponent = ({ userId }: { userId: string }) => {
  console.log(userId);
  const handleLike = async () => {
    try {
      await sendLike(userId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Like envoyé!",
        visibilityTime: 3000,
      });
    } catch (error) {
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: error.message,
      //     visibilityTime: 3000,
      //   });
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikeProfile(userId);
      //   Toast.show({
      //     type: "success",
      //     text1: "Success",
      //     text2: "Profile unliked",
      //     visibilityTime: 3000,
      //   });
    } catch (error) {
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: error.message,
      //     visibilityTime: 3000,
      //   });
    }
  };

  const handleSuperLike = async () => {
    try {
      await sendSuperLike(userId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "SuperLike envoyé!",
        visibilityTime: 3000,
      });
    } catch (error) {
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: error.message,
      //     visibilityTime: 3000,
      //   });
    }
  };

  const handleMessageRequest = async () => {
    Alert.prompt(
      "Send Message Request",
      "Enter your message:",
      async (message) => {
        if (message) {
          try {
            await sendMessageRequest(userId, message);
            Alert.alert("Success", "Message request sent!");
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        }
      }
    );
  };

  return (
    <View className="flex-row items-center justify-center gap-4 w-full py-4">
      <TouchableOpacity
        className="bg-red rounded-full h-[50px] w-[50px] items-center justify-center"
        onPress={handleUnlike}
      >
        <AntDesign name="close" size={35} color={"white"} />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-full h-[50px] w-[50px] items-center justify-center"
        onPress={handleSuperLike}
      >
        <AntDesign name="star" size={35} color={"red"} />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-red rounded-full h-[50px] w-[50px] items-center justify-center"
        onPress={handleLike}
      >
        <AntDesign name="heart" size={35} color={"white"} />
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-full h-[50px] w-[50px] items-center justify-center"
        onPress={handleMessageRequest}
      >
        <Ionicons name="chatbubble" size={35} color={"red"} />
      </TouchableOpacity>
    </View>
  );
};

export default LikesComponent;
