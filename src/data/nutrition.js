export const initialNutritionData = {
  dailyGoals: {
    calories: 2450,
    protein: 175, // grams
    carbs: 240,   // grams
    fat: 68       // grams
  },
  
  todayLogged: {
    calories: 1920,
    protein: 142,
    carbs: 198,
    fat: 52
  },

  meals: {
    breakfast: [
      { id: "m-1", name: "Rolled Oats with Whey & Berries", portion: "80g oats + 1 scoop whey", calories: 460, protein: 36, carbs: 62, fat: 8 },
      { id: "m-2", name: "Whole Eggs (Scrambled)", portion: "2 large eggs", calories: 155, protein: 13, carbs: 1, fat: 11 }
    ],
    lunch: [
      { id: "m-3", name: "Grilled Chicken Breast with Quinoa", portion: "200g chicken + 150g quinoa", calories: 540, protein: 55, carbs: 48, fat: 12 },
      { id: "m-4", name: "Steamed Broccoli with Olive Oil", portion: "120g broccoli + 5ml oil", calories: 85, protein: 4, carbs: 8, fat: 5 }
    ],
    dinner: [
      { id: "m-5", name: "Pan-Seared Salmon Fillet", portion: "180g Atlantic salmon", calories: 420, protein: 38, carbs: 0, fat: 26 },
      { id: "m-6", name: "Baked Sweet Potato", portion: "200g sweet potato", calories: 180, protein: 3, carbs: 42, fat: 0.5 }
    ],
    snacks: [
      { id: "m-7", name: "Non-fat Greek Yogurt with Honey", portion: "170g Greek yogurt", calories: 160, protein: 18, carbs: 18, fat: 0 }
    ]
  }
};
