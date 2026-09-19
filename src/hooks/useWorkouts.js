import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD USER'S WORKOUTS
  // =========================================
  const loadWorkouts = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Unable to get current user:', userError);
      setWorkouts([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('workouts')
      .select(`
        id,
        user_id,
        name,
        target_focus,
        description,
        created_at,
        updated_at,
        workout_exercises (
          id,
          exercise_id,
          sets,
          reps,
          weight,
          rest_seconds,
          order_index,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading workouts:', error);
      setWorkouts([]);
      setLoading(false);
      return;
    }

    const formattedWorkouts = (data || []).map((workout) => ({
      id: workout.id,
      name: workout.name,
      description: workout.description || '',
      targetMuscle: workout.target_focus || 'Chest',
      muscleGroup: workout.target_focus || 'Chest',

      exercises: (workout.workout_exercises || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((exercise) => ({
          exerciseId: exercise.exercise_id,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight ?? 0,
          rest: exercise.rest_seconds ?? 60
        })),

      createdAt: workout.created_at,
      updatedAt: workout.updated_at
    }));

    setWorkouts(formattedWorkouts);
    setLoading(false);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  // =========================================
  // CREATE WORKOUT
  // =========================================
  const createWorkout = async (workoutData) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to create a workout.');
    }

    // Create workout
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        name: workoutData.name,
        target_focus: workoutData.targetMuscle || workoutData.muscleGroup || null,
        description: workoutData.description || null
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Error creating workout:', workoutError);
      throw workoutError;
    }

    // Create exercises belonging to workout
    if (workoutData.exercises?.length > 0) {
      const exerciseRows = workoutData.exercises.map((exercise, index) => ({
        workout_id: workout.id,
        exercise_id: String(exercise.exerciseId),
        sets: Number(exercise.sets) || 3,
        reps: Number(exercise.reps) || 10,
        weight: Number(exercise.weight) || 0,
        rest_seconds: Number(exercise.rest) || 60,
        order_index: index
      }));

      const { error: exerciseError } = await supabase
        .from('workout_exercises')
        .insert(exerciseRows);

      if (exerciseError) {
        console.error('Error creating workout exercises:', exerciseError);

        // Remove workout if exercises failed
        await supabase
          .from('workouts')
          .delete()
          .eq('id', workout.id);

        throw exerciseError;
      }
    }

    await loadWorkouts();

    return workout;
  };

  // =========================================
  // UPDATE WORKOUT
  // =========================================
  const updateWorkout = async (id, updatedData) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to update a workout.');
    }

    // Update workout information
    const { error: workoutError } = await supabase
      .from('workouts')
      .update({
        name: updatedData.name,
        target_focus:
          updatedData.targetMuscle ||
          updatedData.muscleGroup ||
          null,
        description: updatedData.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (workoutError) {
      console.error('Error updating workout:', workoutError);
      throw workoutError;
    }

    // Remove existing exercises
    const { error: deleteError } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', id);

    if (deleteError) {
      console.error('Error removing old exercises:', deleteError);
      throw deleteError;
    }

    // Insert updated exercises
    if (updatedData.exercises?.length > 0) {
      const exerciseRows = updatedData.exercises.map((exercise, index) => ({
        workout_id: id,
        exercise_id: String(exercise.exerciseId),
        sets: Number(exercise.sets) || 3,
        reps: Number(exercise.reps) || 10,
        weight: Number(exercise.weight) || 0,
        rest_seconds: Number(exercise.rest) || 60,
        order_index: index
      }));

      const { error: insertError } = await supabase
        .from('workout_exercises')
        .insert(exerciseRows);

      if (insertError) {
        console.error('Error adding updated exercises:', insertError);
        throw insertError;
      }
    }

    await loadWorkouts();
  };

  // =========================================
  // DELETE WORKOUT
  // =========================================
  const deleteWorkout = async (id) => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in to delete a workout.');
    }

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }

    await loadWorkouts();
  };

  // =========================================
  // GET WORKOUT BY ID
  // =========================================
  const getWorkoutById = (id) => {
    return workouts.find((workout) => workout.id === id) || null;
  };

  // =========================================
  // CLEAR ALL USER WORKOUTS
  // =========================================
  const clearAllWorkouts = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('You must be logged in.');
    }

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing workouts:', error);
      throw error;
    }

    setWorkouts([]);
  };

  return {
    workouts,
    loading,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    clearAllWorkouts,
    loadWorkouts
  };
}