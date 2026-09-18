// Initial demo workout history for FitForge
// Provides realistic initial logged workout sessions with set-by-set performance data.

export const defaultWorkoutHistory = [
  {
    id: "hist-1",
    workoutId: "w-chest-hypertrophy",
    workoutName: "Chest Hypertrophy Blast",
    completedAt: "2026-09-15T10:30:00.000Z",
    date: "2026-09-15",
    duration: 52,
    calories: 470,
    exercises: [
      {
        exerciseId: "ex-1",
        name: "Barbell Bench Press",
        muscle: "Chest",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 10, weight: 80 },
          { setNumber: 2, reps: 8, weight: 85 },
          { setNumber: 3, reps: 6, weight: 90 },
          { setNumber: 4, reps: 6, weight: 92.5 }
        ]
      },
      {
        exerciseId: "ex-2",
        name: "Incline Dumbbell Press",
        muscle: "Chest",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 12, weight: 28 },
          { setNumber: 2, reps: 10, weight: 32 },
          { setNumber: 3, reps: 8, weight: 34 }
        ]
      },
      {
        exerciseId: "ex-3",
        name: "Cable Chest Flyes",
        muscle: "Chest",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 15, weight: 15 },
          { setNumber: 2, reps: 12, weight: 17.5 },
          { setNumber: 3, reps: 12, weight: 17.5 }
        ]
      },
      {
        exerciseId: "ex-11",
        name: "Tricep Cable Pushdown",
        muscle: "Arms",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 15, weight: 25 },
          { setNumber: 2, reps: 12, weight: 30 },
          { setNumber: 3, reps: 10, weight: 32.5 }
        ]
      }
    ]
  },
  {
    id: "hist-2",
    workoutId: "w-back-v-taper",
    workoutName: "Back Thickness & V-Taper",
    completedAt: "2026-09-16T17:15:00.000Z",
    date: "2026-09-16",
    duration: 58,
    calories: 530,
    exercises: [
      {
        exerciseId: "ex-4",
        name: "Barbell Bent-Over Row",
        muscle: "Back",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 10, weight: 70 },
          { setNumber: 2, reps: 8, weight: 80 },
          { setNumber: 3, reps: 8, weight: 85 }
        ]
      },
      {
        exerciseId: "ex-5",
        name: "Wide-Grip Lat Pulldown",
        muscle: "Back",
        type: "weight",
        sets: [
          { setNumber: 1, reps: 12, weight: 60 },
          { setNumber: 2, reps: 10, weight: 65 },
          { setNumber: 3, reps: 8, weight: 70 }
        ]
      },
      {
        exerciseId: "ex-12",
        name: "Hanging Leg Raises",
        muscle: "Core",
        type: "bodyweight",
        sets: [
          { setNumber: 1, reps: 15, weight: 0 },
          { setNumber: 2, reps: 14, weight: 0 },
          { setNumber: 3, reps: 12, weight: 0 }
        ]
      }
    ]
  },
  {
    id: "hist-3",
    workoutId: "w-hiit-metcon",
    workoutName: "HIIT Metabolic Torch",
    completedAt: "2026-09-17T08:00:00.000Z",
    date: "2026-09-17",
    duration: 32,
    calories: 490,
    exercises: [
      {
        exerciseId: "ex-13",
        name: "HIIT Sprint Intervals",
        muscle: "Cardio",
        type: "cardio",
        duration: 30,
        distance: 4.5,
        sets: [
          { setNumber: 1, reps: 8, duration: 30, distance: 4.5 }
        ]
      },
      {
        exerciseId: "ex-12",
        name: "Hanging Leg Raises",
        muscle: "Core",
        type: "bodyweight",
        sets: [
          { setNumber: 1, reps: 16, weight: 0 },
          { setNumber: 2, reps: 15, weight: 0 }
        ]
      }
    ]
  }
];
