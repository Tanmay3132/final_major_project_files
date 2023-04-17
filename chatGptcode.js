const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const sendReply = async (to, reply_message) => {
//   let json = {
//     messaging_product: "whatsapp",
//     to: to,
//     text: { body: reply_message },
//   };
//   let path =
//     "https://graph.facebook.com/v12.0/" + FROM_PHONE_NUMBER_ID + "/messages";

//   const data = await fetch(path, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + WHATSAPP_TOKEN,
//     },
//     method: "POST",
//     body: JSON.stringify(json),
//   });

//   if (!data.ok) {
//     console.error(await data.json());
//     throw Error("Error sending message");
//   }

//   return data.json();
// };

// console.log(ent.changes[0].value);
// const messages = ent.changes[0].value["messages"];
// if (!messages || messages.length === 0) {
//   return res.sendStatus(400);
// }
// const message = messages[0];
// if (message?.type !== "text") {
//   return res.sendStatus(400);
// }

let response, reply;

const tryGPTreponse = async () => {
  reply = await openai.createCompletion({
    model: "text-babbage-001",

    // prompt: message.text.body,
    prompt: "machine learning news",

    max_tokens: 100,
  });
  let testString = reply.data.choices[0].text;
  console.log(reply.data.choices[0], testString);
};
tryGPTreponse();
// response = await sendReply(
//   message.from,
//   reply.data.choices[0].text || "Sorry, couldn't find a response."
// );

// response = await sendReply(message.from, "Something went wrong");
