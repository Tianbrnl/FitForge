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
  ArrowRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ProgressCard from '../components/progress/ProgressCard';
import ProgressChart from '../components/progress/ProgressChart';
import WorkoutCard from '../components/workout/WorkoutCard';
import { initialUserData } from '../data/user';
import { workoutsData } from '../data/workouts';
import { exercisesData } from '../data/exercises';
import { defaultWorkoutHistory } from '../data/defaultHistory';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWorkouts } from '../hooks/useWorkouts';
import { 
  calculateActiveStreak, 
  calculateWorkoutFrequency, 
  generateWeeklyActivity 
} from '../utils/workoutAnalytics';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData] = useLocalStorage('fitforge_user', initialUserData);
  const [workoutHistory] = useLocalStorage('fitforge_workout_history', defaultWorkoutHistory);
  const { workouts } = useWorkouts();
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);

  // Data-driven calculations
  const currentStreak = calculateActiveStreak(workoutHistory);
  const weeklyFrequency = calculateWorkoutFrequency(workoutHistory, 'week');
  const weeklyActivity = generateWeeklyActivity(workoutHistory);

  // Today's assigned workout
  const todaysWorkout = workouts[0] || workoutsData[0] || {
    id: 'workout-001',
    name: 'Chest & Triceps Hypertrophy',
    description: 'Target compound movement routine',
    difficulty: 'Intermediate',
    exercises: []
  };
  const todaysExercises = todaysWorkout.exercises || exercisesData.filter(e => todaysWorkout.exerciseIds?.includes(e.id));
  const recommendedWorkouts = workouts.length > 1 ? workouts.slice(1, 4) : workoutsData.slice(1, 4);

  const handleStartWorkout = () => {
    navigate(`/workouts/${todaysWorkout.id}/session`);
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
            Welcome back, <span className="bg-gradient-to-r from-[#CCFF00] to-[#00E5FF] bg-clip-text text-transparent">{userData.name.split(' ')[0]}</span>!
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
          value={userData.metrics.currentWeight}
          unit={userData.metrics.weightUnit}
          trend={`${userData.metrics.weightTrend} kg`}
          trendPositive={true}
          subtitle="this month"
          icon={Scale}
          accentColor="text-[#CCFF00]"
        />

        <ProgressCard
          title="Daily Calorie Burn"
          value={userData.metrics.dailyCaloriesBurned}
          unit="kcal"
          trend={`Goal: ${userData.metrics.dailyCaloriesTarget} kcal`}
          trendPositive={true}
          subtitle="91% achieved"
          icon={Flame}
          accentColor="text-[#FF6B4A]"
        />

        <ProgressCard
          title="Weekly Workouts"
          value={`${weeklyFrequency.totalWorkouts}/${userData.metrics.weeklyWorkoutsGoal || 5}`}
          unit="sessions"
          trend={`${weeklyFrequency.percentage}% done`}
          trendPositive={weeklyFrequency.percentage >= 50}
          subtitle={weeklyFrequency.totalWorkouts >= (userData.metrics.weeklyWorkoutsGoal || 5) ? 'Weekly target reached! 🎯' : `${Math.max(0, (userData.metrics.weeklyWorkoutsGoal || 5) - weeklyFrequency.totalWorkouts)} remaining`}
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
              {todaysWorkout.description}
            </p>

            <div className="space-y-2 mb-6">
              {todaysExercises.slice(0, 3).map((ex, idx) => (
                <div
                  key={ex.id || idx}
                  className="flex justify-between items-center py-2 border-b border-white/5 text-sm"
                >
                  <span className="text-gray-300 font-medium">{ex.name}</span>
                  <span className="text-xs text-gray-500 font-mono">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
              ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </section>

      {/* Start Workout Active Modal */}
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
              {todaysExercises.map((ex) => (
                <div key={ex.id} className="flex items-center gap-2 text-sm">
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
                alert("Great session Alex! Workout logged to your streak (+1 day).");
                setWorkoutModalOpen(false);
              }}
            >
              Complete Workout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
