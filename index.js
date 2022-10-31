const { 
    Client, 
    Events, 
    GatewayIntentBits, 
    Collection,
} = require("discord.js");

const express = require("express");
const app = express();
const dotenv = require("dotenv");

const path = require('node:path'); // node native path utility module
const fs = require('node:fs'); // node native file system

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

dotenv.config();

const client = new Client({ 
    intents: // clarify what the bot will do
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ]
});

client.commands = new Collection(); // add commands property to client object

// load working command files into client.commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// init event listeners
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	let commandName = command.data.name 
	let user = interaction.user.username

	console.log(`Command |${commandName}| called by user |${user}|`)

	if (!command) return;

	try {
		await command.execute(interaction, user);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});




client.login(process.env.token);