const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../../honami')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check Bot ping'),
	async execute(interaction) {

		const exampleembed = new EmbedBuilder().setAuthor({
			name: `${client.user.username}`, iconURL: client.user.avatarURL()
		}).setDescription(`**Current Ping is ${client.ws.ping} ms \n Bot uptime - ${client.uptime} ms**`)

		await interaction.reply({ embeds: [exampleembed] });
	},
};