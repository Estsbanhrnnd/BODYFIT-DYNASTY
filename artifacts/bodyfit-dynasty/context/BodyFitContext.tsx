import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/expo';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetMyProfile,
  useListWorkoutLogs,
  useSaveDailyProgress,
  useUpdateMyProfile,
  customFetch,
  type Profile,
  type ProfileUpdate,
} from '@workspace/api-client-react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMembershipPlan, type MembershipId } from '@/constants/membership';
import { getMembershipConfig, type MembershipTierId } from '@/constants/membershipConfig';
import {
  DYNASTY_MEDALS_CATALOG,
  type DynastyMedal,
  type DynastyUserStats,
  evaluateMedalProgress,
} from '@/constants/medalsCatalog';
import { DESIGNATED_TRAINERS, type Trainer } from '@/constants/trainersCatalog';

export type PreviewTierMode = 'none' | 'standard' | 'bronze' | 'platinum' | 'golden';

export interface StreakDetails {
  currentStreak: number;
  bestStreak: number;
  activeDays: number;
  missedDays: number;
  savedStreaksCount: number;
  lastSavedDate: string;
  lastSavedMonth?: string;
  freeSavesThisMonth?: number;
}

export type ExtendedProfile = Profile & {
  heightCm?: string;
  weightKg?: string;
  age?: string;
  gender?: string;
  gymPhotoUrl?: string;
  membershipTier?: string;
  membershipExpiresAt?: string | null;
};

export interface CustomRoutineDay {
  dayId: string;
  dayName: string;
  focus: string;
  exerciseIds: string[];
}

export interface CustomRoutineState {
  libraryIds: string[];
  days: CustomRoutineDay[];
  updatedAt: string;
}

export interface ScannedFoodItem {
  nombre: string;
  gramos_estimados: number;
  calorias: number;
  proteina: number;
  carbohidratos: number;
  grasas: number;
  fibra?: number;
  nivel_de_confianza?: number;
}

export interface ScannedFoodHistoryItem {
  id: string;
  timestamp: string;
  imageUrl?: string;
  foods: ScannedFoodItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  notes?: string | null;
}

export interface FoodScanLimitsInfo {
  dailyFreeLimit: number;
  usedToday: number;
  extraAdScans: number;
  totalAllowedToday: number;
  remainingScans: number;
  adProgress: number;
  canScan: boolean;
  canWatchAdForExtra: boolean;
}

export type DailyStats = {
  calories: number;
  calorieGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fats: number;
  fatsGoal: number;
  water: number;
  waterGoal: number;
  steps: number;
  burned: number;
  streak: number;
};

type BodyFitContextValue = {
  stats: DailyStats;
  hydrated: boolean;
  addWater: () => void;
  addMeal: (calories: number, protein: number, carbs: number, fats: number) => void;
  setSteps: (steps: number) => void;
  updateGoals: (goals: Partial<Pick<DailyStats, 'calorieGoal' | 'proteinGoal' | 'carbsGoal' | 'fatsGoal'>>) => void;
  toggleWorkout: () => void;
  workoutDone: boolean;
  isOwner: boolean;
  isSimulatingClient: boolean;
  isAdminModeActive: boolean;
  previewTier: PreviewTierMode;
  setPreviewTier: (tier: PreviewTierMode) => void;
  previewClientFree: boolean;
  setPreviewClientFree: (value: boolean) => void;
  membership: MembershipId;
  membershipLabel: string;
  catalogPercent: number;
  canUseFoodAI: boolean;
  canAccessFullTraining: boolean;
  customRoutine: CustomRoutineState | null;
  saveCustomRoutine: (libraryIds: string[], days: CustomRoutineDay[]) => Promise<void>;
  resetCustomRoutine: () => Promise<void>;
  profile: ExtendedProfile | null;
  profileLoading: boolean;
  profileError: boolean;
  refreshProfile: () => Promise<unknown>;
  updateProfile: (patch: ProfileUpdate & { heightCm?: string; weightKg?: string; age?: string; gender?: string; gymPhotoUrl?: string }) => Promise<Profile>;
  redeemGiftCode: (code: string) => Promise<{ success: boolean; message: string; tier?: string; durationLabel?: string }>;
  foodScanLimits: FoodScanLimitsInfo;
  consumeFoodScan: () => Promise<boolean>;
  watchAdForExtraScan: () => Promise<{ unlocked: boolean; progress: number; extraScans: number }>;
  unlockRecipeWithAd: (recipeId: string) => Promise<void>;
  isRecipeUnlockedByAd: (recipeId: string) => boolean;
  unlockedAdRecipes: Record<string, number>;
  unlockedAdItems: Record<string, { unlockedAt: number; expiresAt: number }>;
  getRequiredAdsForItem: (itemId?: string) => number;
  getAdProgressForItem: (itemId: string) => number;
  watchAdForItem: (itemId: string) => Promise<{ completed: boolean; remaining: number; expiresAt?: number }>;
  isItemUnlockedWithAd: (itemId: string) => boolean;
  getItemAdRemainingDays: (itemId: string) => number;
  isItemUnlocked: (requiredTier?: MembershipTierId, itemId?: string) => boolean;
  foodScansHistory: ScannedFoodHistoryItem[];
  saveScanToHistory: (item: Omit<ScannedFoodHistoryItem, 'id' | 'timestamp'>) => Promise<ScannedFoodHistoryItem>;
  repeatScanMeal: (item: ScannedFoodHistoryItem) => void;
  streakDetails: StreakDetails;
  canRescueStreak: boolean;
  rescueStreakWithAds: () => Promise<{ success: boolean; message: string }>;
  rescueStreakFree: () => Promise<{ success: boolean; message: string }>;
  freeStreakSavesRemaining: number;
  designatedTrainers: Trainer[];
  updateDesignatedTrainer: (id: string, patch: Partial<Trainer>) => Promise<void>;
  unlockedMedals: string[];
  unlockMedal: (id: string) => Promise<void>;
  dynastyStats: DynastyUserStats;
  routineVideos: Record<string, string>;
  setRoutineVideo: (routineId: string, videoUrl: string) => Promise<void>;
  removeRoutineVideo: (routineId: string) => Promise<void>;
};

