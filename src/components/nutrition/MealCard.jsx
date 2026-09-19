import React from 'react';
import { Plus, Trash2, Utensils, Edit3 } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function MealCard({
  mealKey,
  title,
  icon: Icon = Utensils,
  items = [],
  onOpenAddModal,
  onRemoveItem,
  onEditItem
}) {
  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = items.reduce((sum, item) => sum + (item.fat || 0), 0);

  return (
    <Card className="p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center">
            <Icon size={16} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
            <span className="text-xs text-gray-400">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-lg font-black text-white">{totalCalories}</span>
            <span className="text-xs text-gray-400">kcal</span>
          </div>
          <div className="flex gap-2 text-[11px] text-gray-400">
            <span>P: {totalProtein}g</span>
            <span>C: {totalCarbs}g</span>
            <span>F: {totalFat}g</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-2 mb-4 flex-1">
        {items.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-2">
            No foods logged for {title.toLowerCase()} yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.portion} • <span className="text-[#CCFF00] font-medium">{item.calories} kcal</span>{' '}
                  <span className="text-gray-500">(P: {item.protein}g, C: {item.carbs}g, F: {item.fat}g)</span>
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {onEditItem && (
                  <button
                    type="button"
                    onClick={() => onEditItem(mealKey, item)}
                    className="text-gray-500 hover:text-[#CCFF00] p-1.5 rounded-lg hover:bg-white/5 transition duration-150 cursor-pointer"
                    title="Edit food"
                    aria-label="Edit food"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(mealKey, item.id)}
                    className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition duration-150 cursor-pointer"
                    title="Remove food"
                    aria-label="Remove food"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Food Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-center border border-dashed border-white/20 hover:border-[#CCFF00]/40 text-gray-300 hover:text-white"
        onClick={() => onOpenAddModal(mealKey)}
      >
        <Plus size={14} />
        <span>Add Food to {title}</span>
      </Button>
    </Card>
  );
}
