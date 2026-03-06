import type { Module } from '../types';
import { CARD_IDS_BY_MODULE } from './cards';

export const MODULES: Module[] = [
  { id: 'diplomatic', title: 'Diplomacy & Protocol', titleRu: 'Дипломатия и протокол', description: 'Вербальные ноты, демарши, послы, переговоры', cardIds: CARD_IDS_BY_MODULE.diplomaticIds, coverColor: '#1a365d', icon: '🤝' },
  { id: 'un', title: 'UN & Organizations', titleRu: 'ООН и организации', description: 'ООН, НАТО, ЕС, МВФ, ВТО, ВОЗ и др.', cardIds: CARD_IDS_BY_MODULE.unIds, coverColor: '#2c5282', icon: '🏛️' },
  { id: 'crisis', title: 'Security & Crisis', titleRu: 'Безопасность и кризисы', description: 'Санкции, миротворчество, беженцы, терроризм', cardIds: CARD_IDS_BY_MODULE.crisisIds, coverColor: '#2d3748', icon: '🛡️' },
  { id: 'basics', title: 'Core Concepts', titleRu: 'Основы МО', description: 'Международные отношения, суверенитет, геополитика', cardIds: CARD_IDS_BY_MODULE.basicsIds, coverColor: '#276749', icon: '🌍' },
  { id: 'state', title: 'State & Governance', titleRu: 'Государство и власть', description: 'Парламент, конституция, выборы, демократия', cardIds: CARD_IDS_BY_MODULE.stateIds, coverColor: '#2f855a', icon: '⚖️' },
  { id: 'economy', title: 'Economy & Trade', titleRu: 'Экономика и торговля', description: 'ВВП, экспорт, тарифы, устойчивое развитие', cardIds: CARD_IDS_BY_MODULE.economyIds, coverColor: '#38a169', icon: '📈' },
  { id: 'law', title: 'International Law', titleRu: 'Международное право', description: 'Договоры, конвенции, права человека, суды', cardIds: CARD_IDS_BY_MODULE.lawIds, coverColor: '#2589bd', icon: '📜' },
  { id: 'society', title: 'Society & Culture', titleRu: 'Общество и культура', description: 'Мультикультурализм, толерантность, климат', cardIds: CARD_IDS_BY_MODULE.societyIds, coverColor: '#805ad5', icon: '🎭' },
  { id: 'academic', title: 'Academic', titleRu: 'Академия', description: 'Эссе, исследование, методология, цитирование', cardIds: CARD_IDS_BY_MODULE.academicIds, coverColor: '#d69e2e', icon: '🎓' },
  { id: 'phrases', title: 'Phrases & Communication', titleRu: 'Фразы и общение', description: 'Фразовые глаголы, речевые формулы, идиомы', cardIds: CARD_IDS_BY_MODULE.phrasesIds, coverColor: '#c05621', icon: '💬' },
];
