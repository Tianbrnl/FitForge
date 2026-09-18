import React from 'react';
import { Sparkles, Dumbbell, Apple, HeartPulse, HelpCircle } from 'lucide-react';
import Card from '../components/common/Card';
import ChatBox from '../components/ai/ChatBox';

export default function AITrainer() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/25 mb-4">
          <Sparkles size={14} className="text-[#CCFF00]" />
          <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider">
            FitForge Intelligence Engine
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Meet Your Dedicated{' '}
          <span className="bg-gradient-to-r from-[#CCFF00] to-[#00E5FF] bg-clip-text text-transparent">
            AI Fitness Coach
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
          Get instant guidance on training programming, optimal rest intervals, form cues, macronutrient breakdown, and post-workout fuel.
        </p>
      </div>

      {/* Topics Guidance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0E131E] border border-white/10 text-xs font-bold text-white">
          <Dumbbell size={16} className="text-[#CCFF00] shrink-0" />
          <span>Custom Splits</span>
        </div>

        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0E131E] border border-white/10 text-xs font-bold text-white">
          <Apple size={16} className="text-[#00E5FF] shrink-0" />
          <span>Macro Breakdown</span>
        </div>

        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0E131E] border border-white/10 text-xs font-bold text-white">
          <HeartPulse size={16} className="text-[#FF6B4A] shrink-0" />
          <span>Recovery & Sleep</span>
        </div>

        <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-[#0E131E] border border-white/10 text-xs font-bold text-white">
          <HelpCircle size={16} className="text-purple-400 shrink-0" />
          <span>Form Diagnostics</span>
        </div>
      </div>

      {/* Main Full-Page Chat Container */}
      <Card className="p-0 h-[620px] overflow-hidden border-white/15 shadow-2xl">
        <ChatBox isFullPage={true} />
      </Card>
    </div>
  );
}
