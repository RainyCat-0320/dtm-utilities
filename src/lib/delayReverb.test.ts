import { describe, expect, it } from 'vitest'
import { calcDelayTimeTable, calcMeasureMs, calcReverbEstimates } from './delayReverb'

describe('calcDelayTimeTable', () => {
  it('computes ms/Hz for every note value at BPM 120', () => {
    const table = calcDelayTimeTable(120)
    const quarter = table.find((row) => row.denominator === 4)

    expect(quarter).toEqual({
      denominator: 4,
      normal: { ms: 500, hz: 2 },
      dotted: { ms: 750, hz: 1.33 },
      triplet: { ms: 333.3, hz: 3 },
    })
  })

  it('computes the full note (1/1) and shortest note (1/64) correctly at BPM 120', () => {
    const table = calcDelayTimeTable(120)
    const whole = table.find((row) => row.denominator === 1)
    const sixtyFourth = table.find((row) => row.denominator === 64)

    expect(whole?.normal).toEqual({ ms: 2000, hz: 0.5 })
    expect(sixtyFourth?.normal).toEqual({ ms: 31.3, hz: 32 })
  })

  it('scales inversely with BPM', () => {
    const table90 = calcDelayTimeTable(90)
    const quarter90 = table90.find((row) => row.denominator === 4)

    expect(quarter90?.normal.ms).toBeCloseTo((60000 / 90) * 1, 1)
  })
})

describe('calcMeasureMs', () => {
  it('matches the quarter-note ms for a 4/4 measure', () => {
    expect(calcMeasureMs(120, 4, 4)).toBeCloseTo(2000, 5)
  })

  it('gives the same measure length for 2/2 as 4/4', () => {
    expect(calcMeasureMs(120, 2, 2)).toBeCloseTo(calcMeasureMs(120, 4, 4), 5)
  })

  it('halves the measure length for 4/8 vs 4/4', () => {
    expect(calcMeasureMs(120, 4, 8)).toBeCloseTo(calcMeasureMs(120, 4, 4) / 2, 5)
  })
})

describe('calcReverbEstimates', () => {
  it('derives pre-delay from note values and decay from the measure length at BPM 120, 4/4', () => {
    const estimates = calcReverbEstimates(120, 4, 4)

    expect(estimates).toEqual([
      { label: 'Tight (Room)', preDelayMs: 31.3, decayMs: 500 },
      { label: 'Medium (Plate/Room)', preDelayMs: 62.5, decayMs: 1000 },
      { label: 'Large (Hall)', preDelayMs: 125, decayMs: 2000 },
    ])
  })
})
