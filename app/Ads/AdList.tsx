import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import Spinner from "@/components/shared/Spinner";
import { db } from "@/config/firebase";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type AdType = {
  id: string;
  productName: string;
  productType: string;
  description: string;
  distributionType: string;
  coverImageUrl?: string;
  validated: boolean;
};

const AdList = () => {
  const [ads, setAds] = useState<AdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdType | null>(null);
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { top } = useSafeAreaInsets();
  const { height } = Dimensions.get("window");

  const fetchAds = async () => {
    console.log("Getting ad list...");
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const q = query(
        collection(db, "Ads"),
        where("partenaire", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const list: AdType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        productName: doc.data().titre,
        coverImageUrl: doc.data().image_url,
        distributionType: doc.data().location,
      })) as AdType[];

      console.log("Got ad list!");

      setAds(list);
    } catch (err) {
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Subscribing to real-time ad updates...");
    const user = getAuth().currentUser;
    if (!user) return;

    const q = query(collection(db, "Ads"), where("partenaire", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: AdType[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          productName: doc.data().titre,
          coverImageUrl: doc.data().image_url,
          distributionType: doc.data().location,
        })) as AdType[];
        setAds(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to ads:", error);
        setLoading(false);
      }
    );

    return () => {
      console.log("Unsubscribing from real-time ad updates...");
      unsubscribe(); // Clean up on unmount
    };
  }, []);

  const deleteAd = async (adId: string) => {
    setBusy(true);
    try {
      setShowConfirm(false);
      setShowModal(false);
      await deleteDoc(doc(db, "Ads", adId));
      await fetchAds();
      Toast.show({
        type: "success",
        text1: "Publicité supprimée",
        text2: "Votre annonce a été supprimée avec succès!",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "La publicité n'a pas pu être supprimée!",
      });
    } finally {
      setBusy(false);
    }
  };

  const renderItem = ({ item }: { item: AdType }) => {
    return (
      <Animated.View entering={FadeIn.duration(600)}>
        <TouchableOpacity
          className="mb-4 mx-4 bg-white/10 rounded-lg overflow-hidden"
          onPress={() =>
            router.push({
              pathname: "/Ads/EditAd",
              params: { adId: item.id },
            })
          }
        >
          <Image
            source={
              item.coverImageUrl
                ? { uri: item.coverImageUrl }
                : require("@/assets/images/coverImageDefault.png")
            }
            className="w-full h-[150px]"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-roboto-condensed-semibold text-white">
              {item.productName}
            </Text>
            <Text className="text-sm text-gray-300">📦 {item.productType}</Text>
            <Text className="text-sm text-gray-300">
              🧾 {item.distributionType}
            </Text>
          </View>
          {!item.validated ? (
            <View className="bg-yellow-800 rounded-full p-1 px-4 self-start mb-4 mx-4 flex-row gap-2 items-center">
              <AntDesign name="clockcircleo" color={"white"} size={16} />
              <Text className="text-white font-inter-bold text-[12px]">
                En attente de validation
              </Text>
            </View>
          ) : (
            <View className="bg-green-800 rounded-full p-1 px-4 self-start mb-4 mx-4 flex-row gap-2 items-center">
              <AntDesign name="checkcircleo" color={"white"} size={16} />
              <Text className="text-white font-inter-bold text-[12px]">
                Validée
              </Text>
            </View>
          )}
          <TouchableOpacity
            className="absolute bottom-4 right-4"
            hitSlop={8}
            onPress={() => {
              setSelectedAd(item);
              setShowModal(true);
            }}
          >
            <Entypo name="dots-three-vertical" size={15} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        className="bg-dark h-[36px] w-[36px] absolute z-10 p-3 justify-center items-center"
        style={{ top: top + 12 }}
        onPress={() => router.canGoBack() && router.back()}
      >
        <BackBTNIcon />
      </TouchableOpacity>
      <Image
        source={require("@/assets/images/logo.png")}
        className="absolute top-2 right-4 w-[93px] h-[48px]"
        style={{ marginTop: top }}
      />
      <Text className="text-[24px] font-roboto-bold text-white ml-6 mt-16 mb-4">
        Mes publicités
      </Text>
      <View className="flex-row items-center mx-4 mb-4 gap-2">
        <Ionicons name="filter-circle-outline" color={"white"} size={20} />
        <Text className="text-white font-roboto-thin">Toutes mes annonces</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner />
        </View>
      ) : ads.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-40">
          <Text className="text-gray-500">Aucune publicité trouvée.</Text>
          <TouchableOpacity
            className="mt-4 bg-red-500 px-6 py-3 rounded-full"
            onPress={() => router.navigate("/Ads/NewAd")}
          >
            <Text className="text-white">Créer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal
        visible={showModal}
        transparent
        onRequestClose={() => {
          if (busy) return;
          if (showConfirm) setShowConfirm(false);
          else setShowModal(false);
        }}
      >
        <BlurView style={StyleSheet.absoluteFillObject} />
        <Pressable
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
          onPress={() => {
            if (busy) return;
            if (showConfirm) setShowConfirm(false);
            else setShowModal(false);
          }}
        />

        {showConfirm ? (
          <Animated.View
            entering={ZoomIn.duration(500)}
            className="absolute w-[75vw] self-center rounded-3xl bg-black"
            style={{ marginTop: height / 4 }}
          >
            <Text className="text-red font-roboto-bold text-[22px] m-8 text-center">
              Danger!
            </Text>
            <Text className="text-white font-roboto-bold text-[18px] mx-4 text-center">
              Voulez-vous vraiment supprimer cette publicité?
            </Text>
            <Text className="text-white/70 font-roboto-thin text-[22px] mx-4 text-center">
              {selectedAd?.productName}
            </Text>
            {busy ? (
              <View className="flex-row my-6 items-center justify-center">
                <Text className="text-white font-roboto mr-2">
                  Suppression...
                </Text>
                <Spinner size={25} />
              </View>
            ) : (
              <View className="flex-row items-center justify-around my-4">
                &quot;² &quot;
                <TouchableOpacity
                  className="bg-gray-500 px-6 py-3 rounded-full"
                  onPress={() => setShowConfirm(false)}
                >
                  <Text className="text-white">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 px-6 py-3 rounded-full"
                  onPress={() => deleteAd(selectedAd?.id!)}
                >
                  <Text className="text-white">Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn}
            className="absolute bottom-0 bg-black px-8 pb-8 w-full gap-4"
          >
            <View className="bg-white self-center h-1 w-10 mt-4 rounded-full" />
            <TouchableOpacity
              className="flex-row items-center gap-4 bg-white/10 rounded-full py-4 px-4"
              onPress={() => {
                setShowModal(false);
                router.push({
                  pathname: "/Ads/EditAd",
                  params: { adId: selectedAd?.id },
                });
              }}
            >
              <AntDesign name="edit" color={"green"} size={20} />
              <Text className="text-white font-roboto-bold">
                Modifier la publicité
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-4 bg-white/10 rounded-full py-4 px-4"
              onPress={() => setShowConfirm(true)}
            >
              <AntDesign name="delete" color={"red"} size={20} />
              <Text className="text-white font-roboto-bold">
                Supprimer la publicité
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default AdList;
