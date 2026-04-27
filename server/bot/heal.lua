RegisterNetEvent('hoa_sync_discord:server:healPlayer', function (id, cb)
    local Player = QBCore.Functions.GetPlayer(id)
    if not Player then
        cb({
            success = false,
            type = 'no-player'
        })
        return
    end

    local isDead = Player.PlayerData.metadata.isdead
    local inLastStand = Player.PlayerData.metadata.inlaststand
    TriggerClientEvent('hoa_sync_discord:client:heal', id)
    local hunger = 100
    local thirst = 100
    local stress = 0
    Player.Functions.SetMetaData('hunger', hunger)
    Player.Functions.SetMetaData('thirst', thirst)
    Player.Functions.SetMetaData('stress', stress)

    TriggerClientEvent('hud:client:UpdateNeeds', id, hunger, thirst)
    TriggerClientEvent('hud:client:UpdateStress', id, stress)

    local revive = false
    if isDead or inLastStand then
        TriggerClientEvent('hospital:client:Revive', id)
        revive = true
    end

    TriggerClientEvent('QBCore:Notify', id, '管理者によって回復されました。')

    cb({
        success = true,
        revive = revive
    })
end)