import {
  checkUserType,
  getCurrentPartnerData,
  getCurrentUserData,
} from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import {
  PartnerData,
  resetPartnerData,
  setPartnerData,
} from "@/store/slices/partnerSlice";
import { resetUserData, setUserData, UserData } from "@/store/slices/userSlice";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

const ProcessUserData = () => {
  const dispatch = useDispatch();
  const creatingUserData = useSelector(
    (state: RootState) => state.auth.creatingUserData
  );
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    (async () => {
      console.log(creatingUserData);
      if (creatingUserData) return;
      // Add a small delay to prevent brief redirects
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMessageText("Vérification du type d'utilisateur...");
      const userType = await checkUserType();

      if (!userType) {
        console.log("No user type found...");
        dispatch(resetUserData());
        dispatch(resetPartnerData());
        // Add delay before redirect to prevent flash
        setTimeout(() => {
          router.replace("/Auth/Onboarding");
        }, 300);
        return;
      }

      if (userType === "binome") {
        setMessageText("Récupération des données utilisateur...");
        const userData: UserData | null = await getCurrentUserData();

        if (!userData) {
          dispatch(resetUserData());
          console.log("No user data found...");
          setTimeout(() => {
            router.replace("/Users/Onboarding");
          }, 300);
        } else {
          dispatch(setUserData(userData!));

          setTimeout(() => {
            if (!userData?.acceptCGU) {
              router.replace("/Users/Onboarding");
            } else if (!userData?.quizCompleted) {
              router.replace("/Users/SportChoice");
            } else {
              router.replace("/(root)/Home");
            }
          }, 300);
        }
      } else if (userType === "partner") {
        setMessageText("Récupération des données partenaire...");
        const partnerData: PartnerData | null = await getCurrentPartnerData();

        if (!partnerData) {
          console.log("partnerData >> ", partnerData);
          dispatch(resetPartnerData());
          console.log("No partner data found...");
          setTimeout(() => {
            router.replace("/Partner/Onboarding");
          }, 300);
        } else {
          dispatch(setPartnerData(partnerData!));
          console.log("partnerData", partnerData);

          setTimeout(() => {
            if (!partnerData?.acceptCGU) {
              router.replace("/Partner/Onboarding");
            } else {
              router.replace("/Partner/ProfilPartenaire");
            }
          }, 300);
        }
      }
    })();
  }, [dispatch, creatingUserData]);
  return (
    <View className="flex-1 bg-black items-center justify-center gap-4">
      {creatingUserData && (
        <Animated.Text
          entering={FadeInDown.duration(500)}
          className="text-center text-white font-roboto-bold text-[22px]"
        >
          {messageText}
        </Animated.Text>
      )}
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-40 h-24"
        resizeMode="contain"
      />

      <ActivityIndicator
        className="absolute bottom-28 self-center"
        color={"white"}
        size={"large"}
      />
    </View>
  );
};

export default ProcessUserData;
