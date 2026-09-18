import React, { useState, useRef } from 'react';
import { 
  Check, 
  Info, 
  Plus, 
  Trash2, 
  X, 
  Lightbulb, 
  Dumbbell,
  Timer
} from 'lucide-react';

export default function ExerciseCard({
  exercise,
  index,
  isCompleted = false,
  onToggleComplete,
  performanceData,
  onUpdatePerformance
}) {
  const [infoOpen, setInfoOpen] = useState(false);

  const isCardio = exercise.muscle === 'Cardio' || exercise.name?.toLowerCase().includes('sprint');
  const isBodyweight = !isCardio && (
    exercise.muscle === 'Core' ||
    exercise.equipment?.toLowerCase().includes('bodyweight') ||
    exercise.equipment?.toLowerCase().includes('pull-up bar')
  );

  // Parse default reps number (e.g. "8-10" -> 10)
  const defaultReps = parseInt(exercise.reps, 10) || 10;
  const targetSetsCount = exercise.sets || 3;

  // Initialize or fallback to sets
  const sets = performanceData?.sets || Array.from({ length: targetSetsCount }, (_, i) => ({
    setNumber: i + 1,
    reps: defaultReps,
    weight: isBodyweight || isCardio ? 0 : '',
    completed: false
  }));

  const cardioDuration = performanceData?.duration !== undefined ? performanceData.duration : (isCardio ? 20 : '');
  const cardioDistance = performanceData?.distance !== undefined ? performanceData.distance : (isCardio ? 3.0 : '');

  const handleSetChange = (setIdx, field, val) => {
    const newSets = sets.map((s, idx) => {
      if (idx === setIdx) {
        return { ...s, [field]: val };
      }
      return s;
    });

    onUpdatePerformance?.({
      ...performanceData,
      type: isCardio ? 'cardio' : isBodyweight ? 'bodyweight' : 'weight',
      sets: newSets
    });
  };

  const handleToggleSetComplete = (setIdx) => {
    const newSets = sets.map((s, idx) => {
      if (idx === setIdx) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const allDone = newSets.every(s => s.completed);
    if (allDone && !isCompleted) {
      onToggleComplete?.(true);
    }

    onUpdatePerformance?.({
      ...performanceData,
      type: isCardio ? 'cardio' : isBodyweight ? 'bodyweight' : 'weight',
      sets: newSets
    });
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSets = [
      ...sets,
      {
        setNumber: sets.length + 1,
        reps: lastSet ? lastSet.reps : defaultReps,
        weight: lastSet ? lastSet.weight : (isBodyweight ? 0 : ''),
        completed: false
      }
    ];

    onUpdatePerformance?.({
      ...performanceData,
      type: isCardio ? 'cardio' : isBodyweight ? 'bodyweight' : 'weight',
      sets: newSets
    });
  };

  const handleRemoveSet = (setIdx) => {
    if (sets.length <= 1) return;
    const newSets = sets
      .filter((_, idx) => idx !== setIdx)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    onUpdatePerformance?.({
      ...performanceData,
      type: isCardio ? 'cardio' : isBodyweight ? 'bodyweight' : 'weight',
      sets: newSets
    });
  };

  const handleCardioChange = (field, val) => {
    onUpdatePerformance?.({
      ...performanceData,
      type: 'cardio',
      duration: field === 'duration' ? val : cardioDuration,
      distance: field === 'distance' ? val : cardioDistance,
      sets: [{
        setNumber: 1,
        duration: field === 'duration' ? val : cardioDuration,
        distance: field === 'distance' ? val : cardioDistance,
        reps: 1
      }]
    });
  };

  return (
    <div 
      className={`
        w-full max-w-[560px] mx-auto bg-[#161b22] border rounded-xl overflow-hidden transition-all duration-200
        ${isCompleted 
          ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
          : 'border-slate-800 hover:border-slate-700'
        }
      `}
    >
      {/* Ultra-Compact Header Section */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#161b22]">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Exercise #, Title, Muscle Tag, Info Button */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-mono text-xs font-bold text-slate-500 shrink-0">
              #{String(index + 1).padStart(2, '0')}
            </span>

            <h3 className="text-sm sm:text-base font-bold text-white truncate tracking-tight">
              {exercise.name}
            </h3>

            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800/90 text-emerald-400 border border-slate-700/60 shrink-0">
              {exercise.muscle}
            </span>

            {/* Interactive Info Icon Button (Tucks Description & Pro Tip) */}
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="text-slate-500 hover:text-emerald-400 transition p-1 rounded-md hover:bg-slate-800/60 shrink-0 cursor-pointer"
              title="View exercise instructions & tips"
              aria-label="View exercise instructions and tips"
            >
              <Info size={14} />
            </button>
          </div>

          {/* Right: Overall Exercise Completion Button */}
          <button
            type="button"
            onClick={() => onToggleComplete?.()}
            className={`
              min-w-[44px] min-h-[44px] sm:min-w-[34px] sm:min-h-[34px] sm:w-[34px] sm:h-[34px]
              rounded-lg flex items-center justify-center border transition-all duration-150 cursor-pointer active:scale-95 shrink-0
              ${isCompleted
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-[#0d1117] text-slate-500 border-slate-800 hover:border-slate-700 hover:text-white'
              }
            `}
            title={isCompleted ? 'Mark incomplete' : 'Mark movement completed'}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark movement completed'}
          >
            <Check size={16} strokeWidth={isCompleted ? 3 : 2} />
          </button>
        </div>

        {/* Inline Meta Row: 4 sets • 8–10 reps • 90s rest */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>{exercise.sets || 3} sets</span>
          <span className="text-slate-600">•</span>
          <span>{exercise.reps} reps</span>
          <span className="text-slate-600">•</span>
          <span>{exercise.rest || 60}s rest</span>
          {exercise.equipment && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 truncate">{exercise.equipment}</span>
            </>
          )}
        </div>
      </div>

      {/* High-Density Sets Table / Protocol Body */}
      <div className="p-3 sm:p-4 bg-[#0d1117]">
        {isCardio ? (
          /* High-Density Cardio Layout */
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="20"
                  value={cardioDuration}
                  onChange={(e) => handleCardioChange('duration', parseFloat(e.target.value) || '')}
                  className="w-full h-11 sm:h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm outline-none transition"
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
                  placeholder="3.0"
                  value={cardioDistance}
                  onChange={(e) => handleCardioChange('distance', parseFloat(e.target.value) || '')}
                  className="w-full h-11 sm:h-9 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm outline-none transition"
                />
              </div>
            </div>
          </div>
        ) : (
          /* High-Density Strength Sets Table */
          <div className="w-full">
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 text-[10px] font-semibold tracking-wider text-slate-500 uppercase pb-1.5 px-1 border-b border-slate-800/80">
              <div className="col-span-2 text-center">Set</div>
              <div className="col-span-4 text-center">Reps</div>
              <div className="col-span-4 text-center">{isBodyweight ? 'Weight (opt)' : 'Weight (kg)'}</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            {/* Set Rows with subtle hairline dividers */}
            <div className="divide-y divide-slate-800/60">
              {sets.map((set, setIdx) => (
                <SetRowItem
                  key={setIdx}
                  set={set}
                  setIdx={setIdx}
                  totalSets={sets.length}
                  isBodyweight={isBodyweight}
                  defaultReps={defaultReps}
                  onSetChange={handleSetChange}
                  onToggleComplete={handleToggleSetComplete}
                  onRemoveSet={handleRemoveSet}
                />
              ))}
            </div>

            {/* Compact Ghost + Add Set Button */}
            <div className="pt-2.5 flex justify-start">
              <button
                type="button"
                onClick={handleAddSet}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 py-1 px-2 rounded-md hover:bg-slate-800/40 transition cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Set</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Info Modal / Popover */}
      {infoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-[#161b22] border border-slate-800 rounded-2xl p-5 shadow-2xl relative"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Dumbbell size={16} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {exercise.name}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {exercise.muscle} • {exercise.equipment || 'Standard'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition cursor-pointer"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs leading-relaxed text-slate-300">
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
                  Execution & Form
                </span>
                <p className="bg-[#0d1117] p-3 rounded-xl border border-slate-800/80 text-slate-300">
                  {exercise.description}
                </p>
              </div>

              {exercise.tips && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5">
                  <Lightbulb size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block mb-0.5">Pro Tip</span>
                    <span className="text-slate-300">{exercise.tips}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                <div className="bg-[#0d1117] p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Sets</span>
                  <span className="text-sm font-bold text-white">{exercise.sets || 3}</span>
                </div>
                <div className="bg-[#0d1117] p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Target Reps</span>
                  <span className="text-sm font-bold text-white">{exercise.reps}</span>
                </div>
                <div className="bg-[#0d1117] p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Rest</span>
                  <span className="text-sm font-bold text-emerald-400">{exercise.rest || 60}s</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Set Row with mobile swipe-to-delete and desktop hover-to-delete
function SetRowItem({
  set,
  setIdx,
  totalSets,
  isBodyweight,
  defaultReps,
  onSetChange,
  onToggleComplete,
  onRemoveSet
}) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartRef = useRef(0);

  // Mobile Touch Handlers for swipe-to-delete
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - touchStartRef.current;
    if (diff < 0) {
      // Swiping left (max -72px reveal for delete button)
      setSwipeOffset(Math.max(diff, -72));
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -40) {
      setSwipeOffset(-64); // Snap open to reveal delete button
    } else {
      setSwipeOffset(0); // Snap closed
    }
  };

  return (
    <div className="relative overflow-hidden group">
      {/* Mobile Swipe-Revealed Delete Action Button */}
      {totalSets > 1 && (
        <div className="absolute inset-y-0 right-0 w-16 bg-rose-600/90 flex items-center justify-center sm:hidden">
          <button
            type="button"
            onClick={() => onRemoveSet(setIdx)}
            className="w-full h-full flex items-center justify-center text-white"
            aria-label="Confirm delete set"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Main Row Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className={`
          grid grid-cols-12 items-center py-2 px-1 transition-transform duration-100 ease-out bg-[#0d1117]
          ${set.completed ? 'opacity-90' : ''}
        `}
      >
        {/* Set # */}
        <div className="col-span-2 text-center font-mono text-xs font-semibold text-slate-400">
          #{set.setNumber}
        </div>

        {/* Reps Input */}
        <div className="col-span-4 px-1">
          <input
            type="number"
            min="1"
            placeholder={String(defaultReps)}
            value={set.reps !== undefined ? set.reps : ''}
            onChange={(e) => onSetChange(setIdx, 'reps', parseInt(e.target.value, 10) || '')}
            className="w-full h-11 sm:h-8 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm font-medium outline-none transition"
          />
        </div>

        {/* Weight Input */}
        <div className="col-span-4 px-1">
          <input
            type="number"
            step="0.5"
            min="0"
            placeholder={isBodyweight ? "0" : "0.0"}
            value={set.weight !== undefined && set.weight !== '' ? set.weight : ''}
            onChange={(e) => onSetChange(setIdx, 'weight', parseFloat(e.target.value) || 0)}
            className="w-full h-11 sm:h-8 bg-[#161b22] border border-slate-800 focus:border-emerald-500 text-white rounded-lg text-center text-sm font-medium outline-none transition"
          />
        </div>

        {/* Status: Checkbox + Desktop Hover Delete */}
        <div className="col-span-2 flex items-center justify-center relative">
          <button
            type="button"
            onClick={() => onToggleComplete(setIdx)}
            className={`
              min-w-[44px] min-h-[44px] sm:min-w-[28px] sm:min-h-[28px] sm:w-7 sm:h-7
              rounded-lg flex items-center justify-center border transition-all duration-150 cursor-pointer active:scale-95
              ${set.completed
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : 'bg-[#161b22] border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white'
              }
            `}
            title={set.completed ? "Mark set incomplete" : "Complete set"}
            aria-label={`Set ${set.setNumber} ${set.completed ? 'completed' : 'incomplete'}`}
          >
            <Check size={14} strokeWidth={set.completed ? 3 : 2} />
          </button>

          {/* Desktop Only: Delete Icon Visible on Row Hover */}
          {totalSets > 1 && (
            <button
              type="button"
              onClick={() => onRemoveSet(setIdx)}
              className="hidden sm:block absolute -right-3 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
              title="Delete set"
              aria-label={`Delete set ${set.setNumber}`}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
