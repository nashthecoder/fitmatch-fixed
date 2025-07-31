// components/Spinner.tsx
import React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 48 }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `-${rotation.value}deg` }],
    };
  });

  return (
    <Animated.Image
      source={require("@/assets/images/icons/spinner.png")}
      resizeMode="contain"
      className="rounded-full z-100"
      style={[{ width: size, height: size }, animatedStyle]}
    />
  );
};

export default Spinner;
