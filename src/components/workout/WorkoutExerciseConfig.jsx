import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

export default function WorkoutExerciseConfig({
  exercise,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onRemove,
  onChangeField
}) {
  const isCardio = exercise.type === 'cardio' || exercise.muscle === 'Cardio';
  const isBodyweight = exercise.type === 'bodyweight';

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-xl p-3.5 sm:p-4 transition hover:border-slate-700 space-y-3">
      {/* Header row: Index, Title, Muscle Pill, and Action Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-mono text-xs font-bold text-slate-500 shrink-0">
            #{String(index + 1).padStart(2, '0')}
          </span>
          <h4 className="text-sm font-bold text-white truncate">
            {exercise.name}
          </h4>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60 shrink-0">
            {exercise.muscle || exercise.muscleGroup}
          </span>
          {isBodyweight && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              Bodyweight
            </span>
          )}
          {isCardio && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              Cardio
            </span>
          )}
        </div>

        {/* Reorder and Delete Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move exercise up"
            aria-label="Move up"
          >
            <ArrowUp size={15} />
          </button>

          <button
            type="button"
            disabled={index === totalCount - 1}
            onClick={() => onMoveDown(index)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move exercise down"
            aria-label="Move down"
          >
            <ArrowDown size={15} />
          </button>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition ml-1 cursor-pointer"
            title="Remove exercise from routine"
            aria-label="Remove exercise"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="bg-[#0d1117] border border-slate-800/80 rounded-lg p-3">
        {isCardio ? (
          /* Cardio Specific Configuration */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                min="1"
                placeholder="30"
                value={exercise.duration !== undefined ? exercise.duration : 30}
                onChange={(e) => onChangeField(index, 'duration', parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2.5 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="4.0"
                value={exercise.distance !== undefined ? exercise.distance : 4.0}
                onChange={(e) => onChangeField(index, 'distance', parseFloat(e.target.value) || 0)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2.5 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Rest (sec)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                placeholder="0"
                value={exercise.rest !== undefined ? exercise.rest : 0}
                onChange={(e) => onChangeField(index, 'rest', parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2.5 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>
          </div>
        ) : (
          /* Strength / Bodyweight Configuration */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Sets
              </label>
              <input
                type="number"
                min="1"
                max="12"
                placeholder="3"
                value={exercise.sets !== undefined ? exercise.sets : 3}
                onChange={(e) => onChangeField(index, 'sets', parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Target Reps
              </label>
              <input
                type="number"
                min="1"
                placeholder="10"
                value={exercise.reps !== undefined ? exercise.reps : 10}
                onChange={(e) => onChangeField(index, 'reps', parseInt(e.target.value, 10) || 1)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                {isBodyweight ? 'Weight (opt)' : 'Weight (kg)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder={isBodyweight ? '0' : '40'}
                value={exercise.weight !== undefined && exercise.weight !== '' ? exercise.weight : (isBodyweight ? 0 : '')}
                onChange={(e) => onChangeField(index, 'weight', parseFloat(e.target.value) || 0)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Rest (sec)
              </label>
              <input
                type="number"
                min="0"
                step="15"
                placeholder="60"
                value={exercise.rest !== undefined ? exercise.rest : 60}
                onChange={(e) => onChangeField(index, 'rest', parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg px-2 text-center text-xs sm:text-sm outline-none transition"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
