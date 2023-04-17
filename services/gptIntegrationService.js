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
    model: "text-davinci-003",
    prompt: whatsappTextInput,
    max_tokens: 200,
  });
  let gptResponse = reply.data.choices[0].text;
  console.log(gptResponse);
  return gptResponse;
};

module.exports = gptIntegrationService;
