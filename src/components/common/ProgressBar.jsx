import React from 'react';

const COLOR_CLASSES = {
  lime: 'bg-[#CCFF00]',
  cyan: 'bg-[#00E5FF]',
  orange: 'bg-[#FF6B4A]',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500'
};

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'lime',
  height = 'h-2',
  className = '',
  barClassName = ''
}) {
  const pct = Math.max(0, Math.min(100, Math.round((Number(value) / (Number(max) || 1)) * 100)));
  const fillBg = COLOR_CLASSES[color] || COLOR_CLASSES.lime;

  return (
    <div className={`w-full ${height} rounded-full bg-white/10 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${fillBg} transition-all duration-500 ease-out ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
