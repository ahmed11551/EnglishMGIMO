/** Приветствие по времени суток (как в Easy Ten / Duolingo) */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Доброе утро';
  if (h >= 12 && h < 18) return 'Добрый день';
  if (h >= 18 && h < 23) return 'Добрый вечер';
  return 'Доброй ночи';
}

export const MOTIVATIONAL_TIPS = [
  '10 слов в день = 70 в неделю',
  'Повторение — мать учения',
  'Маленькие шаги каждый день',
  'Каждое слово приближает к цели',
];

export function getRandomTip(): string {
  return MOTIVATIONAL_TIPS[Math.floor(Math.random() * MOTIVATIONAL_TIPS.length)];
}

/** Фразы при достижении дневной цели (10/10) — как в Easy Ten */
export const GOAL_PHRASES = [
  'Отлично! Цель на сегодня выполнена 🎉',
  'Вы молодец! 10 слов — и день не зря',
  'Супер! Завтра снова 10 слов?',
  'Цель достигнута! Так держать 💪',
  'Идеально! Носитель использует ~3000 слов — вы приближаетесь',
  '10 из 10! За неделю это уже 70 новых слов',
];

export function getRandomGoalPhrase(): string {
  return GOAL_PHRASES[Math.floor(Math.random() * GOAL_PHRASES.length)];
}
