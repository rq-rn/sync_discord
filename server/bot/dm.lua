RegisterNetEvent('hoa_sync_discord:server:sendDirectMessage', function (id, message, name, cb)
    TriggerClientEvent('txcl:showDirectMessage', id, message, name)
    TriggerEvent('txsv:logger:addChatMessage', 'tx', '(DM) '.. name, message)

    cb({
        success = true
    })
end)