fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name '5M_CustomApp'
author 'Finals / 5M Phone'
version '1.0.0'
description 'Example developer app for 5M Phone (React + TypeScript template)'

shared_script 'config.lua'
client_script 'client/main.lua'

files {
    'ui/dist/**/*',
}

--- Production: built UI
-- ui_page 'ui/dist/index.html'

--- Dev: Vite (`cd ui && npm run dev`) — uncomment while iterating in browser
-- ui_page 'http://localhost:5173/'
