import { describe, expect, it } from 'vitest'
import { PLATFORM_TARGETS, calcPlr, evaluatePlr } from './lufsPlr'

describe('PLATFORM_TARGETS', () => {
  it('lists the 5 platforms from the spec', () => {
    expect(PLATFORM_TARGETS).toHaveLength(5)
    expect(PLATFORM_TARGETS.map((p) => p.platform)).toEqual([
      'Spotify',
      'Apple Music',
      'YouTube',
      'ニコニコ動画',
      'CD / クラブ系マスター',
    ])
  })
})

describe('calcPlr', () => {
  it('computes True Peak minus Integrated LUFS', () => {
    expect(calcPlr(-14, -0.1)).toBeCloseTo(13.9, 5)
    expect(calcPlr(-9, -1)).toBeCloseTo(8, 5)
  })
})

describe('evaluatePlr', () => {
  it('flags PLR below 9 as low (compressed)', () => {
    expect(evaluatePlr(8.9).category).toBe('low')
    expect(evaluatePlr(0).category).toBe('low')
  })

  it('flags PLR within 9-11 (inclusive) as ok', () => {
    expect(evaluatePlr(9).category).toBe('ok')
    expect(evaluatePlr(10).category).toBe('ok')
    expect(evaluatePlr(11).category).toBe('ok')
  })

  it('flags PLR above 11 as high (wide dynamic range)', () => {
    expect(evaluatePlr(11.1).category).toBe('high')
    expect(evaluatePlr(20).category).toBe('high')
  })
})
