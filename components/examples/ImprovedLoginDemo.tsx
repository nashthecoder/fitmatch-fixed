import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { 
  Layout, 
  Button, 
  Input, 
  Card, 
  Typography 
} from '@/components/shared';
import { useResponsive } from '@/customHooks/useResponsive';
import { useEmailAuth } from '@/customHooks/useEmailAuth';
import { useGoogleSignIn } from '@/customHooks/useGoogleSignIn';

/**
 * Refactored Login component using shared UI components
 * Demonstrates best practices for component usage, accessibility, and responsive design
 */
const ImprovedLoginDemo: React.FC = () => {
  const { spacing, isDesktop } = useResponsive();
  const [showPassword, setShowPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const { 
    signIn: emailSignIn, 
    loading: emailSignInBusy,
    error: emailSignInError 
  } = useEmailAuth();
  
  const { 
    signIn: googleSignIn, 
    loading: googleLoading,
    error: googleSignInError 
  } = useGoogleSignIn();

  const handleEmailSignIn = async () => {
    if (!signInForm.email || !signInForm.password) {
      Toast.show({
        text1: 'Connexion',
        text2: 'Veuillez entrer votre email et mot de passe',
        type: 'error',
      });
      return;
    }

    await emailSignIn(signInForm.email, signInForm.password);
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  const passwordIcon = (
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      accessibilityRole="button"
      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
    >
      <Ionicons
        name={showPassword ? "eye-off" : "eye"}
        size={20}
        color="gray"
      />
    </TouchableOpacity>
  );

  return (
    <Layout 
      variant="centered" 
      scrollable 
      accessibilityLabel="Login screen"
    >
      <View style={{ width: '100%', maxWidth: isDesktop ? 400 : '100%' }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: spacing(40) }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ 
              width: isDesktop ? 120 : 100, 
              height: isDesktop ? 80 : 66 
            }}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel="FitMatch logo"
          />
          <Typography 
            variant="h1" 
            align="center"
            style={{ marginTop: spacing(16) }}
          >
            Se connecter
          </Typography>
        </View>

        {/* Login Form */}
        <Card 
          variant="elevated" 
          style={{ marginBottom: spacing(24) }}
          accessibilityLabel="Login form"
        >
          <Input
            label="Email"
            placeholder="Entrez votre email"
            value={signInForm.email}
            onChangeText={(text) => setSignInForm({ ...signInForm, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailSignInError}
            containerStyle={{ marginBottom: spacing(16) }}
            accessibilityLabel="Email address"
            accessibilityHint="Enter your email address to sign in"
          />

          <Input
            label="Mot de passe"
            placeholder="Entrez votre mot de passe"
            value={signInForm.password}
            onChangeText={(text) => setSignInForm({ ...signInForm, password: text })}
            secureTextEntry={!showPassword}
            rightIcon={passwordIcon}
            error={emailSignInError}
            containerStyle={{ marginBottom: spacing(24) }}
            accessibilityLabel="Password"
            accessibilityHint="Enter your password to sign in"
          />

          <Button
            title="Connexion avec e-mail"
            onPress={handleEmailSignIn}
            loading={emailSignInBusy}
            fullWidth
            accessibilityLabel="Sign in with email"
            accessibilityHint="Sign in using your email and password"
            style={{ marginBottom: spacing(16) }}
          />

          <Typography 
            variant="body" 
            align="center" 
            color="gray"
            style={{ marginBottom: spacing(16) }}
          >
            OU
          </Typography>

          <Button
            title="Continuer avec Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            loading={googleLoading}
            fullWidth
            icon={
              <Image
                source={require("@/assets/images/google.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            }
            accessibilityLabel="Sign in with Google"
            accessibilityHint="Sign in using your Google account"
            style={{ marginBottom: spacing(24) }}
          />

          <View 
            style={{ 
              height: 1, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              marginBottom: spacing(16) 
            }}
          />

          <Button
            title="Je m'inscris"
            onPress={() => router.navigate("/Auth/Onboarding")}
            variant="secondary"
            fullWidth
            accessibilityLabel="Create account"
            accessibilityHint="Navigate to account creation"
          />
        </Card>

        {/* Additional Options */}
        <View style={{ alignItems: 'center' }}>
          <Button
            title="Réinitialiser le mot de passe"
            onPress={() => {}}
            variant="outline"
            size="small"
            accessibilityLabel="Reset password"
            accessibilityHint="Reset your forgotten password"
            style={{ marginBottom: spacing(16) }}
          />

          <Typography 
            variant="caption" 
            align="center" 
            color="gray"
            style={{ marginBottom: spacing(16) }}
          >
            En vous connectant, vous acceptez nos Conditions Générales d'Utilisation.
          </Typography>

          <TouchableOpacity
            onPress={() => router.navigate("/Extras/CGU")}
            accessibilityRole="button"
            accessibilityLabel="Terms and conditions"
            accessibilityHint="View terms and conditions"
          >
            <Typography variant="caption" color="primary" align="center">
              Conditions générales d'utilisation
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

export default ImprovedLoginDemo;