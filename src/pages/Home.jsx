import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Sparkles,
  Apple,
  ArrowRight,
  TrendingUp,
  Bot,
  ChevronRight
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import WorkoutCard from '../components/workout/WorkoutCard';
import { useWorkouts } from '../hooks/useWorkouts';
import { useNutrition } from '../hooks/useNutrition';

export default function Home() {
  const navigate = useNavigate();
  const { workouts } = useWorkouts();
  const {
    todayCaloriesConsumed: caloriesConsumed,
    dailyCalorieGoal: caloriesTarget,
    todayProteinConsumed: proteinConsumed,
    dailyProteinGoal: proteinTarget,
    caloriePercent: rawCalPercent,
    proteinPercent: rawProtPercent
  } = useNutrition();

  const featuredWorkouts = workouts && workouts.length > 0 ? workouts.slice(0, 3) : [];

  const liveNutrition = {
    caloriesConsumed,
    caloriesTarget,
    proteinConsumed,
    proteinTarget
  };

  const calPercent = Math.min(100, rawCalPercent);
  const protPercent = Math.min(100, rawProtPercent);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/25 mb-6 shadow-sm">
            <Sparkles size={14} className="text-[#CCFF00]" />
            <span className="text-xs font-extrabold text-[#CCFF00] uppercase tracking-wider">
              The Future of Performance Training
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-white">
            Train smarter. Build stronger.{' '}
            <span className="bg-gradient-to-r from-[#CCFF00] to-[#00E5FF] bg-clip-text text-transparent">
              Become your best.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            FitForge unites precision strength programming, macro tracking, and intelligent AI coaching into one seamless, unified athletic experience.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="gap-2.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={18} />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/workouts')}
              className="gap-2.5"
            >
              <Dumbbell size={18} />
              <span>Explore Workouts</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-16 bg-[#0E131E]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Everything you need to master your fitness
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card glow="lime" className="p-7">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] flex items-center justify-center mb-5">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Workouts</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Filter routines by muscle group, difficulty, and duration. Detailed sets, reps, and rest periods dialed for hypertrophy.
              </p>
            </Card>

            <Card glow="lime" className="p-7">
              <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/15 text-[#00E5FF] flex items-center justify-center mb-5">
                <Apple size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Macro & Fuel Tracking</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Visual progress bars for calories, protein, carbohydrates, and fats. Structured breakfast, lunch, dinner, and snack tracking.
              </p>
            </Card>

            <Card glow="lime" className="p-7">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A]/15 text-[#FF6B4A] flex items-center justify-center mb-5">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Progress Analytics</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Interactive weight trajectory graphs, workout streaks, calorie burns, and personal record milestones at your fingertips.
              </p>
            </Card>

            <Card glow="lime" className="p-7">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-5">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Fitness Coach</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Always accessible floating assistant with instantaneous answers for exercise form, recovery, stamina, and meal optimizations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Workout Discovery Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 mb-2.5">
                Training Library
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Featured Routines
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Engineered for maximum muscle stimulus and rapid athletic recovery.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/workouts')}
              className="gap-2"
            >
              <span>View All Workouts</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          {featuredWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          ) : (
            <div className="bg-[#121620] border border-white/5 rounded-2xl p-10 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center mb-4 text-[#CCFF00]">
                <Dumbbell size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Routines Created Yet</h3>
              <p className="text-sm text-gray-400 mb-6">
                Build your custom training routines tailored for progressive overload and they will appear here.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/workouts')}
                className="gap-2"
              >
                <Dumbbell size={16} />
                <span>Build a Workout</span>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Split Section: Nutrition & AI Previews */}
      <section className="py-16 bg-[#0E131E]/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nutrition Teaser Card */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25 mb-4">
                  Nutrition Protocol
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Fuel Every Rep With Precision
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Track your daily caloric targets alongside clean protein, complex carbohydrates, and essential fats to guarantee optimal energy and lean mass retention.
                </p>

                {/* Macro Progress Bars Preview */}
                <div className="flex flex-col gap-4 bg-black/30 p-5 rounded-2xl border border-white/5 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-white font-bold">Calories</span>
                      <span className="text-[#CCFF00] font-semibold">
                        {liveNutrition.caloriesConsumed.toLocaleString()} / {liveNutrition.caloriesTarget.toLocaleString()} kcal
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#CCFF00] transition-all duration-500"
                        style={{ width: `${calPercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-white font-bold">Protein</span>
                      <span className="text-[#00E5FF] font-semibold">
                        {liveNutrition.proteinConsumed} / {liveNutrition.proteinTarget}g
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#00E5FF] transition-all duration-500"
                        style={{ width: `${protPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => navigate('/nutrition')}
                className="w-full justify-between"
              >
                <span>Open Nutrition Tracker</span>
                <ArrowRight size={16} />
              </Button>
            </Card>

            {/* AI Trainer Teaser Card */}
            <Card glow="lime" className="p-8 flex flex-col justify-between border-[#CCFF00]/25">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 mb-4">
                  Intelligent Guidance
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Your Personal AI Fitness Coach
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Ask questions about muscle soreness, pre-workout nutrition, routine adjustments, or progressive overload principles anytime, anywhere.
                </p>

                {/* Mock Dialogue Snippet */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl text-sm">
                    <strong className="text-[#CCFF00] font-bold">User:</strong> "What workout should I do today?"
                  </div>
                  <div className="bg-[#CCFF00]/10 border border-[#CCFF00]/25 p-3.5 rounded-xl text-sm">
                    <strong className="text-[#00E5FF] font-bold">AI Coach:</strong> "Chest Hypertrophy Blast is primed for maximum activation today!"
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/ai-trainer')}
                className="w-full justify-between"
              >
                <span>Launch Full AI Coach</span>
                <Bot size={16} />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl border border-[#CCFF00]/30 bg-gradient-to-br from-[#121825] to-[#090C12] p-10 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(204,255,0,0.08)]">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Ready to take control of your physique?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Jump into your personal dashboard, select your next workout, and track your metrics in real-time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Enter Guest Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
