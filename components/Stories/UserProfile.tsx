import { Image } from "expo-image";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import React from "react";
import {
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VerifiedIcon from "../Icons/Posts/VerifiedIcon";

interface StoryProfileProps {
  username: string;
  profileImg: ImageSourcePropType;
  size?: number;
  borderColor?: string;
  newStory?: boolean;
  userActive?: boolean;
  age?: number;
  horizontal?: boolean;
  verified?: boolean;
  sponsored?: boolean;
}

const UserProfile: React.FC<StoryProfileProps> = ({
  username,
  profileImg,
  size = 71,
  borderColor = "#ff0000",
  newStory = false,
  userActive = false,
  age,
  horizontal = false,
  verified = false,
  sponsored = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: horizontal ? "row" : "column",
        alignItems: horizontal ? "flex-start" : "center",
        gap: 4,
      }}
      onPress={() =>
        router.navigate({
          pathname: "/ViewStory",
          params: { userId: getAuth().currentUser!.uid },
        })
      }
    >
      <View
        style={{
          width: size,
          height: size,
          borderWidth: newStory ? 0 : 1,
          borderColor: borderColor,
          borderRadius: size / 2,
        }}
      >
        <Image
          source={profileImg}
          placeholder={require("@/assets/images/default-user-picture.png")}
          style={{
            borderRadius: size / 2,
            overflow: "hidden",
            width: size,
            height: size,
          }}
        />
        {userActive && (
          <View className="absolute w-4 h-4 rounded-lg bg-[#00c123] bottom-0 right-1" />
        )}
      </View>

      <View className="flex-row">
        <View>
          <Text
            className="text-center text-white font-roboto-condensed tracking-[-0.3px] mt-2"
            style={{ marginLeft: horizontal ? 10 : 0 }}
          >
            {username} {horizontal && age && ", " + age.toString()}{" "}
          </Text>
          {sponsored && (
            <Text className="text-[rgba(255,253,253,0.55)] tracking-[-0.3px] text-[12px] ml-3 font-reddit-sans-bold">
              Sponsorisé
            </Text>
          )}
        </View>
        {horizontal && verified && (
          <View className="-mt-2 -ml-2">
            <VerifiedIcon />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UserProfile;
