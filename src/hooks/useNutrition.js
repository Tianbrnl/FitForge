import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { initialNutritionData } from '../data/nutrition';

export function useNutrition() {
  const { user } = useAuth();
  const userId = user?.id;

  // Read local storage initial state
  const [localNutrition, setLocalNutrition] = useState(() => {
    try {
      const saved = window.localStorage.getItem('fitforge_nutrition');
      return saved ? JSON.parse(saved) : initialNutritionData;
    } catch {
      return initialNutritionData;
    }
  });

  const [supabaseData, setSupabaseData] = useState({
    caloriesConsumed: null,
    proteinConsumed: null,
    carbsConsumed: null,
    fatConsumed: null,
    calorieTarget: null,
    proteinTarget: null,
    carbsTarget: null,
    fatTarget: null
  });

  // Sync state from localStorage
  const syncLocal = useCallback(() => {
    try {
      const saved = window.localStorage.getItem('fitforge_nutrition');
      if (saved) {
        setLocalNutrition(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error reading fitforge_nutrition from localStorage:', e);
    }
  }, []);

  // Listen to storage events (cross-tab and custom in-tab updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'fitforge_nutrition') {
        syncLocal();
      }
    };
    const handleCustomUpdate = (e) => {
      if (!e.detail?.key || e.detail.key === 'fitforge_nutrition') {
        syncLocal();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fitforge_storage_update', handleCustomUpdate);
    window.addEventListener('fitforge_nutrition_updated', syncLocal);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fitforge_storage_update', handleCustomUpdate);
      window.removeEventListener('fitforge_nutrition_updated', syncLocal);
    };
  }, [syncLocal]);

  // Load from Supabase if logged in
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function loadSupabaseNutrition() {
      try {
        const todayStr = new Date().toISOString().split('T')[0];

        const [targetsRes, logsRes] = await Promise.all([
          supabase
            .from('nutrition_targets')
            .select('calories, protein, carbohydrates, fats')
            .eq('user_id', userId)
            .maybeSingle(),
          supabase
            .from('meal_logs')
            .select('calories, protein, carbs, fats')
            .eq('user_id', userId)
            .eq('consumed_at', todayStr)
        ]);

        if (!isMounted) return;

        const targetCal = targetsRes.data?.calories ?? null;
        const targetProt = targetsRes.data?.protein ?? null;
        const targetCarbs = targetsRes.data?.carbohydrates ?? null;
        const targetFat = targetsRes.data?.fats ?? null;

        let consumedCal = null;
        let consumedProt = null;
        let consumedCarbs = null;
        let consumedFat = null;

        if (logsRes.data) {
          consumedCal = 0;
          consumedProt = 0;
          consumedCarbs = 0;
          consumedFat = 0;
          logsRes.data.forEach((log) => {
            consumedCal += Number(log.calories) || 0;
            consumedProt += Number(log.protein) || 0;
            consumedCarbs += Number(log.carbs) || 0;
            consumedFat += Number(log.fats) || 0;
          });
        }

        setSupabaseData({
          caloriesConsumed: consumedCal,
          proteinConsumed: consumedProt,
          carbsConsumed: consumedCarbs,
          fatConsumed: consumedFat,
          calorieTarget: targetCal,
          proteinTarget: targetProt,
          carbsTarget: targetCarbs,
          fatTarget: targetFat
        });
      } catch (err) {
        console.error('Error fetching Supabase nutrition:', err);
      }
    }

    loadSupabaseNutrition();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Compute combined / fallback values
  const {
    todayCaloriesConsumed,
    todayProteinConsumed,
    todayCarbsConsumed,
    todayFatConsumed,
    dailyCalorieGoal,
    dailyProteinGoal,
    dailyCarbsGoal,
    dailyFatGoal
  } = useMemo(() => {
    let localCal = 0;
    let localProt = 0;
    let localCarbs = 0;
    let localFat = 0;

    if (localNutrition?.meals) {
      Object.values(localNutrition.meals).forEach((items) => {
        (items || []).forEach((item) => {
          localCal += Number(item.calories) || 0;
          localProt += Number(item.protein) || 0;
          localCarbs += Number(item.carbs) || 0;
          localFat += Number(item.fat) || 0;
        });
      });
    }

    const localCalTarget = localNutrition?.dailyGoals?.calories || 2450;
    const localProtTarget = localNutrition?.dailyGoals?.protein || 175;
    const localCarbsTarget = localNutrition?.dailyGoals?.carbs || 240;
    const localFatTarget = localNutrition?.dailyGoals?.fat || 68;

    const calConsumed = supabaseData.caloriesConsumed !== null
      ? supabaseData.caloriesConsumed
      : Math.round(localCal);

    const protConsumed = supabaseData.proteinConsumed !== null
      ? supabaseData.proteinConsumed
      : Math.round(localProt);

    const carbsConsumed = supabaseData.carbsConsumed !== null
      ? supabaseData.carbsConsumed
      : Math.round(localCarbs);

    const fatConsumed = supabaseData.fatConsumed !== null
      ? supabaseData.fatConsumed
      : Math.round(localFat);

    const calGoal = supabaseData.calorieTarget !== null
      ? supabaseData.calorieTarget
      : localCalTarget;

    const protGoal = supabaseData.proteinTarget !== null
      ? supabaseData.proteinTarget
      : localProtTarget;

    const carbsGoal = supabaseData.carbsTarget !== null
      ? supabaseData.carbsTarget
      : localCarbsTarget;

    const fatGoal = supabaseData.fatTarget !== null
      ? supabaseData.fatTarget
      : localFatTarget;

    return {
      todayCaloriesConsumed: Math.round(calConsumed),
      todayProteinConsumed: Math.round(protConsumed),
      todayCarbsConsumed: Math.round(carbsConsumed),
      todayFatConsumed: Math.round(fatConsumed),
      dailyCalorieGoal: Math.round(calGoal),
      dailyProteinGoal: Math.round(protGoal),
      dailyCarbsGoal: Math.round(carbsGoal),
      dailyFatGoal: Math.round(fatGoal)
    };
  }, [localNutrition, supabaseData]);

  const caloriePercent = dailyCalorieGoal > 0
    ? Math.round((todayCaloriesConsumed / dailyCalorieGoal) * 100)
    : 0;

  const caloriesRemaining = Math.max(0, dailyCalorieGoal - todayCaloriesConsumed);

  const proteinPercent = dailyProteinGoal > 0
    ? Math.round((todayProteinConsumed / dailyProteinGoal) * 100)
    : 0;

  return {
    nutritionData: localNutrition,
    todayCaloriesConsumed,
    todayProteinConsumed,
    todayCarbsConsumed,
    todayFatConsumed,
    dailyCalorieGoal,
    dailyProteinGoal,
    dailyCarbsGoal,
    dailyFatGoal,
    caloriePercent,
    caloriesRemaining,
    proteinPercent
  };
}
