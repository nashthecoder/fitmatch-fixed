import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useGoogleSignIn } from "@/customHooks/useGoogleSignIn";
import { RootState } from "@/store/rootReducer";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeOut, ZoomInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [showOverlay, setShowOverlay] = useState(false);
  const userData = useSelector((state: RootState) => state.user.data);

  const { user, loading, signIn, error: googleSignInError } = useGoogleSignIn();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const {
    error: emailSginInError,
    signIn: emailSignIn,
    loading: emailSignInBusy,
  } = useEmailAuth();

  const handleGoogleSignIn = async () => {
    await signIn();
    if (googleSignInError) {
      Toast.show({
        type: "error",
        text1: "Connexion",
        text2: googleSignInError,
      });
    }
  };

  function handleAuthStateChanged(user: any) {
    if (user) router.replace("/Auth/ProcessUserData");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0F0E0C]">
      {(loading || showOverlay) && (
        <Animated.View
          exiting={FadeOut}
          className="flex-1 h-screen w-screen z-10 items-center justify-center absolute bg-transparent"
        >
          <BlurView
            tint="dark"
            intensity={10}
            reducedTransparencyFallbackColor="black"
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          <ActivityIndicator size={"large"} color={"red"} />
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
          L&apos;appli qui connecte les sportifs extrêmes
        </Text>
        <Text className="font-roboto-condensed-light-italic text-[30px] text-white ml-[24px]">
          Bienvenue!
        </Text>
        <View className="items-center">
          <Text className="text-center text-white font-roboto-bold text-[28px] mt-4 mb-4">
            Se connecter
          </Text>
          <TouchableOpacity
            className="rounded-[16px] bg-[#D32C1C] w-[350px] h-[45px] items-center justify-center "
            onPress={() => setShowSignInModal(true)}
          >
            <Text className="font-roboto text-white text-[20px] text-center">
              Connexion avec e-mail/téléphone
            </Text>
          </TouchableOpacity>
          <Text className="text-white my-2 font-roboto text-[14px]">OU</Text>
          <TouchableOpacity
            className="flex-row border border-[#D32C1C] h-[45px] overflow-hidden rounded-[16px] py-2 px-8 items-center justify-center gap-4 w-[350px]"
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
          <View className="mb-4 mt-4 h-[0.5px] bg-white/50 self-center w-1/4" />
          <TouchableOpacity
            className="flex-row h-[45px] overflow-hidden rounded-[16px]  items-center justify-center  bg-[#25D31C] w-[350px]"
            onPress={() => router.navigate("/Auth/Onboarding")}
          >
            <Text className="font-inter-bold text-black text-[22px] text-center">
              Je m&apos;inscris
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-2 mt-4 h-[0.5px] bg-white/50 self-center w-1/4" />
        <TouchableOpacity className="self-center mb-4" hitSlop={8}>
          <Text className="text-roboto-bold text-red-600">
            Réinitialiser le mot de passe
          </Text>
        </TouchableOpacity>

        <Text
          className="font-roboto text-white text-[10px] mx-4 my-2 text-nowrap tracking-[-0.3px]"
          style={{ letterSpacing: -0.3 }}
        >
          En vous connectant, vous acceptez nos Conditions Générales
          d’Utilisation. Découvrez comment nous utilisons vos données en
          consultant notre Politique de Confidentialité
        </Text>
        <TouchableOpacity
          className="flex-row gap-x-2 items-center justify-center"
          onPress={() => router.navigate("/Extras/CGU")}
        >
          <Text className="text-center text-white/50 tracking-[-0.3px] font-roboto-condensed-semibold mt-2 ml-4">
            Conditions générales d&apos;utilisation
          </Text>
          <Octicons
            name="link-external"
            color={"rgba(255,255,255,0.5)"}
            size={22}
          />
        </TouchableOpacity>

        <View className="px-6 mt-6">
          <Text className="text-white font-roboto-bold text-[28px] mx-4 tracking-[-0.3px]">
            Nos partenaires
          </Text>
          <View className="rounded-[16] bg-white p-4">
            <View className="flex-row items-center">
              <View className="w-[50vw]">
                <Text className="text-[#343434] text-[14px] font-roboto tracking-[-0.3px] mb-4">
                  Sponsorisée
                </Text>

                <Image
                  source={require("@/assets/images/logoBinocle.png")}
                  className="w-[150px] h-[75px] self-center"
                  resizeMode="cover"
                />
              </View>
              <View className="items-center flex-1">
                <Text
                  className="font-roboto-condensed-italic text-[13px] text-center text-[#343434] mb-6 tracking-[-0.3px] max-w-[48vw] mx-2"
                  numberOfLines={2}
                >
                  Bien voir pour mieux matcher avec Binocle Eyewear
                </Text>
                <TouchableOpacity
                  className="self-center px-2 bg-[#B00000] rounded-[6px] py-1"
                  activeOpacity={0.75}
                  onPress={() => Linking.openURL("https://google.com")}
                >
                  <Text className="font-roboto text-white text-[14px] tracking-[-0.3px]">
                    DECOUVRIR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        visible={showSignInModal}
        transparent
        onRequestClose={() => {
          if (!loading) setShowSignInModal(false);
        }}
      >
        <ScrollView
          style={{ ...StyleSheet.absoluteFillObject }}
          contentContainerStyle={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BlurView
            style={{ ...StyleSheet.absoluteFillObject }}
            tint="dark"
            intensity={4}
            blurRadius={4}
            reducedTransparencyFallbackColor="black"
          />
          <Pressable
            style={{ ...StyleSheet.absoluteFillObject }}
            onPress={() => {
              if (!loading) setShowSignInModal(false);
            }}
          />
          <View />
          <Animated.View
            entering={ZoomInDown.duration(600)}
            className="bg-[#0f0e0c] p-4 h-[60vh] w-[95vw] rounded-t-[30px]"
          >
            <KeyboardAwareScrollView>
              <View className="h-1 bg-white/30 self-center w-14 rounded-full my-2" />
              <Text className="text-white font-roboto-bold text-[20px] text-center">
                Connexion
              </Text>

              {/* Email */}
              <View className="gap-y-2 px-6 py-2">
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                  Email
                </Text>
                <TextInput
                  className="bg-white rounded-lg"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={signInForm.email}
                  onChangeText={(text) =>
                    setSignInForm({ ...signInForm, email: text })
                  }
                />
              </View>

              {/* Password */}
              <View className="gap-y-2 px-6 py-2">
                <Text className="text-white tracking-[-0.3px] font-roboto-condensed text-[14px]">
                  Mot de passe
                </Text>
                <View className="flex-row items-center bg-white rounded-lg px-2">
                  <TextInput
                    className="flex-1 text-black font-roboto py-2"
                    value={signInForm.password}
                    onChangeText={(text) =>
                      setSignInForm({ ...signInForm, password: text })
                    }
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="mt-8 mx-4 items-center justify-center rounded-[16] bg-[#D32C1C] py-2 px-8 flex-row gap-2"
                onPress={async () => {
                  if (emailSignInBusy) return;
                  if (loading) return;

                  if (!signInForm.email || !signInForm.password) {
                    Toast.show({
                      text1: "Connexion",
                      text2: "Veuillez entrer votre email et mot de passe",
                      type: "error",
                    });
                    return;
                  }

                  await emailSignIn(signInForm.email, signInForm.password);

                  if (emailSginInError) {
                    console.error("Login erro : ", emailSginInError);
                    Toast.show({
                      text1: "Erreur de connexion",
                      text2: "Verifier votre nom d'utilisateur ou mot de passe",
                      type: "error",
                    });
                    return;
                  }
                }}
              >
                <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
                  Se connecter
                </Text>
                {emailSignInBusy && <ActivityIndicator color={"white"} />}
              </TouchableOpacity>

              <Image
                source={require("@/assets/images/logo.png")}
                className="w-[86] h-[53] mx-4 mt-8 self-center my-4"
                resizeMode="cover"
              />
            </KeyboardAwareScrollView>
          </Animated.View>
        </ScrollView>
        <Toast />
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
