import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Define breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1200,
};

// Screen size detection
export const isTablet = () => width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
export const isDesktop = () => width >= BREAKPOINTS.desktop;
export const isMobile = () => width < BREAKPOINTS.tablet;

// Platform detection
export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';

// Responsive spacing scale
export const getResponsiveSpacing = (base: number): number => {
  if (isDesktop()) return base * 1.5;
  if (isTablet()) return base * 1.25;
  return base;
};

// Responsive font size scale
export const getResponsiveFontSize = (base: number): number => {
  if (isDesktop()) return base * 1.2;
  if (isTablet()) return base * 1.1;
  return base;
};

// Get responsive width for cards/components
export const getResponsiveCardWidth = (): string => {
  if (isDesktop()) return 'w-[300px]'; // Fixed width for desktop
  if (isTablet()) return 'w-[40%]'; // Percentage for tablet
  return 'w-[45%]'; // Percentage for mobile
};

// Get container max width for different screen sizes
export const getMaxContainerWidth = (): string => {
  if (isDesktop()) return 'max-w-7xl';
  if (isTablet()) return 'max-w-4xl';
  return 'max-w-full';
};

// Get responsive padding
export const getResponsivePadding = (): string => {
  if (isDesktop()) return 'px-8';
  if (isTablet()) return 'px-6';
  return 'px-4';
};

// Get responsive grid columns for lists
export const getGridColumns = (): number => {
  if (isDesktop()) return 4;
  if (isTablet()) return 3;
  return 2;
};

// Get responsive image dimensions
export const getResponsiveImageSize = (baseSize: number): { width: number; height: number } => {
  const screenWidth = width;
  const maxWidth = Math.min(screenWidth * 0.9, baseSize * 1.5);
  
  if (isDesktop()) {
    return { width: Math.min(baseSize * 1.2, maxWidth), height: Math.min(baseSize * 1.2, maxWidth) };
  }
  if (isTablet()) {
    return { width: Math.min(baseSize * 1.1, maxWidth), height: Math.min(baseSize * 1.1, maxWidth) };
  }
  return { width: Math.min(baseSize, maxWidth), height: Math.min(baseSize, maxWidth) };
};