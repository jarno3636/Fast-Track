import { createWidget, widget, align, prop } from '@zos/ui'
import { push } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_NOTIFICATION } from '@zos/sensor'
import { getActiveFast, saveActiveFast, clearActiveFast, addHistory, getHistory } from '../../utils/storage'
import { getFastProgress, formatCountdown, formatClock, getStage } from '../../utils/fasting'
import { getStreakStats } from '../../utils/streaks'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'

const WHITE = 0xffffff
const MUTED = 0xa7a9ad
const TRACK = 0x292321
const SURFACE = 0x171311
const ORANGE = 0xff8a18
const FIRE = 0xff4b16
const HOT = 0xff2f0a
const CREAM = 0xfff3e8
const ARC_START = -90
const ARC_SWEEP = 359

Page({
  state: { fast: null, interval: null, widgets: {}, streaks: null },

  build() {
    this.state.fast = getActiveFast()
    this.state.streaks = getStreakStats(getHistory())
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
    const stats = this.state.streaks
    createWidget(widget.TEXT, {
      x: 0, y: sy(IS_SQUARE ? 55 : 48), w: DEVICE_WIDTH, h: sy(38),
      text: 'FAST TRACK', color: ORANGE, text_size: sx(IS_SQUARE ? 25 : 29),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    createWidget(widget.ARC, {
      x: sx(IS_SQUARE ? 102 : 139), y: sy(IS_SQUARE ? 105 : 100),
      w: sx(IS_SQUARE ? 186 : 202), h: sy(IS_SQUARE ? 186 : 202),
      start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP,
      color: TRACK, line_width: sx(12)
    })
    createWidget(widget.ARC, {
      x: sx(IS_SQUARE ? 102 : 139), y: sy(IS_SQUARE ? 105 : 100),
      w: sx(IS_SQUARE ? 186 : 202), h: sy(IS_SQUARE ? 186 : 202),
      start_angle: ARC_START,
      end_angle: ARC_START + Math.max(12, ARC_SWEEP * Math.min(1, stats.current / Math.max(1, stats.nextMilestone))),
      color: stats.current ? FIRE : 0x573024, line_width: sx(12)
    })

    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 90 : 130), y: sy(IS_SQUARE ? 138 : 136),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 180 : 260), h: sy(44),
      text: String(stats.current), color: CREAM, text_size: sx(IS_SQUARE ? 44 : 50),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 80 : 120), y: sy(IS_SQUARE ? 183 : 184),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 160 : 240), h: sy(26),
      text: stats.current === 1 ? 'DAY FLAME' : 'DAY FLAME', color: ORANGE,
      text_size: sx(IS_SQUARE ? 16 : 18), align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 65 : 115), y: sy(IS_SQUARE ? 218 : 222),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 130 : 230), h: sy(25),
      text: `${stats.level}  •  BEST ${stats.best}`, color: MUTED,
      text_size: sx(IS_SQUARE ? 14 : 16), align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 54 : 90), y: sy(IS_SQUARE ? 292 : 300),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 108 : 180), h: sy(66), radius: sx(33),
      normal_color: ORANGE, press_color: FIRE,
      text: 'START FAST', text_size: sx(IS_SQUARE ? 24 : 27), color: 0x170b03,
      click_func: () => push({ url: 'page/plans/index' })
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 95 : 140), y: sy(IS_SQUARE ? 380 : 392),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 190 : 280), h: sy(44), radius: sx(22),
      normal_color: SURFACE, press_color: TRACK,
      text: 'PROGRESS', text_size: sx(IS_SQUARE ? 18 : 20), color: WHITE,
      click_func: () => push({ url: 'page/history/index' })
    })
  },

  renderActive() {
    const progress = getFastProgress(this.state.fast)
    const ring = this.ringMetrics()

    createWidget(widget.ARC, { ...ring.main, start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: TRACK, line_width: ring.mainWidth })
    this.state.widgets.progressArc = createWidget(widget.ARC, this.mainArcProps(progress))
    createWidget(widget.ARC, { ...ring.over, start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: 0x351a12, line_width: ring.overWidth })
    this.state.widgets.overtimeArc = createWidget(widget.ARC, this.overtimeArcProps(progress))

    this.state.widgets.stage = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 55 : 90), y: sy(78), w: DEVICE_WIDTH - sx(IS_SQUARE ? 110 : 180), h: sy(30),
      text: getStage(progress.elapsedMs), color: ORANGE, text_size: sx(IS_SQUARE ? 18 : 20),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.status = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 50 : 88), y: sy(116), w: DEVICE_WIDTH - sx(IS_SQUARE ? 100 : 176), h: sy(24),
      text: progress.complete ? 'OVER GOAL' : 'TIME REMAINING', color: MUTED,
      text_size: sx(IS_SQUARE ? 15 : 17), align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.timer = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 18 : 43), y: sy(138), w: DEVICE_WIDTH - sx(IS_SQUARE ? 36 : 86), h: sy(76),
      text: formatCountdown(progress), color: CREAM, text_size: sx(IS_SQUARE ? 46 : 54),
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.goal = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 46 : 90), y: sy(210), w: DEVICE_WIDTH - sx(IS_SQUARE ? 92 : 180), h: sy(28),
      text: this.goalText(progress), color: progress.complete ? FIRE : WHITE,
      text_size: sx(IS_SQUARE ? 17 : 19), align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    this.state.widgets.ends = createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 48 : 96), y: sy(238), w: DEVICE_WIDTH - sx(IS_SQUARE ? 96 : 192), h: sy(26),
      text: `GOAL ${formatClock(progress.endsAt)}`, color: MUTED,
      text_size: sx(IS_SQUARE ? 15 : 17), align_h: align.CENTER_H, align_v: align.CENTER_V
    })
    createWidget(widget.TEXT, {
      x: sx(IS_SQUARE ? 70 : 115), y: sy(273), w: DEVICE_WIDTH - sx(IS_SQUARE ? 140 : 230), h: sy(24),
      text: `${this.state.streaks.current} DAY FLAME  •  BEST ${this.state.streaks.best}`,
      color: ORANGE, text_size: sx(IS_SQUARE ? 14 : 16), align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 61 : 105), y: sy(IS_SQUARE ? 315 : 318),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 122 : 210), h: sy(58), radius: sx(29),
      normal_color: FIRE, press_color: HOT, text: 'END FAST',
      text_size: sx(IS_SQUARE ? 21 : 23), color: WHITE, click_func: () => this.endFast()
    })
    createWidget(widget.BUTTON, {
      x: sx(IS_SQUARE ? 107 : 155), y: sy(IS_SQUARE ? 386 : 394),
      w: DEVICE_WIDTH - sx(IS_SQUARE ? 214 : 310), h: sy(42), radius: sx(21),
      normal_color: SURFACE, press_color: TRACK, text: '+ 2 HOURS',
      text_size: sx(IS_SQUARE ? 17 : 18), color: ORANGE, click_func: () => this.extendFast()
    })
  },

  ringMetrics() {
    if (IS_SQUARE) return { main: { x: sx(37), y: sy(42), w: sx(316), h: sy(316) }, over: { x: sx(28), y: sy(33), w: sx(334), h: sy(334) }, mainWidth: sx(17), overWidth: sx(7) }
    return { main: { x: sx(46), y: sy(32), w: sx(388), h: sy(388) }, over: { x: sx(35), y: sy(21), w: sx(410), h: sy(410) }, mainWidth: sx(19), overWidth: sx(8) }
  },

  mainArcProps(progress) {
    const ring = this.ringMetrics()
    return { ...ring.main, start_angle: ARC_START, end_angle: ARC_START + Math.max(1, ARC_SWEEP * progress.ringRatio), color: progress.complete ? ORANGE : FIRE, line_width: ring.mainWidth }
  },

  overtimeArcProps(progress) {
    const ring = this.ringMetrics()
    return { ...ring.over, start_angle: ARC_START, end_angle: ARC_START + Math.max(1, ARC_SWEEP * progress.overtimeCycle), color: progress.complete ? HOT : 0x351a12, line_width: ring.overWidth }
  },

  goalText(progress) {
    const targetHours = Math.round(this.state.fast.targetMinutes / 60)
    return progress.complete ? `GOAL COMPLETE  •  ${targetHours}H` : `${progress.percentage}%  •  ${targetHours}H GOAL`
  },

  updateActiveWidgets(progress) {
    const w = this.state.widgets
    if (!w.timer) return
    w.timer.setProperty(prop.TEXT, formatCountdown(progress))
    w.status.setProperty(prop.TEXT, progress.complete ? 'OVER GOAL' : 'TIME REMAINING')
    w.goal.setProperty(prop.TEXT, this.goalText(progress))
    w.goal.setProperty(prop.COLOR, progress.complete ? FIRE : WHITE)
    w.ends.setProperty(prop.TEXT, `GOAL ${formatClock(progress.endsAt)}`)
    w.stage.setProperty(prop.TEXT, getStage(progress.elapsedMs))
    w.progressArc.setProperty(prop.MORE, this.mainArcProps(progress))
    w.overtimeArc.setProperty(prop.MORE, this.overtimeArcProps(progress))
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
