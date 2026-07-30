import { back, push } from '@zos/router'
import { getHistory } from '../../utils/storage'
import { formatDuration } from '../../utils/fasting'
import { getStreakStats } from '../../utils/streaks'
import { IS_SQUARE } from '../../utils/device'
import { COLORS } from '../../theme/index'
import { text, pill, card, divider } from '../../components/ui'

const W = IS_SQUARE ? 390 : 480
Page({
  build() {
    const history = getHistory()
    const s = getStreakStats(history)
    text({ x: 0, y: IS_SQUARE ? 39 : 27, w: W, h: 30, value: 'YOUR PROGRESS', color: COLORS.orange, size: 22 })
    text({ x: 0, y: IS_SQUARE ? 70 : 59, w: W, h: 48, value: `${s.current} DAY FLAME`, color: COLORS.cream, size: IS_SQUARE ? 34 : 39 })
    text({ x: 25, y: IS_SQUARE ? 114 : 105, w: W - 50, h: 22, value: `${s.level}  •  BEST ${s.best}  •  ${s.weekCompleted}/7 THIS WEEK`, color: COLORS.muted, size: 12 })

    const x = IS_SQUARE ? 18 : 50, y = IS_SQUARE ? 147 : 139, gap = IS_SQUARE ? 88 : 96
    this.stat(x, y, 'FASTS', String(s.completedCount))
    this.stat(x + gap, y, 'SUCCESS', `${s.completionRate}%`)
    this.stat(x + gap * 2, y, 'AVERAGE', shortDuration(s.averageMinutes))
    this.stat(x + gap * 3, y, 'LONGEST', shortDuration(s.longestMinutes))

    text({ x: IS_SQUARE ? 22 : 62, y: IS_SQUARE ? 229 : 221, w: W - (IS_SQUARE ? 44 : 124), h: 26, value: 'RECENT FASTS', color: COLORS.white, size: 17, horizontal: 0 })
    if (!history.length) {
      card({ x: IS_SQUARE ? 26 : 65, y: IS_SQUARE ? 265 : 257, w: IS_SQUARE ? 338 : 350, h: 94 })
      text({ x: IS_SQUARE ? 45 : 85, y: IS_SQUARE ? 280 : 272, w: IS_SQUARE ? 300 : 310, h: 60, value: 'Complete your first fast\nto light your Flame.', color: COLORS.muted, size: 18 })
    } else {
      history.slice(0, 3).forEach((entry, index) => {
        const cy = (IS_SQUARE ? 260 : 252) + index * 50
        card({ x: IS_SQUARE ? 22 : 60, y: cy, w: IS_SQUARE ? 346 : 360, h: 43, radius: 15 })
        text({ x: IS_SQUARE ? 34 : 74, y: cy + 2, w: 92, h: 20, value: entry.completed ? 'COMPLETE' : 'ENDED', color: entry.completed ? COLORS.green : COLORS.muted, size: 11, horizontal: 0 })
        text({ x: IS_SQUARE ? 34 : 74, y: cy + 20, w: 100, h: 19, value: formatDate(entry.endedAt), color: COLORS.muted, size: 12, horizontal: 0 })
        text({ x: IS_SQUARE ? 165 : 225, y: cy + 4, w: IS_SQUARE ? 185 : 175, h: 34, value: formatDuration(entry.actualMinutes * 60000), color: COLORS.white, size: 18, horizontal: 2 })
      })
    }
    pill({ x: IS_SQUARE ? 45 : 73, y: IS_SQUARE ? 416 : 426, w: IS_SQUARE ? 136 : 150, h: 38, label: 'AWARDS', onClick: () => push({ url: 'page/achievements/index' }) })
    pill({ x: IS_SQUARE ? 209 : 257, y: IS_SQUARE ? 416 : 426, w: IS_SQUARE ? 136 : 150, h: 38, label: 'BACK', onClick: () => back() })
  },
  stat(x, y, label, value) {
    card({ x, y, w: IS_SQUARE ? 82 : 88, h: 64, radius: 18 })
    text({ x, y: y + 7, w: IS_SQUARE ? 82 : 88, h: 30, value, color: COLORS.fire, size: IS_SQUARE ? 20 : 22 })
    text({ x, y: y + 38, w: IS_SQUARE ? 82 : 88, h: 17, value: label, color: COLORS.muted, size: 9 })
  }
})
function formatDate(timestamp) { const d = new Date(timestamp); return `${d.getMonth() + 1}/${d.getDate()}` }
function shortDuration(minutes) { if (!minutes) return '0H'; if (minutes < 60) return `${minutes}M`; return `${Math.floor(minutes / 60)}H` }
