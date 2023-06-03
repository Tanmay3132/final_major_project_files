const express = require("express");
const Dialogflow = require("@google-cloud/dialogflow");
const app = express();
app.use(express.json());
const cors = require("cors");
const { whatsappController } = require("./whatsappBot");

app.use(cors());

const port = 5005;

app.use("/", whatsappController);

app.get("/test", async (request, response) => {
  console.log("working...");
  response.send("Working ...");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
