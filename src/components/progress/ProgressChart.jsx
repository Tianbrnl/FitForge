import React, { useState } from 'react';
import Card from '../common/Card';

export default function ProgressChart({
  title,
  type = 'bar', // 'bar' | 'line'
  data = [],
  height = 220,
  unit = ''
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (type === 'bar') {
    const maxVal = Math.max(...data.map(d => d.calories || d.minutes || 1), 700);

    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
          <span className="text-xs text-gray-400">Past 7 Days</span>
        </div>

        <div className="flex items-end justify-between pt-4 gap-3 h-56">
          {data.map((item, idx) => {
            const val = item.calories || item.minutes || 0;
            const pct = Math.max(8, Math.min(100, Math.round((val / maxVal) * 100)));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.day || idx}
                className="flex flex-col items-center flex-1 h-full justify-end cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-8 bg-[#0E131E] border border-[#CCFF00] px-2 py-1 rounded text-[11px] font-bold text-white whitespace-nowrap z-10 shadow-lg">
                    {val} {unit || 'kcal'} {item.minutes ? `(${item.minutes}m)` : ''}
                  </div>
                )}

                {/* Bar */}
                <div
                  className={`
                    w-full max-w-9 rounded-t-md transition-all duration-300 origin-bottom
                    ${item.isToday
                      ? 'bg-gradient-to-t from-[#CCFF00] to-[#00E5FF] shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                      : item.completed
                      ? 'bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                      : 'bg-white/10'
                    }
                    ${isHovered ? 'scale-y-105' : 'scale-y-100'}
                  `}
                  style={{ height: `${pct}%` }}
                />

                {/* Day label */}
                <span className={`
                  mt-3 text-xs font-semibold
                  ${item.isToday ? 'text-[#CCFF00] font-bold' : 'text-gray-400'}
                `}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  // Line Chart representation for weight progression
  const minVal = Math.min(...data.map(d => d.weight)) - 1;
  const maxVal = Math.max(...data.map(d => d.weight)) + 1;
  const range = maxVal - minVal || 1;

  const width = 600;
  const svgHeight = height;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = width - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * plotWidth;
    const y = svgHeight - paddingY - ((d.weight - minVal) / range) * plotHeight;
    return { x, y, ...d };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPolyStr = `${points[0]?.x || 0},${svgHeight - paddingY} ` +
    polylineStr +
    ` ${points[points.length - 1]?.x || 0},${svgHeight - paddingY}`;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <span className="text-xs text-[#CCFF00] font-bold">
          {data[0]?.weight} kg → {data[data.length - 1]?.weight} kg
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="w-full h-auto min-w-[380px] overflow-visible"
        >
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((pct, i) => {
            const y = paddingY + pct * plotHeight;
            const wLabel = (maxVal - pct * range).toFixed(1);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="end"
                >
                  {wLabel}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <polygon points={areaPolyStr} fill="url(#chartGlow)" />

          {/* Line curve */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke="#CCFF00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#090C12"
                stroke="#CCFF00"
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={svgHeight - 10}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="middle"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}
