const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require(`discord.js`)
const ms = require(`ms`)
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName("giveaway").setDescription("Start a giveaway Quickly").addStringOption(option => option.setName("time").setDescription("Enter time Like 2s , 1d 10h").setRequired(true)).addUserOption(option => option.setName("host").setDescription("Select who is hosting this giveaway").setRequired(true)).addStringOption(option => option.setName("prize").setDescription("Enter Prize").setRequired(true)).addChannelOption(option => option.setName("channel").setDescription("select where you want to host giveaway ")).addRoleOption(option => option.setName("role").setDescription("Select role requirement for giveaway")).addRoleOption(option => option.setName("bypass").setDescription("Seelct which role can bypass role requirements")),

    async execute(interaction) {
        const { options } = interaction
        const channel = options.getChannel("channel")
        const prize = options.getString("prize")
        const time = options.getString("time")
        const role = options.getRole('role')
        const bypassrole = options.getRole("bypass")
        const host = options.getUser("host")

        await interaction.reply("This command is Under construction")
        return;

        const puretime = ms(time)
        if (puretime) {
            const timestamp = Date.now()
            const embedtime = puretime + Math.round(timestamp / 1000)
            let roleembed = "No requirements"
            let bypassembed = "No Bypass role"

            if (bypassrole) {
                bypassembed = bypassrole.mention
            }

            if (role) {
                roleembed = role.mention
            }
            const cancel = new ButtonBuilder()
                .setCustomId('enter')
                .setLabel('0')
                .setStyle(ButtonStyle.Success).setEmoji(`🎁`);

            const exampleEmbed = new EmbedBuilder().setTitle(`${prize}`).setDescription(`click 🎁 to enter\n **__Duration__** : Ends in <t:${embedtime}:R> \n Hosted By : ${host.mention}`).addFields({ name: `Requirements`, value: `${roleembed}` }, { name: `Bypass`, value: `${bypassembed}` })

            const row = new ActionRowBuilder()
                .addComponents(cancel);

            if (channel) {

                channel.send({ embeds: [exampleEmbed], components: [row] })

            }
            else {

                interaction.channel.send({ embeds: [exampleEmbed], components: [row] })
                interaction.reply({ content: ` done `, ephemeral: true })

            }

        }
        else {
            const exampleEmbed = new EmbedBuilder().setDescription("**Please enter correct time**")
            await interaction.reply({ embeds: [exampleEmbed] })
        }


    }
}