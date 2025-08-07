import React from 'react';
import { View, Text, ViewStyle, AccessibilityProps } from 'react-native';
import { getResponsiveFontSize, getResponsiveSpacing, isDesktop, isTablet } from '@/helpers/responsive';

export interface TypographyProps extends AccessibilityProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'error' | 'white' | 'gray' | 'custom';
  customColor?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | 'semibold';
  style?: ViewStyle;
  numberOfLines?: number;
  selectable?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = 'white',
  customColor,
  align = 'left',
  weight = 'normal',
  style,
  numberOfLines,
  selectable = false,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  // Get responsive font sizes
  const getFontSize = () => {
    const baseSizes = {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      body: 16,
      caption: 14,
      overline: 12,
    };
    return getResponsiveFontSize(baseSizes[variant]);
  };

  // Get line height
  const getLineHeight = () => {
    const fontSize = getFontSize();
    return fontSize * 1.4; // 140% line height for better readability
  };

  // Get margin bottom for headings
  const getMarginBottom = () => {
    if (['h1', 'h2', 'h3', 'h4'].includes(variant)) {
      return getResponsiveSpacing(8);
    }
    return 0;
  };

  // Get color styles
  const getColorStyle = () => {
    if (customColor) return customColor;
    
    const colors = {
      primary: '#ef4444',
      secondary: '#6b7280',
      error: '#dc2626',
      white: '#ffffff',
      gray: '#9ca3af',
      custom: customColor || '#ffffff',
    };
    return colors[color];
  };

  // Get font weight class
  const getFontWeightClass = () => {
    const weights = {
      normal: 'font-roboto-condensed',
      semibold: 'font-roboto-condensed-semibold',
      bold: 'font-roboto-condensed-bold',
    };
    return weights[weight];
  };

  // Get text alignment class
  const getAlignClass = () => {
    return `text-${align}`;
  };

  // Get accessibility role
  const getAccessibilityRole = () => {
    if (['h1', 'h2', 'h3', 'h4'].includes(variant)) {
      return 'header';
    }
    return 'text';
  };

  // Get accessibility traits
  const getAccessibilityState = () => {
    const state: any = {};
    if (['h1', 'h2', 'h3', 'h4'].includes(variant)) {
      state.header = true;
    }
    return state;
  };

  return (
    <Text
      className={`${getFontWeightClass()} ${getAlignClass()}`}
      style={[
        {
          fontSize: getFontSize(),
          lineHeight: getLineHeight(),
          color: getColorStyle(),
          marginBottom: getMarginBottom(),
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      selectable={selectable}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={getAccessibilityState()}
      {...accessibilityProps}
    >
      {children}
    </Text>
  );
};

export default React.memo(Typography);