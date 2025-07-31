import PlusIconWhite from "@/components/Icons/PlusIconWhite";
import Post from "@/components/Posts/Post";
import HeaderBar from "@/components/shared/HeaderBar";
import StoryBar from "@/components/Stories/StoryBar";
import { db } from "@/config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserPost } from "./NewPost";

export interface Poster {
  uid: string;
  username: string;
  age?: number;
  profileImg: string;
  verified?: boolean;
}

const SPONSORED_POST_INTERVAL = 2; // Show sponsored post every 2 regular posts

const Accueil = () => {
  const currentUserUid = getAuth().currentUser?.uid;
  const {
    data: postsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const user = getAuth().currentUser;
      if (!user) return { posts: [], posters: {} };

      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(postsQuery);

      const posts: UserPost[] = [];
      const posterIds = new Set<string>();

      querySnapshot.forEach((doc) => {
        const postData = doc.data() as UserPost;
        posts.push({ ...postData, id: doc.id });
        posterIds.add(postData.posterInfo.uid);
      });

      return { posts };
    },
    staleTime: 1000 * 60 * 5,
  });

  const renderPostsWithSponsored = () => {
    if (!postsData?.posts) return null;

    const { posts } = postsData;
    const result = [];
    let postCount = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      // Add regular post
      result.push(
        <Post
          key={`post-${post.id}`}
          post={post}
          poster={{
            username: post.posterInfo.username,
            profileImg: { uri: post.posterInfo.profilePicUrl },
            verified: post.posterInfo.verified,
          }}
          currentUserUid={currentUserUid || ""}
          sponsored={false}
        />
      );
      postCount++;

      // Add sponsored post after every SPONSORED_POST_INTERVAL posts
      if (postCount % SPONSORED_POST_INTERVAL === 0) {
        result.push(
          <Post
            key={`sponsored-${i}`}
            post={{
              id: `sponsored-${i}`,
              posterInfo: {
                uid: "sponsored",
                username: "Partenaire",
                profilePicUrl: "@/assets/images/profiles/profile6.png",
              },
              mediaType: "photo",
              mediaUrl:
                "https://firebasestorage.googleapis.com/v0/b/f-i-t-match-po1xi1.firebasestorage.app/o/uploads%2Fsponsored-post.png?alt=media&token=8da795af-5470-43f5-988c-d40869cd4fcb",
              likes: { count: 0, by: [] },
              comments: { count: 0, by: [] },
              createdAt: posts[i].createdAt,
              taggedUsers: [],
              text: "",
              shares: { count: 0, by: [] },
            }}
            poster={{
              username: "Partenaire",
              profileImg: require("@/assets/images/profiles/profile6.png"),
              verified: true,
            }}
            currentUserUid={currentUserUid || ""}
            sponsored={true}
          />
        );
      }
    }

    return result;
  };

  if (isError) {
    return (
      <SafeAreaView className="bg-[#0f0e0c] flex-1 justify-center items-center">
        <Text className="text-white">Error loading posts</Text>
      </SafeAreaView>
    );
  }

  const { posts = [] } = postsData || {};

  return (
    <SafeAreaView className="bg-[#0f0e0c] flex-1 h-full w-full pt-20">
      <HeaderBar />

      {/* Story Bar */}
      <StoryBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 h-full w-full"
        contentContainerStyle={{ paddingBottom: 5 }}
      >
        {/* Posts */}
        {posts.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10 gap-4">
            <MaterialCommunityIcons
              name="newspaper-variant-multiple-outline"
              size={80}
              color="white"
            />
            <Text className="text-white text-2xl font-roboto-condensed-bold -tracking-[0.3px] text-center">
              {!isLoading ? "Aucune publication disponible" : "chargement"}
            </Text>
            {isLoading && <ActivityIndicator color="white" size={"large"} />}
            <TouchableOpacity
              className="flex-row items-center gap-x-2 bg-[#d22c1c] rounded-[12px] px-2"
              onPress={() => router.navigate("/(root)/Home/NewPost")}
            >
              <PlusIconWhite />
              <Text className="font-roboto-condensed text-[1.3rem] text-white tracking-[-0.3px]">
                Créer une publication
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          renderPostsWithSponsored()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Accueil;
