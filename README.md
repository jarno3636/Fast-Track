# Fast Track for Zepp OS — v0.5 Build Ready

Fast Track is a precision fasting timer for Amazfit watches, optimized first for the Amazfit T-Rex 3.

## Core experience

- Circular `HH:MM:SS` countdown
- Clockwise progress ring
- Full goal ring plus a separate overtime wrap
- `+HH:MM:SS` after the goal
- Timestamp-based persistence after closing the app
- 12, 14, 16, 18, 20, 24, and 36-hour plans
- Two-hour extension
- Goal vibration
- Current and best Flame streaks
- Weekly completions, completion rate, lifetime hours, and recent history

## First GitHub build

1. Push every file in this folder to the repository root.
2. Open **Actions → Build Fast Track**.
3. Select **Run workflow**.
4. Download the `fast-track-v0.5-build` artifact after the green check.

The workflow installs both current Zepp build packages globally:

```bash
npm install --global @zeppos/zpm@latest @zeppos/zeus-cli@latest
```

Installing both packages fixes the common `Cannot find module 'zeppos-app-utils'` Zeus environment failure.

## Preview from Codespaces

Open **Code → Codespaces → Create codespace on main**, then run:

```bash
npm run preview
```

Scan the QR code from Zepp Developer Mode to install the preview on the connected watch.

## Device targets

The package uses official `deviceSource` identifiers for:

- Amazfit T-Rex 3 — 480 × 480
- Amazfit Balance 2 — 480 × 480
- Amazfit T-Rex 3 Pro 48 mm — 480 × 480
- Amazfit Active 2 Round — 466 × 466
- Amazfit T-Rex 3 Pro 44 mm — 466 × 466
- Amazfit Active 2 Square — 390 × 450
- Amazfit Bip 6 — 390 × 450

## App ID

`app.json` currently uses App ID `1121904`. Keep it only if that is the Fast Track App ID shown in your Zepp developer console.
