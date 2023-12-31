import dotenv from "dotenv";
import {
  findQueryResponses,
  updateQueryResponse,
  identifyCategoryAndReply,
  addChatExternalApp,
  findMember,
  checkLimitMessagesExternalApp,
} from "./backEnd_api_func.js";

import {
  checkIfFirstMessageTGConnection,
  findChatIDforUser,
  findIfMessageIsAResponse,
  createMessageBasedOnCategory,
  sentMessageBasedOnCategory,
  sentBotMessageAndSaveBackend,
} from "./telegram_func.js";


import TelegramBot from 'node-telegram-bot-api';

dotenv.config();



// --------------- telegram bot ----------------
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});


console.log("I am alive!");



bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (!chatId || !msg.text) {
    return
  }
  
  if (msg.text == "/start") {
    // bot.sendMessage(chatId, `Let's do this! 👏 Can you write the 3 digit code I gave you earlier?` );

    await sentBotMessageAndSaveBackend(chatId,`Let's do this! 👏 Can you write the 4 digit code I gave you earlier?`,bot)

    return 
  } else if (msg.text == "/who") {

    let memberData = await findMember({
        telegramChatID: chatId
    });

    // bot.sendMessage(chatId, `Your Name is: ${memberData.discordName}
    // your ID is: ${memberData._id}` );

    await sentBotMessageAndSaveBackend(chatId,`
    Your Name is: ${memberData.discordName}
    Your ID is: ${memberData._id}
    Your Telegram ID is: ${chatId}`,bot)

    return 

  }

  console.log("msg = " , msg)


  // --------------- save message from TG to database ----------------
  await addChatExternalApp({
    chatID_TG: chatId,
    message: msg.text,
    senderRole: "user",
  })
  // --------------- save message from TG to database ----------------


  let resLimit = await checkLimitMessagesExternalApp({
    chatID_TG: chatId,
    limitMinute: 6,
    limitHour: 13,
    limitDay: 15,
  })

  


  if ( resLimit.limitExceeded == true ){
    await sentBotMessageAndSaveBackend(chatId,resLimit.message,bot)

    return
  }

  // --------------- check if first message TG connection ----------------
  let res = await checkIfFirstMessageTGConnection(msg)

  console.log("res = " , res)
  if (res.done == true ){
    let messageSentTelegram = ""
    if (res.messageBack){
      messageSentTelegram = res.messageBack
    }
    // bot.sendMessage(chatId, messageSentTelegram);
    await sentBotMessageAndSaveBackend(chatId,messageSentTelegram,bot)

    return 
  } 
  // --------------- check if first message TG connection ----------------

  
  findIfMessageIsAResponse(chatId,msg.text)
  

  let resIdentify = await identifyCategoryAndReply({
    chatID_TG: chatId,
    message: msg.text,
    replyFlag: true,
  })


  console.log("resIdentify = " , resIdentify)

  let messageReplyT = ""

  if (resIdentify.reply){
    messageReplyT = resIdentify.reply
  } else {
    messageReplyT = "I didn't understand, please try again"

  }

  // bot.sendMessage(chatId,messageReplyT );
  await sentBotMessageAndSaveBackend(chatId,messageReplyT,bot)



  //  // --------------- save message from TG to database ----------------
  //  await addChatExternalApp({
  //   chatID_TG: chatId,
  //   message: messageReplyT,
  //   senderRole: "assistant",
  // })
  // // --------------- save message from TG to database ----------------
    
  
  return 

});
// --------------- telegram bot ----------------







// --------------- Sent Message for un-send queries --------------
const speed_CheckQueriesAndSent = 10000;
let repeatCheckQueriesAndSentVar = setInterval(checkQueriesAndSentFunc, speed_CheckQueriesAndSent);
// --------------- Sent Message for un-send queries --------------

// --------------- Sent Message for un-send Responses --------------
const speed_CheckResponsesAndSent = 14000;
let repeatCheckResponsesAndSentVar = setInterval(checkResponsesAndSentFunc, speed_CheckResponsesAndSent);
// --------------- Sent Message for un-send Responses --------------




async function checkQueriesAndSentFunc() {


  let findQueryResponsesRes = await findQueryResponses({
    sentFlag: false,
    phase: "QUERY",
  });
  // console.log("findQueryResponsesRes QUERY= " , findQueryResponsesRes)

  for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries
  // for (let i = 0; i < 1; i++) { // for all the queries

    let queryResponse = findQueryResponsesRes[i];

    const chatID = await findChatIDforUser(queryResponse.responder)
    console.log("chatID = " , chatID)


  

    let messageSendRes = await createMessageBasedOnCategory(queryResponse)

    

    
    // --------------- send message Telegram ----------------
    sentMessageBasedOnCategory(chatID,messageSendRes,queryResponse,bot)
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


async function checkResponsesAndSentFunc() {


  let findQueryResponsesRes = await findQueryResponses({
    sentFlag: false,
    phase: "RESPONDED",
  });
  // console.log("findQueryResponsesRes RESPONDED= " , findQueryResponsesRes)

  for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries
  // for (let i = 0; i < 1; i++) { amaz// for all the queries


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
      // bot.sendMessage(chatID, messageSendRes);
      await sentBotMessageAndSaveBackend(chatID,messageSendRes,bot)
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

async function messageSend(queryResponse) {

  let messageSend = queryResponse?.question?.content



  return messageSend
}

