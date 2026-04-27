RegisterNetEvent('hoa_sync_discord:server:sendAnnounce', function (content, user)
    TriggerClientEvent('txcl:showAnnouncement', -1, content, user);
    TriggerEvent('txsv:logger:addChatMessage', 'tx', '(Broadcast) '.. user, content)
end)