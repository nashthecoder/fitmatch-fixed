import React from "react";
import { Text, View } from "react-native";
import BurgerIcon from "../Icons/Quiz/BurgerIcon";
import ChickenIcon from "../Icons/Quiz/ChickenIcon";
import HealthyLunch from "../Icons/Quiz/HealthyLunch";
import ProteinCafein from "../Icons/Quiz/ProteinCafein";
import RunningPerson2 from "../Icons/Quiz/RunningPerson2";
import QuizChoice from "../shared/QuizChoice";

type Quiz1Props = {
  selectedValue: number;
  onSelect: (quizName: string, value: number) => void;
};

const Quiz3: React.FC<Quiz1Props> = ({ selectedValue, onSelect }) => {
  return (
    <View className="px-4">
      <Text className="text-white tracking-[-0.3px] mt-6 font-roboto-condensed-light-italic text-[20px]">
        Ton carburant préféré avant une session ?
      </Text>
      <Text className="font-roboto-thin text-white text-[12px] mx-4">
        Comprendre ton hygiène de vie
      </Text>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz3"
          value={4}
          selectedValue={selectedValue}
          icon={
            <View className="flex-row items-center">
              <ProteinCafein />
              <View className="-mt-12 -ml-6">
                <ChickenIcon />
              </View>
            </View>
          }
          onSelect={onSelect}
          title="Protéines et"
          subtitle="caféine only"
        />
        <QuizChoice
          quizName="quiz3"
          value={2}
          selectedValue={selectedValue}
          icon={<RunningPerson2 />}
          onSelect={onSelect}
          title="Rien du tout,"
          subtitle="freestyle"
        />
      </View>

      <View className="flex flex-row items-center my-1 justify-between">
        <QuizChoice
          quizName="quiz3"
          value={3}
          selectedValue={selectedValue}
          icon={<HealthyLunch />}
          onSelect={onSelect}
          title="Petit-déj"
          subtitle="healthy équilibré"
        />
        <QuizChoice
          quizName="quiz3"
          value={1}
          selectedValue={selectedValue}
          icon={<BurgerIcon />}
          onSelect={onSelect}
          title="Fast food"
          subtitle="sans regret"
        />
      </View>
    </View>
  );
};

export default Quiz3;
