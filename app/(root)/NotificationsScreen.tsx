import FilterIcon from "@/components/Icons/FilterIcon";
import { db } from "@/config/firebase";
import { UserData } from "@/store/slices/userSlice";
import { getAuth } from "firebase/auth";

import { AntDesign, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: string;
  from: string;
  to: string;
  type: "like" | "superlike" | "match" | "message";
  createdAt: any;
  read: boolean;
  fromUser?: UserData;
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = getAuth().currentUser?.uid;

  const fetchUserData = async (
    userId: string
  ): Promise<UserData | undefined> => {
    try {
      if (!userId) {
        console.warn("No user ID provided for fetchUserData");
        return undefined;
      }

      // Ensure we're using the correct collection name (match your Firestore structure)
      const userDocRef = doc(db, "users", userId); // or "Users" if that's your collection name

      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
      } else {
        console.warn(`User document not found for ID: ${userId}`);
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return undefined;
    }
  };

  const processNotifications = async (
    docs: QueryDocumentSnapshot<DocumentData>[]
  ) => {
    try {
      return await Promise.all(
        docs.map(async (docSnapshot) => {
          const notification = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as Notification;

          if (!notification.fromUser) {
            notification.fromUser = await fetchUserData(notification.from);
          }
          return notification;
        })
      );
    } catch (error) {
      console.error("Error processing notifications:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("to", "==", currentUserId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        try {
          const processed = await processNotifications(querySnapshot.docs);
          setNotifications(processed);
        } catch (error) {
          console.error("Error handling snapshot:", error);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      (error) => {
        console.error("Notification listener error:", error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  const handleRefresh = () => {
    setRefreshing(true);
    // The listener will automatically update when data changes
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });

      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert optimistic update if failed
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
      );
    }
  };

  const renderNotificationText = (notification: Notification) => {
    const name =
      notification.fromUser?.pseudo ||
      `${notification.fromUser?.prenoms || ""} ${
        notification.fromUser?.nom || ""
      }`.trim();

    switch (notification.type) {
      case "like":
        return `Vous avez reçu un like de ${name[0]}...`;
      case "superlike":
        return `Vous avez reçu un superlike de ${name}`;
      case "match":
        return `C'est un match! Vous avez matché avec ${name}`;
      case "message":
        return `${name} vous a envoyé un message`;
      default:
        return `Nouvelle notification de ${name}`;
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => markAsRead(item.id)}>
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="bg-[#1d1d1d] px-4 py-2 mx-4 my-2 rounded-lg"
      >
        <View className="flex-row items-center">
          <View className="relative">
            {item.fromUser?.profilePicUrl ? (
              <View className="w-12 h-12 rounded-full overflow-hidden items-center justify-center">
                <Image
                  source={{ uri: item.fromUser.profilePicUrl }}
                  className="w-12 h-12 rounded-full mr-3"
                  blurRadius={item.type === "match" ? 0 : 25}
                />
                {item.type !== "match" && (
                  <View className="absolute bg-white/70 w-full h-full" />
                )}
              </View>
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-500 mr-3 justify-center items-center">
                <AntDesign name="user" size={24} color="white" />
              </View>
            )}

            {/* Notification type indicator icon */}
            <View className="absolute -bottom-1 -right-1 bg-[#2e2c2c] rounded-full p-1 border-2 border-[#2e2c2c]">
              {item.type === "match" && (
                <FontAwesome6
                  name="heart-circle-check"
                  size={18}
                  color="violet" // Green color fo
                />
              )}
              {item.type === "like" && (
                <FontAwesome
                  name="heart"
                  size={16}
                  color="#FF0000" // Red for likes
                />
              )}

              {item.type === "superlike" && (
                <FontAwesome
                  name="star"
                  size={16}
                  color="orange" // Purple for superlikes
                />
              )}

              {item.type === "message" && (
                <FontAwesome
                  name="envelope"
                  size={16}
                  color="#2196F3" // Blue for messages
                />
              )}
            </View>
          </View>

          <View className="flex-1 pl-4">
            <Text className="text-white font-roboto-condensed">
              {renderNotificationText(item)}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              {item.createdAt?.toDate().toLocaleString()}
            </Text>
          </View>

          {!item.read && <View className="w-3 h-3 rounded-full bg-red-500" />}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-dark flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-dark flex-1">
      <Image
        source={require("@/assets/images/logo.png")}
        className="h-12 w-24 m-4"
      />
      <View className="flex-row w-full items-center mt-1 justify-between">
        <Text className="text-white mx-4 font-roboto-condensed-bold text-[22px] -tracking-[0.3px]">
          Notifications
        </Text>
        <TouchableOpacity className="mr-4" hitSlop={8}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Animated.Text
            entering={FadeInDown.duration(500)}
            className="text-white mb-4 -mt-12 font-inter-semibold"
          >
            Pas de notifications pour l&apos;instant
          </Animated.Text>
          <AntDesign name="bells" color={"white"} size={40} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#FF0000"]}
              tintColor="#FF0000"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
