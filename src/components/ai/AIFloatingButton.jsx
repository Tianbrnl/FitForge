import React from 'react';
import { Bot, X } from 'lucide-react';
import ChatBox from './ChatBox';

export default function AIFloatingButton({ isOpen, onToggle, onClose }) {
  return (
    <>
      {/* Floating AI Assistant Trigger Button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#CCFF00]/40 bg-[#0E1420]/90 backdrop-blur-xl p-2 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(204,255,0,0.2)] hover:border-[#CCFF00] hover:shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(204,255,0,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        onClick={onToggle}
        aria-label="Ask FitForge AI"
        title="Ask FitForge AI"
      >
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950 shadow-md">
          <span className="absolute inset-[-4px] rounded-full bg-[#CCFF00] opacity-30 animate-ping pointer-events-none" />
          {isOpen ? <X size={20} /> : <Bot size={20} />}
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-white tracking-tight">AI Coach</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Ask FitForge AI</span>
        </div>
      </button>

      {/* AI Chat Panel - Responsive Modal/Drawer */}
      {isOpen && (
        <>
          {/* Mobile Backdrop (doesn't cover top header to avoid interfering with hamburger) */}
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Chat Container: Bottom Sheet on Mobile, Fixed Bottom-Right Card on Desktop */}
          <div className="fixed bottom-0 md:bottom-24 inset-x-0 md:inset-x-auto md:right-6 z-50 w-full md:w-[410px] h-[82vh] md:h-[560px] max-h-[calc(100vh-5rem)] bg-[#0E131E] border border-white/15 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out">
            <ChatBox onClose={onClose} />
          </div>
        </>
      )}
    </>
  );
}
