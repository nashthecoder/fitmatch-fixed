import React from "react";
import { Image, Text, View } from "react-native";
import ChillNetflixIcon from "../Icons/Quiz/ChillNetflixIcon";
import FireIcon from "../Icons/Quiz/FireIcon";
import MeditationIcon from "../Icons/Quiz/MeditationIcon";
import QuizChoice from "../shared/QuizChoice";

type Quiz1Props = {
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
};

const Quiz1: React.FC<Quiz1Props> = ({ selectedValue, onSelect }) => {
  return (
    <View className="px-4">
      <Text className="text-white tracking-[-0.3px] mt-6 font-roboto-condensed-light-italic text-[20px]">
        Ton mood idéal après une grosse séance ?
      </Text>
      <Text className="font-roboto-thin text-white text-[12px] mx-4">
        Montre ton style de récupération
      </Text>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz1"
          value={1}
          selectedValue={selectedValue}
          icon={<ChillNetflixIcon />}
          onSelect={onSelect}
          title="Chill total devant"
          subtitle="Netflix"
          large
        />
        <QuizChoice
          quizName="quiz1"
          value={2}
          selectedValue={selectedValue}
          icon={
            <Image
              source={require("@/assets/images/weekend-vibes/soire.png")}
            />
          }
          onSelect={onSelect}
          title="Soirée avec les"
          subtitle="potes"
        />
      </View>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz1"
          value={4}
          selectedValue={selectedValue}
          icon={<FireIcon />}
          onSelect={onSelect}
          title="Retraîner direct,"
          subtitle="let’s go"
          large
        />
        <QuizChoice
          quizName="quiz1"
          value={3}
          selectedValue={selectedValue}
          icon={<MeditationIcon />}
          onSelect={onSelect}
          title="Stretching &"
          subtitle="méditation"
          large
        />
      </View>
    </View>
  );
};

export default Quiz1;
