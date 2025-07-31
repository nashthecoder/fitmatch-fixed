import React from "react";
import { Text, View } from "react-native";
import CrescentMoon from "../Icons/Quiz/CrescentMoon";
import SunriseLover from "../Icons/Quiz/SunriseLoverIcon";
import QuizChoice from "../shared/QuizChoice";

type Quiz1Props = {
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
};

const Quiz4: React.FC<Quiz1Props> = ({ selectedValue, onSelect }) => {
  return (
    <View className="px-4">
      <Text className="text-white tracking-[-0.3px] mt-6 font-roboto-condensed-light-italic text-[20px]">
        Comment tu gères un défi sportif ?
      </Text>
      <Text className="font-roboto-thin text-white text-[12px] mx-4">
        Evalue ton mental de compétiteur
      </Text>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz4"
          value={4}
          selectedValue={selectedValue}
          icon={<SunriseLover />}
          onSelect={onSelect}
          title="Sunrise lover"
        />
        <QuizChoice
          quizName="quiz4"
          value={2}
          selectedValue={selectedValue}
          icon={<CrescentMoon />}
          onSelect={onSelect}
          title="Je vis pour les"
          subtitle="nuits"
        />
      </View>
    </View>
  );
};

export default Quiz4;
