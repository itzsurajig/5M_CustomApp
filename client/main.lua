---@diagnostic disable: undefined-global

local PHONE = '5M_Phone'

local function phoneReady()
    return GetResourceState(PHONE) == 'started'
end

local function register()
    if not phoneReady() then return false end

    local ok, err = exports[PHONE]:RegisterApp({
        id = Config.AppId,
        name = Config.Name,
        description = Config.Description,
        developer = Config.Developer,
        defaultApp = Config.DefaultApp == true,
        ui = Config.UiPath,
        icon = Config.IconPath,
        color = Config.Color,
        screenshots = Config.Screenshots,
    })

    if not ok then
        print(('[5M_CustomApp] RegisterApp failed: %s'):format(tostring(err)))
        return false
    end

    print(('[5M_CustomApp] Registered on %s as "%s"'):format(PHONE, Config.AppId))
    return true
end

CreateThread(function()
    while not phoneReady() do
        Wait(400)
    end
    Wait(800)
    register()
end)

AddEventHandler('onResourceStart', function(res)
    if res == PHONE then
        CreateThread(function()
            Wait(1000)
            register()
        end)
    end
end)

AddEventHandler('onResourceStop', function(res)
    if res == GetCurrentResourceName() and phoneReady() then
        pcall(function()
            exports[PHONE]:UnregisterApp(Config.AppId)
        end)
    end
end)

--- Example NUI callback used by the React UI via appFetch('getPlayerSnapshot')
RegisterNUICallback('getPlayerSnapshot', function(_, cb)
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    cb({
        ok = true,
        name = GetPlayerName(PlayerId()) or 'Player',
        serverId = GetPlayerServerId(PlayerId()),
        heading = GetEntityHeading(ped),
        coords = { x = coords.x, y = coords.y, z = coords.z },
    })
end)

--- Push live heading into the open app iframe through the phone bridge.
CreateThread(function()
    local last = nil
    while true do
        Wait(200)
        if not phoneReady() then goto continue end
        local heading = math.floor(GetEntityHeading(PlayerPedId()) + 0.5)
        if heading ~= last then
            last = heading
            pcall(function()
                exports[PHONE]:SendAppMessage(Config.AppId, 'heading', { degrees = heading })
            end)
        end
        ::continue::
    end
end)
