import { useLocalStorage } from './useLocalStorage';
import { defaultWorkoutHistory } from '../data/defaultHistory';

export function useWorkoutHistory() {
  const [history, setHistory] = useLocalStorage(
    'fitforge_workout_history',
    defaultWorkoutHistory
  );

  const saveSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: sessionData.id || `session-${Date.now()}`,
      completedAt: sessionData.completedAt || new Date().toISOString().split('T')[0]
    };

    setHistory((prev) => [newSession, ...prev]);
    return newSession;
  };

  const deleteSession = (id) => {
    setHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const loadDemoHistory = () => {
    setHistory(defaultWorkoutHistory);
  };

  const getSessionById = (id) => {
    return history.find((s) => s.id === id) || null;
  };

  return {
    history,
    saveSession,
    deleteSession,
    clearHistory,
    loadDemoHistory,
    getSessionById
  };
}
