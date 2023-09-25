import {
    checkUsersForTGConnection,
    findMember,
    findPosition,
    findQueryResponses,
    updateQueryResponse,
    addChatExternalApp,
    updateStateEdenChat,
  } from "./backEnd_api_func.js";

export async function checkIfFirstMessageTGConnection(msgTG) {

    const message = msgTG.text;
    
    // if message is only 3 letters
    // if all letters of message are numbers
    if (message.length == 3 && message.match(/^[0-9]+$/) != null) {

        const chatId = msgTG.chat.id;
        const username = msgTG.chat.username;


        let resCheck = await checkUsersForTGConnection({
            authNumberTGMessage: message,
            telegramID: username,
            telegramChatID: chatId
        })

        console.log("resCheck = " , resCheck)

        let messageBack = "This is not the right code try again please"
        if (resCheck._id) {
            messageBack = `Hi ${resCheck.name}, 
            Was great chatting to you earlier! I'll inform you of any updates here - also feel free to ask me any type of questions relating to your application. I'll do my best to answer them! 

            For now, please finalise your application by going back to your application`
        }


        return {
            done: true,
            messageBack: messageBack,
        }

    } else {
        return {
            done: false,
            messageBack: "",
        }
    }

 
  }

  export async function sentBotMessageAndSaveBackend(chatID, message,bot) {


    await bot.sendMessage(chatID, message);

    await addChatExternalApp({
        chatID_TG: chatID,
        message: message,
        senderRole: "assistant",
      })
 
  }

  export async function createMessageBasedOnCategory(queryResponse) {


    let messageSendRes = ""

    if (queryResponse.category == "REJECT_CANDIDATE"){

        messageSendRes = `${queryResponse?.question?.content}`

    } else if (queryResponse.category == "ACCEPT_CANDIDATE"){    

        messageSendRes = `${queryResponse?.question?.content}`

    } else if (queryResponse.category == "PITCH_POSITION_CANDIDATE"){    

        messageSendRes = `${queryResponse?.question?.content}`

    } else if (queryResponse.category == "ASK_CANDIDATE"){    

        messageSendRes = `Wow people are looking at your profile, you have a question:
        ${queryResponse?.question?.content}`

    } else {
        messageSendRes = `Wow people are looking at your profile, you have a question:
        ${queryResponse?.question?.content}`
    }

    return messageSendRes
 
  }

  export async function sentMessageBasedOnCategory(chatID, messageSendRes,queryResponse,bot) {

    if (!chatID) 
        return

    console.log("queryResponse.category = " , queryResponse.category)


    if (queryResponse.category == "REJECT_CANDIDATE"){

        await sentBotMessageAndSaveBackend(chatID, messageSendRes,bot);

        await sentBotMessageAndSaveBackend(chatID, "Do you want me to help you find a different opportunity, I already know so much about you so it will be easy?",bot);

        await updateStateEdenChat({
            userID: queryResponse.responder.userID,
            positionIDs: [queryResponse.sender.positionID],
            categoryChat: queryResponse.category,
        })


    } else if (queryResponse.category == "ACCEPT_CANDIDATE"){    

        await sentBotMessageAndSaveBackend(chatID, messageSendRes,bot);

        await sentBotMessageAndSaveBackend(chatID, "Incredible job, we will conduct you with details in the next 24-48 hours about your next interview",bot);

        await updateStateEdenChat({
            userID: queryResponse.responder.userID,
            positionIDs: [queryResponse.sender.positionID],
            categoryChat: queryResponse.category,
        })

    } else if (queryResponse.category == "PITCH_POSITION_CANDIDATE"){    

        await sentBotMessageAndSaveBackend(chatID, messageSendRes,bot);

        console.log("-=asdf-as=df-as=f-as=df-asdf-asdf-as=df-s="  )

        await updateStateEdenChat({
            userID: queryResponse.responder.userID,
            positionIDs: [queryResponse.sender.positionID],
            categoryChat: queryResponse.category,
        })

    } else if (queryResponse.category == "ASK_CANDIDATE"){    

        await sentBotMessageAndSaveBackend(chatID, messageSendRes,bot);

        await updateStateEdenChat({
            userID: queryResponse.responder.userID,
            positionIDs: [queryResponse.sender.positionID],
            categoryChat: queryResponse.category,
        })

    } else {

        await sentBotMessageAndSaveBackend(chatID, messageSendRes,bot);

    }


    
    


 
  }

  export async function findChatIDforUser(conduct) {
    // conduct = { positionID: "null", userID: '234' },
    // or 
    // conduct = { positionID: "234", userID: 'null' },

    let res
    if (conduct.positionID != null) {
        res = await findPosition({
            _id: conduct.positionID
        });
        if (res?.conduct?.telegramChatID) {
            return res.conduct.telegramChatID;
        }
    } else if (conduct.userID != null) {
        res = await findMember({
            _id: conduct.userID
        });
        console.log("res = " , res)
        if (res?.conduct?.telegramChatID) {
            return res.conduct.telegramChatID;
        }
    }
 
  }

  export async function findIfMessageIsAResponse(chatId,msg) {

    let memberData = await findMember({
        telegramChatID: chatId
    });

    let findQueryResponsesRes

    if (!memberData) {
        let positionData = await findPosition({
            telegramChatID: chatId
        });

        findQueryResponsesRes = await findQueryResponses({
            sentFlag: true,
            phase: "QUERY",
            responderType: "POSITION",
            responderID: positionData._id,
        });

    } else {

        console.log("change = -d-d-d-d-d-d" )

        findQueryResponsesRes = await findQueryResponses({
            sentFlag: true,
            phase: "QUERY",
            responderType: "USER",
            responderID: memberData._id,
        });
    }



    if (findQueryResponsesRes.length > 0) {
        let queryResponse = findQueryResponsesRes[0];
        console.log("queryResponse = " , queryResponse)

   
        // --------------- update backend that message was sent ----------------
        let res = await updateQueryResponse({
            _id: queryResponse._id,
            sentFlag: false,
            answer: msg,
            phase: "RESPONDED",
        })
        console.log("res = " , res)
        // --------------- update backend that message was sent ----------------
    }

 
  }
  
  