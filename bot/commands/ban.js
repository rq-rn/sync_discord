
const path = require('path');
const Expires = require(path.join(__dirname, 'ban.json'));

function getCommand() {
    return {
        name: 'ban',
        description: '対象をBANする。',
        options: [
            {
                name: 'id',
                description: '対象サーバーID',
                type: 10,
                required: true
            },
            {
                name: 'reason',
                description: '理由',
                type: 3
            },
            {
                name: 'time',
                description: '時間',
                type: 10,
                choices: Expires['expires']
            }
        ]
    }
}

async function execute(interaction) {
    const id = interaction.options.getNumber('id');
    const reason = interaction.options.getString('reason');
    const time = interaction.options.getNumber('time');

    const result = await emitPromise('hoa_sync_discord:server:banPlayer', id, reason || '', time);

    await emitResult(result, interaction, async function(interaction, args, result) {
        function formattedIdentifier(identifier) {
            const match = identifier.match(/.+?:(.+)/);
            return match[1];
        }

        const id = args[0];
        const reason = args[1];

        let content = `## ID ${id} をBANしました。`;
        if (reason) {
            content = `${content}\n理由: ${reason}`;
        }
        if (result.name) {
            content = `${content}\nname: ${result.name}`;
        }
        if (result.license) {
            content = `${content}\n${result.license}`;
        }
        if (result.discord) {
            content = `${content}\n${result.discord}`;
        }
        if (result.ip) {
            content = `${content}\n${result.ip}`;
        }
        if (result.date) {
            content = `${content}\n期限: ${result.date}`;
        }

        if (result.discord) {
            const guild = interaction.guild;
            const formattedDiscord = formattedIdentifier(result.discord);
            const user = await guild.members.fetch(formattedDiscord);
            try {
                const timeoutUser = await user.timeout(result.time * 1000, reason);
                content = `${content}\nDiscordの対象ユーザーをタイムアウトしました。\n必要に応じて手動でBANを行ってください。\n対象ユーザー: ${timeoutUser}`;
            } catch(error) {
                const code = error.code;
                if (code === 50013) {
                    content = `${content}\n\nDiscordの対象ユーザーをタイムアウトできませんでした。ボットの権限とロールの順序を確認してください。\n対象ユーザー: ${user}`;
                } else {
                    content = `${content}\n\nDiscordで予期しないエラーが発生しました。\n${error.name}: ${error.message}`;
                }
            }
        }

        await interaction.reply({
            content: content
        })
    }, id, reason);
}

module.exports = {
    getCommand, execute
}