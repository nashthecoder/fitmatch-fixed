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

const CGU = () => {
  const { top } = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <TouchableOpacity
        className={`bg-dark h-[36px] w-[36px| lef-4 justify-center items-center absolute z-10 p-3`}
        style={{ top: top + 12 }}
        onPress={() => {
          if (router.canGoBack()) router.back();
        }}
      >
        <BackBTNIcon />
      </TouchableOpacity>
      <Text className="text-center text-white font-inter-bold text-[25px] mt-12">
        Conditions Générales
      </Text>
      <Text className="text-center text-white font-inter-bold text-[25px]">
        d&apos;Utilisation
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-gray-900 rounded-2xl overflow-hidden my-2"
        contentContainerClassName="rounded-3xl "
      >
        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            1. Objet 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les présentes Conditions Générales d&apos;Utilisation (ci-après «
            CGU ») ont pour objet de définir les modalités d&apos;accès et
            d&apos;utilisation de l&apos;application mobile FITMATCH, mise à
            disposition par [Nom de l&apos;entreprise], ci-après désignée «
            l&apos;Editeur ». En accédant à l&apos;application,
            l&apos;utilisateur accepte sans réserve les présentes CGU. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            2. Accès au service 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;application FITMATCH est accessible gratuitement en
            téléchargement sur App Store et Google Play. Certaines
            fonctionnalités peuvent nécessiter la création d&apos;un compte
            utilisateur ou l&apos;accès à un abonnement payant (offre Premium). 
            L&apos;accès au service peut être temporairement suspendu pour
            maintenance, mise à jour ou cas de force majeure. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            3. Utilisation de l&apos;application 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;utilisateur s&apos;engage à utiliser l&apos;application dans
            le respect des lois en vigueur et des règles de bonne conduite. Il
            est interdit notamment :
          </Text>

          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              de publier du contenu offensant, discriminatoire ou illicite ; 
            </Text>
          </View>

          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              d&apos;usurper l&apos;identité d&apos;un tiers ; 
            </Text>
          </View>

          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              de perturber le bon fonctionnement du service ou d&apos;en faire
              un usage frauduleux. 
            </Text>
          </View>

          <Text className="text-white text-[10px] font-inter">
            L&apos;Editeur se réserve le droit de supprimer tout compte ne
            respectant pas ces règles. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            4. Durée et résiliation 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;inscription est valable pour une durée indéterminée.
            L&apos;utilisateur peut supprimer son compte à tout moment via les
            paramètres de l&apos;application.  L&apos;Editeur peut suspendre ou
            supprimer un compte en cas de non-respect des CGU ou comportement
            inapproprié. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            5. Responsabilité 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;Editeur met en œuvre tous les moyens raisonnables pour
            assurer un accès fiable et sécurisé à l&apos;application. Toutefois,
            sa responsabilité ne saurait être engagée en cas de : 
          </Text>

          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              bug technique ou interruption temporaire ; 
            </Text>
          </View>

          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              perte de données liée à un tiers ; 
            </Text>
          </View>
          <View className="flex-row ml-3 gap-2">
            <View className="h-1 w-1 bg-white rounded-md mt-2" />
            <Text className="font-inter text-[10px] text-white">
              mauvaise utilisation par l&apos;utilisateur. 
            </Text>
          </View>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            6. Propriété intellectuelle 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;ensemble des éléments de l&apos;application (textes, visuels,
            code, logo) est protégé par le droit de la propriété intellectuelle
            et demeure la propriété exclusive de l&apos;Editeur.  Toute
            reproduction ou utilisation non autorisée est interdite. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            7. Données personnelles 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;utilisation de l&apos;application implique la collecte de
            certaines données personnelles. L&apos;utilisateur est invité à
            consulter la Politique de Confidentialité pour connaître ses droits
            et les modalités de traitement. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            8. Liens externes 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;application peut contenir des liens vers des sites tiers.
            L&apos;Editeur n&apos;est pas responsable du contenu ou du bon
            fonctionnement de ces sites. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            9. Modifications des CGU 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            L&apos;Editeur se réserve le droit de modifier les présentes CGU à
            tout moment. Les utilisateurs seront informés de toute modification
            importante via une notification dans l&apos;application. 
          </Text>
        </View>

        <View className="m-2">
          <Text className="text-white font-inter-bold text-[11px]">
            10. Droit applicable 
          </Text>
          <Text className="text-white text-[10px] font-inter">
            Les présentes CGU sont soumises au droit français. En cas de litige,
            les tribunaux compétents seront ceux du ressort du siège social de
            l&apos;Editeur. 
          </Text>
        </View>

        <View className="my-4 items-center justify-center">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[85] h-[55]"
          />
        </View>
      </ScrollView>
      <View className="border-white border-b-2 my-2 mx-4" />
      <View className="flex-row items-center justify-between mt-2 mb-4 mx-4 bottom-0 left-0 right-0">
        <Text className="text-white font-inter text-[8px]">@2025</Text>
        <TouchableOpacity hitSlop={8}>
          <Text
            className="text-white font-inter text-[8px]"
            onPress={() => router.navigate("/Extras/MentionsLegales")}
          >
            Mentions légales
          </Text>
        </TouchableOpacity>

        <TouchableOpacity hitSlop={8}>
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

export default CGU;
