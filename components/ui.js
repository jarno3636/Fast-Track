import { createWidget, widget, align } from '@zos/ui'
import { sx, sy } from '../utils/device'
import { COLORS } from '../theme/index'

export function text({ x, y, w, h, value, color = COLORS.white, size = 18, horizontal = align.CENTER_H, vertical = align.CENTER_V }) {
  return createWidget(widget.TEXT, {
    x: sx(x), y: sy(y), w: sx(w), h: sy(h), text: value,
    color, text_size: sx(size), align_h: horizontal, align_v: vertical
  })
}

export function pill({ x, y, w, h, label, onClick, primary = false, color, textColor }) {
  const normal = color || (primary ? COLORS.orange : COLORS.surface)
  return createWidget(widget.BUTTON, {
    x: sx(x), y: sy(y), w: sx(w), h: sy(h), radius: sx(Math.floor(h / 2)),
    normal_color: normal,
    press_color: primary ? COLORS.fire : COLORS.surfaceRaised,
    text: label,
    text_size: sx(primary ? 21 : 17),
    color: textColor || (primary ? COLORS.background : COLORS.white),
    click_func: onClick
  })
}

export function card({ x, y, w, h, color = COLORS.surface, radius = 22 }) {
  return createWidget(widget.FILL_RECT, {
    x: sx(x), y: sy(y), w: sx(w), h: sy(h), radius: sx(radius), color
  })
}

export function divider({ x, y, w, color = COLORS.track }) {
  return createWidget(widget.FILL_RECT, { x: sx(x), y: sy(y), w: sx(w), h: sy(1), color })
}
