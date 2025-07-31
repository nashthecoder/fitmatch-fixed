import React from "react";
import { Text, View } from "react-native";
import BicepsIcon from "../Icons/Quiz/BicepsIcon";
import PlaneIcon from "../Icons/Quiz/PlaneIcon";
import TargetIcon from "../Icons/Quiz/TargetIcon";
import TrophyIcon from "../Icons/TrophyIcon";
import QuizChoice from "../shared/QuizChoice";

type Quiz1Props = {
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
};

const Quiz5: React.FC<Quiz1Props> = ({ selectedValue, onSelect }) => {
  return (
    <View className="px-4">
      <Text className="text-white tracking-[-0.3px] mt-6 font-roboto-condensed-light-italic text-[20px]">
        Ton carburant préféré avant une session ?
      </Text>
      <Text className="font-roboto-thin text-white text-[12px] mx-4">
        Mésurer ton ambition
      </Text>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz5"
          value={4}
          selectedValue={selectedValue}
          icon={<BicepsIcon />}
          onSelect={onSelect}
          title="Finir un Ironman"
        />
        <QuizChoice
          quizName="quiz5"
          value={2}
          selectedValue={selectedValue}
          icon={
            <View className="mt-6">
              <PlaneIcon />
            </View>
          }
          onSelect={onSelect}
          title="Voyager en mode "
          subtitle="sportif"
        />
      </View>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz5"
          value={3}
          selectedValue={selectedValue}
          icon={<TrophyIcon />}
          onSelect={onSelect}
          title="Monter sur un "
          subtitle="podium"
        />
        <QuizChoice
          quizName="quiz5"
          value={1}
          selectedValue={selectedValue}
          icon={<TargetIcon />}
          onSelect={onSelect}
          title="Juste m’amuser et"
          subtitle="progresser"
        />
      </View>
    </View>
  );
};

export default Quiz5;
