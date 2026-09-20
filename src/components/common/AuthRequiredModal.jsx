import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Bot, 
  Dumbbell, 
  Apple, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import Button from './Button';

const FEATURE_CONFIGS = {
  ai: {
    icon: Bot,
    accentColor: 'from-[#CCFF00] to-[#00E5FF]',
    iconBg: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
    title: 'Sign In to Access FitForge AI',
    description: 'Your personal AI Fitness Coach tailors workout advice, form tips, and macro strategies specifically to your profile.',
    benefits: [
      '10 free personalized AI coaching queries every day',
      'Context-aware answers based on your logged routines and goals',
      'Instant exercise substitutions and injury recovery tips'
    ]
  },
  workout: {
    icon: Dumbbell,
    accentColor: 'from-[#CCFF00] to-emerald-400',
    iconBg: 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30',
    title: 'Sign In to Create Workouts',
    description: 'Save custom workout splits, exercise volume, target weights, and rep ranges directly to your personal training account.',
    benefits: [
      'Build unlimited tailored routines with our exercise library',
      'Track set-by-set progression and progressive overload',
      'Synchronize routines seamlessly across all your devices'
    ]
  },
  nutrition: {
    icon: Apple,
    accentColor: 'from-[#FF6B4A] to-[#CCFF00]',
    iconBg: 'bg-[#FF6B4A]/15 text-[#FF6B4A] border-[#FF6B4A]/30',
    title: 'Sign In to Track Nutrition',
    description: 'Log your daily meals, track macronutrients, and customize your caloric targets to match your athletic ambitions.',
    benefits: [
      'Log breakfast, lunch, dinner, and snacks with detailed macros',
      'Set custom targets for protein, carbohydrates, and healthy fats',
      'Real-time synchronization with your athlete dashboard'
    ]
  },
  default: {
    icon: Lock,
    accentColor: 'from-[#CCFF00] to-[#00E5FF]',
    iconBg: 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30',
    title: 'Account Required',
    description: 'Sign in to access your profile data, synchronize your progress, and unlock all athlete features.',
    benefits: [
      'Secure, cloud-synchronized fitness and meal history',
      'Interactive performance trajectory charts and personal records',
      'Full access to all FitForge intelligence tools'
    ]
  }
};

export default function AuthRequiredModal({
  isOpen,
  onClose,
  feature = 'default',
  title,
  description,
  returnUrl
}) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const config = FEATURE_CONFIGS[feature] || FEATURE_CONFIGS.default;
  const IconComponent = config.icon;
  const effectiveTitle = title || config.title;
  const effectiveDescription = description || config.description;
  const targetReturn = returnUrl || location.pathname;

  const handleGoToLogin = () => {
    onClose();
    navigate('/login', { state: { from: targetReturn } });
  };

  const handleGoToRegister = () => {
    onClose();
    navigate('/register', { state: { from: targetReturn } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-b from-[#161D2B] to-[#0A0D14] shadow-2xl p-6 sm:p-7 relative overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg ${config.iconBg}`}>
            <IconComponent size={24} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#CCFF00]">
              <Sparkles size={12} />
              <span>Athlete Account</span>
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              {effectiveTitle}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          {effectiveDescription}
        </p>

        {/* Perks / Benefits */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 mb-6 space-y-2.5">
          {config.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
              <CheckCircle2 size={15} className="text-[#CCFF00] shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center text-sm font-black shadow-[0_0_20px_rgba(204,255,0,0.25)]"
            onClick={handleGoToLogin}
          >
            <span>Sign In to Your Account</span>
            <ArrowRight size={16} />
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center text-xs font-bold"
            onClick={handleGoToRegister}
          >
            <span>Create Free Account</span>
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 transition cursor-pointer text-center"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
