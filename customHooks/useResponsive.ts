import { useState, useEffect } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1200,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ResponsiveValues {
  width: number;
  height: number;
  deviceType: DeviceType;
  isPortrait: boolean;
  isLandscape: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scale: (size: number) => number;
  fontScale: (size: number) => number;
  spacing: (size: number) => number;
}

/**
 * Custom hook for responsive design
 * Provides device detection, scaling functions, and responsive utilities
 */
export const useResponsive = (): ResponsiveValues => {
  const { width, height } = useWindowDimensions();
  
  // Determine device type based on width
  const getDeviceType = (screenWidth: number): DeviceType => {
    if (screenWidth >= BREAKPOINTS.desktop) return 'desktop';
    if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
  };

  const deviceType = getDeviceType(width);
  const isPortrait = height > width;
  const isLandscape = width > height;
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // Scaling functions based on device type
  const scale = (size: number): number => {
    switch (deviceType) {
      case 'desktop':
        return size * 1.3;
      case 'tablet':
        return size * 1.15;
      default:
        return size;
    }
  };

  const fontScale = (size: number): number => {
    switch (deviceType) {
      case 'desktop':
        return size * 1.2;
      case 'tablet':
        return size * 1.1;
      default:
        return size;
    }
  };

  const spacing = (size: number): number => {
    switch (deviceType) {
      case 'desktop':
        return size * 1.5;
      case 'tablet':
        return size * 1.25;
      default:
        return size;
    }
  };

  return {
    width,
    height,
    deviceType,
    isPortrait,
    isLandscape,
    isMobile,
    isTablet,
    isDesktop,
    scale,
    fontScale,
    spacing,
  };
};

/**
 * Get responsive value based on device type
 */
export const useResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
}): T => {
  const { deviceType } = useResponsive();
  
  switch (deviceType) {
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile;
    case 'tablet':
      return values.tablet ?? values.mobile;
    default:
      return values.mobile;
  }
};

/**
 * Hook for responsive grid layout
 */
export const useResponsiveGrid = () => {
  const { deviceType, width } = useResponsive();
  
  const getColumns = (): number => {
    switch (deviceType) {
      case 'desktop':
        return width > BREAKPOINTS.largeDesktop ? 5 : 4;
      case 'tablet':
        return 3;
      default:
        return 2;
    }
  };

  const getGap = (): number => {
    switch (deviceType) {
      case 'desktop':
        return 24;
      case 'tablet':
        return 16;
      default:
        return 12;
    }
  };

  const getItemWidth = (): number => {
    const columns = getColumns();
    const gap = getGap();
    const totalGaps = (columns - 1) * gap;
    return (width - totalGaps) / columns;
  };

  return {
    columns: getColumns(),
    gap: getGap(),
    itemWidth: getItemWidth(),
  };
};

/**
 * Hook for responsive typography
 */
export const useResponsiveTypography = () => {
  const { fontScale } = useResponsive();
  
  return {
    h1: fontScale(32),
    h2: fontScale(28),
    h3: fontScale(24),
    h4: fontScale(20),
    h5: fontScale(18),
    h6: fontScale(16),
    body: fontScale(16),
    caption: fontScale(14),
    overline: fontScale(12),
  };
};