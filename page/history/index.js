import { createWidget, widget, align } from '@zos/ui'
import { back } from '@zos/router'
import { getHistory } from '../../utils/storage'
import { formatDuration } from '../../utils/fasting'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const MUTED = 0x9aa4ae
const GREEN = 0x67f0a3
const DARK = 0x111820

Page({
  build() {
    const history = getHistory()
    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 70 : 38), w: DEVICE_WIDTH, h: sy(42),
      text: 'FASTING HISTORY', color: WHITE, text_size: sx(IS_SQUARE ? 26 : 30),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    if (!history.length) {
      createWidget(widget.TEXT, {
        x: sx(IS_SQUARE ? 30 : 70), y: sy(IS_SQUARE ? 175 : 165),
        w: DEVICE_WIDTH - sx(IS_SQUARE ? 60 : 140), h: sy(100),
        text: 'No completed fasts yet.\nYour recent history will appear here.',
        color: MUTED, text_size: sx(IS_SQUARE ? 20 : 23),
        align_h: align.CENTER_H, align_v: align.CENTER_V
      })
    } else {
      history.slice(0, IS_SQUARE ? 5 : 5).forEach((entry, index) => {
        const y = (IS_SQUARE ? 122 : 98) + index * (IS_SQUARE ? 58 : 62)
        createWidget(widget.TEXT, {
          x: sx(IS_SQUARE ? 28 : 74), y: sy(y), w: sx(IS_SQUARE ? 165 : 185), h: sy(48),
          text: formatDate(entry.endedAt), color: WHITE, text_size: sx(IS_SQUARE ? 18 : 20),
          align_h: align.LEFT, align_v: align.CENTER_V
        })
        createWidget(widget.TEXT, {
          x: sx(IS_SQUARE ? 197 : 245), y: sy(y), w: sx(IS_SQUARE ? 165 : 160), h: sy(48),
          text: `${formatDuration(entry.actualMinutes * 60000)} ${entry.completed ? '✓' : ''}`,
          color: entry.completed ? GREEN : MUTED, text_size: sx(IS_SQUARE ? 18 : 20),
          align_h: align.RIGHT, align_v: align.CENTER_V
        })
      })
    }

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 115 : 160), y: sy(IS_SQUARE ? 405 : 412),
      w: sx(160), h: sy(44), radius: sx(23),
      normal_color: DARK, press_color: 0x26313d,
      text: 'BACK', text_size: sx(IS_SQUARE ? 18 : 19), color: WHITE,
      click_func: () => back()
    })
  }
})

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}  ${formatTime(date)}`
}

function formatTime(date) {
  let hour = date.getHours()
  const suffix = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${String(date.getMinutes()).padStart(2, '0')} ${suffix}`
}
