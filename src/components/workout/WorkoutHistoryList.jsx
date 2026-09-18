import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Trash2, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { formatDisplayDate } from '../../utils/workoutAnalytics';

export default function WorkoutHistoryList({ history = [], onDeleteSession }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-[#161b22] border border-slate-800 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <Calendar size={20} />
        </div>
        <h4 className="text-base font-bold text-white mb-1">
          No completed workouts yet.
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Finish your first workout session to start recording your personal records and building consistency.
        </p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRelativeDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return formatDisplayDate(dateStr);
  };

  return (
    <div className="space-y-3">
      {history.map((session) => {
        const isExpanded = expandedId === session.id;
        const sessionDate = session.completedAt || session.date;
        const relativeLabel = getRelativeDateLabel(sessionDate);
        const exercises = session.exercises || [];

        return (
          <div
            key={session.id}
            className="bg-[#161b22] border border-slate-800 rounded-2xl overflow-hidden transition hover:border-slate-700"
          >
            {/* Summary Header */}
            <div
              onClick={() => toggleExpand(session.id)}
              className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Trophy size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {session.workoutName || session.name || 'Custom Workout'}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700/60">
                      {relativeLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {session.duration || 45} min
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <Dumbbell size={12} className="text-slate-500" />
                      {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onDeleteSession && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this workout log?')) {
                        onDeleteSession(session.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Delete workout log"
                    aria-label="Delete workout log"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="text-slate-500 p-1">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>

            {/* Expandable Exercise & Performance Breakdown */}
            {isExpanded && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-slate-800/80 bg-[#0d1117] space-y-3">
                <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Recorded Performance Breakdown
                </h5>

                <div className="space-y-2">
                  {exercises.map((ex, exIdx) => (
                    <div
                      key={ex.exerciseId || ex.name || exIdx}
                      className="bg-[#161b22] border border-slate-800/80 rounded-xl p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {ex.muscle || ex.type || 'Exercise'}
                        </span>
                      </div>

                      {/* Sets list */}
                      {ex.sets && ex.sets.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {ex.sets.map((set, sIdx) => {
                            const isCardio = set.duration || set.distance || ex.type === 'cardio';
                            return (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0d1117] border border-slate-800 text-[11px] text-slate-300 font-mono"
                              >
                                <strong className="text-slate-500 font-normal">#{sIdx + 1}</strong>
                                {isCardio ? (
                                  <span>{set.duration || 0}m • {set.distance || 0}km</span>
                                ) : (
                                  <span>{set.reps || 0} reps {set.weight > 0 ? `@ ${set.weight}kg` : ''}</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">
                          Completed protocol as prescribed.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
