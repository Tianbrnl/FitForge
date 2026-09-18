import { useLocalStorage } from './useLocalStorage';
import { defaultCustomWorkouts } from '../data/defaultWorkouts';

export function useWorkouts() {
  const [workouts, setWorkouts] = useLocalStorage(
    'fitforge_custom_workouts',
    defaultCustomWorkouts
  );

  const createWorkout = (workoutData) => {
    const newWorkout = {
      ...workoutData,
      id: workoutData.id || `workout-${Date.now()}`,
      createdAt: workoutData.createdAt || new Date().toISOString().split('T')[0]
    };

    setWorkouts((prev) => [newWorkout, ...prev]);
    return newWorkout;
  };

  const updateWorkout = (id, updatedData) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedData, updatedAt: new Date().toISOString().split('T')[0] } : w))
    );
  };

  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const getWorkoutById = (id) => {
    return workouts.find((w) => w.id === id) || null;
  };

  const clearAllWorkouts = () => {
    setWorkouts([]);
  };

  const resetToDefaults = () => {
    setWorkouts(defaultCustomWorkouts);
  };

  return {
    workouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    clearAllWorkouts,
    resetToDefaults
  };
}
