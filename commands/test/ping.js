const { SlashCommandBuilder } = require('discord.js');
const client = require('../../honami')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check Bot ping'),
	async execute(interaction) {
		await interaction.reply(`Current Ping is ${client.ws.ping}`);
	},
};