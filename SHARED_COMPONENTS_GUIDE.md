# Shared UI Components - FitMatch

This document describes the shared UI component library created for FitMatch to ensure consistency, accessibility, and responsiveness across all screens and features.

## Overview

The shared component library provides:
- **Consistent design system** across all screens
- **Accessibility-first approach** with proper ARIA labels and navigation
- **Responsive design** that adapts to mobile, tablet, and desktop
- **TypeScript support** with proper type definitions
- **Performance optimization** with React.memo where appropriate

## Components

### 1. Layout
Container component for screen layouts with built-in responsive behavior.

```tsx
import { Layout } from '@/components/shared';

<Layout 
  variant="centered" 
  scrollable 
  safeArea 
  accessibilityLabel="Main screen"
>
  {/* Your content */}
</Layout>
```

**Props:**
- `variant`: 'default' | 'centered' | 'full-width' | 'padded'
- `scrollable`: boolean - adds ScrollView wrapper
- `safeArea`: boolean - handles safe area insets
- `padding`: boolean - adds responsive padding

### 2. Button
Consistent button component with multiple variants and accessibility.

```tsx
import { Button } from '@/components/shared';

<Button
  title="Sign Up"
  onPress={handleSignUp}
  variant="primary"
  size="large"
  loading={isLoading}
  fullWidth
  accessibilityLabel="Create account"
  accessibilityHint="Creates a new FitMatch account"
/>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `loading`: boolean - shows loading spinner
- `fullWidth`: boolean - takes full container width
- `icon`: React.ReactNode - optional icon

### 3. Input
Form input component with labels, validation, and accessibility.

```tsx
import { Input } from '@/components/shared';

<Input
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  required
  error={emailError}
  leftIcon={<EmailIcon />}
  accessibilityLabel="Email input"
  accessibilityHint="Enter your email to sign in"
/>
```

**Props:**
- `label`: string - input label
- `error`: string - validation error message
- `helperText`: string - help text below input
- `leftIcon` / `rightIcon`: React.ReactNode
- `variant`: 'default' | 'minimal'
- `required`: boolean - shows asterisk

### 4. Card
Container component for grouping content with elevation and backgrounds.

```tsx
import { Card } from '@/components/shared';

<Card
  variant="elevated"
  backgroundImage="https://example.com/image.jpg"
  onPress={handleCardPress}
  accessibilityLabel="User profile card"
>
  {/* Card content */}
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `backgroundImage`: string - background image URL
- `onPress`: function - makes card touchable
- `padding`: boolean - adds internal padding
- `rounded`: boolean - adds border radius

### 5. Typography
Text component with consistent typography scale and styling.

```tsx
import { Typography } from '@/components/shared';

<Typography
  variant="h1"
  color="primary"
  align="center"
  weight="bold"
  numberOfLines={2}
>
  Welcome to FitMatch
</Typography>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline'
- `color`: 'primary' | 'secondary' | 'error' | 'white' | 'gray' | 'custom'
- `align`: 'left' | 'center' | 'right'
- `weight`: 'normal' | 'bold' | 'semibold'
- `customColor`: string - custom color value

### 6. ErrorBoundary
Error handling component that gracefully catches and displays errors.

```tsx
import { ErrorBoundary } from '@/components/shared';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 7. HeaderBar
Updated header component with accessibility and responsive design.

```tsx
import { HeaderBar } from '@/components/shared';

<HeaderBar />
```

## Custom Hooks

### useResponsive
Comprehensive responsive design hook.

```tsx
import { useResponsive } from '@/customHooks/useResponsive';

const MyComponent = () => {
  const { 
    isDesktop, 
    isTablet, 
    spacing, 
    fontScale, 
    deviceType 
  } = useResponsive();

  return (
    <View style={{ padding: spacing(16) }}>
      <Text style={{ fontSize: fontScale(18) }}>
        Device type: {deviceType}
      </Text>
    </View>
  );
};
```

### useResponsiveValue
Get different values based on device type.

```tsx
import { useResponsiveValue } from '@/customHooks/useResponsive';

const columns = useResponsiveValue({
  mobile: 2,
  tablet: 3,
  desktop: 4,
});
```

### useResponsiveGrid
Grid layout utilities.

```tsx
import { useResponsiveGrid } from '@/customHooks/useResponsive';

const { columns, gap, itemWidth } = useResponsiveGrid();
```

## Accessibility Features

All components include:
- **Proper accessibility roles** (button, text, header, etc.)
- **Accessibility labels and hints** for screen readers
- **Keyboard navigation support** where applicable
- **Touch target sizes** meet accessibility guidelines (minimum 44pt)
- **High contrast support** with proper color choices

## Responsive Design

The component system automatically adapts to:
- **Mobile devices** (< 768px)
- **Tablets** (768px - 1024px)
- **Desktop** (> 1024px)

Features:
- Responsive font scaling
- Adaptive spacing and padding
- Flexible grid layouts
- Touch-friendly interactions on mobile

## Best Practices

### 1. Component Usage
```tsx
// ✅ Good - Use shared components
import { Button, Input, Card } from '@/components/shared';

// ❌ Avoid - Creating custom buttons everywhere
<TouchableOpacity style={customButtonStyle}>
  <Text>Click me</Text>
</TouchableOpacity>
```

### 2. Accessibility
```tsx
// ✅ Good - Proper accessibility
<Button
  title="Submit"
  onPress={handleSubmit}
  accessibilityLabel="Submit form"
  accessibilityHint="Submits the registration form"
/>

// ❌ Avoid - Missing accessibility
<TouchableOpacity onPress={handleSubmit}>
  <Text>Submit</Text>
</TouchableOpacity>
```

### 3. Responsive Design
```tsx
// ✅ Good - Use responsive hooks
const { spacing, fontScale } = useResponsive();

// ❌ Avoid - Hard-coded values
const hardCodedPadding = 16;
```

### 4. TypeScript
```tsx
// ✅ Good - Proper typing
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

// ❌ Avoid - Any types
const props: any = {};
```

## Performance Optimizations

- All components use `React.memo` to prevent unnecessary re-renders
- Responsive calculations are cached where possible
- Touch target optimizations for better performance
- Proper key props in lists and iterations

## Migration Guide

To migrate existing components to use the shared library:

1. **Replace custom buttons:**
   ```tsx
   // Before
   <TouchableOpacity style={styles.button} onPress={onPress}>
     <Text style={styles.buttonText}>{title}</Text>
   </TouchableOpacity>

   // After
   <Button title={title} onPress={onPress} variant="primary" />
   ```

2. **Replace custom inputs:**
   ```tsx
   // Before
   <TextInput
     style={styles.input}
     placeholder="Enter text"
     value={value}
     onChangeText={setValue}
   />

   // After
   <Input
     placeholder="Enter text"
     value={value}
     onChangeText={setValue}
     label="Input Label"
   />
   ```

3. **Replace layout containers:**
   ```tsx
   // Before
   <SafeAreaView style={styles.container}>
     <ScrollView>
       {/* content */}
     </ScrollView>
   </SafeAreaView>

   // After
   <Layout scrollable safeArea>
     {/* content */}
   </Layout>
   ```

## Examples

See `/components/examples/ExampleUsage.tsx` for a complete example of how to use all components together in a cohesive UI.

This shared component library ensures that all FitMatch features maintain consistent design, accessibility, and user experience across all platforms and screen sizes.