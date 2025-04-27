require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sendMessage = async (message) => {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);
    throw error;
  }
};

app.post('/send-to-telegram', async (req, res) => {
  const { name, contact, message } = req.body;
  const fullMessage = `Заявка с сайта:\n\nИмя: ${name}\nКонтакт: ${contact}\nСообщение: ${message}`;

  try {
    await sendMessage(fullMessage);
    res.status(200).send('Сообщение отправлено в Telegram');
  } catch (error) {
    res.status(500).send('Ошибка при отправке сообщения');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
