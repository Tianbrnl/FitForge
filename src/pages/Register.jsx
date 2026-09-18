import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, LogOut, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { width: 'w-1/4', label: 'Weak', bg: 'bg-red-500', text: 'text-red-400' };
      case 2:
        return { width: 'w-2/4', label: 'Fair', bg: 'bg-amber-500', text: 'text-amber-400' };
      case 3:
        return { width: 'w-3/4', label: 'Good', bg: 'bg-[#00E5FF]', text: 'text-[#00E5FF]' };
      case 4:
      default:
        return { width: 'w-full', label: 'Strong', bg: 'bg-emerald-500', text: 'text-emerald-400' };
    }
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please complete all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data.user) {
      navigate('/dashboard');
    }
  };

  if (user) {
    return (
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          Already Signed In
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          You are currently signed in as{' '}
          <span className="text-[#CCFF00] font-semibold">{profile?.full_name || user.email}</span>.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
          </Button>
          <Button
            variant="danger"
            className="w-full flex items-center justify-center gap-2"
            onClick={async () => {
              await signOut();
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          Create Athlete Account
        </h2>
        <p className="text-sm text-gray-400">
          Start tracking workouts, nutrition, and personal records today.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs mb-4">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
        {/* Name */}
        <Input
          label="Full Name"
          type="text"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jordan Hayes"
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="athlete@fitforge.io"
          required
        />


        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-300">Password</label>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/25"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 chars recommended"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-white cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength meter */}
          {password && (
            <div className="mt-1">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-400">Password Strength</span>
                <span className={`font-bold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.bg} ${passwordStrength.width}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-300">Confirm Password</label>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/25"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          Create FitForge Account
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-gray-400">
        <span>Already have an account? </span>
        <Link to="/login" className="text-[#CCFF00] font-bold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}
