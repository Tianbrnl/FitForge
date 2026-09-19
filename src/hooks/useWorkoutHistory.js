import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { defaultWorkoutHistory } from '../data/defaultHistory';
import { exercisesData } from '../data/exercises';

export function useWorkoutHistory() {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load workout history from Supabase
  const loadHistory = async () => {
    if (!user?.id) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get the user's workout history
      const { data: historyData, error: historyError } = await supabase
        .from('workout_history')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (historyError) {
        console.error('Error loading workout history:', historyError);
        setHistory([]);
        return;
      }

      // Get the user's workouts so we can display workout names
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('id, name')
        .eq('user_id', user.id);

      if (workoutsError) {
        console.error('Error loading workouts:', workoutsError);
      }

      const workoutMap = {};

      (workoutsData || []).forEach((workout) => {
        workoutMap[workout.id] = workout.name;
      });

      // Convert Supabase records into the format
      // your existing Progress analytics expect
      const formattedHistory = (historyData || []).map((session) => {
        const durationSeconds = session.duration_seconds || 0;
        const durationMinutes = Math.max(
          1,
          Math.round(durationSeconds / 60)
        );

        return {
          id: session.id,
          workoutId: session.workout_id,
          workoutName:
            workoutMap[session.workout_id] ||
            `Workout ${session.workout_id}`,
          completedAt: session.completed_at,
          duration: durationMinutes,
          durationSeconds,

          // Same calorie estimation used when completing a workout
          calories: Math.round(durationMinutes * 8.5),

          // Clean up and resolve exercise names from exercise library if needed
          exercises: (session.performance_data || []).map((ex) => {
            let name = ex.name?.trim();
            let muscle = ex.muscle;
            let type = ex.type;

            const matched = exercisesData.find(
              (e) => e.id === ex.exerciseId || e.id === name || e.name.toLowerCase() === name?.toLowerCase()
            );

            if (matched) {
              if (!name || name.match(/^ex-\d+$/i) || name.startsWith('ex-')) {
                name = matched.name;
              }
              if (!muscle || muscle === 'Full Body') {
                muscle = matched.muscle || matched.muscleGroup;
              }
              if (!type) {
                type = matched.type;
              }
            }

            return {
              ...ex,
              name: name || ex.name || ex.exerciseId,
              muscle: muscle || ex.muscle || 'Full Body',
              type: type || ex.type || 'strength'
            };
          })
        };
      });

      setHistory(formattedHistory);
    } catch (err) {
      console.error('Unexpected error loading workout history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  // Save a completed workout to Supabase
  const saveSession = async (sessionData) => {
    if (!user?.id) {
      console.error('Cannot save workout history: no authenticated user.');
      return null;
    }

    const resolvedExercises = (sessionData.exercises || []).map((ex) => {
      let name = ex.name?.trim();
      let muscle = ex.muscle;
      let type = ex.type;

      const matched = exercisesData.find(
        (e) => e.id === ex.exerciseId || e.id === name || e.name.toLowerCase() === name?.toLowerCase()
      );

      if (matched) {
        if (!name || name.match(/^ex-\d+$/i) || name.startsWith('ex-')) {
          name = matched.name;
        }
        if (!muscle || muscle === 'Full Body') {
          muscle = matched.muscle || matched.muscleGroup;
        }
        if (!type) {
          type = matched.type;
        }
      }

      return {
        ...ex,
        name: name || ex.name || ex.exerciseId,
        muscle: muscle || ex.muscle || 'Full Body',
        type: type || ex.type || 'strength'
      };
    });

    const newSession = {
      ...sessionData,
      id: sessionData.id || `session-${Date.now()}`,
      completedAt:
        sessionData.completedAt ||
        new Date().toISOString(),
      exercises: resolvedExercises
    };

    const { data, error } = await supabase
      .from('workout_history')
      .insert({
        user_id: user.id,
        workout_id: sessionData.workoutId,
        completed_at: newSession.completedAt,
        duration_seconds: Math.round(
          (sessionData.duration || 0) * 60
        ),
        performance_data: resolvedExercises,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving workout history:', error);
      return null;
    }

    // Keep the UI immediately updated
    const durationSeconds = data.duration_seconds || 0;
    const durationMinutes = Math.max(
      1,
      Math.round(durationSeconds / 60)
    );

    const savedSession = {
      id: data.id,
      workoutId: data.workout_id,
      workoutName: sessionData.workoutName || 'Workout',
      completedAt: data.completed_at,
      duration: durationMinutes,
      durationSeconds,

      // Keep calories compatible with the existing Progress page
      calories: Math.round(durationMinutes * 8.5),

      exercises: resolvedExercises
    };

    setHistory((prev) => [savedSession, ...prev]);

    return savedSession;
  };

  // Delete one workout session
  const deleteSession = async (id) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('workout_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting workout session:', error);
      return;
    }

    setHistory((prev) => prev.filter((session) => session.id !== id));
  };

  // Delete all workout history for the current user
  const clearHistory = async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('workout_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing workout history:', error);
      return;
    }

    setHistory([]);
  };

  // Keep this function for compatibility with existing code.
  // Demo data is loaded only into the current page state.
  const loadDemoHistory = () => {
    setHistory(defaultWorkoutHistory);
  };

  const getSessionById = (id) => {
    return history.find((session) => session.id === id) || null;
  };

  return {
    history,
    loading,
    saveSession,
    deleteSession,
    clearHistory,
    loadDemoHistory,
    getSessionById,
    reloadHistory: loadHistory,
  };
}