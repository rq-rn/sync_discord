fx_version 'cerulean'
game 'gta5'
author 'hoa'
version '0.1.0'

client_script {
    'client/**/*.lua'
}
server_script {
    '@oxmysql/lib/MySQL.lua',
    'server/**/*.lua',
    'bot/index.js'
}
shared_script {
    '@ox_lib/init.lua'
}