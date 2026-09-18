import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { supabase } from '../services/supabase';
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
              onClick={() => alert("Password reset simulation: A temporary reset link has been sent to your email.")}
              className="text-xs text-[#CCFF00] hover:underline cursor-pointer"
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
