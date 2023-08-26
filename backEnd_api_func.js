import apiClient from "./api/axios.js";



const queryResponseFields = `
_id
sender {
  positionID
  userID
}
responder {
  positionID
  userID
}
phase
sentFlag
question {
  content
}
answer {
  content
}
`;

export async function checkUsersForTGConnection(filter) {

  let res = await apiClient({
    data: {
      query: `mutation {
                checkUsersForTGConnection(fields: {
                  authNumberTGMessage: "${filter.authNumberTGMessage}",
                  telegramID: "${filter.telegramID}",
                  telegramChatID: "${filter.telegramChatID}"
                }) {
                  _id
                  discordName
                  conduct {
                    telegram
                    telegramChatID
                    telegramConnectionCode
                  }
              }
            }`,
    },
  }).catch((err) => {
    console.log(err.response.data.errors);
  });

  if (res?.data?.data?.checkUsersForTGConnection) {
    return res.data.data.checkUsersForTGConnection;
  } else {
    return [];
  }
}

export async function findQueryResponses() {

  let res = await apiClient({
    data: {
      query: `query {
                findQueryResponses(fields: {
                  sentFlag: false
                  phase: QUERY
                }) {
                ${queryResponseFields}
              }
            }`,
    },
  }).catch((err) => {
    console.log(err.response.data.errors);
  });

  if (res?.data?.data?.findQueryResponses) {
    return res.data.data.findQueryResponses;
  } else {
    return [];
  }
}

export async function updateQueryResponse(updateQuery) {


  const textUpdate = updateQueryToText(updateQuery)

  let res = await apiClient({
    data: {
      query: `mutation {
                updateQueryResponse(fields: {
                  ${textUpdate}
                }) {
                ${queryResponseFields}
              }
            }`,
    },
  }).catch((err) => {
    console.log(err.response.data.errors);
  });

  if (res?.data?.data?.updateQueryResponse) {
    return res.data.data.updateQueryResponse;
  } else {
    return [];
  }
}

function updateQueryToText(updateQuery) {
  let updateQueryText = "";
  
  if (updateQuery._id) {
    updateQueryText += `_id: "${updateQuery._id}"`;
  }

  if (updateQuery.sentFlag) {
    updateQueryText += `sentFlag: ${updateQuery.sentFlag}`;
  }

  if (updateQuery.phase) {
    updateQueryText += `phase: ${updateQuery.phase}`;
  }

  if (updateQuery.question) {
    updateQueryText += `question: "${updateQuery.question}"`;
  }

  if (updateQuery.answer) {
    updateQueryText += `answer: "${updateQuery.answer}"`;
  }

  if (updateQuery.senderID) {
    updateQueryText += `senderID: "${updateQuery.senderID}"`;
  }

  if (updateQuery.responderID) {
    updateQueryText += `responderID: "${updateQuery.responderID}"`;
  }

  if (updateQuery.senderType) {
    updateQueryText += `senderType: ${updateQuery.senderType}`;
  }

  if (updateQuery.responderType) {
    updateQueryText += `responderType: ${updateQuery.responderType}`;
  }

  return updateQueryText;
}