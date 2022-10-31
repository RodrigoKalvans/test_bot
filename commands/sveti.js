const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName("sveti")
            .setDescription("God bless Latvia!"),
        async execute(interaction) {
            await interaction.reply("Dievs svētī Latviju!");
        }
}
