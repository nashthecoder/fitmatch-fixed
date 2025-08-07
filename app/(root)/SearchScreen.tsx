import CalendarIcon from "@/components/Icons/CalendarIcon";
import GearIcon from "@/components/Icons/GearIcon";
import HandShakeIcon from "@/components/Icons/HandShakeIcon";
import SearchFilters from "@/components/Icons/SearchBar/SearchFilters";
import SettingsIcon from "@/components/Icons/SettingsIcon";
import Post from "@/components/Posts/Post";
import SearchBar from "@/components/Search/SearchBar";
import UserCard from "@/components/UserCard";
import { Image } from "expo-image";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const db = getFirestore();

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("personnes");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const currentUser = getAuth().currentUser;

  const handleFilterChange = (filter: string) => {
    if (loading) return;
    setResults([]);
    setHasSearched(false);
    setSelectedFilter(filter);
    handleSearch();
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);
    let searchResults: any[] = [];

    try {
      if (selectedFilter === "personnes") {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("personalData", "==", true));
        const snapshot = await getDocs(q);
        searchResults = snapshot.docs
          .map((doc) => ({ ...doc.data(), uid: doc.id }))
          .filter((user: any) =>
            [user.nom, user.prenom, user.pseudo].some((field) =>
              field?.toLowerCase().includes(searchTerm.toLowerCase().trim())
            )
          );
      } else if (
        selectedFilter === "publications" ||
        selectedFilter === "évènements"
      ) {
        const snapshot = await getDocs(collection(db, "posts"));
        searchResults = snapshot.docs
          .map((doc) => ({ uid: doc.id, ...doc.data() }))
          .filter((post: any) =>
            [post.text, post.posterInfo?.username].some((field) =>
              field?.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
      }
    } catch (err) {
      console.error("Error searching:", err);
    }

    if (searchResults.length === 0) Vibration.vibrate(300);
    setResults(searchResults);
    console.log("results >>> ", searchResults);

    setLoading(false);
  };
  
  useEffect(() => {
    // Delay mounting to ensure proper layout calculation
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (hasSearched && searchTerm.trim()) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);
  return (
    <SafeAreaView className="bg-[#0f0e0c] flex-1">
      <View className="flex-row items-center justify-between pr-4">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 66, height: 40, margin: 10 }}
          contentFit="cover"
        />
        <View className="flex-row items-center gap-4">
          <TouchableOpacity hitSlop={8}>
            <HandShakeIcon />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8}>
            <CalendarIcon />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8}>
            <GearIcon />
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={(search: string) => {
          setHasSearched(false);
          setSearchTerm(search);
        }}
        onSearch={handleSearch}
        loading={loading}
      />
      <SearchFilters
        selectedFilter={selectedFilter}
        setSelectedFilter={handleFilterChange}
      />
      {selectedFilter === "personnes" && !loading && (
        <Animated.View
          entering={FadeInDown}
          className="flex-row items-center mb-4 gap-x-4"
          style={{ marginLeft: 40 }}
        >
          <View className="" style={{ paddingBottom: 10 }}>
            <SettingsIcon />
          </View>
          <TouchableOpacity className="items-center justify-center px-2 border border-white rounded-full">
            <Text className="text-white font-roboto-condensed-light tracking-|-0.3px]">
              A proximité
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center justify-center px-2 border border-white rounded-full">
            <Text className="text-white font-roboto-condensed-light tracking-|-0.3px]">
              Sport en commun
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4 space-y-4 mt-2 flex-1 h-ful"
      >
        {loading && isMounted && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut.duration(500)}
            className={"flex-1 items-center justify-center h-[50vh]"}
          >
            <Text className="text-white text-center font-roboto-condensed-bold text-[20px] tracking-[-0.3px]">
              Recherche en cours...
            </Text>
            <View style={{ width: 200, height: 200, marginVertical: 30 }}>
              {(() => {
                try {
                  return (
                    <LottieView
                      source={require("@/assets/animations/Red Network Globe.json")}
                      style={{
                        width: 200,
                        height: 200,
                        backgroundColor: "transparent",
                        minWidth: 200,
                        minHeight: 200,
                      }}
                      autoPlay
                      loop
                      resizeMode="contain"
                      onAnimationFailure={(error) => {
                        console.warn('Lottie animation failed:', error);
                      }}
                    />
                  );
                } catch (error) {
                  console.warn('Lottie animation error:', error);
                  return (
                    <View style={{ width: 200, height: 200, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#D32C1C" />
                    </View>
                  );
                }
              })()}
            </View>
          </Animated.View>
        )}
        {!loading && results.length === 0 && isMounted && (
          <Animated.View
            entering={FadeIn.duration(600)}
            className="w-full h-[60vh] items-center justify-center flex-1 gap-3"
          >
            {hasSearched && (
              <Text className="text-white text-center font-roboto-condensed-bold text-[20px] tracking-[-0.3px]">
                Aucun résultat trouvé.
              </Text>
            )}
            <View style={{ width: 200, height: 200 }}>
              {(() => {
                try {
                  return (
                    <LottieView
                      source={require("@/assets/animations/Search File.json")}
                      style={{ 
                        width: 200, 
                        height: 200,
                        minWidth: 200,
                        minHeight: 200,
                      }}
                      autoPlay
                      loop
                      resizeMode="contain"
                      onAnimationFailure={(error) => {
                        console.warn('Lottie animation failed:', error);
                      }}
                    />
                  );
                } catch (error) {
                  console.warn('Lottie animation error:', error);
                  return (
                    <View style={{ width: 200, height: 200, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                      <Text className="text-white text-center">🔍</Text>
                    </View>
                  );
                }
              })()}
            </View>
          </Animated.View>
        )}
        <Animated.View
          entering={FadeIn.duration(800).delay(2000)}
          className="flex-row flex-wrap gap-2"
        >
          {!loading &&
            results &&
            results.length > 0 &&
            results.map((item, index) =>
              selectedFilter === "personnes" ? (
                <UserCard key={item.pseudo} user={item} index={index} />
              ) : (
                <View
                  key={item.id}
                  className="rounded-3xl overflow-hidden my-2"
                >
                  {item && (
                    <Post
                      post={item}
                      poster={item.posterInfo}
                      currentUserUid={currentUser?.uid}
                    />
                  )}
                </View>
              )
            )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