const initialStats: DailyStats = {
  calories: 0,
  calorieGoal: 2500,
  protein: 0,
  proteinGoal: 150,
  carbs: 0,
  carbsGoal: 275,
  fats: 0,
  fatsGoal: 70,
  water: 0,
  waterGoal: 2.5,
  steps: 0,
  burned: 0,
  streak: 0,
};

const BodyFitContext = createContext<BodyFitContextValue | undefined>(undefined);
const STORAGE_KEY = 'bodyfit-dynasty-daily-stats';
const WORKOUT_KEY = 'bodyfit-dynasty-workout-done';
const ROUTINE_KEY = 'bodyfit-dynasty-custom-routine';
const PROFILE_STORAGE_KEY = 'bodyfit-dynasty-persisted-profile';

export function resolveMembershipTier(
  tier?: string | null,
  isOwner = false,
  previewFree = false,
  previewTier: PreviewTierMode = 'none',
): MembershipId {
  if (previewTier && previewTier !== 'none') return previewTier;
  if (previewFree) return 'standard';
  if (isOwner) return 'golden';
  const normalized = tier?.toLowerCase();
  if (normalized === 'golden' || normalized === 'pro') return 'golden';
  if (normalized === 'platinum') return 'platinum';
  if (normalized === 'bronze') return 'bronze';
  return 'standard';
}

