// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// ---------------------------------------------
// 1) Отправка сообщения с inline-кнопкой "Прочитано"
async function sendMessageWithButton(chatId, text) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Прочитано', callback_data: 'mark_read' }
        ]
      ]
    },
    parse_mode: 'Markdown'
  });
}

// 2) Подтверждение callback_query (чтобы убрать спиннер в Telegram)
async function answerCallback(callbackQueryId) {
  return axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId
  });
}

// 3) Удаление inline-кнопок (оставляем только текст)
async function removeInlineKeyboard(chatId, messageId) {
  return axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] }
  });
}

// ---------------------------------------------
// Endpoint для получения заявок с сайта
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-to-telegram', async (req, res) => {
  const { name, contact, message } = req.body;
  const fullMessage =
    `📝 *Новая заявка:*\n` +
    `👤 *Имя:* ${name}\n` +
    `📞 *Контакт:* ${contact}\n` +
    `🕒 *Пожелания:* ${message}`;

  try {
    await sendMessageWithButton(process.env.TELEGRAM_CHAT_ID, fullMessage);
    res.status(200).send('Сообщение отправлено в Telegram');
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error.response?.data || error.message);
    res.status(500).send('Ошибка при отправке сообщения');
  }
});

// ---------------------------------------------
// Webhook для обработки нажатий inline-кнопок
app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.callback_query) {
    const { id: callbackQueryId, data, message } = update.callback_query;
    const chatId = message.chat.id;
    const messageId = message.message_id;

    if (data === 'mark_read') {
      try {
        // Останавливаем спиннер на кнопке
        await answerCallback(callbackQueryId);
        // Убираем кнопку
        await removeInlineKeyboard(chatId, messageId);
      } catch (err) {
        console.error('Ошибка обработки callback_query:', err.response?.data || err.message);
      }
    }
  }

  // Telegram требует возвратить 200 OK
  res.sendStatus(200);
});

// ---------------------------------------------
// (Опционально) Установка webhook по URL
async function setupWebhook() {
  if (!process.env.WEBHOOK_URL) {
    console.log('WEBHOOK_URL не задан — пропускаем установку webhook');
    return;
  }
  try {
    await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: `${process.env.WEBHOOK_URL}/webhook`
    });
    console.log('Webhook успешно установлен на:', `${process.env.WEBHOOK_URL}/webhook`);
  } catch (err) {
    console.error('Не удалось установить webhook:', err.response?.data || err.message);
  }
}

// ---------------------------------------------
app.listen(port, async () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
  await setupWebhook();
});
