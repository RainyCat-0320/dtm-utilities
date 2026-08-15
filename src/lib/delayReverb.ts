export const NOTE_DENOMINATORS = [1, 2, 4, 8, 16, 32, 64] as const

export type NoteDenominator = (typeof NOTE_DENOMINATORS)[number]

export interface DelayTimeVariant {
  ms: number
  hz: number
}

export interface DelayTimeRow {
  denominator: NoteDenominator
  normal: DelayTimeVariant
  dotted: DelayTimeVariant
  triplet: DelayTimeVariant
}

export type ReverbEstimateLabel = 'Tight (Room)' | 'Medium (Plate/Room)' | 'Large (Hall)'

export interface ReverbEstimateRow {
  label: ReverbEstimateLabel
  preDelayMs: number
  decayMs: number
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/** ノーマル音価の ms 値。BPM は4分音符基準（1/4 = 60000/BPM）。 */
export function calcNormalMs(bpm: number, denominator: number): number {
  return (60000 / bpm) * (4 / denominator)
}

function toVariant(ms: number): DelayTimeVariant {
  return { ms: roundTo(ms, 1), hz: roundTo(1000 / ms, 2) }
}

export function calcDelayTimeTable(bpm: number): DelayTimeRow[] {
  return NOTE_DENOMINATORS.map((denominator) => {
    const normalMs = calcNormalMs(bpm, denominator)
    return {
      denominator,
      normal: toVariant(normalMs),
      dotted: toVariant(normalMs * 1.5),
      triplet: toVariant(normalMs * (2 / 3)),
    }
  })
}

/** 1小節の長さ（ms）。拍子分子・分母は2の冪乗を想定。 */
export function calcMeasureMs(
  bpm: number,
  numerator: number,
  denominator: number,
): number {
  return calcNormalMs(bpm, denominator) * numerator
}

export function calcReverbEstimates(
  bpm: number,
  numerator: number,
  denominator: number,
): ReverbEstimateRow[] {
  const measureMs = calcMeasureMs(bpm, numerator, denominator)

  return [
    {
      label: 'Tight (Room)',
      preDelayMs: roundTo(calcNormalMs(bpm, 64), 1),
      decayMs: roundTo(measureMs * 0.25, 1),
    },
    {
      label: 'Medium (Plate/Room)',
      preDelayMs: roundTo(calcNormalMs(bpm, 32), 1),
      decayMs: roundTo(measureMs * 0.5, 1),
    },
    {
      label: 'Large (Hall)',
      preDelayMs: roundTo(calcNormalMs(bpm, 16), 1),
      decayMs: roundTo(measureMs * 1.0, 1),
    },
  ]
}
