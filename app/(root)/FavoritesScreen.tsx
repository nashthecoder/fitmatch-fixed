import SettingsIcon from "@/components/Icons/SettingsIcon";
import UserCard from "@/components/UserCard";
import { db } from "@/config/firebase";
import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const FavoritesScreen = () => {
  const filters = ["Mes coups de cœur", "Cœurs reçus"];
  const [selectedFilter, setSelectedFilter] = useState("Mes coups de cœur");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = getAuth().currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    let unsubscribeUsers: () => void;
    let unsubscribeLikes: () => void;

    const setupRealtimeListeners = async () => {
      setLoading(true);

      if (selectedFilter === "Mes coups de cœur") {
        // Realtime listener for my liked users
        const userRef = doc(db, "users", currentUserId);
        unsubscribeUsers = onSnapshot(userRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const likedUserIds = docSnapshot.data().likes || [];
            const filteredUserIds = likedUserIds.filter(
              (id: string) => id !== currentUserId
            );

            // We don't need realtime updates for each user's profile here
            // since we're just showing basic info
            const usersData = await Promise.all(
              filteredUserIds.map(async (userId: string) => {
                const userDoc = await getDoc(doc(db, "users", userId));
                return userDoc.exists()
                  ? { uid: userDoc.id, ...userDoc.data() }
                  : null;
              })
            );
            setUsers(usersData.filter(Boolean));
            setLoading(false);
          }
        });
      } else {
        // Realtime listener for users who liked me
        const likesQuery = query(
          collection(db, "likes"),
          where("to", "==", currentUserId)
        );

        unsubscribeLikes = onSnapshot(likesQuery, async (querySnapshot) => {
          const uniqueUserIds = Array.from(
            new Set(querySnapshot.docs.map((doc) => doc.data().from))
          ).filter((id) => id !== currentUserId);

          const usersData = await Promise.all(
            uniqueUserIds.map(async (userId: string) => {
              const userDoc = await getDoc(doc(db, "users", userId));
              return userDoc.exists()
                ? { uid: userDoc.id, ...userDoc.data() }
                : null;
            })
          );
          setUsers(usersData.filter(Boolean));
          setLoading(false);
        });
      }
    };

    setupRealtimeListeners();

    // Cleanup function
    return () => {
      unsubscribeUsers?.();
      unsubscribeLikes?.();
    };
  }, [currentUserId, selectedFilter]);

  return (
    <SafeAreaView className="bg-dark flex-1">
      <Image
        source={require("@/assets/images/logo.png")}
        className="h-12 w-24 m-4"
      />
      <View className="mx-4 flex-row items-center justify-center pb-2 mt-4">
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            className={`px-4 flex-row gap-2 items-center justify-center ${
              filter !== filters[filters.length - 1]
                ? "border-r border-r-white"
                : ""
            } w-[45vw]`}
            onPress={() => setSelectedFilter(filter)}
            style={{
              borderBottomColor: selectedFilter === filter ? "red" : "white",
              borderBottomWidth: selectedFilter === filter ? 4 : 1,
              paddingBottom: 4,
            }}
          >
            <Text className="font-roboto-condensed -tracking-[0.3px] text-[16px] text-white">
              {filter}
            </Text>
            <AntDesign size={25} name="heart" color={"red"} />
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View
        entering={FadeInDown}
        className="flex-row items-center mb-4 gap-x-4"
        style={{ marginLeft: 40 }}
      >
        <View className="" style={{ paddingBottom: 10 }}>
          <SettingsIcon />
        </View>
        <TouchableOpacity className="items-center justify-center px-2 border border-white rounded-full">
          <Text className="text-white font-roboto-condensed-light tracking-|-0.3px]">
            A proximité
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center px-2 border border-white rounded-full">
          <Text className="text-white font-roboto-condensed-light tracking-|-0.3px]">
            Sport en commun
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : users.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white font-roboto-condensed">
            Aucun{" "}
            {selectedFilter === "Mes coups de cœur"
              ? "coup de cœur"
              : "cœur reçu"}{" "}
            pour l'instant
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item, index }) => (
            <UserCard key={item.uid} user={item} index={index} />
          )}
          keyExtractor={(item) => item.uid}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      )}
    </SafeAreaView>
  );
};

export default FavoritesScreen;
