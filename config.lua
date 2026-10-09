Config = {}

--- Unique id on the phone home screen (letters, numbers, - _ .)
Config.AppId = 'finals-demo'

Config.Name = 'Finals Demo'
Config.Description = 'Example developer app for 5M Phone.'
Config.Developer = 'Your Studio'
Config.DefaultApp = false --- false = appears in App Store as downloadable; true = auto-install

--- Relative to this resource after `npm run build`
Config.UiPath = 'ui/dist/index.html'
Config.IconPath = 'ui/dist/icon.svg'
Config.Color = '#6366f1'

--- App Store gallery images (paths relative to this resource, or full https:// URLs).
--- Shown on the app detail page under Screenshots.
Config.Screenshots = {
    'ui/dist/store/shot1.svg',
    'ui/dist/store/shot2.svg',
}
