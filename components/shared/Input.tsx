import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { getResponsiveFontSize, getResponsiveSpacing, isDesktop, isTablet } from '@/helpers/responsive';

export interface InputProps extends TextInputProps, AccessibilityProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'minimal';
  containerStyle?: ViewStyle;
  required?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      containerStyle,
      required = false,
      style,
      accessibilityLabel,
      accessibilityHint,
      ...props
    },
    ref
  ) => {
    // Responsive dimensions
    const getInputHeight = () => {
      const base = 50;
      return getResponsiveSpacing(base);
    };

    const getPaddingHorizontal = () => {
      const base = 16;
      return getResponsiveSpacing(base);
    };

    const getFontSize = () => {
      return getResponsiveFontSize(16);
    };

    const getLabelFontSize = () => {
      return getResponsiveFontSize(14);
    };

    const getHelperFontSize = () => {
      return getResponsiveFontSize(12);
    };

    const getIconSpacing = () => {
      return getResponsiveSpacing(12);
    };

    const inputId = React.useId();
    const hasError = !!error;

    return (
      <View style={containerStyle}>
        {label && (
          <Text
            className="text-gray-200 font-roboto-condensed mb-2"
            style={{ fontSize: getLabelFontSize() }}
            nativeID={`${inputId}-label`}
          >
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        )}
        
        <View
          className={`
            ${variant === 'minimal' ? 'border-b border-gray-600' : 'border border-gray-600 rounded-lg'}
            ${hasError ? 'border-red-500' : 'border-gray-600'}
            bg-gray-800
            flex-row
            items-center
          `}
          style={{
            height: variant === 'minimal' ? undefined : getInputHeight(),
            paddingHorizontal: variant === 'minimal' ? 0 : getPaddingHorizontal(),
            paddingVertical: variant === 'minimal' ? getResponsiveSpacing(8) : 0,
          }}
        >
          {leftIcon && (
            <View style={{ marginRight: getIconSpacing() }}>
              {leftIcon}
            </View>
          )}
          
          <TextInput
            ref={ref}
            className="flex-1 text-white font-roboto-condensed"
            style={[
              {
                fontSize: getFontSize(),
                paddingVertical: isDesktop() ? 8 : isTablet() ? 6 : 4,
              },
              style,
            ]}
            placeholderTextColor="#9CA3AF"
            accessibilityLabel={accessibilityLabel || label}
            accessibilityHint={accessibilityHint}
            accessibilityLabelledBy={label ? `${inputId}-label` : undefined}
            accessibilityDescribedBy={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <View style={{ marginLeft: getIconSpacing() }}>
              {rightIcon}
            </View>
          )}
        </View>
        
        {error && (
          <Text
            className="text-red-500 font-roboto-condensed mt-1"
            style={{ fontSize: getHelperFontSize() }}
            nativeID={`${inputId}-error`}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        )}
        
        {!error && helperText && (
          <Text
            className="text-gray-400 font-roboto-condensed mt-1"
            style={{ fontSize: getHelperFontSize() }}
            nativeID={`${inputId}-helper`}
          >
            {helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default React.memo(Input);