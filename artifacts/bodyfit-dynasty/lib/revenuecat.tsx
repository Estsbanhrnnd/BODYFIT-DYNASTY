import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useMutation, useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';

export const REVENUECAT_ENTITLEMENT_IDENTIFIER = 'premium';

const testApiKey = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

function getApiKey() {
  if (__DEV__ || Platform.OS === 'web' || Constants.executionEnvironment === 'storeClient') return testApiKey;
  return Platform.OS === 'ios' ? iosApiKey : androidApiKey;
}

export function initializeRevenueCat() {
  if (Platform.OS === 'web' || Constants.executionEnvironment === 'storeClient') {
    return false;
  }
  const apiKey = getApiKey();
  if (!apiKey) return false;
  try {
    Purchases.configure({ apiKey });
    return true;
  } catch (e) {
    console.warn('[RevenueCat] Failed to configure Purchases:', e);
    return false;
  }
}

function useSubscriptionContext() {
  const isExpoGoOrWeb = Platform.OS === 'web' || Constants.executionEnvironment === 'storeClient';
  const configured = !isExpoGoOrWeb && Boolean(getApiKey());
  const customerInfoQuery = useQuery({
    queryKey: ['revenuecat', 'customer-info'],
    queryFn: () => Purchases.getCustomerInfo(),
    enabled: configured,
    staleTime: 60 * 1000,
  });
  const offeringsQuery = useQuery({
    queryKey: ['revenuecat', 'offerings'],
    queryFn: () => Purchases.getOfferings(),
    enabled: configured,
    staleTime: 300 * 1000,
  });
  const purchaseMutation = useMutation({
    mutationFn: async (packageToPurchase: any) => {
      const result = await Purchases.purchasePackage(packageToPurchase);
      return result.customerInfo;
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });
  const restoreMutation = useMutation({
    mutationFn: () => Purchases.restorePurchases(),
    onSuccess: () => customerInfoQuery.refetch(),
  });
  const isSubscribed = Boolean(customerInfoQuery.data?.entitlements.active?.[REVENUECAT_ENTITLEMENT_IDENTIFIER]);
  return {
    configured,
    offerings: offeringsQuery.data,
    isSubscribed,
    isLoading: configured && (customerInfoQuery.isLoading || offeringsQuery.isLoading),
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}