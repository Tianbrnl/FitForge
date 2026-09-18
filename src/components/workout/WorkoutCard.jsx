import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Edit3, Trash2, Clock, Dumbbell } from 'lucide-react';

export default function WorkoutCard({ workout, onDelete }) {
  const navigate = useNavigate();

  // Calculate stats from exercises array or fallbacks
  const exercisesList = workout.exercises || [];
  const exerciseCount = exercisesList.length || workout.exerciseCount || 0;
  
  // Estimate duration: ~3 minutes per set including rest + warm-up
  const estimatedDuration = workout.duration || Math.max(
    15,
    Math.round(
      exercisesList.reduce((sum, ex) => sum + (ex.sets || 3) * (1.5 + (ex.rest || 60) / 60), 5)
    )
  );

  const muscleTag = workout.targetMuscle || workout.muscleGroup || 'Full Body';

  return (
    <div className="bg-[#161b22] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm group">
      <div>
        {/* Header: Title and Target Muscle Pill */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-emerald-400 transition">
            {workout.name}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60 shrink-0">
            {muscleTag}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {workout.description || 'Custom tailored workout protocol.'}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 py-2.5 px-3 bg-[#0d1117] rounded-xl border border-slate-800/80 text-xs text-slate-300 mb-5">
          <div className="flex items-center gap-1.5">
            <Dumbbell size={13} className="text-emerald-400" />
            <span className="font-semibold text-white">{exerciseCount}</span>
            <span className="text-slate-400">exercises</span>
          </div>

          <span className="text-slate-600">•</span>

          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-cyan-400" />
            <span className="font-semibold text-white">{estimatedDuration} min</span>
            <span className="text-slate-400">est.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: [ Start ] [ Edit ] [ Delete ] */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => navigate(`/workouts/${workout.id}/session`)}
          className="flex-1 h-9 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer"
        >
          <Play size={13} fill="currentColor" />
          <span>Start Workout</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/workouts/edit/${workout.id}`)}
          className="h-9 px-3 rounded-xl bg-[#0d1117] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          title="Edit routine"
          aria-label="Edit routine"
        >
          <Edit3 size={13} />
          <span className="hidden sm:inline">Edit</span>
        </button>

        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${workout.name}"? This action cannot be undone.`)) {
                onDelete(workout.id);
              }
            }}
            className="h-9 w-9 rounded-xl bg-[#0d1117] hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 flex items-center justify-center transition cursor-pointer"
            title="Delete routine"
            aria-label="Delete routine"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
