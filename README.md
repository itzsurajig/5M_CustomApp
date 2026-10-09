# 5M_CustomApp — Finals Phone developer template

Original React + TypeScript example for building **your own apps** on [5M Phone](../5M_Phone).

## Requirements

- `5M_Phone` started
- Node.js 18+

## Setup

```bash
cd ui
npm install
npm run build
```

Ensure order in `server.cfg`:

```
ensure 5M_Phone
ensure 5M_CustomApp
```

## Develop UI in the browser

```bash
cd ui
npm run dev
```

Optionally set `ui_page 'http://localhost:5173/'` in `fxmanifest.lua` while iterating (still register through the phone export in-game).

## Register API (phone)

```lua
exports['5M_Phone']:RegisterApp({
    id = 'my-app',
    name = 'My App',
    description = 'Hello',
    developer = 'Studio',
    defaultApp = true,
    ui = 'ui/dist/index.html',      -- or full https://cfx-nui-... URL
    icon = 'ui/dist/icon.svg',
    color = '#6366f1',
})

exports['5M_Phone']:UnregisterApp('my-app')
exports['5M_Phone']:SendAppMessage('my-app', 'eventName', { foo = true })
```

## UI bridge (`ui/src/lib/phoneBridge.ts`)

| Helper | Purpose |
| --- | --- |
| `appFetch(event, data?)` | NUI callback on **this** resource |
| `onPhoneMessage(handler)` | Listen for `SendAppMessage` pushes |
| `requestCloseApp()` | Return to phone home |
| `getPhoneBridgeMeta()` | `fpResource`, `fpAppId`, `fpTheme` |

## Notes

- Do **not** reuse built-in app ids (`phone`, `messages`, `settings`, …).
- Keep `Config.DeveloperApps.Enabled = true` in `5M_Phone`.
- Ship only your `ui/dist` (and Lua) — do not redistribute 5M Phone escrowed code.
