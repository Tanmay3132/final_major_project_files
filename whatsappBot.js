const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const axios = require("axios").default;
const Dialogflow = require("@google-cloud/dialogflow");
const getGitHubLinks = require("./services/githubLinkService");
const checkFieldService = require("./services/checkfeildService");
const gptIntegrationService = require("./services/gptIntegrationService");

require("dotenv").config();

app.use(cors());

const whatsappController = express.Router();

async function _sendMessageToWhatsAppAsync(
  toUser,
  response,
  phoneNumber,
  token
) {
  const payloadToSend = {
    messaging_product: "whatsapp",
    to: toUser,
    ...response,
  };

  try {
    const baseUrl = `https://graph.facebook.com/v14.0/${phoneNumber}/messages`;
    const result = await axios.post(baseUrl, payloadToSend, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return result.data;
  } catch (error) {
    console.log(
      `[Method : Send Whatsapp Message] >>  Message:: ${error.response.data.error.message}`
    );
  }
}
const token =
  "EAANA7U3CJ1gBACRI3f0HG7QGCYdJT8TU9eLZAj55d9FQOuUnK0bHVZCKRIkiIUCV3QOmRXVpnZBpNZBS4Xu2V4RPAmZCMqZBsHQAvxf5LZCGgEGsNKVZCqI8KvWMUmM0jjnsoSglmwXBL7qlljTjOsKpRpKj0luxilNFRbWAaQ1lRTkHztNbX3FfvZBwkQ6S2eH14SnmbHPx4uQZDZD";

const phoneNumberId = "112578155105976";
let languageCode = "";

const getListMessateInput = (recipient, links) => {
  return JSON.stringify({
    messaging_product: "whatsapp",
    preview_url: true,
    to: recipient,
    type: "text",
    text: {
      body: links.toString(),
    },
  });
};

const getTextMessageInput = async (recipient, text) => {
  console.log(text);
  return JSON.stringify({
    messaging_product: "whatsapp",
    preview_url: false,
    to: recipient,
    type: "text",
    text: {
      body: `${text}`,
    },
  });
};

const sendMessage = async (data) => {
  console.log("data to sent", { data });
  const phoneNumberId = "112578155105976";
  let languageCode = "";

  const baseUrl = `https://graph.facebook.com/v14.0/${phoneNumberId}/messages`;
  const response = await axios.post(baseUrl, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const PROJECID = CREDENTIALS.project_id;
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
};
const sessionClient = new Dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {
  let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

  // The text query request.
  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  console.log(
    result?.fulfillmentText,
    "\nintent   SearchQuery ->",
    result?.parameters?.fields?.SearchQuery?.listValue?.values[0]?.stringValue,
    "\n         SearchField ->",
    result?.parameters?.fields?.searchField?.listValue?.values[0]?.stringValue
  );

  return {
    response: result.fulfillmentText,
    SearchQuery:
      result?.parameters?.fields?.SearchQuery?.listValue?.values[0]
        ?.stringValue,
    searchField:
      result?.parameters?.fields?.searchField?.listValue?.values[0]
        ?.stringValue,
  };
};

whatsappController.post("/entrypoint", async (request, response, next) => {
  console.log("innnnnnn post");

  // let whatsAppId = null;
  // let whatsappBusinessPhoneNumberId = "";
  // let whatsAppBussinessJWT = "";
  try {
    const requestBody = request.body;
    let whatsappReplyType =
      requestBody.entry[0].changes[0].value.messages[0].type.toLowerCase();

    handleWhatsappTemplateForMessageType(whatsappReplyType, requestBody);
    response.json({ status: "ACK", userInput: null });
  } catch (error) {
    response.json({ status: "ok" });
    return;
  }
});

const handleWhatsappTemplateForMessageType = async (
  whatsappReplyType,
  requestBody
) => {
  let whatsappObj = "";
  let msg = "hello tanmay Here";
  let result = {};

  switch (whatsappReplyType) {
    case "text":
      whatsappObj = requestBody.entry[0].changes[0].value;
      msg = whatsappObj.messages[0].text.body;
      const contactNumber =
        requestBody?.entry[0]?.changes[0]?.value?.contacts[0]?.wa_id;

      console.log(msg, contactNumber);
      const dialogflowReponse = await detectIntent("en", msg, "abcd1234");
      console.log("This is Dialogflow message -> ", dialogflowReponse);
      let messageToSent;

      if (
        dialogflowReponse.searchField !== undefined &&
        dialogflowReponse.SearchQuery !== undefined
      ) {
        console.log("Innnnn");
        const getData = await checkFieldService(
          dialogflowReponse.SearchQuery,
          dialogflowReponse.searchField
        );

        messageToSent = getListMessateInput(contactNumber, getData);
      } else {
        // messageToSent = await getTextMessageInput(
        //   contactNumber,
        //   dialogflowReponse.response
        // );
        const gptresponse = await gptIntegrationService(msg);

        messageToSent = await getTextMessageInput(contactNumber, gptresponse);
      }
      const sentMessage = await sendMessage(messageToSent);
      break;
    default:
      break;
  }
};

whatsappController.get("/entrypoint", async (request, response, next) => {
  try {
    console.log("innnnnnn get");
    const secret = request.query["hub.verify_token"];

    if ("tanmay@123" === secret) {
      return response.send(request.query["hub.challenge"]);
    } else {
      return response.send("Enter");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { whatsappController };
