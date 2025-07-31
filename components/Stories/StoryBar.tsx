import { useUserList } from "@/customHooks/useUserList";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlusIconWhite from "../Icons/PlusIconWhite";
import UserProfile from "./UserProfile";

const StoryBar = () => {
  const { data: userList, isLoading, isError } = useUserList();

  if (isLoading) {
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="items-center justify-center py-4">
        <Text className="text-white">Erreur de chargement</Text>
      </View>
    );
  }

  return (
    <View className="flex-row gap-x-2 border-b pb-2 border-b-white/30">
      <ScrollView
        className="w-full"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pl-4 pr-4 gap-x-6"
      >
        <TouchableOpacity
          className="bg-[#d22c1c] items-center justify-center rounded-full h-[71px] w-[71px]"
          onPress={() => router.navigate("/Home/NewStory")}
        >
          <PlusIconWhite />
        </TouchableOpacity>
        {userList?.map((user) => (
          <UserProfile
            key={user.uid}
            username={user.prenoms}
            profileImg={
              user.profilePicUrl
                ? { uri: user.profilePicUrl }
                : require("@/assets/images/default-user-picture.png")
            }
            userActive={false}
            newStory
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default StoryBar;

const styles = StyleSheet.create({});