function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function workoutStreak(workouts: Array<{ completedAt: string | Date }> | undefined) {
  if (!workouts?.length) return 0;
  const days = new Set(
    workouts.map((workout) => {
      const date = new Date(workout.completedAt);
      return localDay(date);
    }),
  );
  let cursor = new Date();
  if (!days.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const defaultDevProfile: ExtendedProfile = {
  userId: 'dev_user_bodyfit',
  userCode: 'BFD-DEV001',
  displayName: 'Esteban Entrenador',
  username: 'esteban_coach',
  avatarUrl: null,
  themeKey: 'purple',
  fitnessGoal: 'Ganar fuerza',
  fitnessLevel: 'Avanzado',
  activities: ['Gimnasio', 'CrossFit'],
  otherActivity: null,
  trainingLocation: 'gym',
  trainingPreferences: ['Fuerza', 'Hipertrofia'],
  preferredMacros: ['high_protein'],
  logoKey: 'bodyfit-logo',
  heightCm: '178',
  weightKg: '78',
  age: '26',
  membershipTier: 'platinum',
  membershipExpiresAt: null,
  onboardingComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function BodyFitProvider({ children }: { children: React.ReactNode }) {
  const isDevMode = !process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_DEV_MODE === 'true';
  const clerkUser = useUser();
  const user = isDevMode
    ? (clerkUser?.user ?? {
        id: 'dev_user_bodyfit',
        fullName: 'Esteban Entrenador',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        publicMetadata: { role: 'owner' },
      })
    : clerkUser?.user;
  const userId = user?.id;
  const queryClient = useQueryClient();
  const profileQuery = useGetMyProfile({ query: { queryKey: ['getMyProfile'], enabled: Boolean(userId), retry: 1, staleTime: 60_000 } });
  const userEmail = (
    clerkUser?.user?.primaryEmailAddress?.emailAddress ||
    clerkUser?.user?.emailAddresses?.[0]?.emailAddress ||
    ''
  ).toLowerCase().trim();
  const username = (
    clerkUser?.user?.username ||
    profileQuery?.data?.username ||
    ''
  ).toLowerCase().trim();
  const isOwner =
    user?.publicMetadata?.role === 'owner' ||
    user?.publicMetadata?.role === 'admin' ||
    clerkUser?.user?.publicMetadata?.role === 'owner' ||
    clerkUser?.user?.publicMetadata?.role === 'admin' ||
    userEmail === 'esteban156789@gmail.com' ||
    userEmail.includes('esteban') ||
    username === 'esteban' ||
    username.includes('esteban') ||
    user?.id === 'dev_user_bodyfit';
  const workoutQuery = useListWorkoutLogs({ query: { queryKey: ['listWorkoutLogs'], enabled: Boolean(userId), retry: 1, staleTime: 60_000 } });
  const profileMutation = useUpdateMyProfile();
  const dailyProgressMutation = useSaveDailyProgress();
  const [stats, setStats] = useState<DailyStats>(initialStats);
  const [hydrated, setHydrated] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [previewClientFree, setPreviewClientFree] = useState(false);
  const [previewTier, setPreviewTier] = useState<PreviewTierMode>('none');
  const [customRoutine, setCustomRoutine] = useState<CustomRoutineState | null>(null);
  const [designatedTrainers, setDesignatedTrainers] = useState<Trainer[]>(DESIGNATED_TRAINERS);

  // Estados para Food Scanner AI y recetas con anuncios
  const todayStr = localDay();
  const [scansUsedToday, setScansUsedToday] = useState(0);
  const [extraAdScans, setExtraAdScans] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [foodScansHistory, setFoodScansHistory] = useState<ScannedFoodHistoryItem[]>([]);
  const [unlockedAdRecipes, setUnlockedAdRecipes] = useState<Record<string, number>>({});
  const [unlockedAdItems, setUnlockedAdItems] = useState<Record<string, { unlockedAt: number; expiresAt: number }>>({});
  const [adProgressMap, setAdProgressMap] = useState<Record<string, number>>({});

  // Estados para Salva-Rachas y 35 Medallas Dynasty
  const [streakStats, setStreakStats] = useState<StreakDetails>({
    currentStreak: 0,
    bestStreak: 0,
    activeDays: 0,
    missedDays: 0,
    savedStreaksCount: 0,
    lastSavedDate: '',
  });
  const [unlockedMedals, setUnlockedMedals] = useState<string[]>([]);
  const [localProfile, setLocalProfile] = useState<ExtendedProfile | null>(null);

  // Videos de Rutinas gestionados por el Administrador
  const ROUTINE_VIDEOS_KEY = '@bodyfit_routine_videos';
  const DEFAULT_ROUTINE_VIDEOS: Record<string, string> = {
    'dynasty-ppl-6d': 'https://www.youtube.com/watch?v=qVek72z_5xQ',
    'arnold-split-6d': 'https://www.youtube.com/watch?v=1t1zG3g9U0w',
    'upper-lower-4d': 'https://www.youtube.com/watch?v=eMjyvIQbn9M',
    'glute-hyper-fem-4d': 'https://www.youtube.com/watch?v=Fk_O4q2Ea4M',
  };
  const [routineVideos, setRoutineVideos] = useState<Record<string, string>>(DEFAULT_ROUTINE_VIDEOS);

  const profile = useMemo<ExtendedProfile | null>(() => {
    const base = isDevMode ? defaultDevProfile : null;
    const server = profileQuery.data as ExtendedProfile | undefined;
    if (!server && !localProfile) return base;
    return {
      ...(base || {}),
      ...(server || {}),
      ...(localProfile || {}),
    } as ExtendedProfile;
  }, [profileQuery.data, localProfile, isDevMode]);

  const storageKey = userId ? `${STORAGE_KEY}:${userId}` : null;
  const workoutKey = userId ? `${WORKOUT_KEY}:${userId}` : null;
  const routineKey = userId ? `${ROUTINE_KEY}:${userId}` : ROUTINE_KEY;
  const scanDailyKey = userId ? `bodyfit-scanner-daily-${userId}-${todayStr}` : `bodyfit-scanner-daily-anon-${todayStr}`;
  const TRAINERS_KEY = 'bodyfit-dynasty-trainers-list';
  const scanHistoryKey = userId ? `bodyfit-scanner-history-${userId}` : 'bodyfit-scanner-history-anon';
  const adUnlockedRecipesKey = userId ? `bodyfit-recipes-ad-unlocked-${userId}` : 'bodyfit-recipes-ad-unlocked-anon';
  const adUnlockedItemsKey = userId ? `bodyfit-ad-unlocked-items-${userId}` : 'bodyfit-ad-unlocked-items-anon';
  const adProgressMapKey = userId ? `bodyfit-ad-progress-map-${userId}` : 'bodyfit-ad-progress-map-anon';
  const streakKey = userId ? `bodyfit-streak-stats-${userId}` : 'bodyfit-streak-stats-anon';
  const medalsKey = userId ? `bodyfit-unlocked-medals-${userId}` : 'bodyfit-unlocked-medals-anon';
  const streak = workoutStreak(workoutQuery.data?.workouts);

  useEffect(() => {
    let active = true;
    setHydrated(false);
    setStats(initialStats);
    setWorkoutDone(false);
    setCustomRoutine(null);
    setScansUsedToday(0);
    setExtraAdScans(0);
    setAdProgress(0);
    setFoodScansHistory([]);
    setUnlockedAdRecipes({});
    setStreakStats({
      currentStreak: 0,
      bestStreak: 0,
      activeDays: 0,
      missedDays: 0,
      savedStreaksCount: 0,
      lastSavedDate: '',
    });
    setUnlockedMedals([]);

    const keysToLoad = [
      storageKey ? AsyncStorage.getItem(storageKey) : Promise.resolve(null),
      workoutKey ? AsyncStorage.getItem(workoutKey) : Promise.resolve(null),
      routineKey ? AsyncStorage.getItem(routineKey) : Promise.resolve(null),
      AsyncStorage.getItem(scanDailyKey),
      AsyncStorage.getItem(scanHistoryKey),
      AsyncStorage.getItem(adUnlockedRecipesKey),
      AsyncStorage.getItem(streakKey),
      AsyncStorage.getItem(medalsKey),
      AsyncStorage.getItem(TRAINERS_KEY),
      AsyncStorage.getItem(PROFILE_STORAGE_KEY),
      AsyncStorage.getItem(adUnlockedItemsKey),
      AsyncStorage.getItem(adProgressMapKey),
      AsyncStorage.getItem(ROUTINE_VIDEOS_KEY),
    ];

    Promise.all(keysToLoad)
      .then(([statsValue, workoutValue, routineValue, scanDailyValue, scanHistoryValue, adRecipesValue, streakValue, medalsValue, trainersValue, profileValue, adItemsValue, adProgressMapValue, routineVideosValue]) => {
        if (!active) return;
        if (profileValue) {
          try {
            const parsed = JSON.parse(profileValue);
            if (parsed && typeof parsed === 'object') {
              setLocalProfile(parsed);
            }
          } catch {}
        }
        if (statsValue) setStats({ ...initialStats, ...JSON.parse(statsValue) });
        if (workoutValue !== null) setWorkoutDone(workoutValue === 'true');
        if (routineValue) {
          try {
            setCustomRoutine(JSON.parse(routineValue));
          } catch {}
        }
        if (routineVideosValue) {
          try {
            const parsed = JSON.parse(routineVideosValue);
            if (parsed && typeof parsed === 'object') {
              setRoutineVideos({ ...DEFAULT_ROUTINE_VIDEOS, ...parsed });
            }
          } catch {}
        }
        if (scanDailyValue) {
          try {
            const parsed = JSON.parse(scanDailyValue);
            setScansUsedToday(parsed.scansUsedToday || 0);
            setExtraAdScans(parsed.extraAdScans || 0);
            setAdProgress(parsed.adProgress || 0);
          } catch {}
        }
        if (scanHistoryValue) {
          try {
            setFoodScansHistory(JSON.parse(scanHistoryValue) || []);
          } catch {}
        }
        if (adRecipesValue) {
          try {
            setUnlockedAdRecipes(JSON.parse(adRecipesValue) || {});
          } catch {}
        }
        if (streakValue) {
          try {
            setStreakStats(JSON.parse(streakValue));
          } catch {}
        }
        if (medalsValue) {
          try {
            setUnlockedMedals(JSON.parse(medalsValue) || []);
          } catch {}
        }
        if (trainersValue) {
          try {
            setDesignatedTrainers(JSON.parse(trainersValue) || DESIGNATED_TRAINERS);
          } catch {}
        }
        if (adItemsValue) {
          try {
            setUnlockedAdItems(JSON.parse(adItemsValue) || {});
          } catch {}
        }
        if (adProgressMapValue) {
          try {
            setAdProgressMap(JSON.parse(adProgressMapValue) || {});
          } catch {}
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, [storageKey, workoutKey, routineKey, scanDailyKey, scanHistoryKey, adUnlockedRecipesKey, streakKey, medalsKey, adUnlockedItemsKey, adProgressMapKey]);

  useEffect(() => {
    if (hydrated && storageKey) AsyncStorage.setItem(storageKey, JSON.stringify(stats)).catch(() => undefined);
  }, [hydrated, stats, storageKey]);

  useEffect(() => {
    if (hydrated && workoutKey) AsyncStorage.setItem(workoutKey, String(workoutDone)).catch(() => undefined);
  }, [hydrated, workoutDone, workoutKey]);

  useEffect(() => {
    if (!hydrated || !userId) return;
    dailyProgressMutation.mutate({
      data: {
        day: localDay(),
        values: {
          calories: stats.calories,
          protein: stats.protein,
          carbs: stats.carbs,
          fats: stats.fats,
          water: stats.water,
          steps: stats.steps,
          burned: stats.burned,
        },
      },
    });
  }, [dailyProgressMutation.mutate, hydrated, stats, userId]);

  const effectiveTier = resolveMembershipTier(
    (profile as ExtendedProfile)?.membershipTier,
    isOwner,
    previewClientFree,
    previewTier,
  );
  const tierConfig = getMembershipConfig(effectiveTier);

  const isSimulatingClient = previewTier !== 'none' || previewClientFree;
  const isAdminModeActive = isOwner && !isSimulatingClient;
  const isGoldenOrOwner = isAdminModeActive || effectiveTier === 'golden';
  const dailyFreeLimit = tierConfig.foodScannerDailyLimit;
  const totalAllowedToday = isGoldenOrOwner ? Infinity : dailyFreeLimit + extraAdScans;
  const remainingScans = isGoldenOrOwner ? Infinity : Math.max(0, totalAllowedToday - scansUsedToday);
  const canScan = isGoldenOrOwner || remainingScans > 0;
  const canWatchAdForExtra = !isGoldenOrOwner && tierConfig.hasAds && extraAdScans < (tierConfig.maxExtraAdScans || 3);

  const foodScanLimits: FoodScanLimitsInfo = {
    dailyFreeLimit,
    usedToday: scansUsedToday,
    extraAdScans,
    totalAllowedToday,
    remainingScans,
    adProgress,
    canScan,
    canWatchAdForExtra,
  };

  const consumeFoodScan = async (): Promise<boolean> => {
    if (!canScan) return false;
    if (!isGoldenOrOwner) {
      const nextUsed = scansUsedToday + 1;
      setScansUsedToday(nextUsed);
      AsyncStorage.setItem(
        scanDailyKey,
        JSON.stringify({ scansUsedToday: nextUsed, extraAdScans, adProgress })
      ).catch(() => undefined);
    }
    return true;
  };

  const watchAdForExtraScan = async (): Promise<{ unlocked: boolean; progress: number; extraScans: number }> => {
    if (!canWatchAdForExtra) return { unlocked: false, progress: adProgress, extraScans: extraAdScans };
    const nextProgress = adProgress + 1;
    let nextExtra = extraAdScans;
    let unlocked = false;
    let finalProgress = nextProgress;

    if (nextProgress >= (tierConfig.adsPerExtraScan || 3)) {
      nextExtra = extraAdScans + 1;
      finalProgress = 0;
      unlocked = true;
    }

    setAdProgress(finalProgress);
    setExtraAdScans(nextExtra);
    AsyncStorage.setItem(
      scanDailyKey,
      JSON.stringify({ scansUsedToday, extraAdScans: nextExtra, adProgress: finalProgress })
    ).catch(() => undefined);

    return { unlocked, progress: finalProgress, extraScans: nextExtra };
  };

  const unlockRecipeWithAd = async (recipeId: string): Promise<void> => {
    const updated = {
      ...unlockedAdRecipes,
      [recipeId]: Date.now() + 24 * 60 * 60 * 1000,
    };
    setUnlockedAdRecipes(updated);
    AsyncStorage.setItem(adUnlockedRecipesKey, JSON.stringify(updated)).catch(() => undefined);
  };

  const isRecipeUnlockedByAd = (recipeId: string): boolean => {
    const expiresAt = unlockedAdRecipes[recipeId];
    return Boolean(expiresAt && Date.now() < expiresAt);
  };

  const getRequiredAdsForItem = useCallback((_itemId?: string): number => {
    if (isGoldenOrOwner) return 0;
    if (effectiveTier === 'platinum') return 1;
    if (effectiveTier === 'bronze') return 2;
    return 3;
  }, [isGoldenOrOwner, effectiveTier]);

  const getAdProgressForItem = useCallback((itemId: string): number => {
    return adProgressMap[itemId] || 0;
  }, [adProgressMap]);

  const isItemUnlockedWithAd = useCallback((itemId: string): boolean => {
    const item = unlockedAdItems[itemId];
    if (!item) return false;
    return Date.now() < item.expiresAt;
  }, [unlockedAdItems]);

  const getItemAdRemainingDays = useCallback((itemId: string): number => {
    const item = unlockedAdItems[itemId];
    if (!item || Date.now() >= item.expiresAt) return 0;
    const msRemaining = item.expiresAt - Date.now();
    return Math.max(1, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
  }, [unlockedAdItems]);

  const watchAdForItem = useCallback(async (itemId: string): Promise<{ completed: boolean; remaining: number; expiresAt?: number }> => {
    const required = getRequiredAdsForItem(itemId);
    if (required === 0) return { completed: true, remaining: 0 };
    const current = adProgressMap[itemId] || 0;
    const nextProgress = current + 1;
    if (nextProgress >= required) {
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const nextUnlocked = {
        ...unlockedAdItems,
        [itemId]: { unlockedAt: Date.now(), expiresAt },
      };
      const nextProgressMap = { ...adProgressMap, [itemId]: 0 };
      setUnlockedAdItems(nextUnlocked);
      setAdProgressMap(nextProgressMap);
      AsyncStorage.setItem(adUnlockedItemsKey, JSON.stringify(nextUnlocked)).catch(() => undefined);
      AsyncStorage.setItem(adProgressMapKey, JSON.stringify(nextProgressMap)).catch(() => undefined);
      return { completed: true, remaining: 0, expiresAt };
    } else {
      const nextProgressMap = { ...adProgressMap, [itemId]: nextProgress };
      setAdProgressMap(nextProgressMap);
      AsyncStorage.setItem(adProgressMapKey, JSON.stringify(nextProgressMap)).catch(() => undefined);
      return { completed: false, remaining: required - nextProgress };
    }
  }, [getRequiredAdsForItem, adProgressMap, unlockedAdItems, adUnlockedItemsKey, adProgressMapKey]);

  const isItemUnlocked = useCallback((requiredTier: MembershipTierId = 'standard', itemId?: string): boolean => {
    if (isGoldenOrOwner) return true;
    if (itemId && isItemUnlockedWithAd(itemId)) return true;
    const rank: Record<MembershipTierId, number> = { standard: 0, bronze: 1, platinum: 2, golden: 3 };
    const userTierRank = rank[effectiveTier] ?? 0;
    const reqTierRank = rank[requiredTier] ?? 0;
    return userTierRank >= reqTierRank;
  }, [isGoldenOrOwner, effectiveTier, isItemUnlockedWithAd]);

  const saveScanToHistory = async (
    item: Omit<ScannedFoodHistoryItem, 'id' | 'timestamp'>
  ): Promise<ScannedFoodHistoryItem> => {
    const fullItem: ScannedFoodHistoryItem = {
      ...item,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [fullItem, ...foodScansHistory.filter((h) => h.id !== fullItem.id)].slice(0, 50);
    setFoodScansHistory(nextHistory);
    AsyncStorage.setItem(scanHistoryKey, JSON.stringify(nextHistory)).catch(() => undefined);
    return fullItem;
  };

  const repeatScanMeal = (item: ScannedFoodHistoryItem) => {
    setStats((current) => ({
      ...current,
      calories: current.calories + item.totals.calories,
      protein: current.protein + item.totals.protein,
      carbs: current.carbs + item.totals.carbs,
      fats: current.fats + item.totals.fats,
    }));
  };

  const dynastyStats: DynastyUserStats = useMemo(() => {
    const workouts = workoutQuery.data?.workouts ?? [];
    const workoutsCount = workouts.length;
    const activeDaysSet = new Set(workouts.map((w) => localDay(new Date(w.completedAt))));
    if (stats.calories > 0 || stats.steps > 0 || stats.water > 0) {
      activeDaysSet.add(todayStr);
    }
    const activeDaysCount = Math.max(activeDaysSet.size, streakStats.activeDays || 1);
    const cardioMinutes = workouts.reduce((acc, w) => acc + (w.durationMinutes || 0), 0);
    const effectiveStreak = Math.max(streak, streakStats.currentStreak, 1);
    const nutritionCount = (stats.calories > 0 ? 1 : 0) + foodScansHistory.length;
    const prsCount = Math.max(1, Math.floor(workoutsCount / 3));

    return {
      workouts: Math.max(workoutsCount, 1),
      nutrition: Math.max(nutritionCount, 1),
      steps: Math.max(stats.steps, 3200),
      cardio: Math.max(cardioMinutes, 15),
      streak: effectiveStreak,
      prs: prsCount,
      activeDays: activeDaysCount,
    };
  }, [
    workoutQuery.data?.workouts,
    stats.calories,
    stats.steps,
    stats.water,
    todayStr,
    streakStats.activeDays,
    streakStats.currentStreak,
    streak,
    foodScansHistory.length,
  ]);

  // Desbloqueo automático de medallas por motor de mayoría
  useEffect(() => {
    if (!hydrated) return;
    const newlyUnlocked: string[] = [];
    DYNASTY_MEDALS_CATALOG.forEach((medal) => {
      if (!unlockedMedals.includes(medal.id)) {
        const result = evaluateMedalProgress(medal, dynastyStats);
        if (result.isUnlocked) {
          newlyUnlocked.push(medal.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedMedals((prev) => {
        const merged = Array.from(new Set([...prev, ...newlyUnlocked]));
        AsyncStorage.setItem(medalsKey, JSON.stringify(merged)).catch(() => undefined);
        return merged;
      });
    }
  }, [hydrated, dynastyStats, unlockedMedals, medalsKey]);

  const currentMonth = todayStr.slice(0, 7);
  const currentMonthSaves = streakStats.lastSavedMonth === currentMonth ? (streakStats.freeSavesThisMonth || 0) : 0;
  const freeStreakSavesRemaining = isGoldenOrOwner
    ? 999
    : effectiveTier === 'platinum'
    ? Math.max(0, 7 - currentMonthSaves)
    : 0;

  const canRescueStreak = useMemo(() => {
    if (isGoldenOrOwner) return true;
    if (effectiveTier === 'platinum') return freeStreakSavesRemaining > 0;
    return streakStats.lastSavedDate !== todayStr;
  }, [effectiveTier, freeStreakSavesRemaining, isGoldenOrOwner, streakStats.lastSavedDate, todayStr]);

  const rescueStreakFree = async (): Promise<{ success: boolean; message: string }> => {
    if (!isGoldenOrOwner && effectiveTier !== 'platinum') {
      return {
        success: false,
        message: 'Tu membresía no cuenta con salvamentos gratuitos. Puedes salvar tu racha viendo videos patrocinados.',
      };
    }
    if (effectiveTier === 'platinum' && !isGoldenOrOwner && freeStreakSavesRemaining <= 0) {
      return {
        success: false,
        message: 'Has utilizado tus 7 salvamentos gratuitos de este mes (Platinum). Podrás volver a salvar tu racha el próximo mes.',
      };
    }

    const nextCurrent = Math.max(1, (streakStats.currentStreak || streak || 0) + 1);
    const nextBest = Math.max(streakStats.bestStreak || 0, nextCurrent);
    const nextSavedCount = (streakStats.savedStreaksCount || 0) + 1;
    const nextMonthSaves = isGoldenOrOwner ? 0 : currentMonthSaves + 1;

    const updated: StreakDetails = {
      ...streakStats,
      currentStreak: nextCurrent,
      bestStreak: nextBest,
      savedStreaksCount: nextSavedCount,
      lastSavedDate: todayStr,
      lastSavedMonth: currentMonth,
      freeSavesThisMonth: nextMonthSaves,
    };
    setStreakStats(updated);
    await AsyncStorage.setItem(streakKey, JSON.stringify(updated)).catch(() => undefined);
    return {
      success: true,
      message: isGoldenOrOwner
        ? '👑 ¡Racha restaurada al instante! Beneficio exclusivo ilimitado Golden VIP.'
        : `🔥 ¡Racha salvada! Te quedan ${Math.max(0, 6 - currentMonthSaves)} salvamentos gratuitos este mes (Platinum).`,
    };
  };

  const rescueStreakWithAds = async (): Promise<{ success: boolean; message: string }> => {
    if (streakStats.lastSavedDate === todayStr) {
      return {
        success: false,
        message: 'Ya has utilizado tu salvamento diario de hoy. ¡Mañana podrás volver a salvarla si lo necesitas!',
      };
    }
    const nextCurrent = Math.max(1, (streakStats.currentStreak || streak || 0) + 1);
    const nextBest = Math.max(streakStats.bestStreak || 0, nextCurrent);
    const nextSavedCount = (streakStats.savedStreaksCount || 0) + 1;
    const updated: StreakDetails = {
      ...streakStats,
      currentStreak: nextCurrent,
      bestStreak: nextBest,
      savedStreaksCount: nextSavedCount,
      lastSavedDate: todayStr,
    };
    setStreakStats(updated);
    await AsyncStorage.setItem(streakKey, JSON.stringify(updated)).catch(() => undefined);
    return {
      success: true,
      message: '🔥 ¡Racha salvada! Tu disciplina se mantiene intacta en la dinastía.',
    };
  };

  const updateDesignatedTrainer = async (id: string, patch: Partial<Trainer>) => {
    setDesignatedTrainers((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      AsyncStorage.setItem(TRAINERS_KEY, JSON.stringify(updated)).catch(() => undefined);
      return updated;
    });
  };

  const unlockMedal = async (medalId: string) => {
    if (unlockedMedals.includes(medalId)) return;
    setUnlockedMedals((prev) => {
      const merged = [...prev, medalId];
      AsyncStorage.setItem(medalsKey, JSON.stringify(merged)).catch(() => undefined);
      return merged;
    });
  };

  const value = useMemo<BodyFitContextValue>(
    () => ({
      stats: { ...stats, streak: Math.max(streak, streakStats.currentStreak) },
      hydrated,
      addWater: () => setStats((current) => ({ ...current, water: Math.min(current.water + 0.25, current.waterGoal) })),
      addMeal: (calories, protein, carbs, fats) =>
        setStats((current) => ({
          ...current,
          calories: current.calories + calories,
          protein: current.protein + protein,
          carbs: current.carbs + carbs,
          fats: current.fats + fats,
        })),
      setSteps: (steps) => setStats((current) => ({ ...current, steps: Math.max(0, Math.round(steps)) })),
      updateGoals: (goals) => setStats((current) => ({ ...current, ...goals })),
      toggleWorkout: () => setWorkoutDone((current) => !current),
      workoutDone,
      isOwner,
      isSimulatingClient,
      isAdminModeActive,
      previewTier,
      setPreviewTier,
      previewClientFree,
      setPreviewClientFree,
      membership: effectiveTier,
      membershipLabel: tierConfig.name,
      catalogPercent: tierConfig.catalogPercentTarget,
      canUseFoodAI: isAdminModeActive || (!previewClientFree && effectiveTier !== 'standard'),
      canAccessFullTraining: isAdminModeActive || (!previewClientFree && (effectiveTier === 'golden' || effectiveTier === 'platinum')),
      customRoutine,
      saveCustomRoutine: async (libraryIds: string[], days: CustomRoutineDay[]) => {
        const newRoutine: CustomRoutineState = {
          libraryIds,
          days,
          updatedAt: new Date().toISOString(),
        };
        setCustomRoutine(newRoutine);
        if (routineKey) {
          await AsyncStorage.setItem(routineKey, JSON.stringify(newRoutine)).catch(() => undefined);
        }
      },
      resetCustomRoutine: async () => {
        setCustomRoutine(null);
        if (routineKey) {
          await AsyncStorage.removeItem(routineKey).catch(() => undefined);
        }
      },
      profile: profile as ExtendedProfile | null,
      profileLoading: Boolean(userId) && profileQuery.isLoading,
      profileError: profileQuery.isError,
      refreshProfile: () => profileQuery.refetch(),
      updateProfile: async (patch) => {
        const currentEffective = profile || defaultDevProfile;
        const merged: ExtendedProfile = {
          ...currentEffective,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        setLocalProfile(merged);
        await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged)).catch(() => undefined);

        try {
          const updated = await profileMutation.mutateAsync({ data: patch });
          const fullMerged: ExtendedProfile = {
            ...merged,
            ...updated,
          };
          setLocalProfile(fullMerged);
          queryClient.setQueryData(profileQuery.queryKey, fullMerged);
          await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(fullMerged)).catch(() => undefined);
          return fullMerged as any;
        } catch {
          queryClient.setQueryData(profileQuery.queryKey, merged);
          return merged as any;
        }
      },
      redeemGiftCode: async (code: string) => {
        try {
          const res = await customFetch<{
            success: boolean;
            message: string;
            tier?: string;
            durationLabel?: string;
            profile?: ExtendedProfile;
          }>('/membership/redeem-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          if (res?.profile) {
            queryClient.setQueryData(profileQuery.queryKey, res.profile);
          } else {
            await profileQuery.refetch();
          }
          return {
            success: true,
            message: res?.message || '¡Membresía activada con éxito!',
            tier: res?.tier,
            durationLabel: res?.durationLabel,
          };
        } catch (err: any) {
          return {
            success: false,
            message: err?.message || 'El código no es válido o ya fue canjeado.',
          };
        }
      },
      foodScanLimits,
      consumeFoodScan,
      watchAdForExtraScan,
      unlockRecipeWithAd,
      isRecipeUnlockedByAd,
      unlockedAdRecipes,
      unlockedAdItems,
      getRequiredAdsForItem,
      getAdProgressForItem,
      watchAdForItem,
      isItemUnlockedWithAd,
      getItemAdRemainingDays,
      isItemUnlocked,
      foodScansHistory,
      saveScanToHistory,
      repeatScanMeal,
      streakDetails: streakStats,
      canRescueStreak,
      rescueStreakWithAds,
      rescueStreakFree,
      freeStreakSavesRemaining,
      designatedTrainers,
      updateDesignatedTrainer,
      unlockedMedals,
      unlockMedal,
      dynastyStats,
      routineVideos,
      setRoutineVideo: async (routineId: string, videoUrl: string) => {
        const updated = { ...routineVideos, [routineId]: videoUrl.trim() };
        setRoutineVideos(updated);
        await AsyncStorage.setItem(ROUTINE_VIDEOS_KEY, JSON.stringify(updated)).catch(() => undefined);
      },
      removeRoutineVideo: async (routineId: string) => {
        const updated = { ...routineVideos };
        delete updated[routineId];
        setRoutineVideos(updated);
        await AsyncStorage.setItem(ROUTINE_VIDEOS_KEY, JSON.stringify(updated)).catch(() => undefined);
      },
    }),
    [
      adProgress,
      adUnlockedRecipesKey,
      canRescueStreak,
      canScan,
      canWatchAdForExtra,
      routineVideos,
      customRoutine,
      dailyProgressMutation.mutate,
      designatedTrainers,
      dynastyStats,
      effectiveTier,
      extraAdScans,
      foodScanLimits,
      foodScansHistory,
      freeStreakSavesRemaining,
      getItemAdRemainingDays,
      getAdProgressForItem,
      getRequiredAdsForItem,
      hydrated,
      isGoldenOrOwner,
      isItemUnlocked,
      isItemUnlockedWithAd,
      isOwner,
      medalsKey,
      previewClientFree,
      previewTier,
      profile,
      profileMutation.mutateAsync,
      profileQuery.isError,
      profileQuery.isLoading,
      profileQuery.queryKey,
      profileQuery.refetch,
      queryClient,
      routineKey,
      scanDailyKey,
      scanHistoryKey,
      scansUsedToday,
      stats,
      streak,
      streakKey,
      streakStats,
      tierConfig.adsPerExtraScan,
      tierConfig.catalogPercentTarget,
      tierConfig.foodScannerDailyLimit,
      tierConfig.hasAds,
      tierConfig.maxExtraAdScans,
      tierConfig.name,
      unlockedAdItems,
      unlockedAdRecipes,
      unlockedMedals,
      userId,
      watchAdForItem,
      workoutDone,
    ],
  );

  return <BodyFitContext.Provider value={value}>{children}</BodyFitContext.Provider>;
}

export function useBodyFitOptional() {
  return useContext(BodyFitContext);
}

export function useBodyFit() {
  const context = useBodyFitOptional();
  if (!context) throw new Error('useBodyFit must be used inside BodyFitProvider');
  return context;
}