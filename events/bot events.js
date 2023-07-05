// const client = require("../honami")
const { MessageType, EmbedBuilder, codeBlock, time, Events, Collection } = require('discord.js');
const afk = require("../schema/afkschema")

const botevents = (client) => {

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);


        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        const { cooldowns } = client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                const exampleEmbed = new EmbedBuilder().setDescription(`**Please wait, you are on a cooldown till <t:${expiredTimestamp}:T>.**`)
                return interaction.reply({ embeds: [exampleEmbed] });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

        try {
            await command.execute(interaction);
        } catch (error) {
            const date = new Date();
            const timeString = time(date);
            const channel = client.channels.cache.get("1015498504992460840");
            const code = codeBlock('js', `${error}`)
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
            console.log(error)

        }
    });

    client.once(Events.ClientReady, c => {
        return console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on("messageCreate", async (message) => {
        const lol = await afk.findOneAndDelete({ userid: message.author.id, guildid: message.guild.id })

        if (lol) {
            const exampleEmbed = new EmbedBuilder().setDescription(`You Are No longer Afk for reason **${lol.reason}**`)
            await message.reply({ embeds: [exampleEmbed] })
            return
        }


        if (message.author.bot) {
            return;
        }


        if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) { return false }


        if (message.mentions.users) {
            const users = message.mentions.users
            await users.map(async (us) => {
                const lol = await afk.findOne({ userid: us.id })
                if (lol) {
                    const exampleEmbed = new EmbedBuilder().setDescription(`<@${lol.userid}> is Afk for **${lol.reason}** since ${time(lol.date)}`)
                    await message.reply({ embeds: [exampleEmbed] })
                }
                else {
                    return
                }
            })

        }

        const EMOJIREGEX = /<?(a)?:(\w{2,32}):(\d{17,19})?>?/;
        var emojis = message.content.match(EMOJIREGEX);
        if (emojis) {
            const text = client.emojis.cache.get(emojis[3])
            if (!text) {
                const emojiname = emojis[0]
                const emojipure = emojiname.replace(/:/g, '')

                const anim = client.emojis.cache.find(emoji => emoji.name === `${emojipure}`)
                if (!anim) {
                    return;
                }

                else {
                    const web = await message.channel.fetchWebhooks()
                    const webk = await web.find(wh => wh.name === "Honami")
                    message.delete()
                    if (webk) {
                        return webk.send({
                            username: `${message.author.username}`, avatarURL: `${message.author.displayAvatarURL()}`,
                            content: `<a:${anim.name}:${anim.id}>`
                        })
                    }
                    else {
                        const webk = await message.channel.createWebhook({
                            name: 'Honami',
                            avatar: `${client.user.avatarURL()}`,
                        })
                        return webk.send({
                            username: `${message.author.username}`, avatarURL: `${message.author.displayAvatarURL()}`,
                            content: `<a:${anim.name}:${anim.id}>`
                        })
                    }
                }
            }
            else {
                return;

            }
        }

    })

}

module.exports = botevents