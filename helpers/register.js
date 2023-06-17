const { REST, Routes } = require('discord.js');

const register = ({commands ,token}) => {

    const rest = new REST().setToken(token);
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands("1118015355714015252"),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

}

module.exports = register