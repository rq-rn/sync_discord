const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
});

global.Config = require('./bot/config.json');
const Commands = require('./bot/command.js');

function normalizeString(string) {
    return string.replace(/\s/g, '').toLowerCase();
}

function emitPromise(eventName, ...args) {
    return new Promise((resolve) => {
        function cb(result) {
            resolve(result);
        }

        emit(eventName, ...args, cb)
    })
}

async function emitResult(result, interaction, fnc, ...args) {
    const id = args[0];
    if (result) {
        if (result.success) {
            fnc(interaction, args, result);
        } else {
            if (result.type === 'no-player') {
                await interaction.reply({
                    content: `ID ${id} のプレイヤーが存在しません。`,
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: '何等かのエラーが発生しました。 [1]',
                    ephemeral: true
                })
            }
        }
    } else {
        await interaction.reply({
            content: '何等かのエラーが発生しました。 [2]',
            ephemeral: true
        })
    }
}

client.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        Commands.commandInteraction(interaction);
    } else if (interaction.isAutocomplete()) {
        Commands.commandAutocomplete(interaction);
    }
})

client.on('ready', async (interaction) => {
    await Commands.setupCommands(client);

    console.log(`@Logged in as ${client.user.tag}`);
})

client.login(Config.TOKEN);