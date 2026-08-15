import { describe, expect, it } from 'vitest'
import { PLACEHOLDER_ROWS, filterRows } from './gainStaging'

describe('PLACEHOLDER_ROWS', () => {
  it('has exactly 3 placeholder rows', () => {
    expect(PLACEHOLDER_ROWS).toHaveLength(3)
  })
})

describe('filterRows', () => {
  it('returns all rows for an empty query', () => {
    expect(filterRows(PLACEHOLDER_ROWS, '')).toEqual(PLACEHOLDER_ROWS)
    expect(filterRows(PLACEHOLDER_ROWS, '   ')).toEqual(PLACEHOLDER_ROWS)
  })

  it('matches by case-insensitive substring', () => {
    const result = filterRows(PLACEHOLDER_ROWS, 'ボーカル')
    expect(result).toEqual([
      { category: 'ボーカル', targetLevel: '-12 dBFS (RMS)', note: '仮データ' },
    ])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterRows(PLACEHOLDER_ROWS, 'スネア')).toEqual([])
  })
})
