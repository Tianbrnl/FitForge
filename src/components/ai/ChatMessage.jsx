import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 items-start mb-4 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md
        ${isAI
          ? 'bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] text-gray-950 shadow-[0_0_12px_rgba(204,255,0,0.25)]'
          : 'bg-white/10 text-white'
        }
      `}>
        {isAI ? <Bot size={18} /> : <User size={16} />}
      </div>

      {/* Bubble */}
      <div className={`
        max-w-[82%] px-4 py-3 text-sm leading-relaxed break-words shadow-md
        ${isAI
          ? 'rounded-2xl rounded-tl-xs bg-white/5 text-gray-100 border border-white/10'
          : 'rounded-2xl rounded-tr-xs bg-[#CCFF00] text-gray-950 font-medium shadow-[0_4px_12px_rgba(204,255,0,0.2)]'
        }
      `}>
        <div className="whitespace-pre-line">{message.text}</div>
        <div className={`text-[10px] mt-1.5 opacity-60 ${isAI ? 'text-left' : 'text-right'}`}>
          {message.time || 'Just now'}
        </div>
      </div>
    </div>
  );
}
