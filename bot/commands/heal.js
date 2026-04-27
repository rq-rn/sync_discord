function getCommand() {
    return {
        name: 'heal',
        description: '対象プレイヤーをヒールする',
        options: [
            {
                name: 'id',
                description: '対象サーバーID',
                type: 10,
                required: true
            }
        ]
    }
}

async function execute(interaction) {
    const id = interaction.options.getNumber('id');

    const result = await emitPromise('hoa_sync_discord:server:healPlayer', Number(id));

    await emitResult(result, interaction, async function(interaction, args) {
        const id = args[0];
        const revive = args[1];
        if (revive) {
            await interaction.reply({
                content: `ID ${id} のプレイヤーを回復させました。\n死亡状態だったため蘇生を行いました。`,
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: `ID ${id} のプレイヤーを回復させました。`,
                ephemeral: true
            })
        }
    }, id, result.revive);
}

module.exports = {
    getCommand, execute
}