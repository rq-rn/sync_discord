RegisterNetEvent('hoa_sync_discord:server:banPlayer', function (id, reason, time, cb)
    local Player = QBCore.Functions.GetPlayer(id)
    if not Player then
        cb({
            success = false,
            type = 'no-player'
        })
        return
    end

    local name = GetPlayerName(id)
    local license = QBCore.Functions.GetIdentifier(id, 'license')
    local discord = QBCore.Functions.GetIdentifier(id, 'discord')
    local ip = QBCore.Functions.GetIdentifier(id, 'ip')

    local message = 'あなたはサーバーからBANされました。'
    if reason ~= '' then
        message = message .. '\n理由: ' .. reason
    end
    local datetime = time
    if datetime then
        if datetime < 2147483647 then
            datetime = os.time() + time
        end
    else
        datetime = 2147483647
    end
    local date = os.date('%Y-%m-%d %H:%M:%S', datetime)
    message = message .. '\n期間: ~ ' .. date

    MySQL.insert('INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)', {
        name,
        license,
        discord,
        ip,
        reason,
        datetime,
        'Discord'
    })

    DropPlayer(id, message)

    cb({
        success = true,
        date = date,
        time = time,
        name = name,
        license = license,
        discord = discord,
        ip = ip
    })
end)