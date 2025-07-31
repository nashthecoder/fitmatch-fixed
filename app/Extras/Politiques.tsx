import BackBTNIcon from "@/components/Icons/BackBTNIcon";
import MenuMobileIcon from "@/components/Icons/MenuMobileIcon";
import Socials from "@/components/Icons/Socials";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BulletPoint = ({ children }: { children: React.ReactNode }) => (
  <View className="flex-row ml-3 gap-2 mt-1">
    <View className="h-1 w-1 bg-white rounded-md mt-2" />
    <Text className="font-inter text-[10px] text-white">{children}</Text>
  </View>
);

const Politiques = () => {
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        className="absolute z-10 p-3 bg-dark h-[36px] w-[36px] left-4 justify-center items-center"
        style={{ top: top + 12 }}
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <BackBTNIcon />
      </TouchableOpacity>

      <Text className="text-center text-white font-inter-bold text-[25px] mt-12">
        Politique de Confidentialité
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-gray-900 rounded-2xl overflow-hidden my-2 mx-3"
        contentContainerClassName="pb-4"
      >
        {/* 1. Introduction */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            1. Introduction
          </Text>
          <Text className="text-white text-[10px] font-inter">
            La présente Politique de Confidentialité a pour objectif d’informer
            les utilisateurs de l’application FITMATCH sur la collecte,
            l’utilisation et la protection de leurs données personnelles,
            conformément au Règlement Général sur la Protection des Données
            (RGPD).
          </Text>
        </View>

        {/* 2. Responsable du traitement */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            2. Responsable du traitement
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Nom de l’entreprise : [Nom de l’entité responsable]
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Contact DPO : [adresse mail RGPD ou support]
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Adresse : [adresse du siège social]
          </Text>
        </View>

        {/* 3. Données collectées */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            3. Données collectées
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Lors de l’utilisation de l’application, les données suivantes
            peuvent être collectées :
          </Text>
          <BulletPoint>
            Informations de profil : nom, prénom, photo, sport(s) pratiqué(s),
            niveau, préférences
          </BulletPoint>
          <BulletPoint>
            Données de localisation (uniquement avec autorisation)
          </BulletPoint>
          <BulletPoint>Messages échangés entre utilisateurs</BulletPoint>
          <BulletPoint>Statuts et contenus partagés</BulletPoint>
          <BulletPoint>
            Informations techniques : type d’appareil, système d’exploitation,
            langue, journaux de connexion
          </BulletPoint>
        </View>

        {/* 4. Finalités du traitement */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            4. Finalités du traitement
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les données collectées sont utilisées pour :
          </Text>
          <BulletPoint>
            Permettre le bon fonctionnement de l’application et des services
            liés
          </BulletPoint>
          <BulletPoint>
            Proposer des profils compatibles et afficher les statuts sportifs
          </BulletPoint>
          <BulletPoint>Gérer la messagerie et les interactions</BulletPoint>
          <BulletPoint>Améliorer l’expérience utilisateur</BulletPoint>
          <BulletPoint>Assurer la sécurité de l’application</BulletPoint>
          <BulletPoint>
            Afficher les publicités et offres via le plugin sponsorisé (1
            affichage maximum)
          </BulletPoint>
        </View>

        {/* 5. Stockage des données */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            5. Stockage des données
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les données sont stockées de manière sécurisée via Google Firebase
            (Google Cloud) sur des serveurs hébergés en Europe. Des mesures
            techniques et organisationnelles sont mises en place pour protéger
            les informations contre toute access non autorisé.
          </Text>
        </View>

        {/* 6. Durée de conservation */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            6. Durée de conservation
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les données sont conservées pendant la durée de l’utilisation du
            service. En cas d’inactivité d’une compte supérieure à 12 mois, les
            données seront automatiquement supprimées, sauf en cas de nécessité
            de preuve.
          </Text>
        </View>

        {/* 7. Vos droits */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            7. Vos droits
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Conformément au RGPD, vous disposez des droits suivants :
          </Text>
          <BulletPoint>Droit d’accès</BulletPoint>
          <BulletPoint>Droit de rectification</BulletPoint>
          <BulletPoint>Droit à l’effacement</BulletPoint>
          <BulletPoint>Droit d’opposition</BulletPoint>
          <BulletPoint>Droit à la portabilité des données</BulletPoint>
          <Text className="text-white text-[10px] font-inter">
            Pour exercer vos droits : rgpd@fitmatch.app
          </Text>
        </View>

        {/* 8. Cookies et traceurs */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            8. Cookies et traceurs
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L’application peut utiliser des cookies techniques et de mesure
            d’audience. Le refus d’utilisation peut entraîner que certains
            services soient inaccessibles. Le détail des cookies est accessible
            depuis les paramètres sociaux affichés lors de la première
            ouverture.
          </Text>
        </View>

        {/* 9. Confidentialité entre utilisateurs */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            9. Confidentialité entre utilisateurs
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les informations partagées entre utilisateurs sont strictement
            privées et ne sont jamais utilisées à des fins hors de
            l’application. Aucun contenu n’est indexé sur des moteurs de
            recherche externes.
          </Text>
        </View>

        {/* 10. Mise à jour */}
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            10. Mise à jour
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Cette politique peut être mise à jour. Toute modification importante
            sera notifiée directement via l’app.
            {"\n"}Dernière mise à jour : [date]
          </Text>
        </View>

        <View className="my-4 items-center justify-center">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[85] h-[55]"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-white border-b-2 my-2 mx-4" />
      <View className="flex-row items-center justify-between mt-2 mb-4 mx-4 bottom-0 left-0 right-0">
        <Text className="text-white font-inter text-[8px]">@2025</Text>
        <TouchableOpacity
          hitSlop={8}
          onPress={() => router.navigate("/Extras/MentionsLegales")}
        >
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
        <TouchableOpacity hitSlop={8}>
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

export default Politiques;
