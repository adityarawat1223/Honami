const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Embed } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const { token } = require('./config.json');
const register = require('./register')
const { EmbedBuilder } = require('discord.js');

const commands = [];

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
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
client.distube
	.on('playSong', (queue, song) => {


		const exampleEmbed = new EmbedBuilder().setColor(0x0099FF).setTitle(` Playing - ${song.name}`).setDescription(`Playing In our Highest quality Enjoy `).setFooter({
			text: ` Requested By ${song.user.tag}`,
			iconURL: song.user.displayAvatarURL()

		}).setImage(song.thumbnail).setAuthor({
			name: `${client.user.tag}`, iconURL: client.user.avatarURL()
		}).addFields(
			{ name: 'Likes on Youtube', value: `**${song.likes}**`, inline: true },
			{ name: 'Song Duration', value: `**${song.formattedDuration}**`, inline: true },

		)



		queue.textChannel?.send(
			{ embeds: [exampleEmbed] }
		)
	}
	)
client.distube.on("addSong", (queue, song) => {
	
	
	if (queue.songs.length <= 1) {

	}
	else {
		queue.textChannel.send(
			`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
		)
	}
});

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
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// register({ commands: commands, token: token })


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.login(token);