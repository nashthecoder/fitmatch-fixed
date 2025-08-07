import React from 'react';
import { View } from 'react-native';
import { 
  Layout, 
  Button, 
  Input, 
  Card, 
  Typography 
} from '@/components/shared';
import { useResponsive } from '@/customHooks/useResponsive';

/**
 * Example component demonstrating the usage of shared UI components
 * This showcases how to build consistent, accessible, and responsive UIs
 */
const ExampleUsage: React.FC = () => {
  const { spacing, isDesktop } = useResponsive();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Layout 
      variant="centered" 
      scrollable 
      accessibilityLabel="Example form screen"
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 400 : '100%' }}>
        <Card 
          variant="elevated" 
          style={{ marginBottom: spacing(24) }}
          accessibilityLabel="User registration form"
        >
          <Typography 
            variant="h2" 
            align="center" 
            style={{ marginBottom: spacing(16) }}
          >
            Welcome to FitMatch
          </Typography>
          
          <Typography 
            variant="body" 
            color="gray" 
            align="center" 
            style={{ marginBottom: spacing(32) }}
          >
            Create your account to start connecting with fitness enthusiasts
          </Typography>

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            required
            style={{ marginBottom: spacing(16) }}
            accessibilityLabel="Email input field"
            accessibilityHint="Enter your email address to create an account"
          />

          <Input
            label="Password"
            placeholder="Create a secure password"
            secureTextEntry
            required
            style={{ marginBottom: spacing(24) }}
            accessibilityLabel="Password input field"
            accessibilityHint="Create a strong password for your account"
          />

          <Button
            title={loading ? "Creating Account..." : "Sign Up"}
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            accessibilityLabel="Sign up button"
            accessibilityHint="Creates a new FitMatch account"
            style={{ marginBottom: spacing(16) }}
          />

          <Button
            title="Sign In Instead"
            onPress={() => {}}
            variant="outline"
            fullWidth
            accessibilityLabel="Sign in button"
            accessibilityHint="Navigate to sign in if you already have an account"
          />
        </Card>

        <Card variant="outlined">
          <Typography variant="caption" align="center" color="gray">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Card>
      </View>
    </Layout>
  );
};

export default ExampleUsage;