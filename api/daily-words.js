/**
 * Рассылка «Слова дня» подписчикам. Вызывается Vercel Cron раз в день.
 * Требует: BOT_TOKEN, CRON_SECRET, Vercel KV (подписчики в ключе daily_words_subscribers).
 */

import { getWordsOfDay } from './wordsData.js';

const SUBSCRIBERS_KEY = 'daily_words_subscribers';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatWordsMessage(words, title) {
  const lines = words.map((w, i) => {
    const num = i + 1;
    const ex = w.example ? `\n   <i>${escapeHtml(w.example)}</i>` : '';
    return `${num}. <b>${escapeHtml(w.term)}</b> — ${escapeHtml(w.translation)}${ex}`;
  });
  return `${title}\n\n${lines.join('\n\n')}`;
}

async function sendMessage(token, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  if (!data.ok) console.error('Telegram send error for', chatId, data);
  return data;
}

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: 'BOT_TOKEN not set' });
    return;
  }

  let kv;
  try {
    const kvModule = await import('@vercel/kv');
    kv = kvModule.kv;
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Vercel KV not available' });
    return;
  }

  try {
    const chatIds = await kv.smembers(SUBSCRIBERS_KEY);
    if (chatIds.length === 0) {
      res.status(200).json({ ok: true, sent: 0 });
      return;
    }

    const words = getWordsOfDay(5);
    const message = formatWordsMessage(words, '📚 <b>Слова дня</b>\nМГИМО ENGLISH');

    let sent = 0;
    for (const chatId of chatIds) {
      try {
        const result = await sendMessage(token, String(chatId), message);
        if (result.ok) sent++;
        else if (result.error_code === 403 || result.description?.includes('blocked')) {
          await kv.srem(SUBSCRIBERS_KEY, chatId);
        }
      } catch (e) {
        console.error('Send to', chatId, e);
      }
    }

    res.status(200).json({ ok: true, sent, total: chatIds.length });
  } catch (e) {
    console.error('daily-words error:', e);
    res.status(500).json({ ok: false, error: String(e.message) });
  }
};
