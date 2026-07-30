export const ACHIEVEMENTS = [
  { id: 'first', title: 'FIRST FLAME', detail: 'Complete 1 fast', type: 'completed', value: 1 },
  { id: 'three', title: 'SPARK', detail: 'Reach a 3 day streak', type: 'best', value: 3 },
  { id: 'seven', title: 'BURNING BRIGHT', detail: 'Reach a 7 day streak', type: 'best', value: 7 },
  { id: 'thirty', title: 'INFERNO', detail: 'Reach a 30 day streak', type: 'best', value: 30 },
  { id: 'century', title: 'CENTURY CLUB', detail: 'Complete 100 fasts', type: 'completed', value: 100 },
  { id: 'warrior', title: 'WARRIOR', detail: 'Complete a 20 hour fast', type: 'longest', value: 1200 },
  { id: 'marathon', title: 'MARATHON', detail: 'Complete a 24 hour fast', type: 'longest', value: 1440 },
  { id: 'deep', title: 'DEEP FAST', detail: 'Complete a 36 hour fast', type: 'longest', value: 2160 }
]

export function achievementUnlocked(item, stats) {
  if (item.type === 'best') return stats.best >= item.value
  if (item.type === 'completed') return stats.completedCount >= item.value
  if (item.type === 'longest') return stats.longestMinutes >= item.value
  return false
}
