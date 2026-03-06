import type { CardProgress, ModuleStats } from './types';

const STORAGE_KEY_PROGRESS = 'dv_progress';
const STORAGE_KEY_STATS = 'dv_stats';
const STORAGE_KEY_LAST_SYNC = 'dv_last_sync';
const STORAGE_KEY_DAILY = 'dv_daily';
const STORAGE_KEY_LAST_MODULE = 'dv_last_module';

function getStorageKey(prefix: string, telegramId?: string): string {
  if (telegramId) return `${prefix}_${telegramId}`;
  return prefix;
}

export function loadProgress(telegramId?: string): Map<string, CardProgress> {
  try {
    const key = getStorageKey(STORAGE_KEY_PROGRESS, telegramId);
    const raw = localStorage.getItem(key);
    if (!raw) return new Map();
    const arr = JSON.parse(raw) as CardProgress[];
    return new Map(arr.map((p) => [p.cardId, p]));
  } catch {
    return new Map();
  }
}

export function saveProgress(progress: Map<string, CardProgress>, telegramId?: string): void {
  const key = getStorageKey(STORAGE_KEY_PROGRESS, telegramId);
  const arr = Array.from(progress.values());
  localStorage.setItem(key, JSON.stringify(arr));
}

export function loadStats(telegramId?: string): Map<string, ModuleStats> {
  try {
    const key = getStorageKey(STORAGE_KEY_STATS, telegramId);
    const raw = localStorage.getItem(key);
    if (!raw) return new Map();
    const arr = JSON.parse(raw) as ModuleStats[];
    return new Map(arr.map((s) => [s.moduleId, s]));
  } catch {
    return new Map();
  }
}

export function saveStats(stats: Map<string, ModuleStats>, telegramId?: string): void {
  const key = getStorageKey(STORAGE_KEY_STATS, telegramId);
  const arr = Array.from(stats.values());
  localStorage.setItem(key, JSON.stringify(arr));
}

export function getLastSync(telegramId?: string): number | null {
  const key = getStorageKey(STORAGE_KEY_LAST_SYNC, telegramId);
  const raw = localStorage.getItem(key);
  return raw ? parseInt(raw, 10) : null;
}

export function setLastSync(telegramId?: string): void {
  const key = getStorageKey(STORAGE_KEY_LAST_SYNC, telegramId);
  localStorage.setItem(key, String(Date.now()));
}

/** Лог по дням: дата YYYY-MM-DD -> количество оттренированных слов за день */
export function loadDailyLog(telegramId?: string): Record<string, number> {
  try {
    const key = getStorageKey(STORAGE_KEY_DAILY, telegramId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDailyLog(log: Record<string, number>, telegramId?: string): void {
  const key = getStorageKey(STORAGE_KEY_DAILY, telegramId);
  localStorage.setItem(key, JSON.stringify(log));
}

/** Последний открытый модуль (для «Продолжить» как в WRD / 10 Minute English) */
export function loadLastModuleId(telegramId?: string): string | null {
  const key = getStorageKey(STORAGE_KEY_LAST_MODULE, telegramId);
  return localStorage.getItem(key);
}

export function saveLastModuleId(moduleId: string, telegramId?: string): void {
  const key = getStorageKey(STORAGE_KEY_LAST_MODULE, telegramId);
  localStorage.setItem(key, moduleId);
}
