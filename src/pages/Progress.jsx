import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeightHistory } from '../hooks/useWeightHistory';
import {
  Flame,
  Calendar,
  Zap,
  Trophy,
  Dumbbell,
  RotateCcw,
  PlusCircle,
  Scale,
  Edit3,
  Trash2,
  AlertCircle,
  History
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressCard from '../components/progress/ProgressCard';
import ProgressChart from '../components/progress/ProgressChart';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { exercisesData } from '../data/exercises';
import {
  calculateActiveStreak,
  calculateWorkoutFrequency,
  calculatePersonalRecords,
  generateWeeklyActivity
} from '../utils/workoutAnalytics';

export default function Progress() {
  const navigate = useNavigate();
  const {
    weightHistory,
    addWeight,
    updateWeight,
    deleteWeight,
    loading: weightLoading
  } = useWeightHistory();
  const {
    history: workoutHistory,
    clearHistory,
    loadDemoHistory
  } = useWorkoutHistory();

  const [period, setPeriod] = useState('week'); // 'week' | 'month' | '30days'
  const [weightInput, setWeightInput] = useState('');
  const [weightSaving, setWeightSaving] = useState(false);
  const [weightError, setWeightError] = useState('');

  // Weight History Modal & Edit State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingWeightId, setEditingWeightId] = useState(null);
  const [editWeightVal, setEditWeightVal] = useState('');
  const [editWeightDate, setEditWeightDate] = useState('');
  const [editWeightSaving, setEditWeightSaving] = useState(false);
  const [editWeightError, setEditWeightError] = useState('');

  // Data-driven calculations
  const activeStreak = calculateActiveStreak(workoutHistory);
  const frequencyData = calculateWorkoutFrequency(workoutHistory, period);
  const personalRecords = calculatePersonalRecords(workoutHistory);
  const weeklyActivity = generateWeeklyActivity(workoutHistory);
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const weightChartData = weightHistory
    .filter((item) => {
      const recordedDate = new Date(`${item.recorded_at}T00:00:00`);
      return recordedDate >= eightWeeksAgo;
    })
    .map((item) => ({
      weight: Number(item.weight),
      date: new Date(`${item.recorded_at}T00:00:00`).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric'
        }
      )
    }));

  const handleAddWeight = async () => {
    const weight = Number(weightInput);

    if (!weight || weight <= 0) {
      setWeightError('Please enter a valid weight.');
      return;
    }

    setWeightSaving(true);
    setWeightError('');

    const result = await addWeight(weight);

    setWeightSaving(false);

    if (!result) {
      setWeightError('Unable to save weight. Please try again.');
      return;
    }

    setWeightInput('');
  };

  const handleDeleteWeight = async (id) => {
    if (!window.confirm('Are you sure you want to delete this weight entry?')) {
      return;
    }

    setEditWeightError('');
    const success = await deleteWeight(id);
    if (!success) {
      setEditWeightError('Failed to delete weight entry.');
    }
  };

  const handleStartEdit = (item) => {
    setEditingWeightId(item.id);
    setEditWeightVal(item.weight.toString());
    setEditWeightDate(item.recorded_at || new Date().toISOString().split('T')[0]);
    setEditWeightError('');
  };

  const handleSaveEditWeight = async (id) => {
    const numericWeight = Number(editWeightVal);
    if (!numericWeight || numericWeight <= 0) {
      setEditWeightError('Please enter a valid weight greater than 0.');
      return;
    }

    if (!editWeightDate) {
      setEditWeightError('Please choose a valid date.');
      return;
    }

    setEditWeightSaving(true);
    setEditWeightError('');

    const updated = await updateWeight(id, numericWeight, editWeightDate);

    setEditWeightSaving(false);

    if (!updated) {
      setEditWeightError('Failed to update weight entry.');
      return;
    }

    setEditingWeightId(null);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all logged workout history to test the empty state?')) {
      clearHistory();
    }
  };

  const handleResetDemoHistory = () => {
    loadDemoHistory();
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 mb-2.5">
            Athletic Metrics & PRs
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
            Progress & Performance
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl">
            Real data-driven insights derived strictly from your completed workout sessions and recorded weights.
          </p>
        </div>

        {/* Period Selector & History Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#0E131E] border border-white/10 rounded-full p-1 flex items-center shadow-lg">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition duration-150 cursor-pointer ${period === 'week'
                ? 'bg-[#CCFF00] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition duration-150 cursor-pointer ${period === 'month'
                ? 'bg-[#CCFF00] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition duration-150 cursor-pointer ${period === '30days'
                ? 'bg-[#CCFF00] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Last 30 Days
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {workoutHistory.length > 0 ? (
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-semibold text-gray-400 hover:text-red-400 transition duration-150 cursor-pointer"
                title="Clear all recorded workout history"
              >
                Clear History
              </button>
            ) : (
              <button
                onClick={handleResetDemoHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-xs font-bold text-[#CCFF00] hover:bg-[#CCFF00]/25 transition duration-150 cursor-pointer"
                title="Load sample workout data"
              >
                <RotateCcw size={12} />
                <span>Load Demo Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top 4 Performance Stat Cards - 100% Data-Driven */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Workout Frequency */}
        <ProgressCard
          title="Workout Frequency"
          value={frequencyData.totalWorkouts}
          unit={frequencyData.totalWorkouts === 1 ? "workout" : "workouts"}
          trend={`${frequencyData.frequencyPercentage}% of ${frequencyData.periodLabel.toLowerCase()}`}
          trendPositive={frequencyData.frequencyPercentage >= 50}
          subtitle={`${frequencyData.activeWorkoutDays} / ${frequencyData.totalDaysInPeriod} active days`}
          icon={Calendar}
          accentColor="text-[#00E5FF]"
        />

        {/* Active Workout Streak */}
        <ProgressCard
          title="Active Workout Streak"
          value={activeStreak}
          unit={activeStreak === 1 ? "Day" : "Days"}
          trend={activeStreak > 0 ? "🔥 Consecutive Days" : "Inactive"}
          trendPositive={activeStreak > 0}
          subtitle={activeStreak > 0 ? "Strict calendar streak" : "Complete workout to ignite"}
          icon={Zap}
          accentColor="text-[#CCFF00]"
        />

        {/* Calories Burned */}
        <ProgressCard
          title={`Calories Burned (${frequencyData.periodLabel})`}
          value={frequencyData.totalCaloriesBurned.toLocaleString()}
          unit="kcal"
          trend={`From ${frequencyData.totalWorkouts} sessions`}
          trendPositive={frequencyData.totalCaloriesBurned > 0}
          subtitle={frequencyData.totalMinutes > 0 ? `${frequencyData.totalMinutes}m logged` : "No sessions logged"}
          icon={Flame}
          accentColor="text-[#FF6B4A]"
        />

        {/* Personal Records Total */}
        <ProgressCard
          title="Personal Records"
          value={personalRecords.length}
          unit={personalRecords.length === 1 ? "PR" : "PRs"}
          trend={personalRecords.length > 0 ? "Verified Bests" : "No PRs yet"}
          trendPositive={personalRecords.length > 0}
          subtitle={personalRecords.length > 0 ? "Performance benchmarks" : "Start logging sets"}
          icon={Trophy}
          accentColor="text-amber-400"
        />
      </div>

      {/* Track Your Weight Banner */}
      <Card glow="lime" className="p-5 sm:p-6 mb-8 border border-white/10 bg-[#121825]/85">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 flex items-center justify-center shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-white tracking-tight">
                  Track Your Weight
                </h4>
                {weightHistory.length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 font-bold">
                    Latest: {weightHistory[weightHistory.length - 1]?.weight} kg
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Record your current weight to update your progress trend.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddWeight();
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value);
                    setWeightError('');
                  }}
                  placeholder="65.5"
                  className="w-32 sm:w-36 px-4 py-2.5 pr-10 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] text-sm transition font-medium"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 pointer-events-none">
                  kg
                </span>
              </div>

              <Button
                type="submit"
                size="md"
                disabled={weightSaving || weightLoading || !weightInput}
              >
                {weightSaving ? 'Saving...' : 'Add Weight'}
              </Button>
            </form>

            {weightHistory.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setIsHistoryOpen(true)}
              >
                <History size={15} />
                <span>Logs ({weightHistory.length})</span>
              </Button>
            )}
          </div>
        </div>

        {weightError && (
          <p className="text-xs font-medium text-red-400 mt-3 pt-2.5 border-t border-red-500/20">
            {weightError}
          </p>
        )}
      </Card>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {weightChartData.length > 0 ? (
          <ProgressChart
            title="8-Week Weight Trend (kg)"
            type="line"
            data={weightChartData}
            height={240}
            action={
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="text-xs text-gray-400 hover:text-[#CCFF00] flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
                title="Manage weight entries"
              >
                <History size={13} />
                <span>Manage</span>
              </button>
            }
          />
        ) : (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-white tracking-tight">
                8-Week Weight Trend (kg)
              </h4>
              {weightHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-xs text-gray-400 hover:text-[#CCFF00] flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <History size={13} />
                  <span>Manage ({weightHistory.length})</span>
                </button>
              )}
            </div>

            <div className="h-56 flex items-center justify-center text-center">
              <div>
                <p className="text-gray-400">
                  No weight records yet.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Add your current weight above to start tracking.
                </p>
              </div>
            </div>
          </Card>
        )}

        <ProgressChart
          title="Weekly Activity (Logged Workouts)"
          type="bar"
          data={weeklyActivity}
          height={240}
          unit="kcal"
        />
      </div>

      {/* Personal Records (PR) Section - Data-Driven & Accurate */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Personal Records (PRs)
              </h2>
              <p className="text-xs text-gray-400">
                Calculated automatically from your highest recorded weights, reps, and endurance times.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/workouts')}
            className="gap-1.5"
          >
            <PlusCircle size={14} />
            <span>Log More Workouts</span>
          </Button>
        </div>

        {personalRecords.length === 0 ? (
          /* Empty State for PRs */
          <Card className="p-12 text-center border-dashed border-white/20">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 inline-flex items-center justify-center text-gray-500 mb-4">
              <Dumbbell size={26} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No personal records yet
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
              Complete workouts and record your performance (sets, weights, reps, or cardio duration) to start tracking your genuine Personal Records.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/workouts')}
              >
                Browse Workouts
              </Button>
              <Button
                variant="secondary"
                onClick={handleResetDemoHistory}
              >
                Load Sample Workouts
              </Button>
            </div>
          </Card>
        ) : (
          /* PR Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {personalRecords.map((pr) => {
              const badgeClass = pr.category === 'weight'
                ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30'
                : pr.category === 'cardio'
                  ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30'
                  : 'bg-purple-500/15 text-purple-400 border-purple-500/30';

              const badgeLabel = pr.category === 'weight'
                ? 'Weight PR'
                : pr.category === 'cardio'
                  ? 'Cardio PR'
                  : 'Rep PR';

              return (
                <Card key={pr.id} glow="lime" className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                      {badgeLabel}
                    </span>
                    <span className="text-xs text-gray-400">{pr.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">
                    {(() => {
                      if (!pr.exercise || pr.exercise.match(/^ex-\d+$/i) || pr.exercise.startsWith('ex-')) {
                        const found = exercisesData.find((e) => e.id === pr.exercise);
                        if (found) return found.name;
                      }
                      return pr.exercise;
                    })()}
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">
                    Target: {(() => {
                      const matched = exercisesData.find((e) => e.id === pr.exercise || e.name === pr.exercise);
                      return matched?.muscle || matched?.muscleGroup || pr.muscle || 'Full Body';
                    })()}
                  </p>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-white/10">
                    <span className="text-2xl font-black text-[#CCFF00]">
                      {pr.value}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {pr.detail}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Manage Weight History Modal */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          setEditingWeightId(null);
          setEditWeightError('');
        }}
        title="Weight History & Logs"
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs text-gray-400 pb-3 border-b border-white/10">
            <span>
              {weightHistory.length} {weightHistory.length === 1 ? 'record' : 'records'} logged
            </span>
            <span className="text-gray-500">
              Sorted newest first
            </span>
          </div>

          {editWeightError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{editWeightError}</span>
            </div>
          )}

          {weightHistory.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-gray-500">
                <Scale size={24} />
              </div>
              <p className="text-sm font-semibold text-white">No weight records found</p>
              <p className="text-xs text-gray-400 mt-1">Log your first weight entry above to track changes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {[...weightHistory]
                .sort((a, b) => new Date(`${b.recorded_at}T00:00:00`) - new Date(`${a.recorded_at}T00:00:00`))
                .map((item) => {
                  const isEditing = editingWeightId === item.id;

                  if (isEditing) {
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white/[0.04] border border-[#CCFF00]/40 flex flex-col gap-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                              Date
                            </label>
                            <input
                              type="date"
                              value={editWeightDate}
                              onChange={(e) => setEditWeightDate(e.target.value)}
                              className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3 py-2 rounded-xl text-xs outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              value={editWeightVal}
                              onChange={(e) => setEditWeightVal(e.target.value)}
                              className="w-full bg-[#0E131E] border border-white/15 focus:border-[#CCFF00] text-white px-3 py-2 rounded-xl text-xs outline-none transition"
                              placeholder="e.g. 68.5"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end items-center gap-2 pt-2 border-t border-white/10">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setEditingWeightId(null);
                              setEditWeightError('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            disabled={editWeightSaving || !editWeightVal}
                            onClick={() => handleSaveEditWeight(item.id)}
                          >
                            <Edit3 size={13} />
                            <span>{editWeightSaving ? 'Saving...' : 'Save Changes'}</span>
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 text-[#CCFF00] border border-white/5 flex items-center justify-center shrink-0">
                          <Scale size={15} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white tracking-tight">
                            {item.weight} <span className="text-xs font-normal text-gray-400">kg</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.recorded_at ? new Date(`${item.recorded_at}T00:00:00`).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'No date'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="text-gray-400 hover:text-[#CCFF00] p-1.5 rounded-lg hover:bg-white/5 transition duration-150 cursor-pointer"
                          title="Edit weight entry"
                          aria-label="Edit weight entry"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWeight(item.id)}
                          className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition duration-150 cursor-pointer"
                          title="Delete weight entry"
                          aria-label="Delete weight entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
