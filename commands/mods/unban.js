const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, time } = require('discord.js');
const client = require('../../honami')

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder().setName("unban").setDescription("unBan a user from server using id ").addStringOption(option => option.setName("id").setDescription("provide id of member you want to unban").setRequired(true)).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const { options } = interaction
        const id = options.getString("id")
        const user = interaction.guild.members.fetch(id)
        if (user) {
            const date = new Date();
            const timeString = time(date);
            const exampleEmbed = new EmbedBuilder().setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` }).setDescription(`**Succesfully unbanned ${user.username}**`).setFooter({ text: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` }).addFields({ name: "Unbanned at", value: `${timeString}`, inline: true })
            await interaction.guild.members.unban(user)
            await interaction.reply({ embeds: [exampleEmbed] })
            return;

        }
        else {
            const exampleEmbed = new EmbedBuilder().setDescription(`**User Not found**`)
            await interaction.reply({ embeds: [exampleEmbed] })
            return;
        }
    }
}