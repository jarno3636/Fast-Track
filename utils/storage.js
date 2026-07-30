import { LocalStorage } from '@zos/storage'

const storage = new LocalStorage()
const ACTIVE_KEY = 'fast_track_active_v2'
const HISTORY_KEY = 'fast_track_history_v2'
const SETTINGS_KEY = 'fast_track_settings_v2'

export function getActiveFast() { return storage.getItem(ACTIVE_KEY, null) }
export function saveActiveFast(fast) { storage.setItem(ACTIVE_KEY, fast) }
export function clearActiveFast() { storage.removeItem(ACTIVE_KEY) }
export function getHistory() { return storage.getItem(HISTORY_KEY, []) || [] }
export function addHistory(entry) {
  const history = getHistory()
  history.unshift(entry)
  storage.setItem(HISTORY_KEY, history.slice(0, 100))
}
export function getSettings() {
  return storage.getItem(SETTINGS_KEY, { haptics: true, encouragement: true, clock24: false }) || { haptics: true, encouragement: true, clock24: false }
}
export function saveSettings(settings) { storage.setItem(SETTINGS_KEY, settings) }
