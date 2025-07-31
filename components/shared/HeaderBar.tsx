import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import GearIcon from "../Icons/GearIcon";
import HandShakeIcon from "../Icons/HandShakeIcon";

const HeaderBar = () => {
  return (
    <View className="flex-row items-center justify-between absolute z-10 mt-8 w-full h-[60] overflow-hidden">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-[66] h-[43] m-4"
        resizeMode="cover"
      />
      <View className="flex-row items-center gap-4 mr-4">
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.navigate("/(root)/Home/NewPost")}
        >
          <AntDesign name="plus" size={32} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <HandShakeIcon />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <GearIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
