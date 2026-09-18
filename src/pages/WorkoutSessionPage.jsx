import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trophy, 
  Flame, 
  ArrowLeft
} from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { calculatePersonalRecords } from '../utils/workoutAnalytics';

export default function WorkoutSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getWorkoutById } = useWorkouts();
  const { history, saveSession } = useWorkoutHistory();

  const workout = getWorkoutById(id);

  // Active session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [performanceState, setPerformanceState] = useState(() => {
    if (!workout || !workout.exercises) return {};
    const initialMap = {};
    workout.exercises.forEach((ex, idx) => {
      const isCardio = ex.type === 'cardio' || ex.muscle === 'Cardio';
      const isBodyweight = ex.type === 'bodyweight';

      if (isCardio) {
        initialMap[idx] = {
          type: 'cardio',
          duration: ex.duration || 20,
          distance: ex.distance || 3.0,
          completed: false
        };
      } else {
        initialMap[idx] = {
          type: isBodyweight ? 'bodyweight' : 'weight',
          sets: Array.from({ length: ex.sets || 3 }, (_, sIdx) => ({
            setNumber: sIdx + 1,
            targetReps: ex.reps || 10,
            targetWeight: ex.weight !== undefined ? ex.weight : (isBodyweight ? 0 : 40),
            reps: ex.reps || 10,
            weight: ex.weight !== undefined ? ex.weight : (isBodyweight ? 0 : 40),
            completed: false
          }))
        };
      }
    });
    return initialMap;
  });
  const [restTimerSeconds, setRestTimerSeconds] = useState(null);
  const [isRestActive, setIsRestActive] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [newPRs, setNewPRs] = useState([]);

  // Stopwatch timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest countdown timer
  useEffect(() => {
    let restInterval;
    if (isRestActive && restTimerSeconds !== null && restTimerSeconds > 0) {
      restInterval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isRestActive, restTimerSeconds]);

  if (!workout) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Workout Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          This workout routine may have been deleted or the link is invalid.
        </p>
        <button
          type="button"
          onClick={() => navigate('/workouts')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
        >
          Return to Workouts
        </button>
      </div>
    );
  }

  const exercises = workout.exercises || [];
  const currentExercise = exercises[currentExerciseIndex] || {};
  const currentPerf = performanceState[currentExerciseIndex] || {};
  const isCardio = currentExercise.type === 'cardio' || currentExercise.muscle === 'Cardio';
  const isBodyweight = currentExercise.type === 'bodyweight';

  // Format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  const handleSetChange = (setIdx, field, val) => {
    setPerformanceState((prev) => {
      const exState = prev[currentExerciseIndex] || {};
      const sets = [...(exState.sets || [])];
      sets[setIdx] = { ...sets[setIdx], [field]: val };
      return {
        ...prev,
        [currentExerciseIndex]: { ...exState, sets }
      };
    });
  };

  const handleToggleSetComplete = (setIdx) => {
    setPerformanceState((prev) => {
      const exState = prev[currentExerciseIndex] || {};
      const sets = [...(exState.sets || [])];
      const willBeCompleted = !sets[setIdx].completed;
      sets[setIdx] = { ...sets[setIdx], completed: willBeCompleted };

      // Trigger rest timer if set was checked complete
      if (willBeCompleted && currentExercise.rest > 0) {
        setRestTimerSeconds(currentExercise.rest);
        setIsRestActive(true);
      }

      return {
        ...prev,
        [currentExerciseIndex]: { ...exState, sets }
      };
    });
  };

  const handleAddSet = () => {
    setPerformanceState((prev) => {
      const exState = prev[currentExerciseIndex] || {};
      const sets = exState.sets || [];
      const lastSet = sets[sets.length - 1];
      const newSet = {
        setNumber: sets.length + 1,
        targetReps: currentExercise.reps || 10,
        targetWeight: currentExercise.weight || 0,
        reps: lastSet ? lastSet.reps : (currentExercise.reps || 10),
        weight: lastSet ? lastSet.weight : (currentExercise.weight || 0),
        completed: false
      };
      return {
        ...prev,
        [currentExerciseIndex]: { ...exState, sets: [...sets, newSet] }
      };
    });
  };

  const handleCardioChange = (field, val) => {
    setPerformanceState((prev) => ({
      ...prev,
      [currentExerciseIndex]: {
        ...prev[currentExerciseIndex],
        [field]: val
      }
    }));
  };

  const handleToggleCardioComplete = () => {
    setPerformanceState((prev) => ({
      ...prev,
      [currentExerciseIndex]: {
        ...prev[currentExerciseIndex],
        completed: !prev[currentExerciseIndex]?.completed
      }
    }));
  };

  // Completion calculation
  const totalCompletedSets = Object.values(performanceState).reduce((total, exState) => {
    if (exState.type === 'cardio') return total + (exState.completed ? 1 : 0);
    return total + (exState.sets ? exState.sets.filter((s) => s.completed).length : 0);
  }, 0);

  const handleFinishWorkout = () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    
    // Construct session exercises payload
    const sessionExercises = exercises.map((ex, idx) => {
      const p = performanceState[idx] || {};
      if (ex.type === 'cardio') {
        return {
          exerciseId: ex.exerciseId,
          name: ex.name,
          muscle: ex.muscle || 'Cardio',
          type: 'cardio',
          duration: p.duration || ex.duration || 20,
          distance: p.distance || ex.distance || 3.0,
          completed: Boolean(p.completed)
        };
      }
      return {
        exerciseId: ex.exerciseId,
        name: ex.name,
        muscle: ex.muscle || 'Full Body',
        type: ex.type || 'strength',
        sets: (p.sets || []).map((s) => ({
          setNumber: s.setNumber,
          targetReps: s.targetReps,
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
          completed: Boolean(s.completed)
        }))
      };
    });

    // Approximate calories burned (~8 kcal/min for active lifting)
    const estimatedCalories = Math.round(durationMinutes * 8.5);

    const newSession = {
      workoutId: workout.id,
      workoutName: workout.name,
      completedAt: new Date().toISOString().split('T')[0],
      duration: durationMinutes,
      calories: estimatedCalories,
      exercises: sessionExercises
    };

    // Calculate PRs before and after to check newly achieved PRs
    const oldPRs = calculatePersonalRecords(history);
    const updatedPRs = calculatePersonalRecords([newSession, ...history]);

    const achieved = [];
    updatedPRs.forEach((uPr) => {
      const old = oldPRs.find((o) => o.exerciseName === uPr.exerciseName);
      if (!old) {
        achieved.push(uPr);
      } else if (uPr.bestWeight > old.bestWeight || uPr.bestReps > old.bestReps) {
        achieved.push(uPr);
      }
    });

    setNewPRs(achieved);
    saveSession(newSession);
    setCompleteModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Header: Routine title & Live Stopwatch */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Quit active workout session? Unsaved progress will be lost.')) {
              navigate('/workouts');
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Exit Workout</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Live Stopwatch Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161b22] border border-slate-800 text-xs font-mono font-bold text-emerald-400 shadow-sm">
            <Clock size={14} className="animate-pulse" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={handleFinishWorkout}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Routine Title and Progress Tracker */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Active Routine
          </span>
          <span className="text-xs font-mono font-semibold text-slate-400">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3">
          {workout.name}
        </h1>

        {/* Exercise Progress Pips */}
        <div className="flex gap-1.5">
          {exercises.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentExerciseIndex(i)}
              className={`
                h-2 flex-1 rounded-full transition-all cursor-pointer
                ${i === currentExerciseIndex
                  ? 'bg-emerald-500 ring-2 ring-emerald-500/40'
                  : i < currentExerciseIndex
                  ? 'bg-emerald-500/40'
                  : 'bg-slate-800'
                }
              `}
              title={`Jump to exercise ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Rest Timer Float / Notification */}
      {isRestActive && restTimerSeconds !== null && (
        <div className="mb-6 p-3.5 rounded-2xl bg-[#161b22] border border-emerald-500/30 flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Timer size={16} className="animate-spin" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Rest Period Active
              </span>
              <span className="text-xs text-slate-400">Take a breath and hydrate.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-black font-mono text-emerald-400">
              {formatTime(restTimerSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setIsRestActive(false)}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Active Exercise Card */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl overflow-hidden mb-6 shadow-sm">
        {/* Exercise Header */}
        <div className="p-5 border-b border-slate-800 bg-[#161b22]">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-bold text-slate-500">
                #{String(currentExerciseIndex + 1).padStart(2, '0')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {currentExercise.name}
              </h2>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60 shrink-0">
              {currentExercise.muscle}
            </span>
          </div>

          {/* Target prescribed row */}
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500">Prescribed Target:</span>
            {isCardio ? (
              <strong className="text-white font-semibold">
                {currentExercise.duration || 20} min • {currentExercise.distance || 3.0} km
              </strong>
            ) : (
              <strong className="text-white font-semibold">
                {currentExercise.sets || 3} sets × {currentExercise.reps || 10} reps {currentExercise.weight ? `@ ${currentExercise.weight} kg` : ''}
              </strong>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">{currentExercise.rest || 60}s rest</span>
          </div>
        </div>

        {/* Exercise Actual Performance Recording */}
        <div className="p-4 sm:p-5 bg-[#0d1117]">
          {isCardio ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Actual Duration (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentPerf.duration !== undefined ? currentPerf.duration : 20}
                    onChange={(e) => handleCardioChange('duration', parseInt(e.target.value, 10) || 0)}
                    className="w-full h-11 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-xl text-center text-sm outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Actual Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={currentPerf.distance !== undefined ? currentPerf.distance : 3.0}
                    onChange={(e) => handleCardioChange('distance', parseFloat(e.target.value) || 0)}
                    className="w-full h-11 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-xl text-center text-sm outline-none transition"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleCardioComplete}
                className={`
                  w-full h-12 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98
                  ${currentPerf.completed
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white'
                  }
                `}
              >
                <CheckCircle2 size={16} />
                <span>{currentPerf.completed ? 'Cardio Segment Completed ✓' : 'Mark Cardio Segment Completed'}</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-12 text-[10px] font-semibold tracking-wider text-slate-500 uppercase pb-2 px-2 border-b border-slate-800/80">
                <span className="col-span-2 text-center">Set</span>
                <span className="col-span-4 text-center">Reps</span>
                <span className="col-span-4 text-center">{isBodyweight ? 'Weight (opt)' : 'Weight (kg)'}</span>
                <span className="col-span-2 text-center">Status</span>
              </div>

              {/* Set rows */}
              <div className="divide-y divide-slate-800/60">
                {(currentPerf.sets || []).map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className={`grid grid-cols-12 items-center py-2.5 px-2 transition ${
                      set.completed ? 'bg-emerald-500/[0.04]' : ''
                    }`}
                  >
                    <span className="col-span-2 text-center font-mono text-xs font-semibold text-slate-400">
                      #{set.setNumber}
                    </span>

                    <div className="col-span-4 px-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="10"
                        value={set.reps !== undefined ? set.reps : ''}
                        onChange={(e) => handleSetChange(sIdx, 'reps', parseInt(e.target.value, 10) || '')}
                        className="w-full h-11 sm:h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm font-medium outline-none transition"
                      />
                    </div>

                    <div className="col-span-4 px-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder={isBodyweight ? '0' : '40'}
                        value={set.weight !== undefined && set.weight !== '' ? set.weight : ''}
                        onChange={(e) => handleSetChange(sIdx, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-full h-11 sm:h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm font-medium outline-none transition"
                      />
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSetComplete(sIdx)}
                        className={`
                          w-11 h-11 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition cursor-pointer active:scale-95
                          ${set.completed
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                            : 'bg-[#161b22] border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white'
                          }
                        `}
                        title={set.completed ? 'Mark incomplete' : 'Complete set'}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <div className="pt-3 flex justify-start">
                <button
                  type="button"
                  onClick={handleAddSet}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 py-1.5 px-3 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Set</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons: [Previous] [Next] */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentExerciseIndex === 0}
          onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
          className="h-11 px-5 rounded-xl bg-[#161b22] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {totalCompletedSets} sets logged
        </span>

        {currentExerciseIndex < exercises.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentExerciseIndex((prev) => Math.min(exercises.length - 1, prev + 1))}
            className="h-11 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <span>Next Move</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinishWorkout}
            className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <span>Finish Session</span>
            <CheckCircle2 size={16} />
          </button>
        )}
      </div>

      {/* Workout Complete Celebration Modal */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#161b22] border border-slate-800 rounded-3xl p-6 sm:p-7 text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 inline-flex items-center justify-center mb-4">
              <Trophy size={32} />
            </div>

            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">
              Workout Complete! 🎉
            </h3>
            <p className="text-sm font-semibold text-emerald-400 mb-6">
              {workout.name}
            </p>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-3 gap-2 bg-[#0d1117] border border-slate-800 p-4 rounded-2xl mb-6 text-center">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Duration
                </span>
                <span className="text-lg font-black text-white">
                  {Math.max(1, Math.round(elapsedSeconds / 60))}m
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Exercises
                </span>
                <span className="text-lg font-black text-white">
                  {exercises.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                  Sets Done
                </span>
                <span className="text-lg font-black text-emerald-400">
                  {totalCompletedSets}
                </span>
              </div>
            </div>

            {/* New PRs Section */}
            {newPRs.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-2xl mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    New Personal Records Unlocked!
                  </span>
                </div>
                <div className="space-y-1.5">
                  {newPRs.map((pr, i) => (
                    <div key={i} className="text-xs text-slate-300 flex justify-between">
                      <span className="font-semibold">{pr.exerciseName}:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {pr.bestWeight > 0 ? `${pr.bestWeight} kg` : `${pr.bestReps} reps`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/progress')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              View in Progress & Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
