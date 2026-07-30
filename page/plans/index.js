import { createWidget, widget } from '@zos/ui'
import { back, replace } from '@zos/router'
import { createFast } from '../../utils/fasting'
import { saveActiveFast } from '../../utils/storage'
import { IS_SQUARE, sx, sy } from '../../utils/device'
import { COLORS } from '../../theme/index'
import { text, pill } from '../../components/ui'

const W = IS_SQUARE ? 390 : 480
const PLANS = [
  { hours: 12, ratio: '12:12', label: 'BEGINNER' },
  { hours: 14, ratio: '14:10', label: 'GENTLE' },
  { hours: 16, ratio: '16:8', label: 'MOST POPULAR' },
  { hours: 18, ratio: '18:6', label: 'ADVANCED' },
  { hours: 20, ratio: '20:4', label: 'WARRIOR' },
  { hours: 24, ratio: '24H', label: 'FULL DAY' }
]
Page({
  build() {
    text({ x: 0, y: IS_SQUARE ? 42 : 29, w: W, h: 38, value: 'CHOOSE YOUR FAST', color: COLORS.cream, size: IS_SQUARE ? 25 : 28 })
    text({ x: 30, y: IS_SQUARE ? 78 : 66, w: W - 60, h: 22, value: 'Pick a goal. You can extend it anytime.', color: COLORS.muted, size: 13 })
    const left = IS_SQUARE ? 25 : 65, right = IS_SQUARE ? 202 : 247, top = IS_SQUARE ? 111 : 99, row = IS_SQUARE ? 92 : 95
    PLANS.forEach((plan, i) => {
      const x = i % 2 === 0 ? left : right, y = top + Math.floor(i / 2) * row
      createWidget(widget.BUTTON, {
        x: sx(x), y: sy(y), w: sx(163), h: sy(78), radius: sx(22),
        normal_color: i === 2 ? 0x3b2014 : COLORS.surface,
        press_color: i === 2 ? COLORS.fire : COLORS.surfaceRaised,
        text: plan.ratio,
        text_size: sx(24),
        color: i === 2 ? COLORS.amber : COLORS.white,
        click_func: () => this.start(plan.hours)
      })
      text({ x: x + 5, y: y + 53, w: 153, h: 17, value: plan.label, color: i === 2 ? COLORS.orange : COLORS.muted, size: 9 })
    })
    pill({ x: IS_SQUARE ? 112 : 170, y: IS_SQUARE ? 401 : 410, w: IS_SQUARE ? 166 : 140, h: 38, label: 'CANCEL', onClick: () => back() })
  },
  start(hours) { saveActiveFast(createFast(hours)); replace({ url: 'page/home/index' }) }
})
