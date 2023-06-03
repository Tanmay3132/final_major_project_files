const express = require("express");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const gptIntegrationService = async (whatsappTextInput) => {
  console.log({ whatsappTextInput });
  reply = await openai.createCompletion({
    model: "text-curie-001",
    temperature: 0,
    prompt: ` answer to the question : ${whatsappTextInput} in polite manner`,
    max_tokens: 2000,
  });
  let gptResponse = reply.data.choices[0].text;
  console.log(gptResponse);
  return gptResponse;
};

module.exports = gptIntegrationService;
