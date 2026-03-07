/**
 * Telegram Bot Webhook — МГИМО ENGLISH.
 * Команды: /start, /words, /learn, /quiz, /app, /subscribe, /unsubscribe.
 * Подписка на слова дня (вариант Б): chat_id сохраняются в Vercel KV, рассылка по крону.
 */

import { getWordsOfDay, getRandomWords, getRandomWord, getWordById, getQuizQuestion } from './wordsData.js';

let kv = null;
try {
  const kvModule = await import('@vercel/kv');
  kv = kvModule.kv;
} catch (e) {
  // Vercel KV не подключён — кнопка подписки не показывается
}
const SUBSCRIBERS_KEY = 'daily_words_subscribers';

function getAppUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return process.env.APP_URL || (host ? `${proto}://${host}` : '');
}

function formatWordsMessage(words, title) {
  const lines = words.map((w, i) => {
    const num = i + 1;
    const ex = w.example ? `\n   <i>${escapeHtml(w.example)}</i>` : '';
    return `${num}. <b>${escapeHtml(w.term)}</b> — ${escapeHtml(w.translation)}${ex}`;
  });
  return `${title}\n\n${lines.join('\n\n')}`;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendMessage(token, chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (replyMarkup) body.reply_markup = replyMarkup;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram API error:', data);
  return data;
}

async function editMessageText(token, chatId, messageId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (replyMarkup) body.reply_markup = replyMarkup;
  const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram API editMessageText error:', data);
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.error('BOT_TOKEN is not set');
    res.status(500).json({ ok: false });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const message = body?.message;
    const chatId = message?.chat?.id;
    const text = (message?.text || '').trim();
    const appUrl = getAppUrl(req);

    if (chatId == null && !body?.callback_query) {
      res.status(200).json({ ok: true });
      return;
    }

    const isStart = text === '/start' || text === '/start start';
    const isHelp = /^\/help(@\w+)?$/i.test(text);
    const isWords = /^\/words(@\w+)?$/i.test(text) || /^(слова дня|новые слова|слова|ещё слова)$/i.test(text);
    const isLearn = /^\/learn(@\w+)?$/i.test(text) || /^(учить|учиться|обучение|слово)$/i.test(text);
    const isQuiz = /^\/quiz(@\w+)?$/i.test(text) || /^(квиз|тест|проверка)$/i.test(text);
    const isApp = /^\/app(@\w+)?$/i.test(text);

    const isSubscribe = /^\/subscribe(@\w+)?$/i.test(text);
    const isUnsubscribe = /^\/unsubscribe(@\w+)?$/i.test(text);

    if (isStart || isHelp) {
      const welcomeText =
        '👋 <b>МГИМО ENGLISH</b>\n\n' +
        'Лексика для дипломатии, ООН, переговоров и международного права — учите слова прямо в чате.\n\n' +
        '📝 <b>Слова дня</b> — 5 терминов на сегодня\n' +
        '📖 <b>Учить</b> — по одному слову с переводом и примером\n' +
        '🎯 <b>Квиз</b> — проверьте, как запомнили перевод\n' +
        '📱 <b>Приложение</b> — карточки, тренажёр и интервальное повторение';

      const keyboard = {
        inline_keyboard: [
          [{ text: '📝 Слова дня', callback_data: 'words_day' }, { text: '📖 Учить', callback_data: 'learn_next' }],
          [{ text: '🎯 Квиз', callback_data: 'quiz_next' }, ...(appUrl ? [{ text: '📱 Приложение', web_app: { url: appUrl } }] : [])],
        ],
      };
      if (kv) {
        keyboard.inline_keyboard.push([
          { text: '📬 Присылать слова каждый день', callback_data: 'subscribe_daily' },
          { text: 'Отписаться от рассылки', callback_data: 'unsubscribe_daily' },
        ]);
      }
      await sendMessage(token, chatId, welcomeText, keyboard);
    } else if (isSubscribe && kv) {
      try {
        await kv.sadd(SUBSCRIBERS_KEY, String(chatId));
        await sendMessage(token, chatId, '✅ Вы подписаны на слова дня. Каждый день вам будет приходить порция из 5 слов. Отписаться: /unsubscribe или кнопка в /start.');
      } catch (e) {
        console.error('KV sadd error:', e);
        await sendMessage(token, chatId, 'Подписка временно недоступна. Попробуйте позже.');
      }
    } else if (isUnsubscribe && kv) {
      try {
        await kv.srem(SUBSCRIBERS_KEY, String(chatId));
        await sendMessage(token, chatId, 'Вы отписаны от рассылки. Чтобы снова получать слова дня — /subscribe или кнопка в /start.');
      } catch (e) {
        console.error('KV srem error:', e);
        await sendMessage(token, chatId, 'Не удалось отписаться. Попробуйте позже.');
      }
    } else if (isLearn) {
      const word = getRandomWord();
      const msg = `📖 <b>Как переводится?</b>\n\n<code>${escapeHtml(word.term)}</code>`;
      const keyboard = {
        inline_keyboard: [
          [
            { text: 'Показать перевод', callback_data: `learn_show_${word.id}` },
            { text: 'Следующее →', callback_data: 'learn_next' },
          ],
        ],
      };
      await sendMessage(token, chatId, msg, keyboard);
    } else if (isQuiz) {
      const { word, options, correctIndex } = getQuizQuestion();
      const msg = `🎯 <b>Как переводится</b> <code>${escapeHtml(word.term)}</code>?`;
      const keyboard = {
        inline_keyboard: [options.map((o) => ({ text: o.text, callback_data: o.callbackData }))],
      };
      await sendMessage(token, chatId, msg, keyboard);
    } else if (isWords) {
      const words = getWordsOfDay(5);
      const msg = formatWordsMessage(words, '📚 <b>Слова дня</b>\nПять терминов на сегодня — сохраните и повторите в приложении.');
      const wButtons = [[{ text: '🔄 Ещё 5 слов', callback_data: 'words_more' }]];
      if (appUrl) wButtons.unshift([{ text: '📖 Открыть приложение', web_app: { url: appUrl } }]);
      await sendMessage(token, chatId, msg, { inline_keyboard: wButtons });
    } else if (isApp && appUrl) {
      await sendMessage(token, chatId, '📱 <b>МГИМО ENGLISH</b> — флэш-карты, тренажёр и прогресс. Нажмите кнопку ниже:', {
        inline_keyboard: [[{ text: '📖 Открыть приложение', web_app: { url: appUrl } }]],
      });
    } else if (body?.callback_query) {
      const cb = body.callback_query;
      const data = cb.data;
      const cbChatId = cb.message?.chat?.id;

      if (cbChatId == null) {
        res.status(200).json({ ok: true });
        return;
      }

      const answerCb = () =>
        fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: cb.id }),
        });

      if (data === 'words_day') {
        const words = getWordsOfDay(5);
        const msg = formatWordsMessage(words, '📚 <b>Слова дня</b>');
        const buttons = [];
        if (appUrl) buttons.push([{ text: '📖 Открыть приложение', web_app: { url: appUrl } }]);
        buttons.push([{ text: '🔄 Ещё 5 слов', callback_data: 'words_more' }]);
        await sendMessage(token, cbChatId, msg, { inline_keyboard: buttons });
        await answerCb();
      } else if (data === 'words_more') {
        const words = getRandomWords(5);
        const msg = formatWordsMessage(words, '📚 <b>Ещё 5 слов</b>');
        const buttons = [];
        if (appUrl) buttons.push([{ text: '📖 Открыть приложение', web_app: { url: appUrl } }]);
        buttons.push([{ text: '🔄 Ещё 5 слов', callback_data: 'words_more' }]);
        await sendMessage(token, cbChatId, msg, { inline_keyboard: buttons });
        await answerCb();
      } else if (data === 'learn_next') {
        await answerCb();
        const word = getRandomWord();
        const msg = `📖 <b>Как переводится?</b>\n\n<code>${escapeHtml(word.term)}</code>`;
        await sendMessage(token, cbChatId, msg, {
          inline_keyboard: [
            [
              { text: 'Показать перевод', callback_data: `learn_show_${word.id}` },
              { text: 'Следующее →', callback_data: 'learn_next' },
            ],
          ],
        });
      } else if (data.startsWith('learn_show_')) {
        const wordId = data.slice('learn_show_'.length);
        const word = getWordById(wordId);
        if (word) {
          const ex = word.example ? `\n\n<i>${escapeHtml(word.example)}</i>` : '';
          const msg = `📖 <b>${escapeHtml(word.term)}</b>\n\n→ ${escapeHtml(word.translation)}${ex}`;
          await editMessageText(token, cbChatId, cb.message.message_id, msg, {
            inline_keyboard: [[{ text: 'Следующее слово →', callback_data: 'learn_next' }]],
          });
        }
        await answerCb();
      } else if (data === 'quiz_next') {
        await answerCb();
        const { word, options } = getQuizQuestion();
        const msg = `🎯 <b>Как переводится</b> <code>${escapeHtml(word.term)}</code>?`;
        await sendMessage(token, cbChatId, msg, {
          inline_keyboard: [options.map((o) => ({ text: o.text, callback_data: o.callbackData }))],
        });
      } else if (data.startsWith('quiz_')) {
        const parts = data.split('__');
        const questionId = (parts[0] || '').replace(/^quiz_/, '');
        const correctIndex = parseInt(parts[1], 10);
        const chosenIndex = parseInt(parts[2], 10);
        const word = getWordById(questionId);
        const isCorrect = word && correctIndex === chosenIndex;
        const resultMsg = word
          ? (isCorrect
            ? `✅ <b>Верно!</b>\n\n<code>${escapeHtml(word.term)}</code> — ${escapeHtml(word.translation)}`
            : `❌ <b>Неверно.</b> Правильно: <code>${escapeHtml(word.term)}</code> — ${escapeHtml(word.translation)}`)
          : 'Ошибка';
        await editMessageText(token, cbChatId, cb.message.message_id, resultMsg, {
          inline_keyboard: [[{ text: 'Следующий вопрос →', callback_data: 'quiz_next' }]],
        });
        await answerCb();
      } else if (data === 'subscribe_daily' && kv) {
        try {
          await kv.sadd(SUBSCRIBERS_KEY, String(cbChatId));
          await answerCb();
          await sendMessage(token, cbChatId, '✅ Вы подписаны. Слова дня будут приходить каждый день. Отписаться: /unsubscribe');
        } catch (e) {
          console.error('KV sadd error:', e);
          await answerCb();
          await sendMessage(token, cbChatId, 'Подписка временно недоступна.');
        }
      } else if (data === 'unsubscribe_daily' && kv) {
        try {
          await kv.srem(SUBSCRIBERS_KEY, String(cbChatId));
          await answerCb();
          await sendMessage(token, cbChatId, 'Вы отписаны от рассылки.');
        } catch (e) {
          console.error('KV srem error:', e);
          await answerCb();
        }
      } else if (data === 'subscribe_daily' && !kv) {
        await answerCb();
        await sendMessage(token, cbChatId, 'Подписка на слова дня временно недоступна. Попробуйте позже.');
      } else {
        await answerCb();
      }
    }
  } catch (e) {
    console.error('Webhook error:', e);
  }

  res.status(200).json({ ok: true });
};
