const { SlashCommandBuilder, codeBlock } = require('discord.js');
const client = require('../../honami')
const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Play music bruh")
        .addSubcommand(
            subcommand =>
                subcommand.setName("play")
                    .setDescription("play bruh")
                    .addStringOption(option =>
                        option.setName("name")
                            .setDescription("Provide name of music or url")
                            .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName("stop")
            .setDescription("Stop Music"))
        .addSubcommand(subcommand => subcommand.setName("skip")
            .setDescription("Skip Music"))
        .addSubcommand(subcommand => subcommand.setName("queue")
            .setDescription("See all songs in queue"))
        .addSubcommand(subcommand => subcommand.setName("jump")
            .setDescription("Jump to song  see queue to get song number").addIntegerOption(option =>
                option.setName("number")
                    .setDescription("Provide Song number")
                    .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName("loop").setDescription("Loop songs or queue")
            .addStringOption(option => option.setName("loop").setDescription("choose loop mode").addChoices(
                { name: "off", value: "off" },
                { name: "song", value: "song" },
                { name: "queue", value: "queue" }

            ).setRequired(true)))
    ,

    async execute(interaction) {
        const { options, member, channel, guild } = interaction
        const query = options.getString("name")
        const num = options.getInteger("number")
        const voicechannel = member.voice.channel
        const botvc = interaction.guild.members.me.voice.channel
        const subcommand = options.getSubcommand()




        if (!voicechannel) {
            return interaction.reply("Please Join a vc then use this command")
        }

        if (!botvc || voicechannel.id == botvc.id) {
            try {
                switch (subcommand) {
                    case "play":
                        client.distube.play(voicechannel, query, {
                            textChannel: channel,
                            member: member,
                        })
                        await interaction.reply({ content: 'Requesting Song please wait a moment', ephemeral: true });
                        break

                    case "stop":
                        const queue = await client.distube.getQueue(voicechannel)
                        if (!queue) {
                            await interaction.reply("No song playing")
                        }
                        else {
                            client.distube.stop(voicechannel)
                            await interaction.reply({ content: "Stopping Music", ephemeral: true })
                        }
                        break

                    case "skip":
                        const queuek = await client.distube.getQueue(voicechannel)
                        if (!queuek) {
                            await interaction.reply({ content: "No song in Queue", ephemeral: true })
                        }
                        else {
                            if (queuek.songs.length <= 1) {
                                await interaction.reply({ content: "NO songs in queue to skip", ephemeral: true })
                            }
                            else {
                                client.distube.skip(voicechannel)
                                await interaction.reply({ content: "Skipping Song", ephemeral: true })
                            }
                        }
                        break
                    case "queue":
                        const qlist = await client.distube.getQueue(voicechannel)
                        if (!qlist) {
                            await interaction.reply({ content: "No song in Queue", ephemeral: true })
                        }
                        else {
                            const exampleEmbed = new EmbedBuilder().setColor(0x0099FF).setTitle(`Queue List`).setDescription(`${qlist.songs.map((song, id) =>
                                `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                            ).join("\n")}`)

                            await interaction.reply({ embeds: [exampleEmbed] })
                        }
                        break

                    case "jump":
                        const qcheck = await client.distube.getQueue(voicechannel)

                        if (!qcheck) {
                            await interaction.reply({ content: "No song in Queue", ephemeral: true })
                        }

                        else {
                            if (qcheck.songs.length <= 1) {
                                await interaction.reply({ content: "Add More songs into queue to access this feature", ephemeral: true })
                            }
                            else {
                                if (parseInt(num) <= qcheck.songs.length) {
                                    const q = parseInt(num) - 1
                                    client.distube.jump(voicechannel, q)
                                    await interaction.reply({ content: "Jumping on your mom", ephemeral: true })
                                }
                                else {
                                    await interaction.reply({ content: " Bruh No number like that exist in queue so i jump on your mom instead " })
                                }
                            }
                        }
                        break


                    case "loop":

                        const option = options.getString("loop")



                        const queuecheck = await client.distube.getQueue(voicechannel)

                        if (!queuecheck) {
                            const exampleEmbed = new EmbedBuilder().setColor('Red').setDescription("**Please add some songs in queue first**")
                            return interaction.reply({ embeds: [exampleEmbed] })
                        }


                        let mode = null
                        switch (option) {

                            case "off":
                                { mode = 0 }
                                break;
                            case "song":
                                { mode = 1 }
                                break
                            case "queue":
                                { mode = 2 }
                                break
                        }



                        mode = await client.distube.setRepeatMode(guild, mode)

                        mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";

                        const exampleEmbed = new EmbedBuilder().setDescription(`**Set Repeat Mode to ${mode}**`)
                        await interaction.reply({ embeds: [exampleEmbed] })




                }
            } catch (err) {
                const channel = client.channels.cache.get("1015498504992460840");
                const code = codeBlock('js', `${err}`)
                const exampleEmbed = new EmbedBuilder().setTitle("Reporting an error").setDescription(
                    `${code}`
                ).setColor('Red').setAuthor({
                    name: `${client.user.username}`, iconURL: client.user.avatarURL()
                })
                channel.send({ embeds: [exampleEmbed] })
            }
        }

        else {

            await interaction.reply({ content: " I am already playing music in a this server", ephemeral: true })
        }
    }



}