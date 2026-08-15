import { describe, expect, it } from 'vitest'
import { calcBpmFromTaps, initialBpmTapState, recordTap } from './bpmTap'

describe('recordTap', () => {
  it('starts a new measurement on the first tap', () => {
    const state = recordTap(initialBpmTapState, 1000)
    expect(state).toEqual({ recentTaps: [1000], tapCount: 1 })
  })

  it('accumulates taps within the reset gap', () => {
    let state = recordTap(initialBpmTapState, 0)
    state = recordTap(state, 500)
    state = recordTap(state, 1000)

    expect(state).toEqual({ recentTaps: [0, 500, 1000], tapCount: 3 })
  })

  it('resets when the gap is exactly 2000ms (>= boundary)', () => {
    let state = recordTap(initialBpmTapState, 0)
    state = recordTap(state, 2000)

    expect(state).toEqual({ recentTaps: [2000], tapCount: 1 })
  })

  it('does not reset when the gap is just under 2000ms', () => {
    let state = recordTap(initialBpmTapState, 0)
    state = recordTap(state, 1999)

    expect(state).toEqual({ recentTaps: [0, 1999], tapCount: 2 })
  })

  it('keeps only the last 8 intervals (9 timestamps) while tapCount keeps growing', () => {
    let state = initialBpmTapState
    for (let i = 0; i <= 10; i += 1) {
      state = recordTap(state, i * 500)
    }

    expect(state.recentTaps).toHaveLength(9)
    expect(state.recentTaps).toEqual([
      1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
    ])
    expect(state.tapCount).toBe(11)
  })
})

describe('calcBpmFromTaps', () => {
  it('returns null with fewer than 2 taps', () => {
    expect(calcBpmFromTaps([])).toBeNull()
    expect(calcBpmFromTaps([1000])).toBeNull()
  })

  it('computes BPM from a steady 500ms interval (120 BPM)', () => {
    expect(calcBpmFromTaps([0, 500, 1000, 1500])).toBe(120)
  })

  it('averages uneven intervals', () => {
    // intervals: 400, 600 -> average 500ms -> 120 BPM
    expect(calcBpmFromTaps([0, 400, 1000])).toBe(120)
  })
})
