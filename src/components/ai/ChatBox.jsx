import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { supabase } from '../../services/supabase';
const SUGGESTED_QUESTIONS = [
  "What workout should I do today?",
  "What should I eat after my workout?",
  "Create a beginner workout.",
  "How can I improve my stamina?"
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hey Alex! I'm your FitForge AI Coach. How can I help you crush your training or nutrition goals today?",
    time: '10:00 AM'
  }
];

export default function ChatBox({ onClose, isFullPage = false }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);



  const handleSendMessage = async (text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response.');
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI chat error:', error);

      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I could not connect to FitForge AI right now. Please try again in a moment.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0E131E]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0E131E]/95">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950 shadow-md">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-white tracking-tight">FitForge AI</h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30">
                Online
              </span>
            </div>
            <p className="text-xs text-gray-400">Intelligent Workout & Nutrition Guide</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isFullPage && (
            <button
              onClick={() => {
                if (onClose) onClose();
                navigate('/ai-trainer');
              }}
              title="Open full page"
              className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition duration-150 cursor-pointer"
            >
              <Maximize2 size={16} />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              title="Close chat"
              className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition duration-150 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2.5 border-b border-white/10 bg-black/20 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#CCFF00] mr-1 shrink-0">
          <Sparkles size={12} /> Prompts:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-[#CCFF00]/10 border border-white/10 hover:border-[#CCFF00]/40 text-gray-300 hover:text-white transition duration-150 cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-11 py-1">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
            <span>FitForge AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
}
