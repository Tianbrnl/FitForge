import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Flame, ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative bg-[#090C12]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Back to Home button */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition duration-150 active:scale-95"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Link>

      {/* Brand Icon Header */}
      <div className="text-center mb-8 z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] inline-flex items-center justify-center text-gray-950 mb-3 shadow-[0_8px_24px_rgba(204,255,0,0.3)]">
          <Flame size={32} strokeWidth={2.6} />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          FitForge
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Train smarter. Build stronger.
        </p>
      </div>

      {/* Routed Auth Form Card */}
      <div className="w-full max-w-md bg-[#0E131E] border border-white/15 rounded-3xl p-8 shadow-2xl z-10">
        <Outlet />
      </div>
    </div>
  );
}
