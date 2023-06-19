const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, MessageType, EmbedBuilder, WebhookClient, Webhook } = require('discord.js');
const { token } = require('./config.json');
const register = require('./helpers/register')
const musicevent = require('./helpers/musicevent')


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], presence: { status: 'dnd', activities: [{ name: "Bursting TreeHouse", type: ActivityType.Competing }] } });

const commands = [];

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
	leaveOnEmpty: true,
	leaveOnFinish: true,
	plugins: [new SpotifyPlugin()],
});
module.exports = client;


for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
			client.commands.set(command.data.name, command);

		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);


	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			return await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			return await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.on("messageCreate", async (message) => {
	if (message.author.bot) {
		return;
	}
	if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == MessageType.Reply) { return false }

	if (message.mentions.has(client.user.id)) {
		return message.reply("Thanks for disturbing me loser but if you want to know use /help to know about my commands");

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

musicevent({ client: client })
// register({ commands: commands, token: token })
// redeploying


client.once(Events.ClientReady, c => {
	const exampleEmbed = new EmbedBuilder().setColor("Blue").setDescription(`**I am online **`)
	const channel = client.channels.cache.get("1119549238716669982");
	channel.send({ embeds: [exampleEmbed] })
	return console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.login(token);
