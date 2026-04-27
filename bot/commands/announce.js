function getCommand() {
    return {
        name: 'announce',
        description: 'アナウンスを送信する',
        options: [
            {
                name: 'content',
                description: 'アナウンス内容',
                type: 3,
                required: true
            },
            {
                name: 'channel',
                description: 'Discordにもアナウンスを送信する場合のチャンネルを指定 (任意)',
                type: 7
            }
        ]
    }
}

async function execute(interaction) {
    const content = interaction.options.getString('content');
    const channel = interaction.options.getChannel('channel');

    let replyMessage = 'ゲーム内にアナウンスを送信しました。';

    if (channel) {
        replyMessage += `\n${channel}にメッセージを送信しました。`;
        await channel.send({
            content: content
        })
    }

    const user = await interaction.guild.members.fetch(interaction.user);

    const result = emitPromise('hoa_sync_discord:server:sendAnnounce', content, user.nickname);

    await interaction.reply({
        content: replyMessage,
        ephemeral: true
    })
}

module.exports = {
    getCommand, execute
}