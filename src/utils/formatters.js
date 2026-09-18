export function formatCalories(val) {
  if (val == null) return "0 kcal";
  return `${Number(val).toLocaleString()} kcal`;
}

export function formatWeight(val, unit = "kg") {
  if (val == null) return `0 ${unit}`;
  return `${Number(val).toFixed(1)} ${unit}`;
}

export function formatDuration(minutes) {
  if (!minutes) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function calcPercent(current, target) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getMacroColor(macro) {
  switch (macro.toLowerCase()) {
    case "protein":
      return "var(--accent-lime)";
    case "carbs":
    case "carbohydrates":
      return "var(--accent-cyan)";
    case "fat":
    case "fats":
      return "var(--accent-orange)";
    case "calories":
      return "#FBBF24";
    default:
      return "#CCFF00";
  }
}

export function getWorkoutGradientClass(workoutId, category) {
  switch (workoutId) {
    case 'w-chest-hypertrophy':
      return 'bg-gradient-to-br from-slate-800 to-slate-950';
    case 'w-back-v-taper':
      return 'bg-gradient-to-br from-indigo-950 to-slate-950';
    case 'w-quad-glute-forge':
      return 'bg-gradient-to-br from-rose-950 to-slate-950';
    case 'w-3d-shoulders':
      return 'bg-gradient-to-br from-amber-950 to-slate-950';
    case 'w-arms-overload':
      return 'bg-gradient-to-br from-purple-950 to-slate-950';
    case 'w-iron-core':
      return 'bg-gradient-to-br from-emerald-950 to-slate-950';
    case 'w-hiit-metcon':
      return 'bg-gradient-to-br from-orange-950 to-slate-950';
    case 'w-upper-body-power':
      return 'bg-gradient-to-br from-cyan-950 to-slate-950';
    default:
      switch (category?.toLowerCase()) {
        case 'chest':
          return 'bg-gradient-to-br from-slate-800 to-slate-950';
        case 'back':
          return 'bg-gradient-to-br from-indigo-950 to-slate-950';
        case 'legs':
          return 'bg-gradient-to-br from-rose-950 to-slate-950';
        case 'shoulders':
          return 'bg-gradient-to-br from-amber-950 to-slate-950';
        case 'arms':
          return 'bg-gradient-to-br from-purple-950 to-slate-950';
        case 'core':
          return 'bg-gradient-to-br from-emerald-950 to-slate-950';
        case 'cardio':
          return 'bg-gradient-to-br from-orange-950 to-slate-950';
        default:
          return 'bg-gradient-to-br from-slate-900 to-[#0A1017]';
      }
  }
}

