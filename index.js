import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const N8N_WEBHOOK = process.env.N8N_WEBHOOK;
console.log("DEBUG TOKEN:", TOKEN ? `Länge=${TOKEN.length}` : "NICHT VORHANDEN");


client.on("messageCreate", async (msg) => {
  if (!msg.content.startsWith("!add") && !msg.content.startsWith("!remove")) return;

  const [cmd, item, amountRaw] = msg.content.split(/\s+/);
  const amount = parseInt(amountRaw, 10);

  await fetch(N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: msg.author.username,
      command: cmd.replace("!", ""),
      item,
      amount
    }),
  });

  msg.reply(`✅ ${amount} ${item} ${cmd === "!add" ? "hinzugefügt" : "entfernt"}.`);
});

client.login(TOKEN);
