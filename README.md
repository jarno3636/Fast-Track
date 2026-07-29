# Fast Track for Zepp OS

Fast Track is a persistent fasting timer for newer Amazfit watches. Version 0.2 uses one shared codebase with responsive layouts for round and square displays.

## Included device families

### 480 × 480 round
- Amazfit T-Rex 3
- T-Rex 3 Pro 48mm
- T-Rex Ultra 2
- Balance / Balance 2 / Balance 3
- Balance Ultra
- Active Max
- Cheetah Pro and newer 480px round models

### 466 × 466 round
- Active 2 Round
- Active 3 Premium
- T-Rex 3 Pro 44mm
- GTR 4
- Cheetah 2 Pro

### 390 × 450 square
- Active
- Active 2 Square
- Bip 6
- GTS 4
- Cheetah Square

The v3 target qualifiers also allow compatible newer devices with the same screen shape and width to use the matching build target.

## Phone-only GitHub workflow

1. Create a new GitHub repository.
2. Upload all files from this project, including the hidden `.github` and `.devcontainer` folders.
3. Open the repository in Safari.
4. Use **Code → Codespaces → Create codespace** for browser editing.
5. For a build without a terminal, open **Actions → Build Fast Track → Run workflow**.
6. Open the completed workflow and download the `fast-track-zab-*` artifact.

GitHub Actions builds every configured target and uploads the resulting `.zab` files from `dist/`.

## Codespaces commands

```bash
npm install
npm run build
npm run preview
```

`npm run preview` may require signing into your Zepp developer account and displaying the generated QR code on another screen so the Zepp phone app can scan it.

## Important before publishing

The current `appId` is a development placeholder. Replace it with the numeric App ID assigned in the Zepp developer console before store submission.

## Current functionality

- 12, 14, 16, 18, 20, 24 and 36-hour presets
- Persistent active-fast state
- Live elapsed and remaining time
- Progress arc on round displays
- Progress bar on square displays
- Completion vibration
- Two-hour extension
- Recent local history
