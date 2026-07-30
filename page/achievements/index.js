import { back } from '@zos/router'
import { getHistory } from '../../utils/storage'
import { getStreakStats } from '../../utils/streaks'
import { ACHIEVEMENTS, achievementUnlocked } from '../../utils/achievements'
import { IS_SQUARE } from '../../utils/device'
import { COLORS } from '../../theme/index'
import { text, pill, card } from '../../components/ui'

const W = IS_SQUARE ? 390 : 480
Page({
  build() {
    const stats = getStreakStats(getHistory())
    const unlocked = ACHIEVEMENTS.filter((a) => achievementUnlocked(a, stats)).length
    text({ x: 0, y: IS_SQUARE ? 40 : 27, w: W, h: 32, value: 'FLAME AWARDS', color: COLORS.orange, size: 23 })
    text({ x: 30, y: IS_SQUARE ? 73 : 61, w: W - 60, h: 22, value: `${unlocked} OF ${ACHIEVEMENTS.length} UNLOCKED`, color: COLORS.muted, size: 13 })
    ACHIEVEMENTS.slice(0, 6).forEach((item, index) => {
      const unlockedNow = achievementUnlocked(item, stats)
      const y = (IS_SQUARE ? 108 : 96) + index * 49
      card({ x: IS_SQUARE ? 24 : 61, y, w: IS_SQUARE ? 342 : 358, h: 42, color: unlockedNow ? 0x2c1b13 : COLORS.surface, radius: 15 })
      text({ x: IS_SQUARE ? 37 : 75, y: y + 3, w: 42, h: 35, value: unlockedNow ? '◆' : '◇', color: unlockedNow ? COLORS.gold : COLORS.muted, size: 20 })
      text({ x: IS_SQUARE ? 80 : 120, y: y + 2, w: IS_SQUARE ? 185 : 195, h: 20, value: item.title, color: unlockedNow ? COLORS.white : COLORS.muted, size: 14, horizontal: 0 })
      text({ x: IS_SQUARE ? 80 : 120, y: y + 21, w: IS_SQUARE ? 245 : 250, h: 16, value: item.detail, color: COLORS.muted, size: 10, horizontal: 0 })
      text({ x: IS_SQUARE ? 310 : 377, y: y + 5, w: 40, h: 30, value: unlockedNow ? '✓' : '—', color: unlockedNow ? COLORS.green : COLORS.muted, size: 18 })
    })
    pill({ x: IS_SQUARE ? 115 : 165, y: IS_SQUARE ? 414 : 420, w: IS_SQUARE ? 160 : 150, h: 40, label: 'BACK', onClick: () => back() })
  }
})
