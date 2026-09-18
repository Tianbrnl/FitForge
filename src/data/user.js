export const initialUserData = {
  name: "Alex Mercer",
  email: "alex.mercer@fitforge.io",
  age: 27,
  height: "5'11\" (180 cm)",
  weight: 78.5, // kg
  targetWeight: 75.0,
  activityLevel: "Very Active (4-5 days/week)",
  experienceLevel: "Intermediate",
  joinedDate: "January 2026",
  
  // Dashboard Metrics
  metrics: {
    currentWeight: 78.5,
    weightUnit: "kg",
    weightTrend: -0.8, // kg this month
    dailyCaloriesBurned: 680,
    dailyCaloriesTarget: 750,
    dailyCaloriesConsumed: 2150,
    dailyCaloriesGoal: 2450,
    weeklyWorkouts: 4,
    weeklyWorkoutsGoal: 5,
    workoutStreak: 12, // days
  },

  // Weekly Activity Chart Data (Mon - Sun)
  weeklyActivity: [
    { day: "Mon", minutes: 55, calories: 520, completed: true },
    { day: "Tue", minutes: 45, calories: 430, completed: true },
    { day: "Wed", minutes: 60, calories: 610, completed: true },
    { day: "Thu", minutes: 0, calories: 0, completed: false, restDay: true },
    { day: "Fri", minutes: 70, calories: 680, completed: true },
    { day: "Sat", minutes: 50, calories: 490, completed: false, isToday: true },
    { day: "Sun", minutes: 0, calories: 0, completed: false }
  ],

  // Weight Progress History (Past 8 Weeks)
  weightHistory: [
    { date: "Aug 01", weight: 81.2 },
    { date: "Aug 08", weight: 80.8 },
    { date: "Aug 15", weight: 80.4 },
    { date: "Aug 22", weight: 80.0 },
    { date: "Aug 29", weight: 79.5 },
    { date: "Sep 05", weight: 79.1 },
    { date: "Sep 12", weight: 78.8 },
    { date: "Sep 18", weight: 78.5 },
  ],

  // Personal Records
  personalRecords: [
    { exercise: "Barbell Bench Press", weight: "105 kg (231 lbs)", reps: "5 reps", date: "Sep 10, 2026" },
    { exercise: "Conventional Deadlift", weight: "170 kg (375 lbs)", reps: "3 reps", date: "Sep 03, 2026" },
    { exercise: "Barbell Back Squat", weight: "140 kg (308 lbs)", reps: "5 reps", date: "Aug 28, 2026" },
    { exercise: "Overhead Barbell Press", weight: "70 kg (154 lbs)", reps: "6 reps", date: "Aug 19, 2026" },
    { exercise: "Weighted Pull-Up", weight: "+25 kg (+55 lbs)", reps: "8 reps", date: "Sep 14, 2026" },
    { exercise: "5K Outdoor Run", weight: "21m 45s", reps: "Pace 4:21/km", date: "Sep 01, 2026" }
  ]
};
