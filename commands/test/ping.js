const { SlashCommandBuilder } = require('discord.js');
const client = require('../../honami')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply(`Current Ping is ${client.ws.ping}`);
	},
};