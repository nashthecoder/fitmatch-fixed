import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import Spinner from "@/components/shared/Spinner";
import { db } from "@/config/firebase";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
import dayjs from "dayjs";
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
import { DateType } from "react-native-ui-datepicker";

type EventType = {
  id: string;
  titre: string;
  date: DateType;
  emplacement: string;
  imageUrls?: string[];
  valide: boolean;
};

const EventList = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const { height } = Dimensions.get("window");
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<EventType | null>(
    null
  );
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { top } = useSafeAreaInsets();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const q = query(
        collection(db, "Evenements"),
        where("partenaireId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const list: EventType[] = snapshot.docs.map((doc) => {
        console.log(doc.data());
        const milliseconds =
          doc.data().date.seconds * 1000 +
          Math.floor(doc.data().date.nanoseconds / 1_000_000);
        return {
          id: doc.id,
          ...doc.data(),
          date: dayjs(milliseconds).toDate(),
        };
      }) as EventType[];

      setEvents(list);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const user = getAuth().currentUser;
    if (!user) return;

    const q = query(
      collection(db, "Evenements"),
      where("partenaireId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: EventType[] = snapshot.docs.map((doc) => {
          const milliseconds =
            doc.data().date.seconds * 1000 +
            Math.floor(doc.data().date.nanoseconds / 1_000_000);
          return {
            id: doc.id,
            ...doc.data(),
            date: dayjs(milliseconds).toDate(),
          };
        }) as EventType[];

        setEvents(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to events:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const deleteEvent = async (eventId: string) => {
    setBusy(true);
    try {
      setShowConfirm(false);
      setShowModal(false);
      await deleteDoc(doc(db, "Evenements", eventId));
      console.log("Document deleted successfully");
      await fetchEvents();
      Toast.show({
        type: "success",
        text1: "Évènements",
        text2: "Votre évènement a été supprimé avec succès!",
      });
    } catch (error: any) {
      setShowConfirm(false);
      setShowModal(false);
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Une erreur s'est produite",
        text2: "Votre évènement n'a pas été supprimé!",
      });
    } finally {
      setBusy(false);
    }
  };

  const renderItem = ({ item }: { item: EventType }) => {
    console.log(item);
    return (
      <Animated.View entering={FadeIn.duration(600)}>
        <TouchableOpacity
          className="mb-4 mx-4 bg-white/10 rounded-lg overflow-hidden "
          onPress={() =>
            router.push({
              pathname: "/Events/EditEvent",
              params: { eventId: item.id },
            })
          }
        >
          <Image
            source={
              item?.imageUrls && item?.imageUrls!.length > 0
                ? { uri: item?.imageUrls[0] }
                : require("@/assets/images/coverImageDefault.png")
            }
            className="w-full h-[150px]"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-roboto-condensed-semibold text-white">
              {item.titre}
            </Text>
            <Text className="text-sm text-gray-300">
              📍 {item.emplacement || "Lieu inconnu"}
            </Text>
            <Text className="text-sm text-gray-300">
              📅 {item.date?.toLocaleString() || "Date non précisée"}
            </Text>
          </View>
          {!item.valide ? (
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
                Validé
              </Text>
            </View>
          )}
          <TouchableOpacity
            className="absolute bottom-4 right-4"
            hitSlop={8}
            onPress={() => {
              setSelectedEventId(item);
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
        className={`bg-dark h-[36px] w-[36px| lef-0 justify-center items-center absolute z-10 p-3`}
        style={{ top: top + 12 }}
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <BackBTNIcon />
      </TouchableOpacity>
      <Image
        source={require("@/assets/images/logo.png")}
        className="absolute top-2 right-4 w-[93] h-[48]"
        style={{ marginTop: top }}
      />
      <Text className="text-[24px] font-roboto-bold text-white -tracking-[0.3px] text-start ml-6 mt-16 mb-4">
        Mes événements
      </Text>
      <View className="flex-row items-center mx-4 mb-4 gap-2">
        <Ionicons name="filter-circle-outline" color={"white"} size={20} />
        <Text className="text-white font-roboto-thin">Tous mes évènements</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Spinner />
        </View>
      ) : events.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-40">
          <Text className="text-gray-500">Aucun événement trouvé.</Text>
          <TouchableOpacity
            className="mt-4 bg-red-500 px-6 py-3 rounded-full"
            onPress={() => router.navigate("/Events/NewEvent")}
          >
            <Text className="text-white">Créer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
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
        <BlurView style={{ ...StyleSheet.absoluteFillObject }} />
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
            className={"absolute w-[75vw] self-center rounded-3xl bg-black"}
            style={{
              marginTop: height / 4,
            }}
          >
            <Text className="text-red font-roboto-bold text-[22px] m-8 text-center -tracking-[0.3px] ">
              Danger!
            </Text>
            <Text className="text-white font-roboto-bold text-[18px] m-4 text-center -tracking-[0.3px] ">
              Voulez vraiment supprimer cet évènement?
            </Text>
            <Text className="text-white/70 font-roboto-thin text-[22px] m-4 text-center -tracking-[0.3px] ">
              {selectedEventId?.titre}
            </Text>
            {busy ? (
              <View className="flex-row my-6 items-center justify-center">
                <Text className="text-white font-roboto">
                  Suppression de l&apos;évènement
                </Text>
                <Spinner size={25} />
              </View>
            ) : (
              <View className="flex-row items-center justify-around my-4">
                <TouchableOpacity
                  className="mt-4 bg-gray-500 px-6 py-3 rounded-full"
                  onPress={() => setShowConfirm(false)}
                >
                  <Text className="text-white">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="mt-4 bg-red-500 px-6 py-3 rounded-full"
                  onPress={() => deleteEvent(selectedEventId?.id!)}
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
                  pathname: "/Events/EditEvent",
                  params: { eventId: selectedEventId?.id },
                });
              }}
            >
              <AntDesign name="edit" color={"green"} size={20} />
              <Text className="text-white text-center font-roboto-bold">
                Modifier lrévènement
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-4 bg-white/10 rounded-full py-4 px-4"
              onPress={() => setShowConfirm(true)}
            >
              <AntDesign name="delete" color={"red"} size={20} />
              <Text className="text-white text-center font-roboto-bold">
                Supprmer lrévènement
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default EventList;
