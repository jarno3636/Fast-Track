import { createWidget, widget, align, prop } from '@zos/ui'
import { push } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_NOTIFICATION } from '@zos/sensor'
import { getActiveFast, saveActiveFast, clearActiveFast, addHistory, getHistory, getSettings } from '../../utils/storage'
import { getFastProgress, formatCountdown, formatClock, getStage } from '../../utils/fasting'
import { getStreakStats } from '../../utils/streaks'
import { DEVICE_WIDTH, IS_SQUARE, sx, sy } from '../../utils/device'
import { COLORS } from '../../theme/index'
import { text, pill, card, divider } from '../../components/ui'

const ARC_START = -90
const ARC_SWEEP = 359
const W = IS_SQUARE ? 390 : 480

Page({
  state: { fast: null, interval: null, widgets: {}, stats: null, settings: null },
  build() {
    this.state.fast = getActiveFast()
    this.state.stats = getStreakStats(getHistory())
    this.state.settings = getSettings()
    this.render()
    this.state.interval = setInterval(() => this.tick(), 1000)
  },
  onDestroy() { if (this.state.interval) clearInterval(this.state.interval) },
  tick() {
    if (!this.state.fast) return
    const progress = getFastProgress(this.state.fast)
    this.updateActiveWidgets(progress)
    if (progress.complete && !this.state.fast.completionAlertSent) {
      if (this.state.settings.haptics) {
        try { new Vibrator().start({ mode: VIBRATOR_SCENE_NOTIFICATION }) } catch (error) { console.log('Vibration unavailable', error) }
      }
      this.state.fast.completionAlertSent = true
      saveActiveFast(this.state.fast)
    }
  },
  render() { this.state.fast ? this.renderActive() : this.renderIdle() },
  renderIdle() {
    const s = this.state.stats
    text({ x: 0, y: IS_SQUARE ? 44 : 32, w: W, h: 28, value: 'FAST TRACK', color: COLORS.orange, size: IS_SQUARE ? 20 : 23 })
    text({ x: 0, y: IS_SQUARE ? 73 : 62, w: W, h: 20, value: 'DISCIPLINE, IN MOTION', color: COLORS.muted, size: 12 })

    const ring = IS_SQUARE ? { x: 82, y: 102, w: 226, h: 226 } : { x: 113, y: 91, w: 254, h: 254 }
    createWidget(widget.ARC, { x: sx(ring.x), y: sy(ring.y), w: sx(ring.w), h: sy(ring.h), start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: COLORS.track, line_width: sx(15) })
    createWidget(widget.ARC, { x: sx(ring.x), y: sy(ring.y), w: sx(ring.w), h: sy(ring.h), start_angle: ARC_START, end_angle: ARC_START + Math.max(18, ARC_SWEEP * Math.min(1, s.current / Math.max(1, s.nextMilestone))), color: s.current ? COLORS.fire : 0x563126, line_width: sx(15) })
    createWidget(widget.ARC, { x: sx(ring.x + 10), y: sy(ring.y + 10), w: sx(ring.w - 20), h: sy(ring.h - 20), start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: 0x120d0b, line_width: sx(2) })

    text({ x: ring.x, y: ring.y + 46, w: ring.w, h: 29, value: 'FLAME', color: COLORS.orange, size: 15 })
    text({ x: ring.x, y: ring.y + 73, w: ring.w, h: 65, value: String(s.current), color: COLORS.cream, size: IS_SQUARE ? 52 : 60 })
    text({ x: ring.x, y: ring.y + 136, w: ring.w, h: 27, value: s.current === 1 ? 'DAY' : 'DAYS', color: COLORS.white, size: 18 })
    text({ x: ring.x, y: ring.y + 166, w: ring.w, h: 22, value: `${s.level}  •  BEST ${s.best}`, color: COLORS.muted, size: 13 })

    pill({ x: IS_SQUARE ? 46 : 82, y: IS_SQUARE ? 347 : 358, w: IS_SQUARE ? 298 : 316, h: 62, label: 'START FAST', primary: true, onClick: () => push({ url: 'page/plans/index' }) })
    this.navRow(IS_SQUARE ? 416 : 431)
  },
  renderActive() {
    const progress = getFastProgress(this.state.fast)
    const ring = this.ringMetrics()
    text({ x: 0, y: IS_SQUARE ? 42 : 28, w: W, h: 24, value: getStage(progress.elapsedMs), color: COLORS.orange, size: 15 })
    createWidget(widget.ARC, { ...ring.main, start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: COLORS.track, line_width: ring.mainWidth })
    this.state.widgets.progressArc = createWidget(widget.ARC, this.mainArcProps(progress))
    createWidget(widget.ARC, { ...ring.over, start_angle: ARC_START, end_angle: ARC_START + ARC_SWEEP, color: 0x2b1711, line_width: ring.overWidth })
    this.state.widgets.overtimeArc = createWidget(widget.ARC, this.overtimeArcProps(progress))

    this.state.widgets.status = text({ x: IS_SQUARE ? 55 : 90, y: 106, w: IS_SQUARE ? 280 : 300, h: 24, value: progress.complete ? 'OVER GOAL' : 'TIME REMAINING', color: COLORS.muted, size: 14 })
    this.state.widgets.timer = text({ x: IS_SQUARE ? 10 : 35, y: 137, w: IS_SQUARE ? 370 : 410, h: 70, value: formatCountdown(progress), color: COLORS.cream, size: IS_SQUARE ? 43 : 51 })
    this.state.widgets.goal = text({ x: IS_SQUARE ? 50 : 90, y: 210, w: IS_SQUARE ? 290 : 300, h: 29, value: this.goalText(progress), color: progress.complete ? COLORS.fire : COLORS.white, size: 17 })
    this.state.widgets.ends = text({ x: IS_SQUARE ? 55 : 95, y: 240, w: IS_SQUARE ? 280 : 290, h: 23, value: `GOAL ${formatClock(progress.endsAt)}`, color: COLORS.muted, size: 14 })
    divider({ x: IS_SQUARE ? 86 : 125, y: 277, w: IS_SQUARE ? 218 : 230 })
    text({ x: IS_SQUARE ? 40 : 80, y: 286, w: IS_SQUARE ? 310 : 320, h: 22, value: `${this.state.stats.current} DAY FLAME  •  BEST ${this.state.stats.best}`, color: COLORS.orange, size: 13 })
    pill({ x: IS_SQUARE ? 54 : 94, y: IS_SQUARE ? 323 : 326, w: IS_SQUARE ? 282 : 292, h: 58, label: 'END FAST', color: COLORS.fire, textColor: COLORS.white, onClick: () => this.endFast() })
    pill({ x: IS_SQUARE ? 111 : 160, y: IS_SQUARE ? 391 : 396, w: IS_SQUARE ? 168 : 160, h: 40, label: '+ 2 HOURS', onClick: () => this.extendFast() })
  },
  navRow(y) {
    pill({ x: IS_SQUARE ? 28 : 66, y, w: IS_SQUARE ? 100 : 108, h: 38, label: 'STATS', onClick: () => push({ url: 'page/history/index' }) })
    pill({ x: IS_SQUARE ? 145 : 186, y, w: IS_SQUARE ? 100 : 108, h: 38, label: 'AWARDS', onClick: () => push({ url: 'page/achievements/index' }) })
    pill({ x: IS_SQUARE ? 262 : 306, y, w: IS_SQUARE ? 100 : 108, h: 38, label: 'SETTINGS', onClick: () => push({ url: 'page/settings/index' }) })
  },
  ringMetrics() {
    if (IS_SQUARE) return { main: { x: sx(37), y: sy(62), w: sx(316), h: sy(316) }, over: { x: sx(27), y: sy(52), w: sx(336), h: sy(336) }, mainWidth: sx(17), overWidth: sx(7) }
    return { main: { x: sx(49), y: sy(43), w: sx(382), h: sy(382) }, over: { x: sx(37), y: sy(31), w: sx(406), h: sy(406) }, mainWidth: sx(19), overWidth: sx(8) }
  },
  mainArcProps(progress) { const r = this.ringMetrics(); return { ...r.main, start_angle: ARC_START, end_angle: ARC_START + Math.max(1, ARC_SWEEP * progress.ringRatio), color: progress.complete ? COLORS.amber : COLORS.fire, line_width: r.mainWidth } },
  overtimeArcProps(progress) { const r = this.ringMetrics(); return { ...r.over, start_angle: ARC_START, end_angle: ARC_START + Math.max(1, ARC_SWEEP * progress.overtimeCycle), color: progress.complete ? COLORS.hot : 0x2b1711, line_width: r.overWidth } },
  goalText(progress) { const hours = Math.round(this.state.fast.targetMinutes / 60); return progress.complete ? `GOAL COMPLETE  •  ${hours}H` : `${progress.percentage}%  •  ${hours}H GOAL` },
  updateActiveWidgets(progress) {
    const w = this.state.widgets
    if (!w.timer) return
    w.timer.setProperty(prop.TEXT, formatCountdown(progress)); w.status.setProperty(prop.TEXT, progress.complete ? 'OVER GOAL' : 'TIME REMAINING')
    w.goal.setProperty(prop.TEXT, this.goalText(progress)); w.goal.setProperty(prop.COLOR, progress.complete ? COLORS.fire : COLORS.white)
    w.ends.setProperty(prop.TEXT, `GOAL ${formatClock(progress.endsAt)}`); w.progressArc.setProperty(prop.MORE, this.mainArcProps(progress)); w.overtimeArc.setProperty(prop.MORE, this.overtimeArcProps(progress))
  },
  endFast() {
    const endedAt = Date.now(); const progress = getFastProgress(this.state.fast, endedAt)
    addHistory({ id: this.state.fast.id, startedAt: this.state.fast.startedAt, endedAt, targetMinutes: this.state.fast.targetMinutes, actualMinutes: Math.floor(progress.elapsedMs / 60000), completed: progress.complete })
    clearActiveFast(); this.state.fast = null; push({ url: 'page/history/index' })
  },
  extendFast() { this.state.fast.targetMinutes += 120; this.state.fast.completionAlertSent = false; saveActiveFast(this.state.fast); this.tick() }
})
