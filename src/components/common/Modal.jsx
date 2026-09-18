import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg' // Tailwind max-w class
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0E131E] shadow-2xl transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/15 transition duration-150"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
