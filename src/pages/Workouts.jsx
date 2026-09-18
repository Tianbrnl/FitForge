import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Dumbbell, 
  Search, 
  Filter, 
  History, 
  RotateCcw,
  BookOpen,
  Info,
  X
} from 'lucide-react';
import WorkoutCard from '../components/workout/WorkoutCard';
import WorkoutHistoryList from '../components/workout/WorkoutHistoryList';
import { useWorkouts } from '../hooks/useWorkouts';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { exercisesData, MUSCLE_GROUPS, EQUIPMENT_LIST, DIFFICULTY_LEVELS } from '../data/exercises';

export default function Workouts() {
  const navigate = useNavigate();
  const { workouts, deleteWorkout, resetToDefaults, clearAllWorkouts } = useWorkouts();
  const { history, deleteSession } = useWorkoutHistory();

  const [activeTab, setActiveTab] = useState('my-workouts'); // 'my-workouts' | 'library' | 'history'

  // Exercise Library Filters
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryMuscle, setLibraryMuscle] = useState('All');
  const [libraryEquipment, setLibraryEquipment] = useState('All');
  const [libraryDifficulty, setLibraryDifficulty] = useState('All');
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  const filteredLibraryExercises = useMemo(() => {
    return exercisesData.filter((ex) => {
      const matchesMuscle =
        libraryMuscle === 'All' ||
        ex.muscleGroup.toLowerCase() === libraryMuscle.toLowerCase() ||
        ex.muscle.toLowerCase() === libraryMuscle.toLowerCase();

      const matchesEquipment =
        libraryEquipment === 'All' ||
        ex.equipment.toLowerCase().includes(libraryEquipment.toLowerCase());

      const matchesDifficulty =
        libraryDifficulty === 'All' ||
        ex.difficulty.toLowerCase() === libraryDifficulty.toLowerCase();

      const q = librarySearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.muscleGroup.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q);

      return matchesMuscle && matchesEquipment && matchesDifficulty && matchesQuery;
    });
  }, [librarySearch, libraryMuscle, libraryEquipment, libraryDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header section with Create Workout primary action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            Training Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Workouts & Custom Protocols
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build your own custom routines, explore exercise mechanics, and track your performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/workouts/create')}
            className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Workout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('my-workouts')}
            className={`
              pb-3.5 px-2 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer
              ${activeTab === 'my-workouts'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            <Dumbbell size={15} />
            <span>My Workouts</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {workouts.length}
            </span>
            {activeTab === 'my-workouts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`
              pb-3.5 px-2 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer
              ${activeTab === 'library'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            <BookOpen size={15} />
            <span>Exercise Library</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {exercisesData.length}
            </span>
            {activeTab === 'library' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`
              pb-3.5 px-2 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer
              ${activeTab === 'history'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-white'
              }
            `}
          >
            <History size={15} />
            <span>Workout History</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {history.length}
            </span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Quick Demo Utilities */}
        {activeTab === 'my-workouts' && (
          <div className="hidden sm:flex items-center gap-2 pb-3">
            {workouts.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all custom workouts to view the empty state?')) {
                    clearAllWorkouts();
                  }
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                Clear All
              </button>
            ) : (
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw size={11} /> <span>Load Samples</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── TAB 1: MY WORKOUTS ──────────────────────────────────────────────── */}
      {activeTab === 'my-workouts' && (
        <div>
          {workouts.length === 0 ? (
            /* User specified empty state */
            <div className="text-center py-20 px-6 bg-[#161b22] border border-dashed border-slate-800 rounded-3xl max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Dumbbell size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                You haven't created a workout yet.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Build your first custom workout by choosing the exercises you want to do.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate('/workouts/create')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>+ Create Workout</span>
                </button>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  Load Sample Workouts
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onDelete={deleteWorkout}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: EXERCISE LIBRARY ────────────────────────────────────────── */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Library Search & Filter Bar */}
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5 bg-[#0d1117] border border-slate-800 rounded-xl px-4 py-2.5 focus-within:border-emerald-500 transition">
              <Search size={16} className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search exercise library by name, anatomy, equipment..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder-slate-500"
              />
              {librarySearch && (
                <button
                  type="button"
                  onClick={() => setLibrarySearch('')}
                  className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Muscle pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {MUSCLE_GROUPS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLibraryMuscle(cat)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer
                    ${libraryMuscle === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-[#0d1117] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Equipment and Difficulty filters */}
            <div className="flex gap-2.5 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={13} className="text-slate-500" />
                <select
                  value={libraryEquipment}
                  onChange={(e) => setLibraryEquipment(e.target.value)}
                  className="bg-[#0d1117] border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium outline-none cursor-pointer focus:border-emerald-500"
                >
                  {EQUIPMENT_LIST.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq === 'All' ? 'All Equipment' : eq}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={libraryDifficulty}
                onChange={(e) => setLibraryDifficulty(e.target.value)}
                className="bg-[#0d1117] border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium outline-none cursor-pointer focus:border-emerald-500"
              >
                {DIFFICULTY_LEVELS.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff === 'All' ? 'All Difficulties' : diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exercise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLibraryExercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => setSelectedExerciseForModal(exercise)}
                className="bg-[#161b22] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition duration-150 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition truncate">
                      {exercise.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60 shrink-0">
                      {exercise.muscleGroup}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {exercise.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>{exercise.equipment}</span>
                  <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                    <Info size={12} />
                    <span>View Guide</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: WORKOUT HISTORY ─────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Completed Workout Sessions
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {history.length} total logged
            </span>
          </div>

          <WorkoutHistoryList
            history={history}
            onDeleteSession={deleteSession}
          />
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExerciseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {selectedExerciseForModal.muscleGroup} • {selectedExerciseForModal.difficulty}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {selectedExerciseForModal.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExerciseForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <p className="bg-[#0d1117] p-3 rounded-xl border border-slate-800/80">
                {selectedExerciseForModal.description}
              </p>

              {selectedExerciseForModal.instructions && selectedExerciseForModal.instructions.length > 0 && (
                <div>
                  <h5 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">
                    Execution Steps:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    {selectedExerciseForModal.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExerciseForModal.tips && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl text-emerald-300">
                  <strong>Pro Tip:</strong> {selectedExerciseForModal.tips}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedExerciseForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
