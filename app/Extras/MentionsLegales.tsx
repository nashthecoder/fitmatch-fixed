import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import MenuMobileIcon from "@/components/Icons/MenuMobileIcon";
import Socials from "@/components/Icons/Socials";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-4 bg-transparent p-4 rounded-xl mx-3 ">
    <Text className="text-black text-center font-inter-bold text-sm mb-2">
      {title}
    </Text>
    <Text className="text-black text-[12px] font-inter leading-4">
      {children}
    </Text>
  </View>
);

const MentionsLegales = () => {
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Back Button */}
      <TouchableOpacity
        className="absolute z-10 p-3 bg-dark h-[36px] w-[36px] left-4 justify-center items-center"
        style={{ top: top + 12 }}
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <BackBTNIcon />
      </TouchableOpacity>

      {/* Title */}
      <Text className="text-center text-white font-inter-bold text-[25px] mt-12">
        Mentions légales
      </Text>

      <ScrollView
        className="mt-2 mb-6 bg-[#b1b0b0] rounded-[30px]"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
      >
        {/* 1. Éditeur de l'application */}
        <Section title="1. Éditeur de l'application">
          Nom de l’entreprise : FitMatch Inc.
          {"\n"}Forme juridique : SAS
          {"\n"}SIRET : 123 456 789 00012
          {"\n"}Directeur de la publication : Jean Fitmatch
          {"\n"}Email : contact@fitmatch.app
          {"\n"}Téléphone : +33 6 12 34 56 78
          {"\n"}Adresse : 42 rue du Sport, 75000 Paris, France
          {"\n"}Contact :{" "}
        </Section>

        {/* 2. Hébergement de l'application */}
        <Section title="2. Hébergement de l'application">
          Nom de l’hébergeur : Google Cloud Platform
          {"\n"}Adresse : Google Ireland Ltd, Gordon House, Barrow Street,
          Dublin 4, Irlande {"\n\n"}
          <Text>Site web: </Text>
          <Text
            className="text-[#2583a3] underline"
            onPress={() => Linking.openURL("https://firebase.google.com")}
          >
            firebase.google.com
          </Text>
        </Section>

        {/* 3. Propriété intellectuelle */}
        <Section title="3. Propriété intellectuelle">
          L’ensemble des éléments présents sur l’application FitMatch (textes,
          images, logos, icônes, sons, logiciels) sont la propriété exclusive de
          FitMatch sauf mentions contraires.
          {"\n\n"}Toute reproduction, représentation, modification ou
          adaptation, totale ou partielle, de l’un de ces éléments est
          interdite, sauf autorisation écrite préalable.
        </Section>

        {/* 4. Données personnelles */}
        <Section title="4. Données personnelles">
          FITMATCH collecte et traite des données personnelles dans le respect
          du RGPD.
          {"\n"}
          Pour en savoir plus sur la nature des données collectées, leur
          utilisation, vos droits et les moyens de contact, veuillez consulter
          {"\n"}
          {"\n"}
          <View className="flex-row items-center gap-4 my-4">
            <FontAwesome name="long-arrow-right" size={24} color="black" />
            <Text
              className="text-[#2583a3] underline"
              onPress={() => router.navigate("/Extras/Politiques")}
            >
              Politique de confidentialité
            </Text>
          </View>
          .
        </Section>

        {/* 5. Signalement d'abus ou de contenu */}
        <Section title="5. Signalement d’abus ou de contenu">
          Tout utilisateur peut signaler des contenus contraires aux CGU, via
          l’adresse{" "}
          <Text
            className="text-[#2583a3] underline"
            onPress={() => Linking.openURL("mailto:support@fitmatch.app")}
          >
            support@fitmatch.app
          </Text>
          .{"\n"}Les éléments doivent contenir le détail du contenu à l’origine
          du signalement.
        </Section>

        {/* 6. Contact */}
        <Section title="6. Contact">
          Pour toute question, remarque ou demande d’exercice de droits,
          veuillez nous écrire à{" "}
          <Text
            className="text-[#2583a3] underline"
            onPress={() => Linking.openURL("mailto:rgpd@fitmatch.app")}
          >
            rgpd@fitmatch.app
          </Text>
          .
        </Section>
      </ScrollView>
      <Text className="font-roboto text-white text-[13px] -tracking-[0.3px] text-center my-4">
        Document mis à jour le : [date de dernière mise à jour] 
      </Text>
      <View className="mb-4 items-center justify-center">
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-[85] h-[55]"
        />
      </View>
      {/* Footer */}
      <View className="border-white border-b-2 my-2 mx-4" />
      <View className="flex-row items-center justify-between mt-2 mb-4 mx-4">
        <Text className="text-white font-inter text-[8px]">@2025</Text>
        <TouchableOpacity hitSlop={8}>
          <Text className="text-white font-inter text-[8px]">
            Mentions légales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.navigate("/Extras/CGU")}
        >
          <Text className="text-white font-inter text-[8px]">CGU</Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.navigate("/Extras/Politiques")}
        >
          <Text className="text-white font-inter text-[8px]">Politique de</Text>
          <Text className="text-white font-inter text-[8px]">
            confidentialité
          </Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <Socials />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8}>
          <MenuMobileIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MentionsLegales;
