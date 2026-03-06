import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES } from '../data/modules';
import { getCardsByIds } from '../data/cards';
import { useApp } from '../context/AppContext';
import type { Card } from '../types';
import type { ReviewQuality } from '../types';
import './Trainer.css';

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Trainer() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { getDueForModule, recordReview } = useApp();
  const [step, setStep] = useState<'question' | 'result'>('question');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [queue, setQueue] = useState<Card[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [lastSessionSize, setLastSessionSize] = useState(0);

  const module = MODULES.find((m) => m.id === moduleId);
  const dueIds = useMemo(() => getDueForModule(moduleId ?? ''), [moduleId, getDueForModule]);
  const allCards = useMemo(() => (module ? getCardsByIds(module.cardIds) : []), [module]);

  const currentCard = queue[queueIndex];
  const options = useMemo(() => {
    if (!currentCard) return [];
    const others = allCards.filter((c) => c.id !== currentCard.id);
    const pick = shuffle(others).slice(0, 3);
    return shuffle([currentCard, ...pick]);
  }, [currentCard, allCards]);

  const startSession = useCallback(() => {
    const ids = dueIds.length > 0 ? dueIds : module?.cardIds ?? [];
    const cards = getCardsByIds(ids);
    setLastSessionSize(0);
    setQueue(shuffle(cards));
    setQueueIndex(0);
    setStep('question');
    setSelectedId(null);
  }, [dueIds, module]);

  if (!module) {
    return (
      <div className="trainer">
        <p>Модуль не найден.</p>
        <Link to="/">На главную</Link>
      </div>
    );
  }

  if (queue.length === 0 && lastSessionSize > 0) {
    return (
      <div className="trainer trainer-done">
        <div className="trainer-done-illo" aria-hidden>🎉</div>
        <p className="trainer-done-title">Сессия завершена</p>
        <p className="trainer-done-count">Повторено слов: {lastSessionSize}</p>
        <div className="trainer-done-actions">
          <button type="button" className="btn btn-primary" onClick={startSession}>Повторить</button>
          <Link to={`/module/${moduleId}`} className="btn btn-ghost">К модулю</Link>
        </div>
      </div>
    );
  }

  if (queue.length === 0 && queueIndex === 0) {
    return (
      <div className="trainer trainer-start">
        <p>Тренажёр: выбор перевода.</p>
        <p className="trainer-desc">Будут показаны слова из модуля «{module.titleRu}». Выберите правильный перевод.</p>
        <button type="button" className="btn btn-primary" onClick={startSession}>
          Начать
        </button>
        <Link to={`/module/${moduleId}`} className="btn btn-ghost">К модулю</Link>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="trainer trainer-done">
        <div className="trainer-done-illo" aria-hidden>🎉</div>
        <p className="trainer-done-title">Сессия завершена</p>
        {lastSessionSize > 0 && (
          <p className="trainer-done-count">Повторено слов: {lastSessionSize}</p>
        )}
        <div className="trainer-done-actions">
          <button type="button" className="btn btn-primary" onClick={startSession}>Повторить</button>
          <Link to={`/module/${moduleId}`} className="btn btn-ghost">К модулю</Link>
        </div>
      </div>
    );
  }

  const correct = selectedId === currentCard.id;
  const showResult = step === 'result';

  const handleOption = (card: Card) => {
    if (showResult) return;
    setSelectedId(card.id);
    setStep('result');
    const quality: ReviewQuality = card.id === currentCard.id ? 'good' : 'again';
    recordReview(currentCard.id, module.id, quality);
  };

  const handleNext = () => {
    if (queueIndex + 1 >= queue.length) {
      setLastSessionSize(queue.length);
      setQueue([]);
      setQueueIndex(0);
    } else {
      setQueueIndex((i) => i + 1);
      setStep('question');
      setSelectedId(null);
    }
  };

  return (
    <div className="trainer">
      <div className="trainer-progress">
        {queueIndex + 1} / {queue.length}
      </div>
      <div className="trainer-prompt">
        <span className="trainer-term">{currentCard.term}</span>
        <span className="trainer-transcription">{currentCard.transcription}</span>
      </div>
      <p className="trainer-instruction">Выберите правильный перевод:</p>
      <div className="trainer-options">
        {options.map((card) => {
          const isSelected = selectedId === card.id;
          const isCorrect = card.id === currentCard.id;
          let stateClass = '';
          if (showResult) {
            if (isCorrect) stateClass = 'correct';
            else if (isSelected && !isCorrect) stateClass = 'wrong';
          }
          return (
            <button
              key={card.id}
              type="button"
              className={`trainer-option ${stateClass}`}
              onClick={() => handleOption(card)}
              disabled={showResult}
            >
              {card.translation}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="trainer-feedback">
          {correct ? <span className="trainer-feedback-ok">Верно!</span> : <span className="trainer-feedback-fail">Правильно: {currentCard.translation}</span>}
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            {queueIndex + 1 >= queue.length ? 'Завершить' : 'Далее'}
          </button>
        </div>
      )}
      <Link to={`/module/${moduleId}`} className="trainer-back btn btn-ghost">Выйти</Link>
    </div>
  );
}
