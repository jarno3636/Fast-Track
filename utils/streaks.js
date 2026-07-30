function dayKey(timestamp) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function startOfDay(timestamp) { const d = new Date(timestamp); d.setHours(0, 0, 0, 0); return d.getTime() }
function addDays(timestamp, amount) { const d = new Date(timestamp); d.setDate(d.getDate() + amount); return d.getTime() }
function completedDays(history) { const days = {}; history.forEach((entry) => { if (entry.completed) days[dayKey(entry.endedAt)] = true }); return days }

export function getStreakStats(history, now = Date.now()) {
  const completed = completedDays(history)
  const today = startOfDay(now)
  const todayDone = Boolean(completed[dayKey(today)])
  let cursor = todayDone ? today : addDays(today, -1)
  let current = 0
  while (completed[dayKey(cursor)]) { current += 1; cursor = addDays(cursor, -1) }
  const sortedDays = Object.keys(completed).sort()
  let best = 0, run = 0, previous = null
  sortedDays.forEach((key) => {
    const parts = key.split('-').map(Number)
    const currentDay = new Date(parts[0], parts[1] - 1, parts[2]).getTime()
    run = previous !== null && currentDay === addDays(previous, 1) ? run + 1 : 1
    best = Math.max(best, run); previous = currentDay
  })
  const weekStart = new Date(today)
  const day = weekStart.getDay()
  weekStart.setDate(weekStart.getDate() + (day === 0 ? -6 : 1 - day)); weekStart.setHours(0, 0, 0, 0)
  let weekCompleted = 0
  for (let i = 0; i < 7; i += 1) if (completed[dayKey(addDays(weekStart.getTime(), i))]) weekCompleted += 1
  const total = history.length
  const completedEntries = history.filter((entry) => entry.completed)
  const completedCount = completedEntries.length
  const totalMinutes = history.reduce((sum, entry) => sum + Math.max(0, entry.actualMinutes || 0), 0)
  const longestMinutes = history.reduce((max, entry) => Math.max(max, entry.actualMinutes || 0), 0)
  const averageMinutes = total ? Math.round(totalMinutes / total) : 0
  const completionRate = total ? Math.round((completedCount / total) * 100) : 0
  return { current, best, weekCompleted, completedCount, completionRate, totalMinutes, longestMinutes, averageMinutes, todayDone, level: getFlameLevel(current), nextMilestone: getNextMilestone(current) }
}
export function getFlameLevel(streak) {
  if (streak >= 365) return 'BLUE FLAME'
  if (streak >= 100) return 'OBSIDIAN'
  if (streak >= 30) return 'GOLD'
  if (streak >= 14) return 'BRIGHT'
  if (streak >= 7) return 'BLAZE'
  if (streak >= 3) return 'SPARK'
  return 'EMBER'
}
export function getNextMilestone(streak) { const m = [1,3,7,14,30,50,100,365]; for (let i=0;i<m.length;i+=1) if (streak < m[i]) return m[i]; return 365 }
function pad(value) { return String(value).padStart(2, '0') }
