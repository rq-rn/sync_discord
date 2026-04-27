const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '10' }).setToken(Config.TOKEN);

const fs = require('fs');
const path = require('path');

const Commands = new Map();

async function setupCommands(client) {
    const commands = [];

    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'));

    function setCommands(files, dir = path.join(__dirname, 'commands')) {
        for (const file of files) {
            const isJS = file.endsWith('.js');
            const fullPath = path.join(dir, file);

            if (isJS) {
                try {
                    const command = require(fullPath);
                    if (typeof(command.getCommand) === 'function') {
                        const commandData = command.getCommand();
                        commands.push(commandData);
                        Commands.set(commandData.name, command);
                    };
                } catch(error) {
                    console.log(error);
                }
            } else {
                try {
                    const subFiles = fs.readdirSync(fullPath);
                    setCommands(subFiles, fullPath);
                } catch(error) {
                    
                }
            }
        }
    }

    setCommands(commandFiles);

    try {
        await rest.put(Routes.applicationGuildCommands(client.user.id, Config.GUILD_ID), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function commandInteraction(interaction) {
    const commandName = interaction.commandName;

    const command = Commands.get(commandName);
    if (!command) return;
    if (typeof(command.execute) !== 'function') return;
    await command.execute(interaction);
}

async function commandAutocomplete(interaction) {
    const commandName = interaction.commandName;

    const command = Commands.get(commandName);
    if (!command) return;
    if (typeof(command.autocomplete) !== 'function') return;
    await command.autocomplete(interaction);
}

module.exports = {
    setupCommands, commandInteraction, commandAutocomplete
}