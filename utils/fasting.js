export const PRESETS = [12, 14, 16, 18, 20, 24, 36]

export function createFast(hours, startedAt = Date.now()) {
  return {
    id: `fast_${startedAt}`,
    status: 'active',
    startedAt,
    targetMinutes: hours * 60,
    completionAlertSent: false
  }
}

export function getFastProgress(fast, now = Date.now()) {
  const elapsedMs = Math.max(0, now - fast.startedAt)
  const targetMs = Math.max(60000, fast.targetMinutes * 60000)
  const remainingMs = Math.max(0, targetMs - elapsedMs)
  const overtimeMs = Math.max(0, elapsedMs - targetMs)
  const ratio = elapsedMs / targetMs
  const complete = ratio >= 1
  const overtimeRatio = overtimeMs / targetMs
  const overtimeCycle = overtimeRatio === 0
    ? 0
    : overtimeRatio % 1 === 0
      ? 1
      : overtimeRatio % 1

  return {
    elapsedMs,
    remainingMs,
    overtimeMs,
    targetMs,
    ratio,
    ringRatio: Math.min(1, ratio),
    overtimeCycle,
    percentage: Math.min(100, Math.floor(ratio * 100)),
    complete,
    endsAt: fast.startedAt + targetMs
  }
}

export function formatDigital(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatCountdown(progress) {
  return progress.complete
    ? `+${formatDigital(progress.overtimeMs)}`
    : formatDigital(progress.remainingMs)
}

export function formatDuration(ms, includeSeconds = false) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (includeSeconds) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  return `${hours}h ${pad(minutes)}m`
}

export function formatClock(timestamp) {
  const date = new Date(timestamp)
  let hours = date.getHours()
  const minutes = pad(date.getMinutes())
  const suffix = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${suffix}`
}

export function getStage(elapsedMs) {
  const hours = elapsedMs / 3600000
  if (hours < 4) return 'RECENTLY FED'
  if (hours < 12) return 'EARLY FAST'
  if (hours < 18) return 'STORED ENERGY'
  return 'EXTENDED FAST'
}

function pad(value) {
  return String(value).padStart(2, '0')
}
