import React from 'react';
import { getInitials } from '../../utils/formatters';

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl sm:text-3xl font-black'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`
        rounded-full flex items-center justify-center select-none shrink-0
        bg-gradient-to-br from-emerald-500/25 via-[#CCFF00]/20 to-[#00E5FF]/20
        border-2 border-[#CCFF00]/50 text-[#CCFF00]
        shadow-[0_0_20px_rgba(204,255,0,0.2)]
        transition-all duration-200
        ${selectedSize}
        ${className}
      `}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      <span>{initials}</span>
    </div>
  );
}
