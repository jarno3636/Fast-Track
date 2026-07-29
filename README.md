# Fast Track for Zepp OS

Fast Track is a precision fasting tracker for newer Amazfit watches. Version 0.4 combines a premium circular countdown with a lightweight consistency system called **Your Flame**.

## Included

- Circular countdown ring that fills clockwise to the fasting goal
- Digital `HH:MM:SS` time remaining inside the ring
- Overtime display using `+HH:MM:SS`
- Secondary outer overtime arc after the goal is reached
- Persistent timestamp-based timing after leaving or reopening the app
- 12, 14, 16, 18, 20, 24, and 36-hour presets
- Two-hour goal extension
- Completion vibration
- Current Flame streak and best streak
- Weekly completion count
- Ember, Bronze, Silver, Gold, Platinum, and Obsidian Flame levels
- Completed fast count, success rate, and lifetime hours
- Recent fasting history
- Responsive 480 round, 466 round, and 390 × 450 square targets

## Flame rules

A calendar day counts toward the Flame when at least one fast ending that day reaches its selected goal. Multiple completed fasts on the same day count as one day. The current Flame remains visible through the following day so users can complete today's fast without seeing the streak disappear at midnight.

## Build in GitHub Actions

1. Upload the project to a GitHub repository.
2. Open **Actions**.
3. Select **Build Fast Track**.
4. Choose **Run workflow**.
5. Download the `fast-track-build` artifact after the run completes.

## Codespaces

The included `.devcontainer` installs dependencies and the Zeus CLI in the cloud.

```bash
npm run build
npm run preview
```

## Important before publishing

Replace the development `appId` in `app.json` with the ID assigned through your Zepp developer account.
