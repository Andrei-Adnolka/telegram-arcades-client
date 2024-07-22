import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import path from "path";

const token = "7472585101:AAGq0B8MME-Y9NhQFVCLZe_2sDliiWp92mg";
const webAppUrl = "https://telegram-arcade-client.netlify.app/";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Arcade games are here ⬇", {
      reply_markup: {
        inline_keyboard: [[{ text: "Play", web_app: { url: webAppUrl } }]],
      },
    });
  }
});

const PORT = 8000;

app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => console.log("server started on PORT " + PORT));
