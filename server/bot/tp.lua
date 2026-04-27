RegisterNetEvent('hoa_sync_discord:server:teleportPlayer', function (id, coords, cb)
    local Player = QBCore.Functions.GetPlayer(id)
    if not Player then
        cb({
            success = false,
            type = 'no-player'
        })
        return
    end

    local player = GetPlayerPed(id)
    SetEntityCoords(player, tonumber(coords.x), tonumber(coords.y), tonumber(coords.z), false, false, false, true)
    TriggerClientEvent('QBCore:Notify', id, '管理者によってテレポートされました。')
    cb({
        success = true
    })
end)
