import { auth, db } from "@/config/firebase";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { User as FirebaseUser } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
type User = {
  id: string;
  prenoms: string;
  nom: string;
  profilePicUrl: string;
  personalData: boolean;
};

type Chat = {
  id: string;
  participants: string[];
  participantData: User[];
  lastMessage: {
    text: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  };
  otherUserName: string;
  otherUserPhoto: string;
};

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser as FirebaseUser;

  useEffect(() => {
    if (!currentUser) return;

    // Fetch active users (personalData === true)
    const fetchActiveUsers = async () => {
      const usersQuery = query(
        collection(db, "users"),
        where("personalData", "==", true)
      );
      const snapshot = await getDocs(usersQuery);
      const userList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as User))
        .filter((user) => user.id !== currentUser.uid);
      setActiveUsers(userList);
    };

    fetchActiveUsers();

    // Fetch existing chats
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastMessage.createdAt", "desc")
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatsData: Chat[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          // Fetch participant data
          const otherUserId = data.participants.find(
            (id: string) => id !== currentUser.uid
          );
          const userDoc = await getDocs(
            query(collection(db, "users"), where("id", "==", otherUserId))
          );
          const userData = userDoc.docs[0]?.data() as User;

          return {
            id: doc.id,
            participants: data.participants,
            participantData: [userData],
            lastMessage: {
              text: data.lastMessage.text,
              createdAt: data.lastMessage.createdAt.toDate(),
              senderId: data.lastMessage.senderId,
              read: data.lastMessage.read,
            },
            otherUserName: data.otherUserName,
            otherUserPhoto: data.otherUserPhoto,
          };
        })
      );
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const startNewChat = async (otherUser: User) => {
    if (!currentUser) return;

    // Create chat ID by combining user IDs in alphabetical order
    const participants = [currentUser.uid, otherUser?.id].sort();
    const chatId = participants.join("_");

    // Check if chat already exists
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      // Create new chat
      await setDoc(chatRef, {
        participants,
        lastMessage: {
          text: "Nouvelle discussion",
          senderId: currentUser.uid,
          createdAt: new Date(),
          read: false,
        },
        otherUserPhoto: otherUser?.profilePicUrl,
        otherUserName: `${otherUser?.prenoms} ${otherUser?.nom}`,
      });
    }

    // Navigate to chat screen
    router.push({
      pathname: "/(root)/MessageScreen/ChatScreen",
      params: {
        chatId,
        otherUserId: otherUser?.id,
        otherUserName: `${otherUser?.prenoms} ${otherUser?.nom}`,
        otherUserPhoto: otherUser?.profilePicUrl,
      },
    });
  };

  const goToChat = (chat: Chat) => {
    const otherUser = chat.participantData[0];
    router.push({
      pathname: "/(root)/MessageScreen/ChatScreen",
      params: {
        chatId: chat.id,
        otherUserId: otherUser?.id,
        otherUserName: chat.otherUserName,
        otherUserPhoto: chat.otherUserPhoto,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black pt-12 items-center justify-center">
        <Text className="text-white">Chargement des messages...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 70, height: 50 }}
        />
      </View>

      {/* Active Users */}
      <Text className="text-white text-sm mt-4 mb-1 px-4 font-semibold">
        Binômes
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 max-h-[90px] overflow-hidden"
      >
        {activeUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => startNewChat(user)}
            className="items-center mr-4"
          >
            <View className="relative">
              <Image
                source={{ uri: user?.profilePicUrl }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  borderWidth: 2,
                  borderColor: "#3b82f6",
                }}
                placeholder={require("@/assets/images/default-user-picture.png")}
              />
              {/* Online indicator */}
              <View className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-black" />
            </View>
            <Text className="text-white text-sm mt-1">{user.prenoms}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <Text className="text-white text-sm mt-6 mb-1 px-4 font-semibold">
        Messages
      </Text>
      <ScrollView className="px-4">
        {chats.length === 0 ? (
          <View className="items-center my-8">
            <Text className="text-white text-center py-2">
              Aucun message pour l&apos;instant!
            </Text>
            <AntDesign name="message1" size={50} color={"white"} />
          </View>
        ) : (
          chats.map((chat) => {
            const otherUser = chat.participantData[0];
            const isUnread =
              !chat.lastMessage.read &&
              chat.lastMessage.senderId !== currentUser.uid;

            return (
              <TouchableOpacity
                key={chat.id}
                onPress={() => goToChat(chat)}
                className="flex-row items-center py-3 border-b border-gray-800"
              >
                <View className="relative">
                  <Image
                    source={{
                      uri: otherUser?.profilePicUrl ?? chat.otherUserPhoto,
                    }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                    placeholder={require("@/assets/images/default-user-picture.png")}
                  />
                  {isUnread && (
                    <View className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-black" />
                  )}
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-white font-semibold">
                    {chat.otherUserName}
                  </Text>
                  <Text
                    className={`text-sm ${
                      isUnread ? "text-white" : "text-gray-300"
                    }`}
                    numberOfLines={1}
                  >
                    {chat.lastMessage.senderId === currentUser.uid && "Vous: "}
                    {chat.lastMessage.text}
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs">
                  {formatTime(chat.lastMessage.createdAt)}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
