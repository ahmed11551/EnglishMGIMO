/**
 * Telegram Bot Webhook — МГИМО ENGLISH.
 * Команды: /start (приветствие + кнопки), /words (слова дня), /app (открыть приложение).
 * В Vercel: BOT_TOKEN и при необходимости APP_URL в Environment Variables.
 */

const { getWordsOfDay, getRandomWords } = require('./wordsData');

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

module.exports = async function handler(req, res) {
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

    if (chatId == null) {
      res.status(200).json({ ok: true });
      return;
    }

    const isStart = text === '/start' || text === '/start start';
    const isWords = /^\/words(@\w+)?$/i.test(text) || /^(слова дня|новые слова|слова|ещё слова)$/i.test(text);
    const isApp = /^\/app(@\w+)?$/i.test(text);

    if (isStart) {
      const welcomeText =
        '👋 <b>МГИМО ENGLISH</b>\n\n' +
        'Профессиональная лексика по международным отношениям: дипломатия, ООН, переговоры, право.\n\n' +
        '• <b>10 слов в день</b> в приложении — флэш-карты, тренажёр, интервальное повторение.\n' +
        '• Здесь в боте — <b>слова дня</b>: получайте порцию новых слов прямо в чат.\n\n' +
        'Нажмите кнопку ниже или команду /words для слов дня.';

      const keyboard = {
        inline_keyboard: [[{ text: '📝 Слова дня', callback_data: 'words_day' }]],
      };
      if (appUrl) {
        keyboard.inline_keyboard.unshift([{ text: '📖 Открыть приложение', web_app: { url: appUrl } }]);
      }
      await sendMessage(token, chatId, welcomeText, keyboard);
    } else if (isWords) {
      const words = getWordsOfDay(5);
      const msg = formatWordsMessage(words, '📚 <b>Слова дня</b>\nПовторите эти термины в приложении.');
      await sendMessage(token, chatId, msg, {
        inline_keyboard: [[{ text: '📖 Открыть приложение', web_app: { url: appUrl || '#' } }]],
      });
    } else if (isApp && appUrl) {
      await sendMessage(token, chatId, 'Откройте приложение МГИМО ENGLISH:', {
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
      }
    }
  } catch (e) {
    console.error('Webhook error:', e);
  }

  res.status(200).json({ ok: true });
};
