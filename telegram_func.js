import {
    checkUsersForTGConnection,
    findMember,
    findQueryResponses,
    updateQueryResponse,
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
            messageBack = `hello ${resCheck.discordName}!!! you are connected I can't wait to find the perfect opportunity for you`
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

  export async function findChatIDforUser(conduct) {
    // conduct = { positionID: "null", userID: '234' },
    // or 
    // conduct = { positionID: "234", userID: 'null' },

    let res
    if (conduct.positionID != null) {

    } else if (conduct.userID != null) {
      res = await findMember({
        _id: conduct.userID
      });
      if (res?.conduct?.telegramChatID) {
        return res.conduct.telegramChatID;
      }
    }
 
  }

  export async function findIfMessageIsAResponse(chatId,msg) {

    let memberData = await findMember({
        telegramChatID: chatId
    });

    console.log("memberData = " , memberData)

    let findQueryResponsesRes = await findQueryResponses({
        sentFlag: true,
        phase: "QUERY",
        responderType: "USER",
        responderID: memberData._id,
    });



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
  
  