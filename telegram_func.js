import {
    checkUsersForTGConnection,
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
  