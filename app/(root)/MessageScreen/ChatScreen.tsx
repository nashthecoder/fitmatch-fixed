import { auth, db } from "@/config/firebase";
import { router, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import useKeyboardVisible from "@/customHooks/useIsKeyboardVisible";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
};

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();
  const { chatId, otherUserId, otherUserName, otherUserPhoto } =
    useLocalSearchParams<{
      chatId: string;
      otherUserId: string;
      otherUserName: string;
      otherUserPhoto: string;
    }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser;
  const isKeyboardUp = useKeyboardVisible();

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          senderId: doc.data().senderId,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          read: doc.data().read || false,
        }));

        setMessages(messagesData);

        // Mark messages as read
        const unreadMessages = snapshot.docs.filter(
          (doc) => !doc.data().read && doc.data().senderId !== currentUser.uid
        );

        if (unreadMessages.length > 0) {
          const batch = unreadMessages.map((doc) =>
            updateDoc(doc.ref, { read: true })
          );

          // Update chat's last message read status
          updateDoc(doc(db, "chats", chatId), {
            "lastMessage.read": true,
          }).catch(console.error);

          Promise.all(batch).catch(console.error);
        }
      },
      (error) => {
        console.error("Messages snapshot error:", error);
        // Handle permission errors gracefully
        if (error.code === "permission-denied") {
          // Show user-friendly message
          Alert.alert(
            "Permission Error",
            "You don't have permission to view this chat."
          );
          router.back();
        }
      }
    );

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !chatId) return;

    try {
      // First update the chat document
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: {
          text: newMessage,
          senderId: currentUser.uid,
          createdAt: serverTimestamp(),
          read: false,
        },
      });

      // Then add the message
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
        read: false,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark h-screen w-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black"
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-gray-800 bg-black">
          <TouchableOpacity
            className={`bg-dark h-[36px] w-[36px| mr-5 justify-center items-center  z-10 p-3`}
            onPress={() => {
              if (router.canGoBack()) router.back();
            }}
          >
            <BackBTNIcon />
          </TouchableOpacity>
          <Image
            source={{ uri: otherUserPhoto }}
            style={{ width: 40, height: 40, marginRight: 24, borderRadius: 20 }}
            placeholder={require("@/assets/images/default-user-picture.png")}
          />
          <Text className="text-white font-semibold">{otherUserName}</Text>
        </View>

        {/* Messages */}
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          ref={(ref) => {
            if (ref) {
              setTimeout(() => ref.scrollToEnd({ animated: true }), 100);
            }
          }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${
                message.senderId === currentUser?.uid
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <View
                className={`max-w-[80%] min-w-[50vw] rounded-lg p-3 ${
                  message.senderId === currentUser?.uid
                    ? "bg-red-500"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-white">{message.text}</Text>
                <Text
                  className={`text-xs mt-1 ${
                    message.senderId === currentUser?.uid
                      ? "text-blue-200"
                      : "text-gray-400"
                  }`}
                >
                  {message.createdAt?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-row items-center p-4 border-t border-gray-800 bg-black z-10 "
      >
        <TextInput
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 mr-3"
          placeholder="Votre message..."
          placeholderTextColor="#9CA3AF"
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          className="bg-red-500 rounded-full w-10 h-10 items-center justify-center"
          onPress={handleSendMessage}
        >
          <Text className="text-white text-lg">↑</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
