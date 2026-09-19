import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Calendar,
  Zap,
  Trophy,
  Dumbbell,
  RotateCcw,
  PlusCircle,
  Activity
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ProgressCard from '../components/progress/ProgressCard';
import ProgressChart from '../components/progress/ProgressChart';
import { initialUserData } from '../data/user';
import { defaultWorkoutHistory } from '../data/defaultHistory';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  calculateActiveStreak,
  calculateWorkoutFrequency,
  calculatePersonalRecords,
  generateWeeklyActivity
} from '../utils/workoutAnalytics';

export default function Progress() {
  const navigate = useNavigate();
  const [userData] = useLocalStorage('fitforge_user', initialUserData);
  const [workoutHistory, setWorkoutHistory] = useLocalStorage(
    'fitforge_workout_history',
    defaultWorkoutHistory
  );

  const [period, setPeriod] = useState('week'); // 'week' | 'month' | '30days'

  // Data-driven calculations
  const activeStreak = calculateActiveStreak(workoutHistory);
  const frequencyData = calculateWorkoutFrequency(workoutHistory, period);
  const personalRecords = calculatePersonalRecords(workoutHistory);
  const weeklyActivity = generateWeeklyActivity(workoutHistory);

  const handleClearHistory = () => {
    if (window.confirm('Clear all logged workout history to test the empty state?')) {
      setWorkoutHistory([]);
    }
  };

  const handleResetDemoHistory = () => {
    setWorkoutHistory(defaultWorkoutHistory);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <ProgressChart
          title="8-Week Weight Trend (kg)"
          type="line"
          data={userData.weightHistory}
          height={240}
        />

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
                    {pr.exercise}
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">
                    Target: {pr.muscle}
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

      {/* Workout Log History List */}
      {workoutHistory.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#00E5FF]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Recent Workout Sessions
            </h3>
            <span className="text-xs text-gray-500">
              ({workoutHistory.length} recorded)
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {workoutHistory.slice(0, 5).map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-[#0E131E] border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
              >
                <div>
                  <h5 className="text-sm font-bold text-white">
                    {w.workoutName}
                  </h5>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(w.completedAt || w.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {w.exercises?.length || 0} exercises logged
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#CCFF00] font-bold">
                    {w.calories || 0} kcal
                  </span>
                  <span className="text-gray-400">
                    {w.duration || 0} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
