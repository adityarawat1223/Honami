const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, codeBlock , time} = require('discord.js');
const client = require("../../honami")

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('purge').
        setDescription("Purge some messages or all messages your wish")
        .addSubcommand(
            subcommand => subcommand.setName("messages").setDescription("Delete some messages amount should be less than 100").addNumberOption(
                option => option.setName("amount").setDescription("Enter message amount you want to delete").setRequired(true)
            ))
        .addSubcommand(subcommand => subcommand.setName("all").setDescription("Delete all messages of channel"))
    ,
    async execute(interaction) {
        const { options } = interaction
        const subcommand = options.getSubcommand()

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)){
            const exampleEmbed = new EmbedBuilder().setDescription("**You Dont have Manage Manage Messages  permission to use this command**").setColor("Blue")
            await interaction.reply(
                { embeds: [exampleEmbed] }
            );
            return;
        }

        
        try {
            switch (subcommand) {
                case "messages":
                    const num = options.getNumber("amount")
                    if (100 >= num) {
                        const amount = await interaction.channel.bulkDelete(num, true)
                        return interaction.reply({ content: `Deleted ${amount.size} Messages, Remember i cant delete message older than 14 days due to discord api limitations `, ephemeral: true })
                    }
                    else {
                        interaction.reply({ content: "Please enter amount less than or equal to 100", ephemeral: true })
                    }
                    break
                case "all":
                    await interaction.channel.clone().then(async (clonedchannel) => {
                        const original = interaction.channel.position
                        await clonedchannel.setPosition(original)
                        clonedchannel.send(`Deleted All messages in ${clonedchannel.name}`)
                    }).catch((err) => {
                        console.log(err)
                    });
                    await interaction.reply("Done")
                    await interaction.channel.delete()
                    break
            }
        } catch (err) {
            const date = new Date();
            const timeString = time(date);
            const channel = client.channels.cache.get("1015498504992460840");
            const code = codeBlock('js', `${err}`)
            const exampleEmbed = new EmbedBuilder().setTitle("Reporting an error").setDescription(
                `${code}`
            ).setColor('Red').setAuthor({
                name: `${client.user.username}`, iconURL: client.user.displayAvatarURL()
            }).addFields({ name: "Command used", value: `</${interaction.commandName}:${interaction.commandId}>`, inline: true }, { name: "Channel", value: `${interaction.channel.name}`, inline: true }, { name: "Time", value: `${timeString}`, inline: true }).setFooter({
                text: `Used By ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()

            })
            await interaction.reply("Oh no I am facing some erros reporting problem to our developers")
            channel.send({ embeds: [exampleEmbed] })
        }
    },
};