import { useGoogleSignIn } from "@/customHooks/useGoogleSignIn";
import {
  createUserIfNotExists,
  getCurrentUserData,
  getQuizCompleted,
} from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { setUser } from "@/store/slices/authSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const SignUp = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [showOverlay, setShowOverlay] = useState(false);

  const { user, loading, signIn } = useGoogleSignIn();

  const handleGoogleSignIn = async () => {
    await signIn();
  };

  function handleAuthStateChanged(user: any) {
    dispatch(setUser(user));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const createDBUser = async () => {
      setShowOverlay(true);
      if (currentUser) {
        await createUserIfNotExists("partenaire");
        const userData = await getCurrentUserData();

        if (userData.userType !== "binome")
          return router.replace("/Auth/ProfilPartenaire");

        const quizCompleted = await getQuizCompleted();
        if (quizCompleted) {
          router.replace("/(root)/Home");
        } else {
          router.replace("/Users/Onboarding");
        }
      }
      setShowOverlay(false);
    };
    createDBUser();
    console.log("Current user ", currentUser);
  }, [currentUser]);
  return (
    <SafeAreaView className="flex-1 bg-[#0F0E0C]">
      {(loading || showOverlay) && (
        <Animated.View
          exiting={FadeOut}
          className="flex-1 h-screen w-screen z-10 items-center justify-center absolute bg-black/50"
        >
          <ActivityIndicator size={"large"} />
        </Animated.View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[152px] h-[100px] mt-[20px] ml-[16px] mb-"
        />
        <Text
          className="ml-[24px] mb-4 font-kavivanar text-[16px] text-[#D0A0A0]"
          style={{ letterSpacing: -0.3 }}
        >
          L’appli qui connecte les sportifs extrêmes
        </Text>
        <Text className="font-roboto-condensed-light-italic text-[30px] text-white ml-[24px]">
          Bienvenue!
        </Text>
        <View className="items-center">
          <Text className="text-center text-white font-roboto-bold text-[36px] mt-8 mb-4">
            Créer un compte
          </Text>
          <TouchableOpacity
            className="p-2 rounded-[6px] bg-[#D32C1C]"
            onPress={() => router.replace("/Auth/ProfilPartenaire")}
          >
            <Text className="font-roboto text-white text-[20px]">
              Connexion avec e-mail/téléphone
            </Text>
          </TouchableOpacity>
          <Text className="text-white my-4 font-roboto text-[20px]">OU</Text>
          <TouchableOpacity
            className="flex-row border border-[#D32C1C] h-[45px] overflow-hidden rounded-[16px] py-2 px-8 items-center justify-center gap-8"
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("@/assets/images/google.png")}
              className="h-[50px] w-[28px]"
              resizeMode="cover"
            />
            <Text className="font-roboto text-white text-[20px]">
              Continuer avec Google
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          className="font-roboto text-white text-[14px] mx-10 my-4"
          style={{ letterSpacing: -0.3 }}
        >
          En vous inscrivant, vous acceptez nos Conditions Générales
          d&apos;Utilisation. Découvrez comment nous utilisons vos données en
          consultant notre Politique de Confidentialité
        </Text>
        <Text className="text-center font-roboto-bold text-[20px] text-white mt-[40px]">
          Vous avez déjà un compte?
        </Text>

        <TouchableOpacity
          className="rounded-[16px] bg-white mx-10 mt-2"
          onPress={() => router.replace("/Auth/ProfilPartenaire")}
        >
          <Text
            className="text-[#D32C1C] text-[30px] font-roboto-bold text-center"
            style={{ letterSpacing: -0.3 }}
          >
            Se connecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
