import { db, firebaseApp } from "@/config/firebase";
import { useEmailAuth } from "@/customHooks/useEmailAuth";
import { useGoogleSignIn } from "@/customHooks/useGoogleSignIn";
import { updateUserData } from "@/helpers/firestore";
import { RootState } from "@/store/rootReducer";
import { setUser } from "@/store/slices/authSlice";
import { resetUserData, setUserData } from "@/store/slices/userSlice";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { deleteUser, getAuth } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

const ProfileScreen = () => {
  const storage = getStorage(firebaseApp);
  const userData = useSelector((state: RootState) => state.user.data);
  const { signOut: signOutGoogle } = useGoogleSignIn();
  const { signOut: signOutEmail } = useEmailAuth();
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  const [busy, setBusy] = useState(false);
  const dispatch = useDispatch();

  // Calculate profile completion percentage
  const calculateProfileCompletion = (): number => {
    if (!userData) return 0;
    
    const fields = [
      userData.pseudo,
      userData.prenoms,
      userData.naissance,
      userData.ville,
      userData.profilePicUrl,
      userData.sportExtreme,
      userData.personality,
      userData.diet,
      userData.weekendVibes && userData.weekendVibes.length > 0,
      userData.mesVideos && userData.mesVideos.length > 0,
      userData.percentage !== undefined, // Has taken quiz
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      console.log("uploading image....");
      await uploadImage(result.assets[0].uri);
      console.log("uploaded image!");
    }
  };

  const uploadImage = async (image: string) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = image.substring(image.lastIndexOf("/") + 1);
      console.log("filename >>> ", filename);
      const imageRef = ref(storage, `profile_photos/${filename}`);
      await uploadBytes(imageRef, blob).then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        console.log("uploaded >> ", downloadURL);
        await updateUserData({ profilePicUrl: downloadURL });
        dispatch(setUserData({ ...userData, profilePicUrl: downloadURL }));
      });
    } catch (error: any) {
      console.error("Full Firebase error:", error);
      if (error?.serverResponse) {
        console.log("Server response:", error.serverResponse);
      }
      if (error?.customData) {
        console.log("Custom data:", error.customData);
      }
      if (error?.message) {
        console.log("Message:", error.message);
      }
    }
  };

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {busy && (
        <View className="absolute z-10 flex-1 h-screen w-screen bg-white items-center justify-center">
          <Text>
            Deconnexion <ActivityIndicator />
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[66] h-[43] mx-4 mt-4 self-start"
        />
        <TouchableOpacity activeOpacity={0.67} onPress={pickImage}>
          <Image
            source={{ uri: userData.profilePicUrl }}
            placeholder={require("@/assets/images/default-user-picture.png")}
            className="h-24 w-24 rounded-full"
            style={{
              overflow: "hidden",
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 16,
            }}
          />
        </TouchableOpacity>

        <Text style={styles.name}>
          {userData.prenoms} {userData.nom}
        </Text>
        <Text style={styles.email}>{userData.email}</Text>

        {/* Profile Completion Progress */}
        <View className="w-full bg-[#2E2C2C] rounded-lg p-4 my-4">
          <Text className="text-white font-roboto-condensed text-[16px] mb-2">
            Complétez votre profil pour de meilleurs matches
          </Text>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white/70 text-[12px]">Progression</Text>
            <Text className="text-white/70 text-[12px]">
              {calculateProfileCompletion()}%
            </Text>
          </View>
          <View className="w-full h-2 bg-gray-600 rounded-full">
            <View 
              className="h-2 bg-red rounded-full" 
              style={{ width: `${calculateProfileCompletion()}%` }}
            />
          </View>
        </View>

        {/* Quick Profile Actions */}
        <View className="w-full space-y-3 mb-6">
          {!userData.personality && (
            <TouchableOpacity
              className="bg-[#2E2C2C] rounded-lg p-4 flex-row items-center justify-between"
              onPress={() => router.navigate("/Users/PersonalityChoice")}
            >
              <View className="flex-row items-center">
                <Text className="text-white mr-3">🧠</Text>
                <View>
                  <Text className="text-white font-roboto-condensed text-[14px]">
                    Définir ma personnalité
                  </Text>
                  <Text className="text-white/50 text-[12px]">
                    Aidez les autres à mieux vous connaître
                  </Text>
                </View>
              </View>
              <Text className="text-red text-[20px]">→</Text>
            </TouchableOpacity>
          )}
          
          {!userData.diet && (
            <TouchableOpacity
              className="bg-[#2E2C2C] rounded-lg p-4 flex-row items-center justify-between"
              onPress={() => router.navigate("/Users/DietChoice")}
            >
              <View className="flex-row items-center">
                <Text className="text-white mr-3">🥗</Text>
                <View>
                  <Text className="text-white font-roboto-condensed text-[14px]">
                    Mes préférences alimentaires
                  </Text>
                  <Text className="text-white/50 text-[12px]">
                    Trouvez des partenaires avec des habitudes similaires
                  </Text>
                </View>
              </View>
              <Text className="text-red text-[20px]">→</Text>
            </TouchableOpacity>
          )}
          
          {(!userData.weekendVibes || userData.weekendVibes.length === 0) && (
            <TouchableOpacity
              className="bg-[#2E2C2C] rounded-lg p-4 flex-row items-center justify-between"
              onPress={() => router.navigate("/Users/WeekendVibes")}
            >
              <View className="flex-row items-center">
                <Text className="text-white mr-3">🎉</Text>
                <View>
                  <Text className="text-white font-roboto-condensed text-[14px]">
                    Mes activités weekend
                  </Text>
                  <Text className="text-white/50 text-[12px]">
                    Partagez vos hobbies et centres d'intérêt
                  </Text>
                </View>
              </View>
              <Text className="text-red text-[20px]">→</Text>
            </TouchableOpacity>
          )}
          
          {(!userData.mesVideos || userData.mesVideos.length === 0) && (
            <TouchableOpacity
              className="bg-[#2E2C2C] rounded-lg p-4 flex-row items-center justify-between"
              onPress={() => router.navigate("/Users/VideoChallenge")}
            >
              <View className="flex-row items-center">
                <Text className="text-white mr-3">🎥</Text>
                <View>
                  <Text className="text-white font-roboto-condensed text-[14px]">
                    Ajouter des vidéos
                  </Text>
                  <Text className="text-white/50 text-[12px]">
                    Montrez votre style et vos talents
                  </Text>
                </View>
              </View>
              <Text className="text-red text-[20px]">→</Text>
            </TouchableOpacity>
          )}
          
          {!userData.percentage && (
            <TouchableOpacity
              className="bg-[#2E2C2C] rounded-lg p-4 flex-row items-center justify-between"
              onPress={() => router.navigate("/Users/MiniQuiz")}
            >
              <View className="flex-row items-center">
                <Text className="text-white mr-3">🏆</Text>
                <View>
                  <Text className="text-white font-roboto-condensed text-[14px]">
                    Passer le FitScore Quiz
                  </Text>
                  <Text className="text-white/50 text-[12px]">
                    Découvrez votre niveau et trouvez des partenaires adaptés
                  </Text>
                </View>
              </View>
              <Text className="text-red text-[20px]">→</Text>
            </TouchableOpacity>
          )}
        </View>

        {userData.totalPoints !== undefined && (
          <Text style={styles.points}>🏆 Points: {userData.totalPoints}</Text>
        )}

        {userData.percentage !== undefined && (
          <Text style={styles.percentage}>
            🎯 Completion: {userData.percentage}%
          </Text>
        )}
        <TouchableOpacity
          className=" mx-4 items-center justify-center rounded-[16] bg-[#D32C1C] py-2 w-full mt-20"
          onPress={() => setConfirmVisible(true)}
        >
          <Text className="text-white font-roboto-condensed tracking-[-0.3px] text-[20px]">
            Supprimer mes données!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-transparent border border-[#FF0000] rounded-full py-3 items-center px-20 mt-4 w-full"
          onPress={() => setLogoutConfirmVisible(true)}
        >
          <Text className="text-[#FFF] font-roboto text-[1.2rem]">
            Déconnexion
          </Text>
        </TouchableOpacity>
        {logoutConfirmVisible && (
          <View className="absolute inset-0 bg-black/80 justify-center items-center px-6 z-50">
            <View className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mt-48">
              <Text className="text-white text-[18px] font-bold mb-2 text-center">
                Voulez-vous vous déconnecter ?
              </Text>
              <Text className="text-gray-300 text-center text-[14px] leading-5 mb-4">
                Vous serez redirigé vers la page d’accueil et devrez vous
                reconnecter pour accéder à votre compte.
              </Text>

              <View className="flex-row justify-between gap-4">
                <TouchableOpacity
                  onPress={() => setLogoutConfirmVisible(false)}
                  className="flex-1 py-3 bg-gray-600 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-[16px]">
                    Annuler
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    setBusy(true);
                    setLogoutConfirmVisible(false);
                    dispatch(setUser(null));
                    dispatch(resetUserData());
                    try {
                      await signOutGoogle();
                      await signOutEmail();
                    } catch (e: any) {
                      console.warn(e);
                    }
                    setBusy(false);
                    router.dismissAll();
                    router.dismissTo("/Auth/LandingPage");
                  }}
                  className="flex-1 py-3 bg-red-700 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-[16px]">
                    Se déconnecter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {confirmVisible && (
          <View className="absolute inset-0 bg-black/80 justify-center items-center px-6 z-50">
            <View className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mt-48">
              <Text className="text-white text-[18px] font-bold mb-2 text-center">
                Supprimer définitivement vos données ?
              </Text>
              <Text className="text-gray-300 text-center text-[14px] leading-5 mb-4">
                Cette action est{" "}
                <Text className="text-red-400 font-semibold">irréversible</Text>
                . Toutes vos données personnelles seront supprimées et ne seront{" "}
                <Text className="text-red-400 font-semibold">
                  pas conservées
                </Text>{" "}
                dans notre base de données.
              </Text>

              <View className="flex-row justify-between gap-4">
                <TouchableOpacity
                  onPress={() => setConfirmVisible(false)}
                  className="flex-1 py-3 bg-gray-600 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-[16px]">
                    Annuler
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const auth = getAuth();
                      const currentUser = auth.currentUser;

                      if (!currentUser) {
                        Toast.show({
                          type: "error",
                          text1: "Erreur",
                          text2: "Aucun utilisateur connecté.",
                        });
                        return;
                      }

                      await deleteDoc(doc(db, "users", currentUser.uid));
                      await deleteUser(currentUser);

                      Toast.show({
                        type: "success",
                        text1: "Compte supprimé",
                        text2: "Votre compte a été supprimé avec succès.",
                      });

                      setConfirmVisible(false);
                      router.dismissAll();
                      router.replace("/Auth/LandingPage");
                    } catch (err: any) {
                      console.error("Delete error:", err);
                      let message = "Une erreur est survenue.";

                      if (err.code === "auth/requires-recent-login") {
                        message =
                          "Reconnectez-vous avant de supprimer votre compte.";
                      }

                      Toast.show({
                        type: "error",
                        text1: "Erreur",
                        text2: message,
                      });
                    }
                  }}
                  className="flex-1 py-3 bg-red-700 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-[16px]">
                    Supprimer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
  },
  content: {
    alignItems: "center",
    padding: 24,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 12,
  },
  points: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
  percentage: {
    color: "#00ffcc",
    fontSize: 16,
    marginTop: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProfileScreen;
