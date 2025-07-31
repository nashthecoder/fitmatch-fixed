import React from "react";
import { Text, View } from "react-native";
import DiceIcon from "../Icons/Quiz/DiceIcon";
import EmbarassedEmoji from "../Icons/Quiz/EmbarassedEmoji";
import NoteIcon from "../Icons/Quiz/NoteIcon";
import RunningPersonIconSmall from "../Icons/Quiz/RuuningPersonIconSmall";
import QuizChoice from "../shared/QuizChoice";

type Quiz1Props = {
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
};

const Quiz2: React.FC<Quiz1Props> = ({ selectedValue, onSelect }) => {
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
          quizName="quiz2"
          value={4}
          selectedValue={selectedValue}
          icon={<RunningPersonIconSmall />}
          onSelect={onSelect}
          title="A fond sans "
          subtitle="réfléchir"
        />
        <QuizChoice
          quizName="quiz2"
          value={2}
          selectedValue={selectedValue}
          icon={<DiceIcon />}
          onSelect={onSelect}
          title="J’improvise au "
          subtitle="feeling"
        />
      </View>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz2"
          value={3}
          selectedValue={selectedValue}
          icon={<NoteIcon />}
          onSelect={onSelect}
          title="Je prépare une"
          subtitle="stratégie béton"
        />
        <QuizChoice
          quizName="quiz2"
          value={1}
          selectedValue={selectedValue}
          icon={<EmbarassedEmoji />}
          onSelect={onSelect}
          title="J’évite les "
          subtitle="trucs trop durs"
        />
      </View>
    </View>
  );
};

export default Quiz2;
