import dotenv from "dotenv";
import {
  findQueryResponses,
  updateQueryResponse,
} from "./backEnd_api_func.js";



dotenv.config();

console.log("I am alive!");


// --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------
const speed_CalculateCVsummaryJobsNodes = 2000;
let repeatCalculateCVsummaryJobsNodesVar = setInterval(repeatCalculateCVsummaryJobsNodesFunc, speed_CalculateCVsummaryJobsNodes);
// --------------- repeatCalculateCVsummaryJobsNodesFunc ----------------



async function repeatCalculateCVsummaryJobsNodesFunc() {


  let findQueryResponsesRes = await findQueryResponses();


  for (let i = 0; i < findQueryResponsesRes.length; i++) { // for all the queries

    let queryResponse = findQueryResponsesRes[i];

    let responderChatID = await findUserChatID(queryResponse.responder); // what is the chatID of the future responder

    let messageSendRes = await messageSend(queryResponse); // what is the message to send


    console.log("messageSendRes = " , messageSendRes)
    console.log("queryResponse._id = " , queryResponse._id)


    

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

  let chatID = "23423"

  // find the user if it is position
  if (userInfo.positionID) {

  }
  // find the user if it is candidate
  if (userInfo.userID) {

  }



  return chatID
}
