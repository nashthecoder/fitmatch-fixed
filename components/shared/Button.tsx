import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import { getResponsiveFontSize, getResponsiveSpacing, isDesktop, isTablet } from '@/helpers/responsive';

export interface ButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  // Responsive dimensions
  const getButtonHeight = () => {
    const base = size === 'small' ? 36 : size === 'large' ? 56 : 44;
    return getResponsiveSpacing(base);
  };

  const getPaddingHorizontal = () => {
    const base = size === 'small' ? 12 : size === 'large' ? 24 : 16;
    return getResponsiveSpacing(base);
  };

  const getFontSize = () => {
    const base = size === 'small' ? 14 : size === 'large' ? 18 : 16;
    return getResponsiveFontSize(base);
  };

  const getHitSlop = () => {
    if (isDesktop()) return { top: 8, bottom: 8, left: 8, right: 8 };
    if (isTablet()) return { top: 6, bottom: 6, left: 6, right: 6 };
    return { top: 4, bottom: 4, left: 4, right: 4 };
  };

  // Variant styles
  const getVariantStyles = (): { container: string; text: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: 'bg-gray-600',
          text: 'text-white',
        };
      case 'danger':
        return {
          container: 'bg-red-500',
          text: 'text-white',
        };
      case 'outline':
        return {
          container: 'bg-transparent border border-red-500',
          text: 'text-red-500',
        };
      default: // primary
        return {
          container: 'bg-red-500',
          text: 'text-white',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={getHitSlop()}
      className={`
        ${variantStyles.container}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50' : ''}
        rounded-lg
        flex-row
        items-center
        justify-center
      `}
      style={[
        {
          height: getButtonHeight(),
          paddingHorizontal: getPaddingHorizontal(),
          minWidth: isDesktop() ? 120 : isTablet() ? 100 : 80,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      {...accessibilityProps}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#ef4444' : 'white'} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={`${variantStyles.text} font-roboto-condensed-bold text-center`}
            style={[
              {
                fontSize: getFontSize(),
                marginLeft: icon ? getResponsiveSpacing(8) : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(Button);