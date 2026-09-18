import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Flame, Heart, Shield, Award } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import AIFloatingButton from '../components/ai/AIFloatingButton';

export default function MainLayout() {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const location = useLocation();
  const isAIPage = location.pathname === '/ai-trainer';

  return (
    <div className="flex flex-col min-h-screen bg-[#090C12] text-[#F3F4F6] relative">
      {/* Floating Bubble Pill Navigation */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="flex-1 pt-20 md:pt-24 pb-16">
        <Outlet />
      </main>

      {/* Floating AI Assistant Trigger Button & Drawer */}
      {!isAIPage && (
        <AIFloatingButton
          isOpen={aiDrawerOpen}
          onToggle={() => setAiDrawerOpen((prev) => !prev)}
          onClose={() => setAiDrawerOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto bg-[#0E131E] border-t border-white/10 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950 shadow-[0_2px_8px_rgba(204,255,0,0.3)]">
                  <Flame size={18} strokeWidth={2.8} />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  FitForge
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-4">
                Train smarter. Build stronger. Become your best with intelligent workout analytics and nutritional clarity.
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25">
                Next-Gen Fitness
              </span>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Explore Platform
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <Link to="/workouts" className="text-gray-400 hover:text-white transition duration-150">
                    Workout Routines
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition" className="text-gray-400 hover:text-white transition duration-150">
                    Nutrition & Macro Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/progress" className="text-gray-400 hover:text-white transition duration-150">
                    Progress Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/ai-trainer" className="text-[#CCFF00] hover:underline font-medium transition duration-150">
                    AI Fitness Assistant
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Pillars */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Core Pillars
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Shield size={16} className="text-[#CCFF00] shrink-0" />
                  <span>Science-Backed Hypertrophy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart size={16} className="text-[#00E5FF] shrink-0" />
                  <span>Precision Macro Balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award size={16} className="text-[#FF6B4A] shrink-0" />
                  <span>Real Progress Metrics</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} FitForge. Built for dedicated athletes.</p>
            <p className="flex items-center gap-1.5">
              Frontend UI Architecture Demo • <span className="text-[#CCFF00] font-semibold">Tailwind CSS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
