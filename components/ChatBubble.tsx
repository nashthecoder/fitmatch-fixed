import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

interface Message {
  senderId: string;
  text: string;
  createdAt: {
    toDate: () => Date;
  };
}

interface ChatBubbleProps {
  message: Message;
  currentUserId: string;
}

const ChatBubble = React.memo(({ message, currentUserId }: ChatBubbleProps) => {
  const isMine = message.senderId === currentUserId;
  return (
    <View className={`mb-2 ${isMine ? "items-end" : "items-start"}`}>
      <View
        className={`px-4 py-2 rounded-xl max-w-[80%] ${
          isMine ? "bg-red-500" : "bg-gray-300"
        }`}
      >
        <Text className={`text-sm ${isMine ? "text-white" : "text-black"}`}>
          {message.text}
        </Text>
        <Text className="text-[10px] text-gray-500 mt-1">
          {moment(message.createdAt?.toDate()).fromNow()}
        </Text>
      </View>
    </View>
  );
});

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
