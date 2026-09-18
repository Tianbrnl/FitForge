import React from 'react';
import Card from '../common/Card';

export default function ProgressCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  accentColor = 'text-[#CCFF00]'
}) {
  return (
    <Card className="p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${accentColor}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1.5">
        <span className="text-3xl font-black text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-gray-400">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        {trend && (
          <span className={`font-bold ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-gray-400">
            {subtitle}
          </span>
        )}
      </div>
    </Card>
  );
}
