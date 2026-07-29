import { createWidget, widget, align } from '@zos/ui'
import { back, replace } from '@zos/router'
import { PRESETS, createFast } from '../../utils/fasting'
import { saveActiveFast } from '../../utils/storage'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const GREEN = 0x67f0a3
const DARK = 0x111820

Page({
  build() {
    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 72 : 42), w: DEVICE_WIDTH, h: sy(44),
      text: 'CHOOSE YOUR FAST', color: WHITE, text_size: sx(IS_SQUARE ? 26 : 30),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    const left = IS_SQUARE ? 28 : 74
    const right = IS_SQUARE ? 204 : 250
    const top = IS_SQUARE ? 126 : 112
    const gap = IS_SQUARE ? 70 : 78
    const positions = [
      [left, top], [right, top],
      [left, top + gap], [right, top + gap],
      [left, top + gap * 2], [right, top + gap * 2],
      [IS_SQUARE ? 117 : 162, top + gap * 3]
    ]

    PRESETS.forEach((hours, index) => {
      const [x, y] = positions[index]
      createWidget(widget.BUTTON, {
        x: sx(x), y: sy(y), w: sx(156), h: sy(IS_SQUARE ? 54 : 60), radius: sx(30),
        normal_color: index === 2 ? GREEN : DARK,
        press_color: index === 2 ? 0x48c981 : 0x26313d,
        text: `${hours} HOURS`, text_size: sx(IS_SQUARE ? 19 : 21),
        color: index === 2 ? 0x07110c : WHITE,
        click_func: () => this.start(hours)
      })
    })

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 125 : 170), y: sy(IS_SQUARE ? 414 : 420),
      w: sx(140), h: sy(36), radius: sx(19),
      normal_color: 0x090d12, press_color: DARK,
      text: 'CANCEL', text_size: sx(17), color: 0x9aa4ae,
      click_func: () => back()
    })
  },

  start(hours) {
    saveActiveFast(createFast(hours))
    replace({ url: 'page/home/index' })
  }
})
