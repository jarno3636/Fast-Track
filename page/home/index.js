import { createWidget, widget, align, prop } from '@zos/ui'
import { push } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_NOTIFICATION } from '@zos/sensor'
import { getActiveFast, saveActiveFast, clearActiveFast, addHistory } from '../../utils/storage'
import { getFastProgress, formatDuration, formatClock, getStage } from '../../utils/fasting'
import { DEVICE_WIDTH, DEVICE_HEIGHT, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const MUTED = 0x9aa4ae
const GREEN = 0x67f0a3
const DARK = 0x111820
const RED = 0xff6b6b

Page({
  state: { fast: null, interval: null, widgets: {} },

  build() {
    this.state.fast = getActiveFast()
    this.render()
    this.state.interval = setInterval(() => this.tick(), 1000)
  },

  onDestroy() {
    if (this.state.interval) clearInterval(this.state.interval)
  },

  tick() {
    if (!this.state.fast) return
    const progress = getFastProgress(this.state.fast)
    this.updateActiveWidgets(progress)
    if (progress.complete && !this.state.fast.completionAlertSent) {
      try {
        const vibrator = new Vibrator()
        vibrator.start({ mode: VIBRATOR_SCENE_NOTIFICATION })
      } catch (error) {
        console.log('Vibration unavailable', error)
      }
      this.state.fast.completionAlertSent = true
      saveActiveFast(this.state.fast)
    }
  },

  render() {
    if (this.state.fast) this.renderActive()
    else this.renderIdle()
  },

  renderIdle() {
    const top = IS_SQUARE ? 78 : 62
    createWidget(widget.TEXT, {
      x: 0, y: sy(top), w: DEVICE_WIDTH, h: sy(44),
      text: 'FAST TRACK', color: GREEN, text_size: sx(IS_SQUARE ? 26 : 30),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 24 : 40), y: sy(IS_SQUARE ? 132 : 124),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 48 : 80), h: sy(82),
      text: 'Ready when\nyou are.', color: WHITE, text_size: sx(IS_SQUARE ? 38 : 42),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 30 : 64), y: sy(IS_SQUARE ? 220 : 220),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 60 : 128), h: sy(56),
      text: 'Start a fast and keep it tracked\neven after you close the app.',
      color: MUTED, text_size: sx(IS_SQUARE ? 18 : 20),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 54 : 90), y: sy(IS_SQUARE ? 300 : 300),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 108 : 180), h: sy(68), radius: sx(34),
      normal_color: GREEN, press_color: 0x48c981,
      text: 'START FAST', text_size: sx(IS_SQUARE ? 25 : 28), color: 0x07110c,
      click_func: () => push({ url: 'page/plans/index' })
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 95 : 140), y: sy(IS_SQUARE ? 384 : 394),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 190 : 280), h: sy(46), radius: sx(23),
      normal_color: DARK, press_color: 0x26313d,
      text: 'HISTORY', text_size: sx(IS_SQUARE ? 18 : 20), color: WHITE,
      click_func: () => push({ url: 'page/history/index' })
    })
  },

  renderActive() {
    const progress = getFastProgress(this.state.fast)
    if (!IS_SQUARE) {
      createWidget(widget.ARC, {
        x: sx(40), y: sy(40), w: sx(400), h: sy(400),
        start_angle: -140, end_angle: 140, color: 0x26313d, line_width: sx(18)
      })
      this.state.widgets.progressArc = createWidget(widget.ARC, this.arcProps(progress.percentage))
    } else {
      createWidget(widget.RECT, {
        x: sx(36), y: sy(130), w: sx(318), h: sy(12), radius: sx(6), color: 0x26313d
      })
      this.state.widgets.progressBar = createWidget(widget.RECT, this.barProps(progress.percentage))
    }

    this.state.widgets.stage = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 24 : 70), y: sy(IS_SQUARE ? 80 : 88),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 48 : 140), h: sy(34),
      text: getStage(progress.elapsedMs), color: GREEN, text_size: sx(IS_SQUARE ? 20 : 22),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.timer = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 18 : 45), y: sy(IS_SQUARE ? 154 : 132),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 36 : 90), h: sy(76),
      text: formatDuration(progress.elapsedMs, true), color: WHITE,
      text_size: sx(IS_SQUARE ? 48 : 54), align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.goal = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 30 : 100), y: sy(IS_SQUARE ? 225 : 207),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 60 : 200), h: sy(32),
      text: `${progress.percentage}% OF ${Math.round(this.state.fast.targetMinutes / 60)}H GOAL`,
      color: MUTED, text_size: sx(IS_SQUARE ? 18 : 20),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.remaining = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 22 : 70), y: sy(IS_SQUARE ? 266 : 247),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 44 : 140), h: sy(34),
      text: progress.complete ? 'GOAL COMPLETE' : `${formatDuration(progress.remainingMs)} REMAINING`,
      color: progress.complete ? GREEN : WHITE, text_size: sx(IS_SQUARE ? 21 : 24),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.ends = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 50 : 100), y: sy(IS_SQUARE ? 301 : 282),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 100 : 200), h: sy(28),
      text: `ENDS ${formatClock(progress.endsAt)}`, color: MUTED, text_size: sx(IS_SQUARE ? 17 : 18),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 55 : 100), y: sy(IS_SQUARE ? 340 : 327),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 110 : 200), h: sy(60), radius: sx(30),
      normal_color: RED, press_color: 0xd94e4e,
      text: 'END FAST', text_size: sx(IS_SQUARE ? 22 : 24), color: WHITE,
      click_func: () => this.endFast()
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 105 : 150), y: sy(IS_SQUARE ? 410 : 402),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 210 : 300), h: sy(40), radius: sx(20),
      normal_color: DARK, press_color: 0x26313d,
      text: '+ 2 HOURS', text_size: sx(IS_SQUARE ? 17 : 18), color: WHITE,
      click_func: () => this.extendFast()
    })
  },

  arcProps(percentage) {
    return {
      x: sx(40), y: sy(40), w: sx(400), h: sy(400), start_angle: -140,
      end_angle: -140 + (280 * percentage / 100), color: GREEN, line_width: sx(18)
    }
  },

  barProps(percentage) {
    return {
      x: sx(36), y: sy(130), w: Math.max(sx(6), Math.round(sx(318) * percentage / 100)),
      h: sy(12), radius: sx(6), color: GREEN
    }
  },

  updateActiveWidgets(progress) {
    const w = this.state.widgets
    if (!w.timer) return
    w.timer.setProperty(prop.TEXT, formatDuration(progress.elapsedMs, true))
    w.goal.setProperty(prop.TEXT, `${progress.percentage}% OF ${Math.round(this.state.fast.targetMinutes / 60)}H GOAL`)
    w.remaining.setProperty(prop.TEXT, progress.complete ? 'GOAL COMPLETE' : `${formatDuration(progress.remainingMs)} REMAINING`)
    w.ends.setProperty(prop.TEXT, `ENDS ${formatClock(progress.endsAt)}`)
    w.stage.setProperty(prop.TEXT, getStage(progress.elapsedMs))
    if (w.progressArc) w.progressArc.setProperty(prop.MORE, this.arcProps(progress.percentage))
    if (w.progressBar) w.progressBar.setProperty(prop.MORE, this.barProps(progress.percentage))
  },

  endFast() {
    const endedAt = Date.now()
    const progress = getFastProgress(this.state.fast, endedAt)
    addHistory({
      id: this.state.fast.id,
      startedAt: this.state.fast.startedAt,
      endedAt,
      targetMinutes: this.state.fast.targetMinutes,
      actualMinutes: Math.floor(progress.elapsedMs / 60000),
      completed: progress.complete
    })
    clearActiveFast()
    this.state.fast = null
    push({ url: 'page/history/index' })
  },

  extendFast() {
    this.state.fast.targetMinutes += 120
    this.state.fast.completionAlertSent = false
    saveActiveFast(this.state.fast)
    this.tick()
  }
})
