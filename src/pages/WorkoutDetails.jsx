import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Dumbbell, 
  ArrowLeft, 
  Play, 
  Edit3,
  Calendar
} from 'lucide-react';
import { useWorkouts } from '../hooks/useWorkouts';

export default function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkoutById } = useWorkouts();

  const workout = getWorkoutById(id);

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
  const exerciseCount = exercises.length;

  // Calculate estimated duration
  const estimatedDuration = workout.duration || Math.max(
    15,
    Math.round(
      exercises.reduce((sum, ex) => sum + (ex.sets || 3) * (1.5 + (ex.rest || 60) / 60), 5)
    )
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/workouts')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6 cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Workouts</span>
      </button>

      {/* Routine Hero Card */}
      <div className="bg-[#161b22] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60">
                {workout.targetMuscle || workout.muscleGroup || 'Full Body'}
              </span>
              {workout.createdAt && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Created {workout.createdAt}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {workout.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/workouts/edit/${workout.id}`)}
              className="h-10 px-4 rounded-xl bg-[#0d1117] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/workouts/${workout.id}/session`)}
              className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              <span>Start Workout</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed mb-6">
          {workout.description || 'Custom tailored workout protocol.'}
        </p>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-[#0d1117] p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
              Exercises
            </span>
            <span className="text-base font-bold text-white flex items-center gap-1.5">
              <Dumbbell size={15} className="text-emerald-400" />
              {exerciseCount} movements
            </span>
          </div>

          <div className="bg-[#0d1117] p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
              Estimated Duration
            </span>
            <span className="text-base font-bold text-white flex items-center gap-1.5">
              <Clock size={15} className="text-cyan-400" />
              ~{estimatedDuration} minutes
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-[#0d1117] p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-0.5">
              Focus
            </span>
            <span className="text-base font-bold text-emerald-400">
              {workout.targetMuscle || 'General'}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Exercise Sequence Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Exercise Sequence ({exerciseCount})
          </h3>
          <span className="text-xs text-slate-500">
            Click Start Workout to record actual sets
          </span>
        </div>

        <div className="space-y-3">
          {exercises.map((ex, index) => {
            const isCardio = ex.type === 'cardio' || ex.muscle === 'Cardio';
            const isBodyweight = ex.type === 'bodyweight';

            return (
              <div
                key={`${ex.exerciseId}-${index}`}
                className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-500 shrink-0">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {ex.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-emerald-400 font-semibold">{ex.muscle}</span>
                      <span className="text-slate-600">•</span>
                      {isCardio ? (
                        <span>{ex.duration || 20} min • {ex.distance || 3.0} km</span>
                      ) : (
                        <span>{ex.sets || 3} sets × {ex.reps || 10} reps {ex.weight > 0 ? `@ ${ex.weight} kg` : (isBodyweight ? '(Bodyweight)' : '')}</span>
                      )}
                      <span className="text-slate-600">•</span>
                      <span>{ex.rest || 60}s rest</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                  {ex.type || 'Strength'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Start Action */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
        <button
          type="button"
          onClick={() => navigate(`/workouts/${workout.id}/session`)}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
        >
          <Play size={16} fill="currentColor" />
          <span>Launch Workout Session</span>
        </button>
      </div>
    </div>
  );
}
