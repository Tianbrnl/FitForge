import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Coffee,
  Utensils,
  Moon,
  Cookie,
  Sparkles,
  Edit3,
  AlertCircle,
  Lock
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressBar from '../components/common/ProgressBar';
import MealCard from '../components/nutrition/MealCard';
import AuthRequiredModal from '../components/common/AuthRequiredModal';
import { initialNutritionData } from '../data/nutrition';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calcPercent } from '../utils/formatters';

const QUICK_PRESETS = [
  { name: 'Grilled Chicken Breast', portion: '150g', calories: 247, protein: 46, carbs: 0, fat: 5 },
  { name: 'Brown Rice', portion: '1 cup cooked (195g)', calories: 218, protein: 4.5, carbs: 46, fat: 1.6 },
  { name: 'Rolled Oatmeal', portion: '1 cup cooked (234g)', calories: 158, protein: 6, carbs: 28, fat: 3 },
  { name: 'Whole Eggs', portion: '2 large (100g)', calories: 143, protein: 12.6, carbs: 0.7, fat: 9.5 },
  { name: 'Whey Protein Shake', portion: '1 scoop (30g)', calories: 120, protein: 24, carbs: 2, fat: 1.5 },
  { name: 'Greek Yogurt (0%)', portion: '170g', calories: 100, protein: 17, carbs: 6, fat: 0 },
  { name: 'Avocado', portion: '1/2 medium (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { name: 'Atlantic Salmon', portion: '150g', calories: 312, protein: 34, carbs: 0, fat: 18 }
];

export default function Nutrition() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [nutritionData, setNutritionData] = useLocalStorage(
    'fitforge_nutrition',
    initialNutritionData
  );
  const [_targetsLoading, setTargetsLoading] = useState(true);
  const [targetsSaving, setTargetsSaving] = useState(false);
  const [_mealsLoading, setMealsLoading] = useState(true);
  const [_mealSaving, setMealSaving] = useState(false);
  useEffect(() => {
    async function loadNutritionTargets() {
      if (!user?.id) {
        setTargetsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('nutrition_targets')
          .select('calories, protein, carbohydrates, fats')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Failed to load nutrition targets:', error);
          return;
        }

        if (data) {
          setNutritionData((prev) => ({
            ...prev,
            dailyGoals: {
              calories: data.calories,
              protein: data.protein,
              carbs: data.carbohydrates,
              fat: data.fats
            }
          }));
        }
      } catch (error) {
        console.error('Error loading nutrition targets:', error);
      } finally {
        setTargetsLoading(false);
      }
    }

    loadNutritionTargets();
  }, [user?.id, setNutritionData]);
  useEffect(() => {
    async function loadTodayMeals() {
      if (!user?.id) {
        setMealsLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('meal_logs')
          .select(`
          id,
          food_id,
          meal_type,
          food_name,
          serving,
          protein,
          calories,
          carbs,
          fats,
          consumed_at
        `)
          .eq('user_id', user.id)
          .eq('consumed_at', today)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Failed to load meal logs:', error);
          return;
        }

        const meals = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };

        data.forEach((item) => {
          const mealKey = item.meal_type;

          if (!meals[mealKey]) return;

          meals[mealKey].push({
            id: item.id,
            foodId: item.food_id,
            name: item.food_name,
            portion: item.serving,
            calories: Number(item.calories) || 0,
            protein: Number(item.protein) || 0,
            carbs: Number(item.carbs) || 0,
            fat: Number(item.fats) || 0
          });
        });

        setNutritionData((prev) => ({
          ...prev,
          meals
        }));
      } catch (error) {
        console.error('Error loading meal logs:', error);
      } finally {
        setMealsLoading(false);
      }
    }

    loadTodayMeals();
  }, [user?.id, setNutritionData]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeMealKey, setActiveMealKey] = useState('breakfast');

  // Custom Food Form state
  const [foodForm, setFoodForm] = useState({
    name: '',
    portion: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Edit Food Form state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSourceMealKey, setEditingSourceMealKey] = useState('breakfast');
  const [editMealKey, setEditMealKey] = useState('breakfast');
  const [editFoodForm, setEditFoodForm] = useState({
    name: '',
    portion: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Target Editing state
  const [targetModalMode, setTargetModalMode] = useState(null); // null | 'all' | 'calories' | 'protein' | 'carbs' | 'fat'
  const [targetForm, setTargetForm] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  const [targetError, setTargetError] = useState('');

  // Recalculate consumed macros
  const calculatedLogged = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    Object.values(nutritionData.meals).forEach((mealItems) => {
      mealItems.forEach((item) => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    };
  }, [nutritionData.meals]);

  const { dailyGoals } = nutritionData;

  const handleOpenAddModal = (mealKey) => {
    if (!user?.id) {
      setAuthModalOpen(true);
      return;
    }
    setActiveMealKey(mealKey);
    setFoodForm({
      name: '',
      portion: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
    setAddModalOpen(true);
  };

  const handleApplyPreset = (preset) => {
    setFoodForm({
      name: preset.name,
      portion: preset.portion,
      calories: preset.calories.toString(),
      protein: preset.protein.toString(),
      carbs: preset.carbs.toString(),
      fat: preset.fat.toString()
    });
  };

  const handleAddCustomFood = async (e) => {
    if (e) e.preventDefault();

    if (!user?.id) {
      setAuthModalOpen(true);
      return;
    }

    if (!foodForm.name.trim()) return;

    setMealSaving(true);

    try {
      // 1. Save the food as a reusable custom food
      const { data: foodItem, error: foodError } = await supabase
        .from('food_items')
        .insert({
          user_id: user.id,
          food_name: foodForm.name.trim(),
          serving: foodForm.portion.trim() || '1 serving',
          calories: parseFloat(foodForm.calories) || 0,
          protein: parseFloat(foodForm.protein) || 0,
          carbs: parseFloat(foodForm.carbs) || 0,
          fats: parseFloat(foodForm.fat) || 0,
          is_preset: false
        })
        .select()
        .single();

      if (foodError) {
        console.error('Failed to save food item:', foodError);
        return;
      }

      // 2. Log the food into the selected meal
      const today = new Date().toISOString().split('T')[0];

      const { data: mealLog, error: mealError } = await supabase
        .from('meal_logs')
        .insert({
          user_id: user.id,
          food_id: foodItem.id,
          meal_type: activeMealKey,
          food_name: foodItem.food_name,
          serving: foodItem.serving,
          protein: foodItem.protein,
          calories: foodItem.calories,
          carbs: foodItem.carbs,
          fats: foodItem.fats,
          consumed_at: today
        })
        .select()
        .single();

      if (mealError) {
        console.error('Failed to save meal log:', mealError);
        return;
      }

      // 3. Update the UI immediately
      const newItem = {
        id: mealLog.id,
        foodId: mealLog.food_id,
        name: mealLog.food_name,
        portion: mealLog.serving,
        calories: Number(mealLog.calories) || 0,
        protein: Number(mealLog.protein) || 0,
        carbs: Number(mealLog.carbs) || 0,
        fat: Number(mealLog.fats) || 0
      };

      setNutritionData((prev) => ({
        ...prev,
        meals: {
          ...prev.meals,
          [activeMealKey]: [
            ...(prev.meals[activeMealKey] || []),
            newItem
          ]
        }
      }));

      // 4. Reset form and close modal
      setFoodForm({
        name: '',
        portion: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      });

      setAddModalOpen(false);
    } catch (error) {
      console.error('Error adding food:', error);
    } finally {
      setMealSaving(false);
    }
  };

  const handleRemoveFoodFromMeal = async (mealKey, itemId) => {
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('meal_logs')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to remove meal log:', error);
          return;
        }
      } catch (error) {
        console.error('Error removing meal:', error);
      }
    }

    setNutritionData((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealKey]: prev.meals[mealKey].filter(
          (item) => item.id !== itemId
        )
      }
    }));
  };

  const handleOpenEditModal = (mealKey, item) => {
    setEditingSourceMealKey(mealKey);
    setEditMealKey(mealKey);
    setEditingItem(item);
    setEditFoodForm({
      name: item.name || '',
      portion: item.portion || '',
      calories: item.calories !== undefined ? item.calories.toString() : '',
      protein: item.protein !== undefined ? item.protein.toString() : '',
      carbs: item.carbs !== undefined ? item.carbs.toString() : '',
      fat: item.fat !== undefined ? item.fat.toString() : ''
    });
    setEditError('');
    setEditModalOpen(true);
  };

  const handleSaveEditFood = async (e) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    if (!editFoodForm.name.trim()) {
      setEditError('Food name is required.');
      return;
    }

    const cal = parseFloat(editFoodForm.calories);
    if (isNaN(cal) || cal < 0) {
      setEditError('Please enter a valid calorie amount.');
      return;
    }

    setEditSaving(true);
    setEditError('');

    try {
      const parsedProtein = parseFloat(editFoodForm.protein) || 0;
      const parsedCarbs = parseFloat(editFoodForm.carbs) || 0;
      const parsedFat = parseFloat(editFoodForm.fat) || 0;

      if (user?.id) {
        // 1. Update meal log in Supabase
        const { error: updateError } = await supabase
          .from('meal_logs')
          .update({
            food_name: editFoodForm.name.trim(),
            serving: editFoodForm.portion.trim() || '1 serving',
            calories: Math.round(cal),
            protein: parsedProtein,
            carbs: parsedCarbs,
            fats: parsedFat,
            meal_type: editMealKey
          })
          .eq('id', editingItem.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Failed to update meal log:', updateError);
          setEditError(updateError.message || 'Failed to update food log.');
          setEditSaving(false);
          return;
        }

        // 2. If item has linked foodId, update the food_items entry
        if (editingItem.foodId) {
          await supabase
            .from('food_items')
            .update({
              food_name: editFoodForm.name.trim(),
              serving: editFoodForm.portion.trim() || '1 serving',
              calories: Math.round(cal),
              protein: parsedProtein,
              carbs: parsedCarbs,
              fats: parsedFat
            })
            .eq('id', editingItem.foodId)
            .eq('user_id', user.id);
        }
      }

      // 3. Update local state
      const updatedItem = {
        ...editingItem,
        name: editFoodForm.name.trim(),
        portion: editFoodForm.portion.trim() || '1 serving',
        calories: Math.round(cal),
        protein: parsedProtein,
        carbs: parsedCarbs,
        fat: parsedFat
      };

      setNutritionData((prev) => {
        if (editingSourceMealKey === editMealKey) {
          // Same meal: replace item in place
          return {
            ...prev,
            meals: {
              ...prev.meals,
              [editingSourceMealKey]: (prev.meals[editingSourceMealKey] || []).map((item) =>
                item.id === editingItem.id ? updatedItem : item
              )
            }
          };
        } else {
          // Changed meal category: move item
          const filteredSource = (prev.meals[editingSourceMealKey] || []).filter(
            (item) => item.id !== editingItem.id
          );
          const targetList = [...(prev.meals[editMealKey] || []), updatedItem];
          return {
            ...prev,
            meals: {
              ...prev.meals,
              [editingSourceMealKey]: filteredSource,
              [editMealKey]: targetList
            }
          };
        }
      });

      setEditModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving edited food:', err);
      setEditError('An unexpected error occurred while saving.');
    } finally {
      setEditSaving(false);
    }
  };

  // Open Target Editing modal
  const handleOpenEditTarget = (mode) => {
    if (!user?.id) {
      setAuthModalOpen(true);
      return;
    }
    setTargetModalMode(mode);
    setTargetForm({
      calories: dailyGoals.calories.toString(),
      protein: dailyGoals.protein.toString(),
      carbs: dailyGoals.carbs.toString(),
      fat: dailyGoals.fat.toString()
    });
    setTargetError('');
  };

  // Save Target Edits with validation
  const handleSaveTargets = async (e) => {
    if (e) e.preventDefault();
    setTargetError('');

    const cal = parseFloat(targetForm.calories);
    const pro = parseFloat(targetForm.protein);
    const crb = parseFloat(targetForm.carbs);
    const ft = parseFloat(targetForm.fat);

    // Validation checks
    if (targetModalMode === 'calories') {
      if (isNaN(cal) || cal <= 0) {
        setTargetError('Please enter a target greater than 0.');
        return;
      }
    } else if (targetModalMode === 'protein') {
      if (isNaN(pro) || pro <= 0) {
        setTargetError('Please enter a target greater than 0.');
        return;
      }
    } else if (targetModalMode === 'carbs') {
      if (isNaN(crb) || crb <= 0) {
        setTargetError('Please enter a target greater than 0.');
        return;
      }
    } else if (targetModalMode === 'fat') {
      if (isNaN(ft) || ft <= 0) {
        setTargetError('Please enter a target greater than 0.');
        return;
      }
    } else if (targetModalMode === 'all') {
      if (
        isNaN(cal) || cal <= 0 ||
        isNaN(pro) || pro <= 0 ||
        isNaN(crb) || crb <= 0 ||
        isNaN(ft) || ft <= 0
      ) {
        setTargetError('Please enter targets greater than 0 for all fields.');
        return;
      }
    }

    const updatedGoals = {
      calories: targetModalMode === 'calories' || targetModalMode === 'all' ? Math.round(cal) : dailyGoals.calories,
      protein: targetModalMode === 'protein' || targetModalMode === 'all' ? Math.round(pro) : dailyGoals.protein,
      carbs: targetModalMode === 'carbs' || targetModalMode === 'all' ? Math.round(crb) : dailyGoals.carbs,
      fat: targetModalMode === 'fat' || targetModalMode === 'all' ? Math.round(ft) : dailyGoals.fat
    };

    if (!user?.id) {
      setTargetError('You must be logged in to save nutrition targets.');
      return;
    }

    setTargetsSaving(true);

    try {
      const { error } = await supabase
        .from('nutrition_targets')
        .upsert(
          {
            user_id: user.id,
            calories: updatedGoals.calories,
            protein: updatedGoals.protein,
            carbohydrates: updatedGoals.carbs,
            fats: updatedGoals.fat,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error('Failed to save nutrition targets:', error);
        setTargetError(error.message);
        return;
      }

      setNutritionData((prev) => ({
        ...prev,
        dailyGoals: updatedGoals
      }));

      setTargetModalMode(null);
    } catch (error) {
      console.error('Error saving nutrition targets:', error);
      setTargetError('Failed to save nutrition targets.');
    } finally {
      setTargetsSaving(false);
    }

    // setTargetModalMode(null);
  };

  const getTargetModalTitle = () => {
    switch (targetModalMode) {
      case 'calories':
        return 'Edit Daily Target: Calories';
      case 'protein':
        return 'Edit Daily Target: Protein';
      case 'carbs':
        return 'Edit Daily Target: Carbohydrates';
      case 'fat':
        return 'Edit Daily Target: Healthy Fats';
      case 'all':
      default:
        return 'Edit Daily Nutrition Targets';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 mb-2.5">
          Daily Intake & Fuel
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          Nutrition & Macro Tracker
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-xl">
          Monitor your caloric expenditure and balance macronutrients for clean recovery, muscle preservation, and sustained power output.
        </p>
      </div>

      {!user?.id && (
        <div className="mb-8 p-4 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/25 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 text-xs text-gray-300">
            <Lock size={16} className="text-[#CCFF00] shrink-0" />
            <span>You are viewing sample nutrition targets in guest mode. Sign in to log your daily meals and customize macro targets.</span>
          </div>
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#CCFF00] hover:bg-[#b5e600] text-gray-950 text-xs font-bold transition cursor-pointer shrink-0"
          >
            Sign In to Track
          </button>
        </div>
      )}

      {/* Daily Macro Progress Summary Card */}
      <Card glow="lime" className="p-8 mb-10">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Macro Target
              </h3>
            </div>
            <span className="text-xs text-gray-400">
              Total Consumed vs. Daily Goal
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {calculatedLogged.calories.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 font-semibold">
              / {dailyGoals.calories.toLocaleString()} kcal
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 ml-2">
              {calcPercent(calculatedLogged.calories, dailyGoals.calories)}%
            </span>
          </div>
        </div>

        {/* 4 Progress Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calories Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Calories
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEditTarget('calories')}
                  className="text-xs text-gray-400 hover:text-[#CCFF00] flex items-center gap-1 transition cursor-pointer p-1 rounded hover:bg-white/5"
                  title="Edit Calories Target"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-baseline gap-1 text-sm font-semibold mb-2">
                <span className="text-white font-bold text-base">
                  {calculatedLogged.calories.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs">
                  / {dailyGoals.calories.toLocaleString()} kcal
                </span>
              </div>
            </div>

            <div>
              <ProgressBar
                value={calculatedLogged.calories}
                max={dailyGoals.calories}
                color="lime"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5">
                <span className="font-semibold text-[#CCFF00]">
                  {calcPercent(calculatedLogged.calories, dailyGoals.calories)}%
                </span>
                <span className="text-gray-500">
                  {Math.max(0, dailyGoals.calories - calculatedLogged.calories).toLocaleString()} kcal remaining
                </span>
              </div>
            </div>
          </div>

          {/* Protein Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Protein
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEditTarget('protein')}
                  className="text-xs text-gray-400 hover:text-[#CCFF00] flex items-center gap-1 transition cursor-pointer p-1 rounded hover:bg-white/5"
                  title="Edit Protein Target"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-baseline gap-1 text-sm font-semibold mb-2">
                <span className="text-white font-bold text-base">
                  {calculatedLogged.protein.toLocaleString()}g
                </span>
                <span className="text-gray-400 text-xs">
                  / {dailyGoals.protein.toLocaleString()}g
                </span>
              </div>
            </div>

            <div>
              <ProgressBar
                value={calculatedLogged.protein}
                max={dailyGoals.protein}
                color="lime"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5">
                <span className="font-semibold text-[#CCFF00]">
                  {calcPercent(calculatedLogged.protein, dailyGoals.protein)}%
                </span>
                <span className="text-gray-500">
                  {Math.max(0, dailyGoals.protein - calculatedLogged.protein).toLocaleString()}g remaining
                </span>
              </div>
            </div>
          </div>

          {/* Carbohydrates Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Carbohydrates
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEditTarget('carbs')}
                  className="text-xs text-gray-400 hover:text-[#00E5FF] flex items-center gap-1 transition cursor-pointer p-1 rounded hover:bg-white/5"
                  title="Edit Carbohydrates Target"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-baseline gap-1 text-sm font-semibold mb-2">
                <span className="text-white font-bold text-base">
                  {calculatedLogged.carbs.toLocaleString()}g
                </span>
                <span className="text-gray-400 text-xs">
                  / {dailyGoals.carbs.toLocaleString()}g
                </span>
              </div>
            </div>

            <div>
              <ProgressBar
                value={calculatedLogged.carbs}
                max={dailyGoals.carbs}
                color="cyan"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5">
                <span className="font-semibold text-[#00E5FF]">
                  {calcPercent(calculatedLogged.carbs, dailyGoals.carbs)}%
                </span>
                <span className="text-gray-500">
                  {Math.max(0, dailyGoals.carbs - calculatedLogged.carbs).toLocaleString()}g remaining
                </span>
              </div>
            </div>
          </div>

          {/* Healthy Fats Card */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Healthy Fats
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenEditTarget('fat')}
                  className="text-xs text-gray-400 hover:text-[#FF6B4A] flex items-center gap-1 transition cursor-pointer p-1 rounded hover:bg-white/5"
                  title="Edit Healthy Fats Target"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-baseline gap-1 text-sm font-semibold mb-2">
                <span className="text-white font-bold text-base">
                  {calculatedLogged.fat.toLocaleString()}g
                </span>
                <span className="text-gray-400 text-xs">
                  / {dailyGoals.fat.toLocaleString()}g
                </span>
              </div>
            </div>

            <div>
              <ProgressBar
                value={calculatedLogged.fat}
                max={dailyGoals.fat}
                color="orange"
              />
              <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5">
                <span className="font-semibold text-[#FF6B4A]">
                  {calcPercent(calculatedLogged.fat, dailyGoals.fat)}%
                </span>
                <span className="text-gray-500">
                  {Math.max(0, dailyGoals.fat - calculatedLogged.fat).toLocaleString()}g remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals Grid */}
      <div className="mb-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Daily Meals
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            4 meal windows logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <MealCard
            mealKey="breakfast"
            title="Breakfast"
            icon={Coffee}
            items={nutritionData.meals.breakfast}
            onOpenAddModal={handleOpenAddModal}
            onRemoveItem={handleRemoveFoodFromMeal}
            onEditItem={handleOpenEditModal}
          />

          <MealCard
            mealKey="lunch"
            title="Lunch"
            icon={Utensils}
            items={nutritionData.meals.lunch}
            onOpenAddModal={handleOpenAddModal}
            onRemoveItem={handleRemoveFoodFromMeal}
            onEditItem={handleOpenEditModal}
          />

          <MealCard
            mealKey="dinner"
            title="Dinner"
            icon={Moon}
            items={nutritionData.meals.dinner}
            onOpenAddModal={handleOpenAddModal}
            onRemoveItem={handleRemoveFoodFromMeal}
            onEditItem={handleOpenEditModal}
          />

          <MealCard
            mealKey="snacks"
            title="Snacks"
            icon={Cookie}
            items={nutritionData.meals.snacks}
            onOpenAddModal={handleOpenAddModal}
            onRemoveItem={handleRemoveFoodFromMeal}
            onEditItem={handleOpenEditModal}
          />
        </div>
      </div>

      {/* Add Food to Meal Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Add Food to ${activeMealKey.charAt(0).toUpperCase() + activeMealKey.slice(1)}`}
      >
        <div className="flex flex-col gap-5">
          {/* Quick presets */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <Sparkles size={13} className="text-[#CCFF00]" />
              <span>Quick Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#CCFF00]/15 hover:text-[#CCFF00] text-gray-300 border border-white/10 transition cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddCustomFood} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Food Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken, Oats, Salmon"
                  value={foodForm.name}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Portion / Serving
                </label>
                <input
                  type="text"
                  placeholder="e.g. 150g, 1 cup"
                  value={foodForm.portion}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, portion: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Calories (kcal) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  placeholder="e.g. 250"
                  value={foodForm.calories}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 30"
                  value={foodForm.protein}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, protein: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 25"
                  value={foodForm.carbs}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, carbs: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Fats (g)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 8"
                  value={foodForm.fat}
                  onChange={(e) => setFoodForm(prev => ({ ...prev, fat: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={!foodForm.name.trim() || !foodForm.calories}>
                <Plus size={15} />
                <span>Add to {activeMealKey.charAt(0).toUpperCase() + activeMealKey.slice(1)}</span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Nutrition Targets Modal */}
      <Modal
        isOpen={targetModalMode !== null}
        onClose={() => setTargetModalMode(null)}
        title={getTargetModalTitle()}
      >
        <form onSubmit={handleSaveTargets} className="flex flex-col gap-4">
          {targetError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{targetError}</span>
            </div>
          )}

          {/* Mode: Calories only */}
          {targetModalMode === 'calories' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Calories Target (kcal) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={targetForm.calories}
                onChange={(e) => setTargetForm(prev => ({ ...prev, calories: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition font-medium"
                placeholder="2500"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Your daily energetic goal. Consumed amount will remain preserved.
              </p>
            </div>
          )}

          {/* Mode: Protein only */}
          {targetModalMode === 'protein' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Protein Target (g) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={targetForm.protein}
                onChange={(e) => setTargetForm(prev => ({ ...prev, protein: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition font-medium"
                placeholder="180"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Daily protein target for recovery and lean tissue synthesis.
              </p>
            </div>
          )}

          {/* Mode: Carbs only */}
          {targetModalMode === 'carbs' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Carbohydrates Target (g) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={targetForm.carbs}
                onChange={(e) => setTargetForm(prev => ({ ...prev, carbs: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#00E5FF] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition font-medium"
                placeholder="300"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Daily carbohydrate goal for glycogen storage and workout stamina.
              </p>
            </div>
          )}

          {/* Mode: Fat only */}
          {targetModalMode === 'fat' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Healthy Fats Target (g) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={targetForm.fat}
                onChange={(e) => setTargetForm(prev => ({ ...prev, fat: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#FF6B4A] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition font-medium"
                placeholder="80"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Daily fats goal for hormonal balance and essential fatty acids.
              </p>
            </div>
          )}

          {/* Mode: All 4 Targets */}
          {targetModalMode === 'all' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Calories Target (kcal) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={targetForm.calories}
                  onChange={(e) => setTargetForm(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Protein Target (g) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={targetForm.protein}
                  onChange={(e) => setTargetForm(prev => ({ ...prev, protein: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Carbohydrates Target (g) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={targetForm.carbs}
                  onChange={(e) => setTargetForm(prev => ({ ...prev, carbs: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#00E5FF] text-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                  placeholder="300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Healthy Fats Target (g) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={targetForm.fat}
                  onChange={(e) => setTargetForm(prev => ({ ...prev, fat: e.target.value }))}
                  className="w-full bg-[#0E131E] border border-white/15 focus:border-[#FF6B4A] text-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                  placeholder="80"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10 mt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setTargetModalMode(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={targetsSaving}
            >
              {targetsSaving
                ? 'Saving...'
                : `Save ${targetModalMode === 'all' ? 'Changes' : 'Target'}`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Food in Meal Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingItem(null);
        }}
        title="Edit Food Entry"
      >
        <form onSubmit={handleSaveEditFood} className="flex flex-col gap-4">
          {editError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          {/* Meal Window Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Meal Window
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'breakfast', label: 'Breakfast', icon: Coffee },
                { key: 'lunch', label: 'Lunch', icon: Utensils },
                { key: 'dinner', label: 'Dinner', icon: Moon },
                { key: 'snacks', label: 'Snacks', icon: Cookie }
              ].map(({ key, label, icon: MealIcon }) => {
                const isActive = editMealKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEditMealKey(key)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isActive
                        ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 shadow-sm'
                        : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <MealIcon size={13} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Food Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grilled Chicken, Oats, Salmon"
                value={editFoodForm.name}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Portion / Serving
              </label>
              <input
                type="text"
                placeholder="e.g. 150g, 1 cup"
                value={editFoodForm.portion}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, portion: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Calories (kcal) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                placeholder="e.g. 250"
                value={editFoodForm.calories}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, calories: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 30"
                value={editFoodForm.protein}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, protein: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 25"
                value={editFoodForm.carbs}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, carbs: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 8"
                value={editFoodForm.fat}
                onChange={(e) => setEditFoodForm((prev) => ({ ...prev, fat: e.target.value }))}
                className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3.5 py-2.5 rounded-xl text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditModalOpen(false);
                setEditingItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={editSaving || !editFoodForm.name.trim() || !editFoodForm.calories}
            >
              <Edit3 size={15} />
              <span>{editSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </Button>
          </div>
        </form>
      </Modal>

      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        feature="nutrition"
      />
    </div>
  );
}
