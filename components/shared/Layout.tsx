import React from 'react';
import { View, ViewStyle, ScrollView, AccessibilityProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getResponsiveSpacing, isDesktop, isTablet } from '@/helpers/responsive';

export interface LayoutProps extends AccessibilityProps {
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'full-width' | 'padded';
  scrollable?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  safeArea?: boolean;
  padding?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  variant = 'default',
  scrollable = false,
  style,
  backgroundColor = '#111827', // gray-900
  safeArea = true,
  padding = true,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const insets = useSafeAreaInsets();

  // Get responsive padding
  const getPadding = () => {
    if (!padding) return 0;
    const base = 16;
    return getResponsiveSpacing(base);
  };

  // Get max width for centered variant
  const getMaxWidth = () => {
    if (variant === 'centered') {
      if (isDesktop()) return 1200;
      if (isTablet()) return 768;
      return undefined;
    }
    return undefined;
  };

  // Get layout styles based on variant
  const getLayoutStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flex: 1,
      backgroundColor,
    };

    if (safeArea) {
      baseStyles.paddingTop = insets.top;
      baseStyles.paddingBottom = insets.bottom;
      baseStyles.paddingLeft = insets.left;
      baseStyles.paddingRight = insets.right;
    }

    switch (variant) {
      case 'centered':
        return {
          ...baseStyles,
          alignItems: 'center',
          justifyContent: 'center',
        };
      case 'full-width':
        return {
          ...baseStyles,
          width: '100%',
        };
      case 'padded':
        return {
          ...baseStyles,
          padding: getPadding(),
        };
      default:
        return baseStyles;
    }
  };

  // Get content container styles
  const getContentStyles = (): ViewStyle => {
    const maxWidth = getMaxWidth();
    return {
      flex: 1,
      width: '100%',
      maxWidth,
      paddingHorizontal: variant !== 'padded' && padding ? getPadding() : 0,
      alignSelf: variant === 'centered' ? 'center' : 'stretch',
    };
  };

  const layoutStyles = getLayoutStyles();
  const contentStyles = getContentStyles();

  if (scrollable) {
    return (
      <View 
        style={[layoutStyles, style]}
        accessibilityLabel={accessibilityLabel}
        {...accessibilityProps}
      >
        <ScrollView
          style={contentStyles}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: padding ? getPadding() : 0,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View 
      style={[layoutStyles, style]}
      accessibilityLabel={accessibilityLabel}
      {...accessibilityProps}
    >
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );
};

export default React.memo(Layout);