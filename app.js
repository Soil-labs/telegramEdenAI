import dotenv from "dotenv";
import {
  findQueryResponses,
  updateQueryResponse,
} from "./backEnd_api_func.js";

import {
  checkIfFirstMessageTGConnection,
} from "./telegram_func.js";


import TelegramBot from 'node-telegram-bot-api';

dotenv.config();



// --------------- telegram bot ----------------
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});


console.log("I am alive!");



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  console.log("msg = " , msg)


  let res = await checkIfFirstMessageTGConnection(msg)

  console.log("res = " , res)

  let messageSentTelegram = ""
  if (res.done == true && res.messageBack){
    messageSentTelegram = res.messageBack
  } else {
    messageSentTelegram = 'Received your message - ' + msg.text 
  }

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, messageSentTelegram);
});
// --------------- telegram bot ----------------







// // --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------
// const speed_CalculateCVsummaryJobsNodes = 10000;
// let repeatCalculateCVsummaryJobsNodesVar = setInterval(repeatCalculateCVsummaryJobsNodesFunc, speed_CalculateCVsummaryJobsNodes);
// // --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------



async function repeatCalculateCVsummaryJobsNodesFunc() {


  let findQueryResponsesRes = await findQueryResponses();


  // for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries
  for (let i = 0; i < 1; i++) { // for all the queries

    let queryResponse = findQueryResponsesRes[i];

    let responderChatID = await findUserChatID(queryResponse.responder); // what is the chatID of the future responder

    let messageSendRes = await messageSend(queryResponse); // what is the message to send


    console.log("messageSendRes = " , messageSendRes)
    console.log("queryResponse._id = " , queryResponse._id)



    // --------------- send message Telegram ----------------
    bot.sendMessage(responderChatID, messageSendRes);
    // --------------- send message Telegram ----------------


    // --------------- update backend that message was sent ----------------
    let res = await updateQueryResponse({
      _id: queryResponse._id,
      sentFlag: true,
    })
    // --------------- update backend that message was sent ----------------



    sd9




  }
  


  clearInterval(repeatCalculateCVsummaryJobsNodesVar);
  repeatCalculateCVsummaryJobsNodesVar = setInterval(repeatCalculateCVsummaryJobsNodesFunc, speed_CalculateCVsummaryJobsNodes);
}


async function messageSend(queryResponse) {

  let messageSend = queryResponse?.question?.content



  return messageSend
}


async function findUserChatID(userInfo) {

  let chatID = "2125809502"

  // find the user if it is position
  if (userInfo.positionID) {

  }
  // find the user if it is candidate
  if (userInfo.userID) {

  }



  return chatID
}
