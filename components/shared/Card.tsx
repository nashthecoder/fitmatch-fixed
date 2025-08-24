import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { ImageBackground } from 'expo-image';
import { getResponsiveFontSize, getResponsiveSpacing, isDesktop, isTablet } from '@/helpers/responsive';

export interface CardProps extends AccessibilityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  backgroundImage?: string;
  style?: ViewStyle;
  padding?: boolean;
  rounded?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  backgroundImage,
  style,
  padding = true,
  rounded = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  ...accessibilityProps
}) => {
  // Responsive dimensions
  const getPadding = () => {
    if (!padding) return 0;
    const base = 16;
    return getResponsiveSpacing(base);
  };

  const getBorderRadius = () => {
    if (!rounded) return 0;
    const base = 12;
    return getResponsiveSpacing(base);
  };

  const getElevation = () => {
    if (variant === 'elevated') {
      return isDesktop() ? 8 : isTablet() ? 6 : 4;
    }
    return 0;
  };

  const getShadowStyle = () => {
    if (variant === 'elevated') {
      return {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: getElevation() / 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: getElevation(),
        elevation: getElevation(),
      };
    }
    return {};
  };

  // Variant styles
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'elevated':
        return 'bg-gray-800';
      case 'outlined':
        return 'bg-transparent border border-gray-600';
      case 'filled':
        return 'bg-gray-700';
      default:
        return 'bg-gray-800';
    }
  };

  const cardContent = (
    <View
      className={getVariantStyles()}
      style={[
        {
          padding: getPadding(),
          borderRadius: getBorderRadius(),
        },
        getShadowStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );

  if (backgroundImage) {
    const imageContent = (
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={[
          {
            borderRadius: getBorderRadius(),
            overflow: 'hidden',
          },
          style,
        ]}
        contentFit="cover"
      >
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: getPadding(),
            borderRadius: getBorderRadius(),
          }}
        >
          {children}
        </View>
      </ImageBackground>
    );

    if (onPress) {
      return (
        <TouchableOpacity
          onPress={onPress}
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          {...accessibilityProps}
        >
          {imageContent}
        </TouchableOpacity>
      );
    }

    return imageContent;
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        {...accessibilityProps}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
      {...accessibilityProps}
    >
      {cardContent}
    </View>
  );
};

export default React.memo(Card);