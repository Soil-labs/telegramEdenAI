import dotenv from "dotenv";
import {
  findQueryResponses,
  updateQueryResponse,
} from "./backEnd_api_func.js";

import {
  checkIfFirstMessageTGConnection,
  findChatIDforUser,
  findIfMessageIsAResponse,
} from "./telegram_func.js";


import TelegramBot from 'node-telegram-bot-api';

dotenv.config();



// --------------- telegram bot ----------------
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});


console.log("I am alive!");



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (!chatId) {
    return
  }

  console.log("msg = " , msg)


  // --------------- check if first message TG connection ----------------
  let res = await checkIfFirstMessageTGConnection(msg)
  if (res.done == true ){
    let messageSentTelegram = ""
    if (res.messageBack){
      messageSentTelegram = res.messageBack
    }
    bot.sendMessage(chatId, messageSentTelegram);

    return 
  } 
  // --------------- check if first message TG connection ----------------

  
  findIfMessageIsAResponse(chatId,msg.text)
  
  bot.sendMessage(chatId, 'Thank you for the answer' );
    
  

});
// --------------- telegram bot ----------------







// --------------- Sent Message for un-send queries --------------
const speed_CheckQueriesAndSent = 12000;
let repeatCheckQueriesAndSentVar = setInterval(checkQueriesAndSentFunc, speed_CheckQueriesAndSent);
// --------------- Sent Message for un-send queries --------------

// --------------- Sent Message for un-send Responses --------------
const speed_CheckResponsesAndSent = 8000;
let repeatCheckResponsesAndSentVar = setInterval(checkResponsesAndSentFunc, speed_CheckResponsesAndSent);
// --------------- Sent Message for un-send Responses --------------

async function checkResponsesAndSentFunc() {


  let findQueryResponsesRes = await findQueryResponses({
    sentFlag: false,
    phase: "RESPONDED",
  });
  // console.log("findQueryResponsesRes = " , findQueryResponsesRes)

  for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries
  // for (let i = 0; i < 1; i++) { // for all the queries


    let queryResponse = findQueryResponsesRes[i];

    if (!queryResponse){
      return 
    }

    // let messageSendRes = await messageSend(queryResponse); // what is the message to send

    let messageSendRes = `You already have a response for your question:
    Q: ${queryResponse?.question?.content}
    A: ${queryResponse?.answer?.content}`


    console.log("messageSendRes = " , messageSendRes)
    console.log("queryResponse._id = " , queryResponse._id)


    const chatID = await findChatIDforUser(queryResponse.sender)

    console.log("chatID = " , chatID)


    // sd1

    if (chatID && messageSendRes){
      // --------------- send message Telegram ----------------
      bot.sendMessage(chatID, messageSendRes);
      // --------------- send message Telegram ----------------
    }


    // --------------- update backend that message was sent ----------------
    let res = await updateQueryResponse({
      _id: queryResponse._id,
      sentFlag: true,
    })
    // --------------- update backend that message was sent ----------------
  }
  

  clearInterval(repeatCheckResponsesAndSentVar);
  repeatCheckResponsesAndSentVar = setInterval(checkResponsesAndSentFunc, speed_CheckResponsesAndSent);
}



async function checkQueriesAndSentFunc() {


  let findQueryResponsesRes = await findQueryResponses({
    sentFlag: false,
    phase: "QUERY",
  });
  // console.log("findQueryResponsesRes = " , findQueryResponsesRes)

  for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries
  // for (let i = 0; i < 1; i++) { // for all the queries

    let queryResponse = findQueryResponsesRes[i];

    // let messageSendRes = await messageSend(queryResponse); // what is the message to send
    let messageSendRes = `Wow people are looking at your profile, you have a question:
    ${queryResponse?.question?.content}`


    console.log("messageSendRes = " , messageSendRes)
    console.log("queryResponse._id = " , queryResponse._id)


    const chatID = await findChatIDforUser(queryResponse.responder)

    console.log("chatID = " , chatID)


    // --------------- send message Telegram ----------------
    bot.sendMessage(chatID, messageSendRes);
    // --------------- send message Telegram ----------------


    // --------------- update backend that message was sent ----------------
    let res = await updateQueryResponse({
      _id: queryResponse._id,
      sentFlag: true,
    })
    // --------------- update backend that message was sent ----------------

  }
  

  clearInterval(repeatCheckQueriesAndSentVar);
  repeatCheckQueriesAndSentVar = setInterval(checkQueriesAndSentFunc, speed_CheckQueriesAndSent);
}


async function messageSend(queryResponse) {

  let messageSend = queryResponse?.question?.content



  return messageSend
}

