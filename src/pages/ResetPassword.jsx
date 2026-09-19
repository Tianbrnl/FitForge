import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRecoverySessionReady, setIsRecoverySessionReady] = useState(false);

  useEffect(() => {
    // Supabase can supply access tokens in the URL hash (Implicit flow) or query params (PKCE flow)
    const hash = window.location.hash;
    const search = window.location.search;
    const hasRecoveryTokens =
      hash.includes('access_token') ||
      hash.includes('type=recovery') ||
      search.includes('code=');

    if (session || hasRecoveryTokens) {
      setIsRecoverySessionReady(true);
    }

    // Listen for password recovery auth event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY' || newSession) {
        setIsRecoverySessionReady(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [session]);

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in both password fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to update password. Your reset link may have expired.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Password Updated!
        </h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Your password has been changed successfully. You can now use your new password to sign in.
        </p>
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => navigate('/login')}
        >
          <span>Return to Sign In</span>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center mx-auto mb-3">
          <KeyRound size={22} />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-400">
          Enter and confirm your new password below.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Warning banner if visited without an active recovery session and finished loading */}
      {!authLoading && !isRecoverySessionReady && !session && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-300 text-xs mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>
            No active password reset link detected. If you arrived here directly, please request a reset link from the login page.
          </span>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="New Password"
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* Password strength meter */}
          {password && (
            <div className="mt-1">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-400 text-[11px]">Password strength:</span>
                <span className={`font-semibold text-[11px] ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.bg} ${passwordStrength.width}`}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          id="confirm-password"
          type={showConfirmPassword ? 'text' : 'password'}
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <p className="text-[11px] text-gray-500">
          Must be at least 6 characters. Recommended to include letters, numbers, and symbols.
        </p>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          <span>Update Password</span>
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#CCFF00] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
