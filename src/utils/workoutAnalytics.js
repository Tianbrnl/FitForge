// FitForge Workout Analytics Engine
// Computes data-driven Personal Records, Active Streak, Workout Frequency, and Weekly Charts
import { exercisesData } from '../data/exercises';

export const toDateString = (dateInput) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Calculates consecutive calendar day active workout streak.
 * Rules:
 * 1. Workout must be marked completed.
 * 2. Multiple workouts on the same day count as 1 active day.
 * 3. A missed day breaks the streak.
 * 4. Future workouts are ignored.
 * 5. If no workout completed today, streak remains alive if completed yesterday.
 */
export function calculateActiveStreak(workoutHistory = []) {
  if (!workoutHistory || workoutHistory.length === 0) return 0;

  const todayStr = toDateString(new Date());

  // Extract unique valid completed dates that are <= today
  const activeDateSet = new Set();
  workoutHistory.forEach((w) => {
    if (w.completedAt || w.date) {
      const dateStr = toDateString(w.completedAt || w.date);
      if (dateStr <= todayStr) {
        activeDateSet.add(dateStr);
      }
    }
  });

  if (activeDateSet.size === 0) return 0;

  // Determine starting point
  let checkDate = new Date();
  const workedOutToday = activeDateSet.has(todayStr);

  if (!workedOutToday) {
    // Check if worked out yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = toDateString(checkDate);
    if (!activeDateSet.has(yesterdayStr)) {
      return 0; // Missed yesterday and today -> streak is 0
    }
  }

  let streak = 0;
  while (true) {
    const checkStr = toDateString(checkDate);
    if (activeDateSet.has(checkStr)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates Workout Frequency for a given period:
 * 'week' (Monday to Sunday of current week)
 * 'month' (Current calendar month)
 * '30days' (Last 30 days)
 */
export function calculateWorkoutFrequency(workoutHistory = [], period = 'week') {
  const now = new Date();
  const todayStr = toDateString(now);

  let startDate = new Date(now);
  let totalDaysInPeriod = 7;
  let periodLabel = 'This Week';

  if (period === 'week') {
    // Find Monday of current week (ISO week: Monday = 1, Sunday = 0)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    totalDaysInPeriod = 7;
    periodLabel = 'This Week';
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    totalDaysInPeriod = lastDayOfMonth;
    periodLabel = 'This Month';
  } else if (period === '30days') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    totalDaysInPeriod = 30;
    periodLabel = 'Last 30 Days';
  }

  const startDateStr = toDateString(startDate);

  // Filter workouts within period
  const workoutsInPeriod = workoutHistory.filter((w) => {
    const wDate = toDateString(w.completedAt || w.date);
    return wDate >= startDateStr && wDate <= todayStr;
  });

  const activeDaysSet = new Set();
  let totalCaloriesBurned = 0;
  let totalMinutes = 0;

  workoutsInPeriod.forEach((w) => {
    const wDate = toDateString(w.completedAt || w.date);
    activeDaysSet.add(wDate);
    totalCaloriesBurned += Number(w.calories) || 0;
    totalMinutes += Number(w.duration) || 0;
  });

  const activeWorkoutDays = activeDaysSet.size;
  const totalWorkouts = workoutsInPeriod.length;
  const frequencyPercentage = Math.min(100, Math.round((activeWorkoutDays / totalDaysInPeriod) * 100));

  return {
    activeWorkoutDays,
    totalWorkouts,
    totalDaysInPeriod,
    frequencyPercentage,
    periodLabel,
    totalCaloriesBurned,
    totalMinutes
  };
}

/**
 * Calculates genuine, data-driven Personal Records from actual workout logs.
 * Returns an empty array if no PRs are recorded.
 */
export function calculatePersonalRecords(workoutHistory = []) {
  if (!workoutHistory || workoutHistory.length === 0) return [];

  // Group performance records by exercise name
  const exerciseRecords = {};

  workoutHistory.forEach((workout) => {
    const workoutDate = workout.completedAt || workout.date;
    if (!workout.exercises || !Array.isArray(workout.exercises)) return;

    workout.exercises.forEach((ex) => {
      let name = ex.name?.trim();
      let muscle = ex.muscle;
      let type = ex.type;

      // If name is missing or is an ID like "ex-1", resolve it from the exercise library
      const matchedExercise = exercisesData.find(
        (e) => e.id === ex.exerciseId || e.id === name || e.name.toLowerCase() === name?.toLowerCase()
      );

      if (matchedExercise) {
        // If name is missing or is an ID format (e.g., "ex-1"), use the official name
        if (!name || name.match(/^ex-\d+$/i) || name.startsWith('ex-')) {
          name = matchedExercise.name;
        }
        if (!muscle || muscle === 'Full Body') {
          muscle = matchedExercise.muscle || matchedExercise.muscleGroup;
        }
        if (!type) {
          type = matchedExercise.type;
        }
      }

      if (!name) return;

      if (!exerciseRecords[name]) {
        exerciseRecords[name] = {
          exerciseName: name,
          muscle: muscle || 'Full Body',
          type: type || 'weight',
          bestWeight: 0,
          bestWeightReps: 0,
          bestWeightDate: null,
          bestReps: 0,
          bestRepsDate: null,
          bestCardioDuration: 0,
          bestCardioDistance: 0,
          bestCardioDate: null
        };
      }

      const rec = exerciseRecords[name];

      // Check cardio duration & distance
      if (ex.type === 'cardio' || ex.duration || ex.distance) {
        const duration = Number(ex.duration) || 0;
        const distance = Number(ex.distance) || 0;
        if (duration > rec.bestCardioDuration || (duration === rec.bestCardioDuration && distance > rec.bestCardioDistance)) {
          rec.bestCardioDuration = duration;
          rec.bestCardioDistance = distance;
          rec.bestCardioDate = workoutDate;
          rec.type = 'cardio';
        }
      }

      // Check sets
      if (ex.sets && Array.isArray(ex.sets)) {
        ex.sets.forEach((set) => {
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;
          const duration = Number(set.duration) || 0;
          const distance = Number(set.distance) || 0;

          if (duration > 0 || distance > 0) {
            if (duration > rec.bestCardioDuration || distance > rec.bestCardioDistance) {
              rec.bestCardioDuration = duration || rec.bestCardioDuration;
              rec.bestCardioDistance = distance || rec.bestCardioDistance;
              rec.bestCardioDate = workoutDate;
              rec.type = 'cardio';
            }
          }

          if (weight > 0) {
            rec.type = 'weight';
            if (weight > rec.bestWeight) {
              rec.bestWeight = weight;
              rec.bestWeightReps = reps;
              rec.bestWeightDate = workoutDate;
            } else if (weight === rec.bestWeight && reps > rec.bestWeightReps) {
              rec.bestWeightReps = reps;
              rec.bestWeightDate = workoutDate;
            }
          } else if (reps > 0) {
            if (reps > rec.bestReps) {
              rec.bestReps = reps;
              rec.bestRepsDate = workoutDate;
            }
          }
        });
      }
    });
  });

  const prList = [];

  Object.values(exerciseRecords).forEach((rec) => {
    if (rec.bestWeight > 0) {
      prList.push({
        id: `pr-${rec.exerciseName.toLowerCase().replace(/\s+/g, '-')}`,
        exercise: rec.exerciseName,
        muscle: rec.muscle,
        category: 'weight',
        value: `${rec.bestWeight} kg`,
        detail: rec.bestWeightReps > 0 ? `${rec.bestWeightReps} reps` : 'Max Load',
        date: formatDisplayDate(rec.bestWeightDate)
      });
    } else if (rec.type === 'cardio' && (rec.bestCardioDuration > 0 || rec.bestCardioDistance > 0)) {
      prList.push({
        id: `pr-${rec.exerciseName.toLowerCase().replace(/\s+/g, '-')}`,
        exercise: rec.exerciseName,
        muscle: rec.muscle,
        category: 'cardio',
        value: rec.bestCardioDuration > 0 ? `${rec.bestCardioDuration} min` : `${rec.bestCardioDistance} km`,
        detail: rec.bestCardioDistance > 0 ? `${rec.bestCardioDistance} km distance` : 'Endurance Peak',
        date: formatDisplayDate(rec.bestCardioDate)
      });
    } else if (rec.bestReps > 0) {
      prList.push({
        id: `pr-${rec.exerciseName.toLowerCase().replace(/\s+/g, '-')}`,
        exercise: rec.exerciseName,
        muscle: rec.muscle,
        category: 'bodyweight',
        value: `${rec.bestReps} reps`,
        detail: 'Bodyweight PR',
        date: formatDisplayDate(rec.bestRepsDate)
      });
    }
  });

  return prList;
}

/**
 * Builds real Monday through Sunday activity chart data for the current week.
 */
export function generateWeeklyActivity(workoutHistory = []) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const now = new Date();
  const todayStr = toDateString(now);

  // Find Monday of current week
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);

  return dayNames.map((dayName, idx) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + idx);
    const dayDateStr = toDateString(dayDate);

    const workoutsOnDay = workoutHistory.filter((w) => {
      const wDate = toDateString(w.completedAt || w.date);
      return wDate === dayDateStr;
    });

    const completed = workoutsOnDay.length > 0;
    const isToday = dayDateStr === todayStr;

    let minutes = 0;
    let calories = 0;

    workoutsOnDay.forEach((w) => {
      minutes += Number(w.duration) || 0;
      calories += Number(w.calories) || 0;
    });

    return {
      day: dayName,
      date: dayDateStr,
      minutes,
      calories,
      completed,
      isToday,
      workoutCount: workoutsOnDay.length
    };
  });
}
