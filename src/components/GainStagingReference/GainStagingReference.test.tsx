import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import GainStagingReference from './GainStagingReference'

describe('GainStagingReference', () => {
  it('shows the 3 placeholder rows by default', () => {
    render(<GainStagingReference />)

    expect(screen.getAllByRole('row')).toHaveLength(4) // header + 3 rows
    expect(screen.getByRole('row', { name: /キック/ })).toHaveTextContent(
      '-18 dBFS (peak)',
    )
  })

  it('filters rows as the search query changes', () => {
    render(<GainStagingReference />)

    fireEvent.change(screen.getByLabelText('カテゴリ検索'), {
      target: { value: 'ボーカル' },
    })

    expect(screen.getAllByRole('row')).toHaveLength(2) // header + 1 match
    expect(screen.getByRole('row', { name: /ボーカル/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /キック/ })).not.toBeInTheDocument()
  })

  it('shows an empty-state message when nothing matches', () => {
    render(<GainStagingReference />)

    fireEvent.change(screen.getByLabelText('カテゴリ検索'), {
      target: { value: 'スネア' },
    })

    expect(screen.getAllByRole('row')).toHaveLength(1) // header only
    expect(screen.getByText('該当するカテゴリがありません。')).toBeInTheDocument()
  })
})
