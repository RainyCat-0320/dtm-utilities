import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import LufsPlrReference from './LufsPlrReference'

describe('LufsPlrReference', () => {
  it('renders the platform target lookup table', () => {
    render(<LufsPlrReference />)

    const spotifyRow = screen.getByRole('row', { name: /Spotify/ })
    expect(spotifyRow).toHaveTextContent('-14')
    expect(screen.getByText(/True Peak 上限: -0.1 dBTP/)).toBeInTheDocument()
  })

  it('shows PLR and an "ok" comment for the default -14 LUFS / -0.1 dBTP inputs', () => {
    render(<LufsPlrReference />)

    const resultSection = screen
      .getByRole('heading', { name: '簡易計算' })
      .closest('section')!
    expect(within(resultSection).getByText('13.9')).toBeInTheDocument()
    expect(
      within(resultSection).getByText(/ダイナミックレンジが広め/),
    ).toBeInTheDocument()
  })

  it('recalculates PLR and flags a low (compressed) result', () => {
    render(<LufsPlrReference />)

    fireEvent.change(screen.getByLabelText('Integrated LUFS'), {
      target: { value: '-1' },
    })
    fireEvent.change(screen.getByLabelText('True Peak (dBTP)'), {
      target: { value: '-1' },
    })

    const resultSection = screen
      .getByRole('heading', { name: '簡易計算' })
      .closest('section')!
    expect(within(resultSection).getByText('0.0')).toBeInTheDocument()
    expect(within(resultSection).getByText(/圧縮強め/)).toBeInTheDocument()
  })

  it('flags a PLR within 9-11 as ok', () => {
    render(<LufsPlrReference />)

    fireEvent.change(screen.getByLabelText('Integrated LUFS'), {
      target: { value: '-10' },
    })

    const resultSection = screen
      .getByRole('heading', { name: '簡易計算' })
      .closest('section')!
    expect(within(resultSection).getByText('9.9')).toBeInTheDocument()
    expect(within(resultSection).getByText(/適正範囲内です/)).toBeInTheDocument()
  })
})
