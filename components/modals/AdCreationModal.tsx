import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import CheckIcon from "../Icons/CheckIcon";
import CloseIcon from "../Icons/CloseIcon";
import PencilIcon from "../Icons/PencilIncon";
import Spinner from "../shared/Spinner";

const AdCreationModal = ({
  visible = false,
  onRequestClose,
  onCreated,
}: {
  visible?: boolean;
  onRequestClose?: () => void;
  onCreated?: () => void;
}) => {
  const [created, setCreated] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      handleCreated();
    }, 10000);
  }, []);

  const handleCreated = () => {
    onCreated && onCreated();
    setCreated(true);
  };

  return (
    <Modal transparent visible={visible}>
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex flex-1 bg-black/90 h-full w-full items-center justify-center"
      >
        <View className="flex-row justify-between items-center pr-10 pl-4 w-full absolute top-8">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-[66] h-[43]"
            resizeMode="cover"
          />
          {created && (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => router.dismissTo("/Auth/ProfilPartenaire")}
            >
              <CloseIcon />
            </TouchableOpacity>
          )}
        </View>
        {created && (
          <Animated.View entering={FadeInDown.duration(450)}>
            <CheckIcon />
          </Animated.View>
        )}

        {created ? (
          <Animated.View entering={FadeInDown.duration(600)}>
            <Animated.Text className="text-center text-white text-[20px] mb-4 trakcing-[-0.3px] font-roboto-bold">
              Votre publicté a été validé
            </Animated.Text>
          </Animated.View>
        ) : (
          <Animated.Text
            entering={FadeInDown.duration(600)}
            exiting={FadeOut}
            className="text-center text-white text-[20px] mb-4 trakcing-[-0.3px] font-roboto-bold"
          >
            Votre publicité est en cours de validation
          </Animated.Text>
        )}

        {!created && (
          <View className="absolute items-center justify-center">
            <Spinner size={175} />
          </View>
        )}
        <ImageBackground
          source={require("@/assets/images/adImage.png")}
          resizeMode="cover"
          className="w-[350] h-[580] items-center justify-start overflow-hidden"
          style={{
            opacity: created ? 1 : 0.8,
          }}
          blurRadius={created ? 0 : 15}
        ></ImageBackground>
        {created && (
          <TouchableOpacity className="rounded-[8px] bg-white items-center mt-4 px-6 py-2">
            <PencilIcon />
            <Text>Modifier</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Modal>
  );
};

export default AdCreationModal;
