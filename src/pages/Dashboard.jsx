import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Scale,
  Play,
  Calendar,
  CheckCircle,
  Zap,
  ArrowRight,
  Plus
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressCard from '../components/progress/ProgressCard';
import ProgressChart from '../components/progress/ProgressChart';
import WorkoutCard from '../components/workout/WorkoutCard';
import { useAuth } from '../context/AuthContext';
import { initialUserData } from '../data/user';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWorkouts } from '../hooks/useWorkouts';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { useWeightHistory } from '../hooks/useWeightHistory';
import { 
  calculateActiveStreak, 
  calculateWorkoutFrequency, 
  generateWeeklyActivity,
  toDateString
} from '../utils/workoutAnalytics';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [userData] = useLocalStorage('fitforge_user', initialUserData);
  const { history: workoutHistory } = useWorkoutHistory();
  const { weightHistory } = useWeightHistory();
  const { workouts } = useWorkouts();
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);

  // Authenticated user profile name
  const displayName =
    profile?.full_name ||
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split('@')[0] : '') ||
    userData?.name ||
    'Athlete';
  const firstName = displayName.split(' ')[0] || displayName;

  // Latest weight from Supabase weight history
  const latestWeight = weightHistory && weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
  const previousWeight = weightHistory && weightHistory.length > 1 ? weightHistory[weightHistory.length - 2] : null;
  const weightDiff = latestWeight && previousWeight ? (Number(latestWeight.weight) - Number(previousWeight.weight)).toFixed(1) : null;
  const weightTrendText = weightDiff !== null
    ? `${Number(weightDiff) > 0 ? '+' : ''}${weightDiff} kg`
    : (latestWeight ? 'Latest record' : 'No entries yet');
  const weightTrendPositive = weightDiff !== null ? Number(weightDiff) <= 0 : true;
  const weightSubtitle = latestWeight
    ? (previousWeight ? 'vs previous entry' : 'First entry')
    : 'Log in Progress tab';

  // Calorie burn calculated from completed workouts today
  const todayStr = toDateString(new Date());
  const todayCaloriesBurned = (workoutHistory || [])
    .filter((w) => toDateString(w.completedAt || w.date) === todayStr)
    .reduce((sum, w) => {
      if (w.calories !== undefined && w.calories !== null) {
        return sum + Number(w.calories);
      }
      const durationMins = w.durationSeconds
        ? Math.round(w.durationSeconds / 60)
        : (Number(w.duration) || 0);
      return sum + Math.round(durationMins * 8.5);
    }, 0);

  const dailyCalorieGoal = userData?.metrics?.dailyCaloriesTarget || 500;
  const caloriePercent = dailyCalorieGoal > 0 ? Math.round((todayCaloriesBurned / dailyCalorieGoal) * 100) : 0;

  // Workout statistics
  const currentStreak = calculateActiveStreak(workoutHistory);
  const weeklyFrequency = calculateWorkoutFrequency(workoutHistory, 'week');
  const weeklyActivity = generateWeeklyActivity(workoutHistory);
  const weeklyWorkoutsGoal = userData?.metrics?.weeklyWorkoutsGoal || 5;
  const weeklyPercentage = Math.round((weeklyFrequency.totalWorkouts / weeklyWorkoutsGoal) * 100);

  // Today's assigned workout from Supabase workouts
  const hasWorkouts = workouts && workouts.length > 0;
  const todaysWorkout = hasWorkouts ? workouts[0] : null;
  const todaysExercises = todaysWorkout?.exercises || [];
  const recommendedWorkouts = workouts && workouts.length > 1
    ? workouts.slice(1, 4)
    : (workouts && workouts.length === 1 ? workouts : []);

  const handleStartWorkout = () => {
    if (todaysWorkout?.id) {
      navigate(`/workouts/${todaysWorkout.id}/session`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Welcome Banner */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25">
              Athlete Dashboard
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-[#CCFF00] to-[#00E5FF] bg-clip-text text-transparent">{firstName}</span>!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Consistency is your competitive edge.
          </p>
        </div>
      </div>

      {/* 4 Core Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <ProgressCard
          title="Current Weight"
          value={latestWeight ? latestWeight.weight : '--'}
          unit={latestWeight ? 'kg' : ''}
          trend={weightTrendText}
          trendPositive={weightTrendPositive}
          subtitle={weightSubtitle}
          icon={Scale}
          accentColor="text-[#CCFF00]"
        />

        <ProgressCard
          title="Calorie Burn"
          value={todayCaloriesBurned}
          unit="kcal"
          trend={`Goal: ${dailyCalorieGoal} kcal`}
          trendPositive={todayCaloriesBurned > 0}
          subtitle={todayCaloriesBurned > 0 ? `${caloriePercent}% achieved` : (weeklyFrequency.totalCaloriesBurned > 0 ? `This week: ${weeklyFrequency.totalCaloriesBurned} kcal` : 'No workouts logged today')}
          icon={Flame}
          accentColor="text-[#FF6B4A]"
        />

        <ProgressCard
          title="Weekly Workouts"
          value={`${weeklyFrequency.totalWorkouts}/${weeklyWorkoutsGoal}`}
          unit="sessions"
          trend={`${weeklyPercentage}% done`}
          trendPositive={weeklyFrequency.totalWorkouts >= Math.ceil(weeklyWorkoutsGoal / 2)}
          subtitle={weeklyFrequency.totalWorkouts >= weeklyWorkoutsGoal ? 'Weekly target reached! 🎯' : `${Math.max(0, weeklyWorkoutsGoal - weeklyFrequency.totalWorkouts)} remaining`}
          icon={Dumbbell}
          accentColor="text-[#00E5FF]"
        />

        <ProgressCard
          title="Workout Streak"
          value={currentStreak}
          unit="days"
          trend={currentStreak > 0 ? "🔥 Active Streak" : "No active streak"}
          trendPositive={currentStreak > 0}
          subtitle={currentStreak > 0 ? "Keep the flame lit" : "Complete a workout today"}
          icon={Zap}
          accentColor="text-amber-400"
        />
      </div>

      {/* Today's Workout & Weekly Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Today's Workout Section */}
        <Card glow="lime" className="p-7 flex flex-col justify-between">
          {hasWorkouts && todaysWorkout ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#CCFF00]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
                      Today's Workout
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30">
                    {todaysWorkout.difficulty || todaysWorkout.targetMuscle || 'Protocol'}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mb-1.5 tracking-tight">
                  {todaysWorkout.name}
                </h3>

                <p className="text-sm text-gray-400 mb-5">
                  {todaysWorkout.description || 'Custom tailored workout protocol.'}
                </p>

                <div className="space-y-2 mb-6">
                  {todaysExercises.slice(0, 3).map((ex, idx) => (
                    <div
                      key={ex.exerciseId || ex.id || idx}
                      className="flex justify-between items-center py-2 border-b border-white/5 text-sm"
                    >
                      <span className="text-gray-300 font-medium">{ex.name}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {ex.sets} × {ex.reps}
                      </span>
                    </div>
                  ))}
                  {todaysExercises.length === 0 && (
                    <p className="text-xs text-gray-500 italic py-2">No exercises added to this routine yet.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleStartWorkout}
                  className="flex-1"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Workout</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/workouts/${todaysWorkout.id}`)}
                >
                  Details
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#CCFF00]">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Workouts Created Yet</h3>
              <p className="text-sm text-gray-400 max-w-sm mb-6">
                Create your first custom workout plan to start logging your sessions and tracking daily performance.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/workouts')}
              >
                <Plus size={16} className="mr-1.5" />
                <span>Create a Workout</span>
              </Button>
            </div>
          )}
        </Card>

        {/* Weekly Activity Chart */}
        <ProgressChart
          title="Weekly Workout Intensity"
          type="bar"
          data={weeklyActivity}
          height={240}
          unit="kcal"
        />
      </div>

      {/* Recommended Workouts Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Recommended Routines
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Tailored for progressive overload in your current training cycle.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate('/workouts')}
            className="gap-1.5 text-xs font-semibold"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {recommendedWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="bg-[#121620] border border-white/5 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center mb-3 text-gray-400">
              <Dumbbell size={20} />
            </div>
            <p className="text-sm text-gray-300 font-medium mb-1">No additional routines found</p>
            <p className="text-xs text-gray-500 mb-4">Build more workout routines to see them recommended here.</p>
            <Button
              variant="secondary"
              onClick={() => navigate('/workouts')}
              className="text-xs"
            >
              Explore Workouts
            </Button>
          </div>
        )}
      </section>

      {/* Start Workout Active Modal */}
      {todaysWorkout && (
        <Modal
          isOpen={workoutModalOpen}
          onClose={() => setWorkoutModalOpen(false)}
          title="Active Workout Session"
        >
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] inline-flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              <Play size={28} fill="currentColor" />
            </div>

            <h4 className="text-xl font-extrabold text-white mb-1.5 tracking-tight">
              {todaysWorkout.name} Started!
            </h4>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Focus on full range of motion and 2-second negative tempos on every rep.
            </p>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-6 text-left">
              <h5 className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider mb-3">
                Workout Checklist
              </h5>
              <div className="flex flex-col gap-2.5">
                {todaysExercises.map((ex, idx) => (
                  <div key={ex.exerciseId || ex.id || idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-white font-medium">{ex.name}</span>
                    <span className="text-gray-500 text-xs ml-auto">{ex.sets} sets</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => setWorkoutModalOpen(false)}
              >
                Minimize Session
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  alert(`Great session ${firstName}! Workout logged to your streak.`);
                  setWorkoutModalOpen(false);
                }}
              >
                Complete Workout
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
