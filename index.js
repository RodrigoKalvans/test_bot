const { Client, Events, GatewayIntentBits } = require("discord.js");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.get("/", (req, res) => {
    res.send("rk test bot");
    console.log("bot page accessed by user")
});

const client = new Client({ 
    intents: // clarify what the bot will do
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ]
});

client.once(Events.ClientReady, c => {
    console.log(`Connected as ${c.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
