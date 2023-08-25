const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

console.log("token = " , token)

const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // console.log("chatId = " , chatId)
    console.log("msg = " , msg)
  
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message - ' + msg.text);
  });