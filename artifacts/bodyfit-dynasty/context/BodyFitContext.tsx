import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  toggleWorkout: () => void;
  workoutDone: boolean;
};

const initialStats: DailyStats = {
  calories: 1250,
  calorieGoal: 2500,
  protein: 75,
  proteinGoal: 150,
  carbs: 138,
  carbsGoal: 275,
  fats: 35,
  fatsGoal: 70,
  water: 1.6,
  waterGoal: 2.5,
  steps: 8752,
  burned: 482,
  streak: 12,
};

const BodyFitContext = createContext<BodyFitContextValue | undefined>(undefined);
const STORAGE_KEY = 'bodyfit-dynasty-daily-stats';

export function BodyFitProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<DailyStats>(initialStats);
  const [hydrated, setHydrated] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) setStats({ ...initialStats, ...JSON.parse(value) });
      })
      .catch(() => undefined)
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats)).catch(() => undefined);
  }, [hydrated, stats]);

  const value = useMemo<BodyFitContextValue>(
    () => ({
      stats,
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
      toggleWorkout: () => setWorkoutDone((current) => !current),
      workoutDone,
    }),
    [hydrated, stats, workoutDone],
  );

  return <BodyFitContext.Provider value={value}>{children}</BodyFitContext.Provider>;
}

export function useBodyFit() {
  const context = useContext(BodyFitContext);
  if (!context) throw new Error('useBodyFit must be used inside BodyFitProvider');
  return context;
}