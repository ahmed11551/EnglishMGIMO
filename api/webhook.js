/**
 * Telegram Bot Webhook — отвечает на /start кнопкой «Открыть приложение» (Mini App).
 * В Vercel: задайте BOT_TOKEN и при необходимости APP_URL в Environment Variables.
 */

function getAppUrl(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return process.env.APP_URL || (host ? `${proto}://${host}` : '');
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
    const text = message?.text?.trim();

    if (text === '/start' && chatId != null) {
      const appUrl = getAppUrl(req);
      if (!appUrl) {
        console.error('APP_URL or host header missing');
        res.status(500).json({ ok: false });
        return;
      }

      const reply = {
        chat_id: chatId,
        text: 'Привет! Откройте приложение МГИМО ENGLISH — 10 слов в день по лексике международных отношений.',
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📖 Открыть приложение', web_app: { url: appUrl } }],
          ],
        },
      };

      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply),
      });

      const data = await tgRes.json();
      if (!data.ok) {
        console.error('Telegram API error:', data);
      }
    }
  } catch (e) {
    console.error('Webhook error:', e);
  }

  res.status(200).json({ ok: true });
};
