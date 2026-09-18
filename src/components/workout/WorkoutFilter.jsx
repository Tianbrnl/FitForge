import React from 'react';

const CATEGORIES = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio'
];

export default function WorkoutFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition duration-150 cursor-pointer active:scale-95
              ${isActive
                ? 'bg-[#CCFF00] text-gray-950 font-bold shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
