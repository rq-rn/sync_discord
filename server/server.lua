QBCore = exports['qb-core']:GetCoreObject({'Functions'})

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
end)

RegisterNetEvent('hoa_sync_discord:server:getDiscordId', function (id, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then
        cb({
            success = false,
            type = 'no-player'
        })
        return
    end
    local discordId = GetPlayerIdentifierByType(id, 'discord')
    cb({
        success = true,
        discord = discordId
    })
end)