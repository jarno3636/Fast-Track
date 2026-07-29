import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from '@zos/device'

const info = getDeviceInfo()

export const DEVICE_WIDTH = info.width
export const DEVICE_HEIGHT = info.height
export const IS_SQUARE = info.screenShape === SCREEN_SHAPE_SQUARE
export const BASE_WIDTH = IS_SQUARE ? 390 : 480

export function sx(value) {
  return Math.round((value / BASE_WIDTH) * DEVICE_WIDTH)
}

export function sy(value) {
  const baseHeight = IS_SQUARE ? 450 : 480
  return Math.round((value / baseHeight) * DEVICE_HEIGHT)
}

export function layout() {
  return {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    square: IS_SQUARE,
    top: IS_SQUARE ? sy(68) : sy(36),
    safeX: IS_SQUARE ? sx(18) : sx(40)
  }
}
