import React from 'react';

export default function Loading({ message = 'Loading FitForge...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-5">
      <div className="w-11 h-11 rounded-full border-3 border-[#CCFF00]/20 border-t-[#CCFF00] animate-spin" />
      <p className="text-sm font-medium text-gray-400 tracking-wide">
        {message}
      </p>
    </div>
  );
}
