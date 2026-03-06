/** Карточка термина по ТЗ: слово, перевод, транскрипция, аудио, примеры */
export interface Card {
  id: string;
  term: string;
  translation: string;
  transcription: string;
  audioUrl?: string;
  examples: string[];
}

/** Модуль — тематическая подборка карточек */
export interface Module {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  cardIds: string[];
  coverColor: string;
  /** Эмодзи-иконка для карточки и шапки (как в Easy Ten) */
  icon: string;
}

/** Состояние карточки для интервальных повторений (SM-2) */
export interface CardProgress {
  cardId: string;
  moduleId: string;
  quality: number;       // 0-5 для SM-2
  repetitions: number;
  interval: number;      // дней
  easeFactor: number;
  nextReviewAt: number;  // timestamp
  lastReviewedAt?: number;
}

/** Оценка ответа пользователя (упрощённо для UI) */
export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

/** Режим обучения */
export type LearningMode = 'flash' | 'choice' | 'listen' | 'builder' | 'pronounce';

/** Статистика по модулю */
export interface ModuleStats {
  moduleId: string;
  learnedCount: number;
  totalCount: number;
  dueToday: number;
  streakDays: number;
  lastPracticeAt?: number;
}
