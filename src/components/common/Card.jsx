import React from 'react';

export default function Card({
  children,
  className = '',
  interactive = false,
  glow = false, // 'lime' | 'cyan' | false
  onClick,
  ...props
}) {
  const baseClasses = 'rounded-2xl border border-white/10 bg-[#121825]/75 backdrop-blur-xl p-6 transition duration-300 shadow-lg relative overflow-hidden';
  const interactiveClasses = interactive
    ? 'hover:bg-[#192234]/85 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl cursor-pointer'
    : '';
  const glowClasses = glow === 'lime'
    ? 'hover:border-[#CCFF00]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(204,255,0,0.12)]'
    : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${interactiveClasses}
        ${glowClasses}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
