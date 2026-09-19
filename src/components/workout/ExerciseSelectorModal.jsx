import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Check, X, Dumbbell } from 'lucide-react';
import {
  MUSCLE_GROUPS,
  EQUIPMENT_LIST,
  DIFFICULTY_LEVELS
} from '../../data/exercises';

import { getExercises } from '../../services/exerciseService';
export default function ExerciseSelectorModal({
  isOpen,
  onClose,
  onSelectExercise,
  selectedExerciseIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [equipmentFilter, setEquipmentFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [exercisesData, setExercisesData] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);

  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await getExercises();
        setExercisesData(exercises);
      } catch (error) {
        console.error('Failed to load exercises from Sanity:', error);
      } finally {
        setExercisesLoading(false);
      }
    }

    if (isOpen) {
      loadExercises();
    }
  }, [isOpen]);
  useEffect(() => {
    async function loadExercises() {
      try {
        const exercises = await getExercises();
        setExercisesData(exercises);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      } finally {
        setExercisesLoading(false);
      }
    }
    loadExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    return exercisesData.filter((ex) => {
      const muscleGroup = ex.muscleGroup || '';
      const muscle = ex.muscle || '';
      const equipment = ex.equipment || '';
      const difficulty = ex.difficulty || '';
      const name = ex.name || '';
      const description = ex.description || '';

      const matchesMuscle =
        muscleFilter === 'All' ||
        muscleGroup.toLowerCase() === muscleFilter.toLowerCase() ||
        muscle.toLowerCase() === muscleFilter.toLowerCase();

      const matchesEquipment =
        equipmentFilter === 'All' ||
        equipment.toLowerCase().includes(equipmentFilter.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === 'All' ||
        difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        name.toLowerCase().includes(q) ||
        muscleGroup.toLowerCase().includes(q) ||
        equipment.toLowerCase().includes(q);

      return (
        matchesMuscle &&
        matchesEquipment &&
        matchesDifficulty &&
        matchesQuery
      );
    });
  }, [
    exercisesData,
    searchQuery,
    muscleFilter,
    equipmentFilter,
    difficultyFilter
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#161b22] border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#161b22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Dumbbell size={16} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Add Exercise to Workout
              </h3>
              <p className="text-xs text-slate-400">
                Browse or search our library of compound and isolation movements.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-[#0d1117] space-y-3">
          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-[#161b22] border border-slate-800 rounded-xl px-3.5 py-2 focus-within:border-emerald-500 transition">
            <Search size={16} className="text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search exercises by name, muscle, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          {/* Muscle Pill Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MUSCLE_GROUPS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setMuscleFilter(cat)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer
                  ${muscleFilter === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Equipment & Difficulty Dropdowns */}
          <div className="flex gap-2">
            <select
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
              className="bg-[#161b22] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer focus:border-emerald-500"
            >
              {EQUIPMENT_LIST.map((eq) => (
                <option key={eq} value={eq}>
                  {eq === 'All' ? 'All Equipment' : eq}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-[#161b22] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer focus:border-emerald-500"
            >
              {DIFFICULTY_LEVELS.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Levels' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0d1117] divide-y divide-slate-800/50">
          {exercisesLoading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Loading exercises...
            </div>
          ) : filteredExercises.length === 0 ? (

            <div className="text-center py-12 text-slate-500 text-xs">
              No exercises match your search filters.
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const isSelected = selectedExerciseIds.includes(ex.id);

              return (
                <div
                  key={ex.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-[#161b22] border border-transparent hover:border-slate-800 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-bold text-white truncate">
                        {ex.name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60">
                        {ex.muscleGroup}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {ex.equipment}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {ex.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectExercise(ex)}
                    disabled={isSelected}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition cursor-pointer
                      ${isSelected
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold active:scale-95 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                      }
                    `}
                  >
                    {isSelected ? (
                      <>
                        <Check size={13} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#161b22] flex justify-between items-center text-xs text-slate-400">
          <span>{filteredExercises.length} movements found</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
