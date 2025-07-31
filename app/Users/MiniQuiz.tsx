import Quiz1 from "@/components/Quizes/Quiz1";
import Quiz2 from "@/components/Quizes/Quiz2";
import Quiz3 from "@/components/Quizes/Quiz3";
import Quiz4 from "@/components/Quizes/Quiz4";
import Quiz5 from "@/components/Quizes/Quiz5";
import { useHandleFormChange } from "@/customHooks/useHandleFormChange copy";
import { updateUserData } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { setUserData } from "@/store/slices/userSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const MiniQuiz = () => {
  const [quiz, setQuiz] = useState({
    quiz1: 0,
    quiz2: 0,
    quiz3: 0,
    quiz4: 0,
    quiz5: 0,
  });

  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.user.data);

  const [loading, setLoading] = useState(false);
  const handleChange = useHandleFormChange();

  const handleSelect = (quizName: string, res: number) => {
    setQuiz({ ...quiz, [quizName]: res });
  };

  const calculateScore = () => {
    const totalPoints =
      quiz.quiz1 + quiz.quiz2 + quiz.quiz3 + quiz.quiz4 + quiz.quiz5;
    let percentage = 0;
    let category = "";

    // Calculate percentage (max 20 points = 100%)
    percentage = (totalPoints / 20) * 100;

    // Determine category
    if (totalPoints >= 18) {
      category = "Compétiteur extrême";
    } else if (totalPoints >= 14) {
      category = "Sportif passionné ";
    } else if (totalPoints >= 10) {
      category = "Entraîné mais cool";
    } else if (totalPoints >= 6) {
      category = "Décontracté";
    } else {
      category = "Sportif du dimanche";
    }

    return { totalPoints, percentage, category };
  };

  return (
    <SafeAreaView className={`flex flex-1 bg-dark h-full-w-full gap-2`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="pb-[20px] gap-4"
      >
        <View className="flex-row items-center justify-between pr-4">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[66] h-[43] m-4"
            resizeMode="cover"
          />
        </View>
        <Text className="text-white tracking-[-0.3px] text-center font-roboto-condensed text-[28px] mt-4  w-4/5 self-center">
          MINI-QUIZ FitScore
        </Text>

        <Quiz1 onSelect={handleSelect} selectedValue={quiz.quiz1} />
        <Quiz2 onSelect={handleSelect} selectedValue={quiz.quiz2} />
        <Quiz3 onSelect={handleSelect} selectedValue={quiz.quiz3} />
        <Quiz4 onSelect={handleSelect} selectedValue={quiz.quiz4} />
        <Quiz5 onSelect={handleSelect} selectedValue={quiz.quiz5} />

        <TouchableOpacity
          className="mt-12 mb-6 self-center items-center justify-center rounded-full bg-[#D32C1C] py-2 px-8 w-[60vw] flex-row gap-2"
          onPress={async () => {
            console.log(quiz);
            if (loading) return;
            if (
              quiz.quiz1 === 0 ||
              quiz.quiz2 === 0 ||
              quiz.quiz3 === 0 ||
              quiz.quiz4 === 0 ||
              quiz.quiz5 === 0
            ) {
              Toast.show({
                type: "error",
                text1: "Réponse invalide!",
                text2:
                  "Veuillez répondre à toute les questions s'il vous plaît!",
              });
              return;
            }
            const { totalPoints, category, percentage } = calculateScore();
            setLoading(true);
            await updateUserData({
              totalPoints,
              percentage,
              category,
              quizCompleted: true,
            });

            dispatch(
              setUserData({
                ...userData,
                totalPoints,
                percentage,
                category,
                quizCompleted: true,
              })
            );

            setLoading(false);

            router.replace("/Users/ScoreScreen");
          }}
        >
          <Text className="-mt-1 mb-2 text-white font-roboto-bold tracking-[-0.3px] text-[20px]">
            Voir mon score
          </Text>
          {loading && <ActivityIndicator color={"white"} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MiniQuiz;
