import { LocalStorage } from '@zos/storage'

const storage = new LocalStorage()
const ACTIVE_KEY = 'fast_track_active_v1'
const HISTORY_KEY = 'fast_track_history_v1'

export function getActiveFast() {
  return storage.getItem(ACTIVE_KEY, null)
}

export function saveActiveFast(fast) {
  storage.setItem(ACTIVE_KEY, fast)
}

export function clearActiveFast() {
  storage.removeItem(ACTIVE_KEY)
}

export function getHistory() {
  return storage.getItem(HISTORY_KEY, []) || []
}

export function addHistory(entry) {
  const history = getHistory()
  history.unshift(entry)
  storage.setItem(HISTORY_KEY, history.slice(0, 30))
}
