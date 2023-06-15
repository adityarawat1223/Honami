const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const client = require('../../honami')

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder().setName("ban").setDescription("Ban a user from guild id or mention both work").addUserOption(option => option.setName("user").setDescription("Select user or provide id").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Optional reason")).setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const { user, options } = interaction
        const reason = options.getString("reason")
        const banuser = options.getMember("user")
        const targetUserRolePosition = banuser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        const { EmbedBuilder } = require('discord.js');


        if (banuser.id === interaction.guild.ownerId) {
            await interaction.reply(
                "You can't ban that user because they're the server owner."
            );
            return;
        }


        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.reply(
                "You can't ban that user because they have the same/higher role than you."
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.reply(
                "I can't ban that user because they have the same/higher role than me."
            );
            return;
        }

        else {

            if (!reason) {
                const exampleEmbed = new EmbedBuilder().setAuthor({
                    name: `${client.user.tag}`, iconURL: client.user.avatarURL()
                }).setDescription(`**Successfully Banned ${banuser.user.tag} **`).addFields({ name: 'Action performed By', value: `${user.tag}`, inline: true },
                    { name: "Reason", value: `Not provided` }).setFooter({
                        text: ` Requested By ${user.tag}`,
                        iconURL: user.displayAvatarURL()
                    })
                banuser.ban(banuser)
                await interaction.reply({ embeds: [exampleEmbed] })
            }

            else {
                const exampleEmbed = new EmbedBuilder().setAuthor({
                    name: `${client.user.tag}`, iconURL: client.user.avatarURL()
                }).setDescription(`**Successfully Banned ${banuser.user.tag} **`).addFields({ name: 'Action performed By', value: `${user.tag}`, inline: true },
                    { name: "Reason", value: `${reason}` }).setFooter({
                        text: ` Requested By ${user.tag}`,
                        iconURL: user.displayAvatarURL()
                    })
                banuser.ban(banuser)
                await interaction.reply({ embeds: [exampleEmbed] })

            }
        }
    }
}