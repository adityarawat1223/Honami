const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Let bot speak for you').addStringOption(option =>
            option.setName("content")
                .setDescription("Content you want bot to say ")
                .setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        interaction.channel.sendTyping()
        const { options } = interaction
        const content = options.getString("content")
        await interaction.reply({ content: "Done", ephemeral: true })
        await interaction.channel.send(`${content}`);
    },
};