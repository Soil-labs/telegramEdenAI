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

export async function findMember(filter) {
  // filter = { _id, discordName,telegramChatID}

  const textUpdate = filterToText(filter)

  let res = await apiClient({
    data: {
      query: `query {
                findMember(fields: {
                  ${textUpdate}
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
    if (err?.response?.data?.errors) {
      console.log(err.response.data.errors);
    }
  });

  if (res?.data?.data?.findMember) {
    return res.data.data.findMember;
  } else {
    return [];
  }
}

export async function findPosition(filter) {
  // filter = { _id, discordName,telegramChatID}

  const textUpdate = filterToText(filter)

  let res = await apiClient({
    data: {
      query: `query {
                findPosition(fields: {
                  ${textUpdate}
                }) {
                  _id
                  name
                  conduct {
                    telegram
                    telegramChatID
                    telegramConnectionCode
                  }
              }
            }`,
    },
  }).catch((err) => {
    if (err?.response?.data?.errors) {
      console.log(err.response.data.errors);
    }
  });

  if (res?.data?.data?.findPosition) {
    return res.data.data.findPosition;
  } else {
    return [];
  }
}


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
                  name
                  done
                  telegram
                  telegramChatID
                  authTelegramCode
              }
            }`,
    },
  }).catch((err) => {
    if (err?.response?.data?.errors) {
      console.log(err.response.data.errors);
    }
  });

  if (res?.data?.data?.checkUsersForTGConnection) {
    return res.data.data.checkUsersForTGConnection;
  } else {
    return [];
  }
}

export async function findQueryResponses(filter) {

  const textUpdate = filterToText(filter)

  let res = await apiClient({
    data: {
      query: `query {
                findQueryResponses(fields: {
                  ${textUpdate}
                }) {
                ${queryResponseFields}
              }
            }`,
    },
  }).catch((err) => {
    if (err?.response?.data?.errors) {
      console.log(err.response.data.errors);
    }
  });

  if (res?.data?.data?.findQueryResponses) {
    return res.data.data.findQueryResponses;
  } else {
    return [];
  }
}

export async function updateQueryResponse(updateQuery) {


  const textUpdate = filterToText(updateQuery)

  console.log("textUpdate = " , textUpdate)

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
    if (err?.response?.data?.errors) {
      console.log(err.response.data.errors);
    }
  });

  if (res?.data?.data?.updateQueryResponse) {
    return res.data.data.updateQueryResponse;
  } else {
    return [];
  }
}

function filterToText(filter) {
  let filterText = "";
  
  if (filter._id) {
    filterText += `_id: "${filter._id}"\n`;
  }

  if (filter.sentFlag != null) {
    filterText += `sentFlag: ${filter.sentFlag}\n`;
  }

  if (filter.phase) {
    filterText += `phase: ${filter.phase}\n`;
  }

  if (filter.question) {
    filterText += `question: "${filter.question}"\n`;
  }

  if (filter.answer) {
    filterText += `answer: "${filter.answer}"\n`;
  }

  if (filter.senderID) {
    filterText += `senderID: "${filter.senderID}"\n`;
  }

  if (filter.responderID) {
    filterText += `responderID: "${filter.responderID}"\n`;
  }

  if (filter.senderType) {
    filterText += `senderType: ${filter.senderType}\n`;
  }

  if (filter.responderType) {
    filterText += `responderType: ${filter.responderType}\n`;
  }

  if (filter.telegramChatID) {
    filterText += `telegramChatID: "${filter.telegramChatID}"\n`;
  }

  return filterText;
}