import { createWidget, widget, align } from '@zos/ui'
import { back, replace } from '@zos/router'
import { PRESETS, createFast } from '../../utils/fasting'
import { saveActiveFast } from '../../utils/storage'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const ORANGE = 0xff8a18
const FIRE = 0xff4b16
const DARK = 0x171311
const MUTED = 0x9aa4ae

Page({
  build() {
    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 58 : 40), w: DEVICE_WIDTH, h: sy(42),
      text: 'CHOOSE YOUR FAST', color: WHITE, text_size: sx(IS_SQUARE ? 26 : 30),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(30), y: sy(IS_SQUARE ? 96 : 82), w: DEVICE_WIDTH - sx(60), h: sy(25),
      text: 'Your Flame grows when you reach the goal.', color: MUTED,
      text_size: sx(IS_SQUARE ? 14 : 16), align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    const left = IS_SQUARE ? 28 : 74
    const right = IS_SQUARE ? 204 : 250
    const top = IS_SQUARE ? 130 : 116
    const gap = IS_SQUARE ? 68 : 75
    const positions = [
      [left, top], [right, top], [left, top + gap], [right, top + gap],
      [left, top + gap * 2], [right, top + gap * 2], [IS_SQUARE ? 117 : 162, top + gap * 3]
    ]

    PRESETS.forEach((hours, index) => {
      const position = positions[index]
      createWidget(widget.BUTTON, {
        x: sx(position[0]), y: sy(position[1]), w: sx(156), h: sy(IS_SQUARE ? 54 : 58), radius: sx(29),
        normal_color: index === 2 ? ORANGE : DARK,
        press_color: index === 2 ? FIRE : 0x2a211e,
        text: `${hours} HOURS`, text_size: sx(IS_SQUARE ? 19 : 21),
        color: index === 2 ? 0x170b03 : WHITE, click_func: () => this.start(hours)
      })
    })

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 125 : 170), y: sy(IS_SQUARE ? 414 : 420),
      w: sx(140), h: sy(36), radius: sx(19), normal_color: 0x090807,
      press_color: DARK, text: 'CANCEL', text_size: sx(17), color: MUTED,
      click_func: () => back()
    })
  },

  start(hours) {
    saveActiveFast(createFast(hours))
    replace({ url: 'page/home/index' })
  }
})
