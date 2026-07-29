import { createWidget, widget, align } from '@zos/ui'
import { back } from '@zos/router'
import { getHistory } from '../../utils/storage'
import { formatDuration } from '../../utils/fasting'
import { getStreakStats } from '../../utils/streaks'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const MUTED = 0x9aa4ae
const ORANGE = 0xff8a18
const FIRE = 0xff4b16
const GREEN = 0x67f0a3
const DARK = 0x171311

Page({
  build() {
    const history = getHistory()
    const stats = getStreakStats(history)

    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 52 : 35), w: DEVICE_WIDTH, h: sy(38),
      text: 'YOUR FLAME', color: ORANGE, text_size: sx(IS_SQUARE ? 24 : 28),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 88 : 74), w: DEVICE_WIDTH, h: sy(52),
      text: `${stats.current} DAYS`, color: WHITE, text_size: sx(IS_SQUARE ? 39 : 44),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(30), y: sy(IS_SQUARE ? 134 : 126), w: DEVICE_WIDTH - sx(60), h: sy(24),
      text: `${stats.level}  •  BEST ${stats.best}  •  WEEK ${stats.weekCompleted}/7`,
      color: MUTED, text_size: sx(IS_SQUARE ? 14 : 16),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    const statY = IS_SQUARE ? 172 : 164
    this.stat('COMPLETED', String(stats.completedCount), IS_SQUARE ? 24 : 68, statY)
    this.stat('SUCCESS', `${stats.completionRate}%`, IS_SQUARE ? 145 : 190, statY)
    this.stat('HOURS', String(Math.floor(stats.totalMinutes / 60)), IS_SQUARE ? 266 : 312, statY)

    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 24 : 68), y: sy(IS_SQUARE ? 242 : 232),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 48 : 136), h: sy(30),
      text: 'RECENT FASTS', color: WHITE, text_size: sx(IS_SQUARE ? 19 : 21),
      align_h: align.LEFT, align_v: align.CENTER_V
    })

    if (!history.length) {
      createWidget(widget.TEXT, {
        x: sx(IS_SQUARE ? 30 : 70), y: sy(IS_SQUARE ? 285 : 276),
        w: DEVICE_WIDTH - sx(IS_SQUARE ? 60 : 140), h: sy(70),
        text: 'Complete your first fast\nto light your Flame.',
        color: MUTED, text_size: sx(IS_SQUARE ? 19 : 21),
        align_h: align.CENTER_H, align_v: align.CENTER_V
      })
    } else {
      history.slice(0, 3).forEach((entry, index) => {
        const y = (IS_SQUARE ? 278 : 270) + index * (IS_SQUARE ? 43 : 45)
        createWidget(widget.TEXT, {
          x: sx(IS_SQUARE ? 27 : 70), y: sy(y), w: sx(IS_SQUARE ? 155 : 180), h: sy(38),
          text: formatDate(entry.endedAt), color: WHITE, text_size: sx(IS_SQUARE ? 16 : 18),
          align_h: align.LEFT, align_v: align.CENTER_V
        })
        createWidget(widget.TEXT, {
          x: sx(IS_SQUARE ? 187 : 245), y: sy(y), w: sx(IS_SQUARE ? 175 : 165), h: sy(38),
          text: `${formatDuration(entry.actualMinutes * 60000)} ${entry.completed ? 'DONE' : 'EARLY'}`,
          color: entry.completed ? GREEN : MUTED, text_size: sx(IS_SQUARE ? 15 : 17),
          align_h: align.RIGHT, align_v: align.CENTER_V
        })
      })
    }

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 115 : 160), y: sy(IS_SQUARE ? 404 : 413),
      w: sx(160), h: sy(42), radius: sx(22), normal_color: DARK,
      press_color: 0x2a211e, text: 'BACK', text_size: sx(IS_SQUARE ? 18 : 19),
      color: WHITE, click_func: () => back()
    })
  },

  stat(label, value, x, y) {
    createWidget(widget.TEXT, {
      x: sx(x), y: sy(y), w: sx(IS_SQUARE ? 100 : 100), h: sy(30),
      text: value, color: FIRE, text_size: sx(IS_SQUARE ? 24 : 27),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(x), y: sy(y + 29), w: sx(IS_SQUARE ? 100 : 100), h: sy(22),
      text: label, color: MUTED, text_size: sx(IS_SQUARE ? 12 : 13),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
  }
})

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
