import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CardProgress, ModuleStats, ReviewQuality } from '../types';
import { nextReview, reviewQualityToNumber, createInitialProgress, getDueCardIds } from '../spacedRepetition';
import { loadProgress, saveProgress, loadStats, saveStats, loadDailyLog, saveDailyLog, loadLastModuleId, saveLastModuleId } from '../storage';
import { MODULES } from '../data/modules';

const DAILY_GOAL = 10;

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getStreak(log: Record<string, number>): number {
  let streak = 0;
  const check = new Date();
  for (let i = 0; i < 366; i++) {
    const k = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
    if ((log[k] ?? 0) > 0) streak++;
    else break;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

type TelegramId = string | undefined;

interface AppState {
  progress: Map<string, CardProgress>;
  stats: Map<string, ModuleStats>;
  dailyLog: Record<string, number>;
  telegramId: TelegramId;
  lastModuleId: string | null;
}

interface AppContextValue extends AppState {
  dailyGoal: number;
  learnedToday: number;
  streak: number;
  setTelegramId: (id: TelegramId) => void;
  setLastModuleId: (moduleId: string) => void;
  recordReview: (cardId: string, moduleId: string, quality: ReviewQuality) => void;
  getProgress: (cardId: string) => CardProgress | undefined;
  getDueForModule: (moduleId: string) => string[];
  refreshFromStorage: () => void;
  getModuleStats: (moduleId: string) => ModuleStats;
  getCalendarDays: (days: number) => { date: string; count: number }[];
  getTodayCardIds: () => { cardId: string; moduleId: string }[];
}

const defaultState: AppState = {
  progress: new Map(),
  stats: new Map(),
  dailyLog: {},
  telegramId: undefined,
  lastModuleId: loadLastModuleId() ?? null,
};

const AppContext = createContext<AppContextValue | null>(null);

function ensureStats(stats: Map<string, ModuleStats>, moduleId: string, totalCount: number): ModuleStats {
  let s = stats.get(moduleId);
  if (!s) {
    s = { moduleId, learnedCount: 0, totalCount, dueToday: 0, streakDays: 0 };
    stats.set(moduleId, s);
  }
  return s;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    ...defaultState,
    progress: loadProgress(),
    stats: loadStats(),
    dailyLog: loadDailyLog(),
    lastModuleId: loadLastModuleId() ?? null,
  }));

  const refreshFromStorage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      progress: loadProgress(prev.telegramId),
      stats: loadStats(prev.telegramId),
      dailyLog: loadDailyLog(prev.telegramId),
      lastModuleId: loadLastModuleId(prev.telegramId) ?? null,
    }));
  }, []);

  const setTelegramId = useCallback((telegramId: TelegramId) => {
    setState((prev) => ({
      ...prev,
      telegramId,
      progress: loadProgress(telegramId),
      stats: loadStats(telegramId),
      dailyLog: loadDailyLog(telegramId),
      lastModuleId: loadLastModuleId(telegramId) ?? null,
    }));
  }, []);

  const setLastModuleId = useCallback((moduleId: string) => {
    setState((prev) => {
      saveLastModuleId(moduleId, prev.telegramId);
      return { ...prev, lastModuleId: moduleId };
    });
  }, []);

  const recordReview = useCallback((cardId: string, moduleId: string, quality: ReviewQuality) => {
    const q = reviewQualityToNumber(quality);
    const key = todayKey();
    setState((prev) => {
      const progress = new Map(prev.progress);
      let p = progress.get(cardId);
      if (!p) p = createInitialProgress(cardId, moduleId);
      p = nextReview(p, q);
      progress.set(cardId, p);

      const stats = new Map(prev.stats);
      const mod = MODULES.find((m) => m.id === moduleId);
      const totalCount = mod?.cardIds.length ?? 0;
      const st = ensureStats(stats, moduleId, totalCount);
      st.lastPracticeAt = Date.now();
      const learned = Array.from(progress.values()).filter((x) => x.moduleId === moduleId && x.repetitions > 0).length;
      st.learnedCount = learned;
      st.dueToday = getDueCardIds(progress, mod?.cardIds ?? []).length;

      const dailyLog = { ...prev.dailyLog, [key]: (prev.dailyLog[key] ?? 0) + 1 };
      saveProgress(progress, prev.telegramId);
      saveStats(stats, prev.telegramId);
      saveDailyLog(dailyLog, prev.telegramId);
      return { ...prev, progress, stats, dailyLog };
    });
  }, []);

  const getProgress = useCallback(
    (cardId: string) => state.progress.get(cardId),
    [state.progress]
  );

  const getDueForModule = useCallback(
    (moduleId: string) => {
      const mod = MODULES.find((m) => m.id === moduleId);
      if (!mod) return [];
      return getDueCardIds(state.progress, mod.cardIds);
    },
    [state.progress]
  );

  const getModuleStats = useCallback(
    (moduleId: string): ModuleStats => {
      const mod = MODULES.find((m) => m.id === moduleId);
      const totalCount = mod?.cardIds.length ?? 0;
      return ensureStats(state.stats, moduleId, totalCount);
    },
    [state.stats]
  );

  const learnedToday = state.dailyLog[todayKey()] ?? 0;
  const streak = useMemo(() => getStreak(state.dailyLog), [state.dailyLog]);

  const getCalendarDays = useCallback(
    (days: number): { date: string; count: number }[] => {
      const result: { date: string; count: number }[] = [];
      const d = new Date();
      for (let i = 0; i < days; i++) {
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        result.push({ date: k, count: state.dailyLog[k] ?? 0 });
        d.setDate(d.getDate() - 1);
      }
      return result;
    },
    [state.dailyLog]
  );

  const getTodayCardIds = useCallback((): { cardId: string; moduleId: string }[] => {
    const pool: { cardId: string; moduleId: string }[] = [];
    for (const mod of MODULES) {
      const due = getDueCardIds(state.progress, mod.cardIds);
      due.forEach((cardId) => pool.push({ cardId, moduleId: mod.id }));
    }
    return pool.slice(0, DAILY_GOAL);
  }, [state.progress]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      dailyGoal: DAILY_GOAL,
      learnedToday,
      streak,
      setTelegramId,
      setLastModuleId,
      recordReview,
      getProgress,
      getDueForModule,
      refreshFromStorage,
      getModuleStats,
      getCalendarDays,
      getTodayCardIds,
    }),
    [state, learnedToday, streak, setTelegramId, setLastModuleId, recordReview, getProgress, getDueForModule, refreshFromStorage, getModuleStats, getCalendarDays, getTodayCardIds]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
