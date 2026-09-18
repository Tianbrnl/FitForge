// Default Initial Custom Workouts for FitForge
// Used to seed `fitforge_custom_workouts` in localStorage on first run

export const defaultCustomWorkouts = [
  {
    id: "workout-001",
    name: "Chest & Triceps Hypertrophy",
    description: "Classic high-volume push session targeting pectoral thickness and tricep lockout.",
    targetMuscle: "Chest",
    createdAt: "2026-09-15",
    exercises: [
      {
        exerciseId: "ex-1",
        name: "Barbell Bench Press",
        muscle: "Chest",
        type: "strength",
        sets: 4,
        reps: 10,
        weight: 40,
        rest: 90
      },
      {
        exerciseId: "ex-2",
        name: "Incline Dumbbell Press",
        muscle: "Chest",
        type: "strength",
        sets: 3,
        reps: 12,
        weight: 16,
        rest: 75
      },
      {
        exerciseId: "ex-3",
        name: "Cable Chest Flyes",
        muscle: "Chest",
        type: "strength",
        sets: 3,
        reps: 15,
        weight: 12.5,
        rest: 60
      },
      {
        exerciseId: "ex-13",
        name: "Tricep Cable Pushdown",
        muscle: "Arms",
        type: "strength",
        sets: 3,
        reps: 12,
        weight: 20,
        rest: 60
      },
      {
        exerciseId: "ex-15",
        name: "Push-ups",
        muscle: "Chest",
        type: "bodyweight",
        sets: 3,
        reps: 15,
        weight: 0,
        rest: 45
      }
    ]
  },
  {
    id: "workout-002",
    name: "Back & Biceps Power",
    description: "Heavy horizontal and vertical pulling protocol for lat width and grip strength.",
    targetMuscle: "Back",
    createdAt: "2026-09-16",
    exercises: [
      {
        exerciseId: "ex-4",
        name: "Barbell Bent-Over Row",
        muscle: "Back",
        type: "strength",
        sets: 4,
        reps: 8,
        weight: 50,
        rest: 90
      },
      {
        exerciseId: "ex-5",
        name: "Lat Pulldown",
        muscle: "Back",
        type: "strength",
        sets: 3,
        reps: 10,
        weight: 45,
        rest: 60
      },
      {
        exerciseId: "ex-16",
        name: "Pull-ups",
        muscle: "Back",
        type: "bodyweight",
        sets: 3,
        reps: 8,
        weight: 0,
        rest: 90
      },
      {
        exerciseId: "ex-12",
        name: "Dumbbell Bicep Curls",
        muscle: "Arms",
        type: "strength",
        sets: 3,
        reps: 12,
        weight: 12,
        rest: 60
      }
    ]
  },
  {
    id: "workout-003",
    name: "Legs & Core Conditioning",
    description: "Quadriceps, posterior chain builder, and dynamic midsection stability.",
    targetMuscle: "Legs",
    createdAt: "2026-09-17",
    exercises: [
      {
        exerciseId: "ex-8",
        name: "Barbell Back Squat",
        muscle: "Legs",
        type: "strength",
        sets: 4,
        reps: 8,
        weight: 60,
        rest: 120
      },
      {
        exerciseId: "ex-7",
        name: "Romanian Deadlift",
        muscle: "Legs",
        type: "strength",
        sets: 3,
        reps: 10,
        weight: 50,
        rest: 90
      },
      {
        exerciseId: "ex-19",
        name: "Walking Lunges",
        muscle: "Legs",
        type: "bodyweight",
        sets: 3,
        reps: 12,
        weight: 0,
        rest: 60
      },
      {
        exerciseId: "ex-21",
        name: "Hanging Leg Raises",
        muscle: "Core",
        type: "bodyweight",
        sets: 3,
        reps: 15,
        weight: 0,
        rest: 60
      }
    ]
  }
];
