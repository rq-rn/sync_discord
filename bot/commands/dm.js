function getCommand() {
    return {
        name: 'dm',
        description: '対象プレイヤーにメッセージを送る',
        options: [
            {
                name: 'id',
                description: '対象サーバーID',
                type: 10,
                required: true
            },
            {
                name: 'message',
                description: 'メッセージ',
                type: 3,
                required: true
            }
        ]
    }
}

async function execute(interaction) {
    const id = interaction.options.getNumber('id');
    const message = interaction.options.getString('message');

    const user = await interaction.guild.members.fetch(interaction.user);

    const result = await emitPromise('hoa_sync_discord:server:sendDirectMessage', id, message, user.nickname);

    await emitResult(result, interaction, async function(interaction, args, result) {
        const id = args[0];
        const message = args[1];
        await interaction.reply({
            content: `ID ${id} にDMを送信しました。\n> ${message}`,
            ephemeral: true
        })
    }, id, message);
}

module.exports = {
    getCommand, execute
}