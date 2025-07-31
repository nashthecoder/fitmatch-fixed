import React, { useState } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import ChevronRightIcon from "../Icons/ChevronRightIcon";
import CommentsIcon from "../Icons/Posts/CommentsIcon";
import ThreeDots from "../Icons/ThreeDots";

import { UserPost } from "@/app/(root)/Home/NewPost";
import { toggleLike } from "@/helpers/firestore";
import { formatNumber } from "@/helpers/formatters";
import { getTimeAgo } from "@/helpers/timeAgo";
import { AntDesign } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import CheckIcon from "../Icons/CheckIcon";

type Poster = {
  username: string;
  age?: number;
  profileImg: any;
  verified?: boolean;
};

interface PostProps {
  post: UserPost;
  poster: Poster;
  currentUserUid: string | undefined;
  sponsored?: boolean;
}

const Post: React.FC<PostProps> = ({
  post,
  poster,
  currentUserUid,
  sponsored = false,
}) => {
  const [liked, setLiked] = useState(
    post?.likes?.by?.includes(currentUserUid!)
  );
  const [likesCount, setLikesCount] = useState(post.likes?.count | 0);
  const [commentsCount] = useState(post?.comments?.count | 0);
  const [sharesCount] = useState(post?.shares?.count | 0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLikePress = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

      // Update Firestore
      await toggleLike(post.id, currentUserUid!, liked);
    } catch (error) {
      // Revert UI changes if Firestore update fails
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      console.error("Failed to update like:", error);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl || !post.mediaType) {
      return null; // No media to render
    }

    if (post.mediaType === "photo") {
      return (
        <Image
          source={{ uri: post.mediaUrl }}
          className="w-full h-[250px] rounded-lg"
          resizeMode="cover"
        />
      );
    }

    return (
      <View className="relative">
        <ImageBackground
          source={post.thumbnailUrl ? { uri: post.thumbnailUrl } : undefined}
          style={{ width: "100%", height: 250, borderRadius: 8 }}
        >
          <TouchableOpacity
            // onPress={togglePlayback}
            className="absolute inset-0 items-center justify-center"
            activeOpacity={0.25}
            onPress={() => {
              router.navigate({
                pathname: "/Home/ViewPostScreen",
                params: { postId: post.id },
              });
            }}
          >
            {!isPlaying && (
              <View className="w-16 h-16 bg-black/50 rounded-full items-center justify-center">
                <Text className="text-white text-2xl">▶</Text>
              </View>
            )}
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  return (
    <TouchableOpacity
      className="overflow-hidden mb-3  bg-stone-900 py-2"
      activeOpacity={0.75}
      onPress={() => {
        if (sponsored) return Linking.openURL("https://google.com");
        router.navigate({
          pathname: "/Home/ViewPostScreen",
          params: { postId: post.id },
        });
      }}
    >
      {/* User header */}
      <View className="flex-row items-center justify-between mb-3 mx-4">
        <View className="flex-row items-center">
          <Image
            source={
              post?.posterInfo?.profilePicUrl
                ? { uri: post.posterInfo.profilePicUrl }
                : require("@/assets/images/default-user-picture.png")
            }
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-wrap ml-4 text-white font-roboto-condensed tracking-[-0.3px] max-w-[55vw]">
            {post?.posterInfo?.username}
          </Text>
          {post?.posterInfo?.verified && <CheckIcon />}
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="tracking-[-0.3px] text-white text-[10px]">
            {getTimeAgo(post?.createdAt as Timestamp)}
          </Text>
          <TouchableOpacity hitSlop={8}>
            <ThreeDots />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post media */}
      {renderMedia()}

      {/* Sponsored CTA */}
      {sponsored ? (
        <View className="ml-3 -mt-3 mb-2">
          <TouchableOpacity
            className="flex-row items-center bg-[#CC301A] justify-center gap-2 py-1"
            onPress={() => Linking.openURL("https://google.com")}
          >
            <Text className="text-white font-roboto-condensed-extrabold text-[16px] tracking-[-0.3px]">
              DECOUVRIR L&apos;OFFRE
            </Text>
            <ChevronRightIcon />
          </TouchableOpacity>
        </View>
      ) : (
        post?.text?.length > 0 && (
          <View className="flex-row gap-x4 my-3 mx-4">
            {/* <FontAwesome6
              name="quote-left"
              size={14}
              color="rgba(255,255,255,1)"
            /> */}
            <View className="flex-row gap-x-4 items-center rounded-[16px] bg-gray-200/10 overflow-hidden px-8 py-2 w-full">
              <Text className="font-roboto-condensed text-[14px] text-white tracking-[-0.3px] text-wrap">
                {post?.text}
              </Text>
            </View>
          </View>
        )
      )}

      {/* Footer (like, comment, share) */}
      <View className="flex-row gap-4 items-center p-1 rounded-full mt-2 self-end px-10 mx-2">
        <View className="flex-row items-center gap-1">
          <TouchableOpacity hitSlop={8} onPress={handleLikePress}>
            {liked ? (
              <AntDesign name="heart" color={"red"} size={17} />
            ) : (
              <AntDesign name="hearto" color={"white"} size={17} />
            )}
          </TouchableOpacity>
          <Text className="text-[#CD2020] text-[12px] font-roboto-bold mx-2">
            {formatNumber(likesCount)}
          </Text>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            hitSlop={8}
            onPress={() =>
              router.navigate({
                pathname: "/Home/ViewPostScreen",
                params: { postId: post?.id },
              })
            }
          >
            <CommentsIcon />
          </TouchableOpacity>
          <Text className="text-[#CD2020] text-[12px]">
            {formatNumber(commentsCount)}
          </Text>
        </View>

        {/* <TouchableOpacity hitSlop={8}>
          <ShareIcon />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default Post;
