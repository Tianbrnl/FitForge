import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled = false }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3.5 border-t border-white/10 bg-[#0A0E16]/95"
    >
      <input
        type="text"
        placeholder="Ask FitForge AI anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition duration-150 focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]/25"
      />

      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition duration-150 active:scale-95
          ${text.trim() && !disabled
            ? 'bg-[#CCFF00] text-gray-950 hover:bg-[#b5e600] shadow-[0_0_12px_rgba(204,255,0,0.3)] cursor-pointer'
            : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }
        `}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
