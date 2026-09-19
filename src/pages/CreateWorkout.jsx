import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Dumbbell, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { MUSCLE_GROUPS } from '../data/exercises';
import ExerciseSelectorModal from '../components/workout/ExerciseSelectorModal';
import WorkoutExerciseConfig from '../components/workout/WorkoutExerciseConfig';

export default function CreateWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createWorkout, updateWorkout, getWorkoutById } = useWorkouts();

  const isEditing = Boolean(id);
  const existingWorkout = isEditing ? getWorkoutById(id) : null;

  const [name, setName] = useState(() => existingWorkout?.name || '');
  const [description, setDescription] = useState(() => existingWorkout?.description || '');
  const [targetMuscle, setTargetMuscle] = useState(
    () => existingWorkout?.targetMuscle || existingWorkout?.muscleGroup || 'Chest'
  );
  const [selectedExercises, setSelectedExercises] = useState(
    () => existingWorkout?.exercises || []
  );
  useEffect(() => {
    if (!isEditing || !existingWorkout) return;

    setName(existingWorkout.name || '');
    setDescription(existingWorkout.description || '');
    setTargetMuscle(
      existingWorkout.targetMuscle ||
      existingWorkout.muscleGroup ||
      'Chest'
    );
    setSelectedExercises(existingWorkout.exercises || []);
  }, [isEditing, existingWorkout]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Add exercise from selector modal
  const handleSelectExercise = (exercise) => {
    const isCardio = exercise.type === 'cardio' || exercise.muscle === 'Cardio';
    const isBodyweight = exercise.type === 'bodyweight';

    const newExerciseEntry = {
      exerciseId: exercise.id,
      name: exercise.name,
      muscle: exercise.muscleGroup || exercise.muscle,
      type: exercise.type || 'strength',
      equipment: exercise.equipment,
      sets: exercise.sets || 3,
      reps: parseInt(exercise.reps, 10) || 10,
      weight: isBodyweight || isCardio ? 0 : (exercise.weight !== undefined ? exercise.weight : 40),
      rest: exercise.rest || 60,
      duration: isCardio ? (exercise.duration || 30) : undefined,
      distance: isCardio ? (exercise.distance || 4.0) : undefined
    };

    setSelectedExercises((prev) => [...prev, newExerciseEntry]);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setSelectedExercises((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const handleMoveDown = (index) => {
    if (index === selectedExercises.length - 1) return;
    setSelectedExercises((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const handleRemove = (index) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeField = (index, field, value) => {
    setSelectedExercises((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveWorkout = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide a workout routine name.');
      return;
    }

    if (selectedExercises.length === 0) {
      setErrorMessage('Please add at least one exercise to your workout routine.');
      return;
    }

    const workoutPayload = {
      name: name.trim(),
      description: description.trim() || 'Custom athlete training protocol',
      targetMuscle,
      exercises: selectedExercises
    };

    if (isEditing) {
      updateWorkout(id, workoutPayload);
    } else {
      createWorkout(workoutPayload);
    }

    navigate('/workouts');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top back navigation */}
      <button
        type="button"
        onClick={() => navigate('/workouts')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Workouts</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          {isEditing ? 'Edit Protocol' : 'Workout Builder'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {isEditing ? 'Edit Custom Workout' : 'Create Custom Workout'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your exercise sequence, volume targets, weights, and rest periods.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-rose-400 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveWorkout} className="space-y-6">
        {/* Workout Metadata Card */}
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Workout Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chest & Triceps Hypertrophy, Leg Day Power"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 bg-[#0d1117] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-sm outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Focus / Muscle
              </label>
              <select
                value={targetMuscle}
                onChange={(e) => setTargetMuscle(e.target.value)}
                className="w-full h-11 bg-[#0d1117] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-sm outline-none cursor-pointer transition"
              >
                {MUSCLE_GROUPS.filter((m) => m !== 'All').map((muscle) => (
                  <option key={muscle} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. High intensity hypertrophy focus with drop sets"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 bg-[#0d1117] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-4 text-sm outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Selected Exercises ({selectedExercises.length})
              </h3>
              <p className="text-xs text-slate-400">
                Configure sets, target reps, resistance, and rest between sets.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectorOpen(true)}
              className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Exercise</span>
            </button>
          </div>

          {/* Exercise List */}
          {selectedExercises.length === 0 ? (
            <div className="text-center py-14 px-6 bg-[#161b22] border border-dashed border-slate-800 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <Dumbbell size={20} />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                No exercises added yet.
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Build your custom workout by choosing the movements you want to perform.
              </p>
              <button
                type="button"
                onClick={() => setSelectorOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Plus size={13} />
                <span>Browse Exercise Library</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedExercises.map((exercise, index) => (
                <WorkoutExerciseConfig
                  key={`${exercise.exerciseId}-${index}`}
                  exercise={exercise}
                  index={index}
                  totalCount={selectedExercises.length}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onRemove={handleRemove}
                  onChangeField={handleChangeField}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/workouts')}
            className="px-5 py-2.5 rounded-xl bg-[#161b22] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Save size={15} />
            <span>{isEditing ? 'Save Changes' : 'Save Workout'}</span>
          </button>
        </div>
      </form>

      {/* Exercise Selector Modal */}
      <ExerciseSelectorModal
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectExercise={handleSelectExercise}
        selectedExerciseIds={selectedExercises.map((e) => e.exerciseId)}
      />
    </div>
  );
}
