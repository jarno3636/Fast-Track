import { back } from '@zos/router'
import { getSettings, saveSettings } from '../../utils/storage'
import { IS_SQUARE } from '../../utils/device'
import { COLORS } from '../../theme/index'
import { text, pill, card, divider } from '../../components/ui'

const W = IS_SQUARE ? 390 : 480
Page({
  state: { settings: null },
  build() {
    this.state.settings = getSettings()
    text({ x: 0, y: IS_SQUARE ? 42 : 30, w: W, h: 34, value: 'SETTINGS', color: COLORS.cream, size: 25 })
    text({ x: 30, y: IS_SQUARE ? 78 : 67, w: W - 60, h: 20, value: 'FAST TRACK 2.2', color: COLORS.orange, size: 12 })
    this.settingRow('HAPTICS', 'Vibrate for key moments', 'haptics', IS_SQUARE ? 120 : 110)
    this.settingRow('ENCOURAGEMENT', 'Show motivational prompts', 'encouragement', IS_SQUARE ? 196 : 186)
    this.settingRow('24-HOUR CLOCK', 'Use military time', 'clock24', IS_SQUARE ? 272 : 262)
    card({ x: IS_SQUARE ? 30 : 70, y: IS_SQUARE ? 347 : 338, w: IS_SQUARE ? 330 : 340, h: 47, radius: 16 })
    text({ x: IS_SQUARE ? 44 : 86, y: IS_SQUARE ? 351 : 342, w: IS_SQUARE ? 302 : 308, h: 39, value: 'All fasting data stays on your watch.', color: COLORS.muted, size: 13 })
    pill({ x: IS_SQUARE ? 115 : 165, y: IS_SQUARE ? 414 : 420, w: IS_SQUARE ? 160 : 150, h: 40, label: 'DONE', onClick: () => back() })
  },
  settingRow(title, detail, key, y) {
    card({ x: IS_SQUARE ? 30 : 70, y, w: IS_SQUARE ? 330 : 340, h: 62, radius: 18 })
    text({ x: IS_SQUARE ? 47 : 88, y: y + 7, w: 200, h: 22, value: title, color: COLORS.white, size: 15, horizontal: 0 })
    text({ x: IS_SQUARE ? 47 : 88, y: y + 31, w: 230, h: 17, value: detail, color: COLORS.muted, size: 10, horizontal: 0 })
    pill({ x: IS_SQUARE ? 281 : 338, y: y + 13, w: 63, h: 36, label: this.state.settings[key] ? 'ON' : 'OFF', color: this.state.settings[key] ? COLORS.orange : COLORS.track, textColor: this.state.settings[key] ? COLORS.background : COLORS.muted, onClick: () => this.toggle(key) })
  },
  toggle(key) { this.state.settings[key] = !this.state.settings[key]; saveSettings(this.state.settings); back(); }
})
