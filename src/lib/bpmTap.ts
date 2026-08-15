export const RESET_GAP_MS = 2000
export const MAX_INTERVALS = 8

export interface BpmTapState {
  recentTaps: number[]
  tapCount: number
}

export const initialBpmTapState: BpmTapState = { recentTaps: [], tapCount: 0 }

/** タップ時刻を記録する。直前タップから2000ms以上空いていれば計測をリセットする。 */
export function recordTap(state: BpmTapState, now: number): BpmTapState {
  const lastTap = state.recentTaps.at(-1)
  const shouldReset = lastTap === undefined || now - lastTap >= RESET_GAP_MS

  if (shouldReset) {
    return { recentTaps: [now], tapCount: 1 }
  }

  return {
    recentTaps: [...state.recentTaps, now].slice(-(MAX_INTERVALS + 1)),
    tapCount: state.tapCount + 1,
  }
}

/** 直近8間隔の平均からBPMを算出する。有効なタップが2件未満なら null。 */
export function calcBpmFromTaps(recentTaps: number[]): number | null {
  if (recentTaps.length < 2) {
    return null
  }

  const intervals = recentTaps.slice(1).map((tap, index) => tap - recentTaps[index])
  const averageIntervalMs =
    intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length

  return Math.round((60000 / averageIntervalMs) * 10) / 10
}
