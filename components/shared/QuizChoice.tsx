import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QuizChoiceProps = {
  quizName: string;
  value: number;
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  large?: boolean;
};

const QuizChoice: React.FC<QuizChoiceProps> = ({
  quizName,
  value,
  selectedValue,
  onSelect,
  title,
  subtitle,
  icon,
  large = false,
}) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      className="flex-row items-center bg-[#2E2C2C] p-2 mx-2 gap-2 h-16 overflow-hidden w-[44vw]"
      onPress={() => onSelect(quizName, value)}
    >
      {isSelected ? (
        <View className="w-[20] h-[20] rounded-full bg-red border-4 border-white" />
      ) : (
        <View className="w-[20] h-[20] rounded-full bg-white" />
      )}
      <View>
        <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-white font-roboto-condensed text-[13px] tracking-[-0.3]">
            {subtitle}
          </Text>
        )}
      </View>
      <View
        className="flex-row items-center justify-center"
        style={{ marginHorizontal: large ? -12 : 0 }}
      >
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default QuizChoice;
