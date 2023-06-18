const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete message in bulk Max 100 per command').addNumberOption(
            option => option.setName("amount").setDescription("Enter message amount you want to delete").setRequired(true)
        ).setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    ,
    async execute(interaction) {
        const { channel, options } = interaction
        const num = options.getNumber("amount")
        if (100 >= num) {
            channel.bulkDelete(num, true)
            interaction.reply({ content: `Deleted ${num} Messages Remembed i cant delete message older than 14 days due to discord api limitations `, ephemeral: true })

        }
        else {
            interaction.reply({ content: "Please enter amount less than or equal to 100", ephemeral: true })
        }


    },
};