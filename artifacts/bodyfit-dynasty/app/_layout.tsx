import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useSegments } from 'expo-router';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { BodyFitProvider } from '@/context/BodyFitContext';
import { initializeRevenueCat, SubscriptionProvider } from '@/lib/revenuecat';
import { setBaseUrl } from '@workspace/api-client-react';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { useBodyFit } from '@/context/BodyFitContext';
import { SimulationBanner } from '@/components/SimulationBanner';
import { DynastyTermsModal } from '@/components/DynastyTermsModal';

const rawDomain = process.env.EXPO_PUBLIC_DOMAIN;
const isHttpLocal = Boolean(rawDomain && (rawDomain.includes(':5000') || rawDomain.startsWith('localhost') || /^\d+\.\d+\.\d+\.\d+/.test(rawDomain)));
const apiProtocol = isHttpLocal ? 'http' : 'https';
setBaseUrl(rawDomain ? `${apiProtocol}://${rawDomain}` : null);
initializeRevenueCat();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const isDevMode = !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const clerkAuth = useAuth();
  const isLoaded = isDevMode ? true : clerkAuth.isLoaded;
  const isSignedIn = isDevMode ? true : clerkAuth.isSignedIn;
  const getToken = clerkAuth.getToken;
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';
  const { profile, profileLoading } = useBodyFit();

  useEffect(() => {
    setAuthTokenGetter(async () => (isDevMode ? 'dev-mock-token' : await getToken()));
  }, [getToken, isDevMode]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0710', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <ActivityIndicator color="#A855F7" />
        <Text style={{ color: '#D5C8DF', fontSize: 12, marginTop: 14 }}>Cargando tu cuenta...</Text>
      </View>
    );
  }
  if (!isSignedIn && !inAuthGroup) return <Redirect href={'/sign-in' as never} />;
  if (isSignedIn && inAuthGroup) return <Redirect href={'/(tabs)' as never} />;
  if (isSignedIn && !inAuthGroup && (isDevMode ? false : profileLoading)) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B0710', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <ActivityIndicator color="#A855F7" />
        <Text style={{ color: '#D5C8DF', fontSize: 12, marginTop: 14 }}>Cargando tu perfil...</Text>
      </View>
    );
  }
  if (isSignedIn && profile && !profile.onboardingComplete && segments[0] !== 'onboarding') {
    return <Redirect href={'/onboarding' as never} />;
  }
  if (isSignedIn && profile?.onboardingComplete && segments[0] === 'onboarding') {
    return <Redirect href={'/(tabs)' as never} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerBackTitle: 'Atrás' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="food-analysis" options={{ headerShown: false }} />
        <Stack.Screen name="plans" options={{ headerShown: false }} />
        <Stack.Screen name="progress" options={{ headerShown: false }} />
        <Stack.Screen name="recipes" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="profile-edit" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
        <Stack.Screen name="admin-users" options={{ headerShown: false }} />
        <Stack.Screen name="admin-store" options={{ headerShown: false }} />
        <Stack.Screen name="admin-trainers" options={{ headerShown: false }} />
        <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="athlete-profile" options={{ headerShown: false }} />
        <Stack.Screen name="trainer-chat" options={{ headerShown: false }} />
        <Stack.Screen name="widgets" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <SimulationBanner />
      <DynastyTermsModal />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!ready && !fontsLoaded && !fontError) return null;

  const hasClerkKey = Boolean(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Ym9keWZpdC1kZXYuY2xlcmsuYWNjb3VudHMuZGV2JA==';

  const innerContent = (
    <QueryClientProvider client={queryClient}>
      <BodyFitProvider>
        <SubscriptionProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SubscriptionProvider>
      </BodyFitProvider>
    </QueryClientProvider>
  );

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ErrorBoundary>
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache} proxyUrl={process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined}>
          {hasClerkKey ? (
            <ClerkLoaded>
              {innerContent}
            </ClerkLoaded>
          ) : (
            innerContent
          )}
        </ClerkProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
