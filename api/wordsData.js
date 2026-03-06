/**
 * Слова для бота «Слова дня» — синхронизированы с лексикой приложения МГИМО ENGLISH.
 * Формат: { term, translation, example, moduleRu }
 */

const MODULE_NAMES = {
  dc: 'Дипломатия и протокол',
  un: 'ООН и организации',
  cr: 'Безопасность и кризисы',
  b: 'Основы МО',
  st: 'Государство и власть',
  ec: 'Экономика и торговля',
  lw: 'Международное право',
  so: 'Общество и культура',
  ac: 'Академия',
  ph: 'Фразы и общение',
};

const WORDS = [
  { id: 'dc-1', term: 'note verbale', translation: 'вербальная нота', example: 'The embassy sent a note verbale to the Ministry.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-2', term: 'persona non grata', translation: 'персона нон грата', example: 'The diplomat was declared persona non grata.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-3', term: 'démarche', translation: 'демарш', example: 'The ambassador made a démarche regarding the incident.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-4', term: 'accredit', translation: 'аккредитовать', example: 'He was accredited as ambassador to the UN.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-5', term: 'diplomatic protocol', translation: 'дипломатический протокол', example: 'Diplomatic protocol governs official ceremonies.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-12', term: 'summit', translation: 'саммит', example: 'The G20 summit will discuss climate.', moduleRu: MODULE_NAMES.dc },
  { id: 'dc-13', term: 'negotiation', translation: 'переговоры', example: 'Negotiations between the parties resumed.', moduleRu: MODULE_NAMES.dc },
  { id: 'un-1', term: 'UN', translation: 'ООН', example: 'The UN was founded in 1945.', moduleRu: MODULE_NAMES.un },
  { id: 'un-2', term: 'Security Council', translation: 'Совет Безопасности ООН', example: 'The Security Council adopted a resolution.', moduleRu: MODULE_NAMES.un },
  { id: 'un-4', term: 'resolution', translation: 'резолюция', example: 'The resolution was adopted by 14 votes.', moduleRu: MODULE_NAMES.un },
  { id: 'un-5', term: 'peacekeeping', translation: 'миротворчество', example: 'Peacekeeping forces were deployed.', moduleRu: MODULE_NAMES.un },
  { id: 'un-10', term: 'BRICS', translation: 'БРИКС', example: 'BRICS brings together emerging economies.', moduleRu: MODULE_NAMES.un },
  { id: 'un-13', term: 'WTO', translation: 'ВТО', example: 'The WTO regulates global trade.', moduleRu: MODULE_NAMES.un },
  { id: 'un-15', term: 'WHO', translation: 'ВОЗ', example: 'The WHO coordinates global health.', moduleRu: MODULE_NAMES.un },
  { id: 'cr-1', term: 'ceasefire', translation: 'прекращение огня', example: 'The parties agreed to a ceasefire.', moduleRu: MODULE_NAMES.cr },
  { id: 'cr-2', term: 'mediation', translation: 'посредничество', example: 'UN offered its good offices for mediation.', moduleRu: MODULE_NAMES.cr },
  { id: 'cr-3', term: 'sanctions', translation: 'санкции', example: 'Sanctions were imposed by the Security Council.', moduleRu: MODULE_NAMES.cr },
  { id: 'cr-5', term: 'refugee', translation: 'беженец', example: 'Refugees fled the conflict zone.', moduleRu: MODULE_NAMES.cr },
  { id: 'cr-8', term: 'genocide', translation: 'геноцид', example: 'The convention prohibits genocide.', moduleRu: MODULE_NAMES.cr },
  { id: 'cr-10', term: 'peace treaty', translation: 'мирный договор', example: 'A peace treaty was signed.', moduleRu: MODULE_NAMES.cr },
  { id: 'b-1', term: 'international relations', translation: 'международные отношения', example: 'International relations is a broad field.', moduleRu: MODULE_NAMES.b },
  { id: 'b-3', term: 'diplomacy', translation: 'дипломатия', example: 'Diplomacy is the art of negotiation.', moduleRu: MODULE_NAMES.b },
  { id: 'b-4', term: 'geopolitics', translation: 'геополитика', example: 'Geopolitics shapes foreign policy.', moduleRu: MODULE_NAMES.b },
  { id: 'b-6', term: 'sovereignty', translation: 'суверенитет', example: 'Sovereignty is a key principle of international law.', moduleRu: MODULE_NAMES.b },
  { id: 'b-11', term: 'foreign policy', translation: 'внешняя политика', example: 'Foreign policy priorities were set.', moduleRu: MODULE_NAMES.b },
  { id: 'b-12', term: 'soft power', translation: 'мягкая сила', example: 'Soft power relies on culture and values.', moduleRu: MODULE_NAMES.b },
  { id: 'b-13', term: 'international law', translation: 'международное право', example: 'International law binds states.', moduleRu: MODULE_NAMES.b },
  { id: 'st-1', term: 'parliament', translation: 'парламент', example: 'The parliament passed the law.', moduleRu: MODULE_NAMES.st },
  { id: 'st-4', term: 'constitution', translation: 'конституция', example: 'The constitution was amended.', moduleRu: MODULE_NAMES.st },
  { id: 'st-12', term: 'elections', translation: 'выборы', example: 'Elections were held in May.', moduleRu: MODULE_NAMES.st },
  { id: 'st-16', term: 'democracy', translation: 'демократия', example: 'Democracy requires active citizens.', moduleRu: MODULE_NAMES.st },
  { id: 'st-20', term: 'republic', translation: 'республика', example: 'The republic was proclaimed.', moduleRu: MODULE_NAMES.st },
  { id: 'ec-1', term: 'GDP', translation: 'ВВП', example: 'GDP growth slowed down.', moduleRu: MODULE_NAMES.ec },
  { id: 'ec-2', term: 'export', translation: 'экспорт', example: 'Export revenues increased.', moduleRu: MODULE_NAMES.ec },
  { id: 'ec-4', term: 'free trade', translation: 'свободная торговля', example: 'Free trade agreements were signed.', moduleRu: MODULE_NAMES.ec },
  { id: 'ec-6', term: 'tariff', translation: 'тариф', example: 'Tariffs were imposed on steel.', moduleRu: MODULE_NAMES.ec },
  { id: 'ec-20', term: 'sustainable development', translation: 'устойчивое развитие', example: 'Sustainable development balances growth and environment.', moduleRu: MODULE_NAMES.ec },
  { id: 'lw-1', term: 'treaty', translation: 'договор', example: 'The treaty was ratified.', moduleRu: MODULE_NAMES.lw },
  { id: 'lw-2', term: 'convention', translation: 'конвенция', example: 'The convention entered into force.', moduleRu: MODULE_NAMES.lw },
  { id: 'lw-10', term: 'human rights', translation: 'права человека', example: 'Human rights must be protected.', moduleRu: MODULE_NAMES.lw },
  { id: 'lw-18', term: 'charter', translation: 'устав', example: 'The UN Charter was signed in 1945.', moduleRu: MODULE_NAMES.lw },
  { id: 'so-1', term: 'multiculturalism', translation: 'мультикультурализм', example: 'Multiculturalism shapes modern societies.', moduleRu: MODULE_NAMES.so },
  { id: 'so-2', term: 'tolerance', translation: 'толерантность', example: 'Tolerance is a core value.', moduleRu: MODULE_NAMES.so },
  { id: 'so-17', term: 'climate change', translation: 'изменение климата', example: 'Climate change affects us all.', moduleRu: MODULE_NAMES.so },
  { id: 'so-24', term: 'pandemic', translation: 'пандемия', example: 'The pandemic disrupted global travel.', moduleRu: MODULE_NAMES.so },
  { id: 'ac-4', term: 'essay', translation: 'эссе', example: 'She wrote an essay on human rights.', moduleRu: MODULE_NAMES.ac },
  { id: 'ac-5', term: 'research', translation: 'исследование', example: 'Research on the topic is ongoing.', moduleRu: MODULE_NAMES.ac },
  { id: 'ac-7', term: 'methodology', translation: 'методология', example: 'The methodology was sound.', moduleRu: MODULE_NAMES.ac },
  { id: 'ac-9', term: 'citation', translation: 'цитирование', example: 'Proper citation is required.', moduleRu: MODULE_NAMES.ac },
  { id: 'ph-1', term: 'go about', translation: 'приступать, заниматься чем-то', example: 'How do you go about applying?', moduleRu: MODULE_NAMES.ph },
  { id: 'ph-3', term: 'get over', translation: 'пережить, оправиться', example: 'It took time to get over the loss.', moduleRu: MODULE_NAMES.ph },
  { id: 'ph-9', term: 'We have reached an agreement', translation: 'мы пришли к соглашению', example: 'We have reached an agreement.', moduleRu: MODULE_NAMES.ph },
  { id: 'ph-10', term: "Let's sum up", translation: 'давайте подведём итоги', example: "Let's sum up the main points.", moduleRu: MODULE_NAMES.ph },
  { id: 'ph-13', term: 'To sum up', translation: 'подводя итог', example: 'To sum up, we need more data.', moduleRu: MODULE_NAMES.ph },
];

/**
 * Возвращает «слова дня»: детерминированный набор по дате (одни и те же слова в течение дня).
 * @param {number} count - количество слов (по умолчанию 5)
 * @param {string} [dateStr] - дата YYYY-MM-DD (по умолчанию сегодня)
 */
function getWordsOfDay(count = 5, dateStr = null) {
  const date = dateStr || new Date().toISOString().slice(0, 10);
  const seed = date.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const shuffled = [...WORDS].sort((a, b) => {
    const ha = (seed + a.id.split('').reduce((s, x) => s + x.charCodeAt(0), 0)) % 1000;
    const hb = (seed + b.id.split('').reduce((s, x) => s + x.charCodeAt(0), 0)) % 1000;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

/**
 * Случайные слова (для «ещё слова»).
 */
function getRandomWords(count = 5) {
  const copy = [...WORDS];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

module.exports = { WORDS, getWordsOfDay, getRandomWords };
