function getCommand() {
    return {
        name: 'tp',
        description: '対象プレイヤーをテレポートさせる',
        options: [
            {
                name: 'id',
                description: '対象サーバーID',
                type: 10,
                required: true
            },
            {
                name: 'location',
                description: '場所 (name or x, y, z)',
                type: 3,
                autocomplete: true,
                required: true
            }
        ]
    }
}

const path = require('path');

const Locations = require(path.join(__dirname, 'locations.json'));

async function execute(interaction) {
    const id = interaction.options.getNumber('id');
    const value = interaction.options.getString('location');

    const location = Locations.find(loc => normalizeString(loc.label) === normalizeString(value));
    let coords = {};

    if (location) {
        [coords.x, coords.y, coords.z] = location.coords.replace(/\s/g, '').split(',');
    } else {
        [coords.x, coords.y, coords.z] = value.replace(/\s/g, '').split(',');
    }

    const result = await emitPromise('hoa_sync_discord:server:teleportPlayer', Number(id), coords);

    await emitResult(result, interaction, async function(interaction, args) {
        const id = args[0];
        const location = args[1];
        const value = args[2];
        await interaction.reply({
            content: `ID ${id} のプレイヤーを${location?.label || value}にテレポートさせました。`,
            ephemeral: true
        })
    }, id, location, value);
}

async function autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filteredChoices = Locations.filter((location) => {
        const formatLocation = location.label.replace(/\s/g, '').toLowerCase();
        const formatValue = focusedValue.replace(/\s/g, '').toLowerCase();

        if (formatLocation.startsWith(formatValue)) {
            return true;
        }

        if (location.alias) {
            for (const alias of location.alias) {
                if (alias.startsWith(formatValue)) {
                    return true;
                }
            }
        }
    })

    const results = filteredChoices.map((choice) => {
        return {
            name: choice.label + ' (' + choice.coords + ')',
            value: choice.coords,
        }
    })

    interaction.respond(results.slice(0, 25)).catch(() => {});
}

on('hoa_sync_discord:discord:successTeleportPlayer', function(fnc, values) {
    fnc();
})

module.exports = {
    getCommand, execute, autocomplete
}