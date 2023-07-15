
const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');
const { token } = require('./config.json');
const musicevent = require('./events/musicevent')
const botevent = require("./events/bot events")
const Connectdb = require("./helpers/database")
const checkyt = require("./events/ytevents")


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], presence: { status: 'dnd', activities: [{ name: "Bursting TreeHouse", type: ActivityType.Competing }] } });


const fs = require('node:fs');
const path = require('node:path');



const commands = [];
client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

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

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
	leaveOnEmpty: true,
	leaveOnFinish: true,
	plugins: [new SpotifyPlugin()],
	emptyCooldown: 30
});




musicevent({ client: client })
botevent({ client : client , commands: commands })
Connectdb()
setInterval(checkyt, 600000);
client.login(token);


