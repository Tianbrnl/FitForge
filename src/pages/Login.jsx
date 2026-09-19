import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleForgotPassword = async () => {
    setErrorMsg('');
    setResetMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address first.');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setResetMsg('Password reset link sent. Please check your email.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    navigate('/dashboard');
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
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400">
          Sign in to access your workout splits and nutrition targets.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs mb-4">
          {errorMsg}
        </div>
      )}
      {resetMsg && (
        <div className="p-3 bg-[#CCFF00]/10 border border-[#CCFF00]/25 rounded-xl text-[#CCFF00] text-xs mb-4">
          {resetMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="athlete@fitforge.io"
          required
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password-input" className="text-xs font-semibold text-gray-300">
              Password <span className="text-[#CCFF00]">*</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-xs text-[#CCFF00] hover:underline cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          <LogIn size={16} />
          <span>Sign In to Dashboard</span>
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-gray-400">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-[#CCFF00] font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}
