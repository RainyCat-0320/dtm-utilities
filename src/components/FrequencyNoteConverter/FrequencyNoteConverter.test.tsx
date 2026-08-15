import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FrequencyNoteConverter from './FrequencyNoteConverter'

describe('FrequencyNoteConverter', () => {
  it('shows A4 / MIDI69 / 0 cents for the default 440Hz input', () => {
    render(<FrequencyNoteConverter />)

    const freqToNoteSection = screen
      .getByRole('heading', { name: '周波数 → ノート' })
      .closest('section')!
    expect(within(freqToNoteSection).getByText('A4')).toBeInTheDocument()
    expect(within(freqToNoteSection).getByText('69')).toBeInTheDocument()
    expect(within(freqToNoteSection).getByText('0')).toBeInTheDocument()
  })

  it('updates note name and cents as the frequency input changes', async () => {
    const user = userEvent.setup()
    render(<FrequencyNoteConverter />)

    const freqInput = screen.getByLabelText('周波数 (Hz)')
    await user.clear(freqInput)
    await user.type(freqInput, '445')

    const freqToNoteSection = screen
      .getByRole('heading', { name: '周波数 → ノート' })
      .closest('section')!
    expect(within(freqToNoteSection).getByText('A4')).toBeInTheDocument()
    expect(
      within(freqToNoteSection).getByText((_, el) => el?.textContent === '+20'),
    ).toBeInTheDocument()
  })

  it('defaults the piano roll selection to A4 and shows its frequency', () => {
    render(<FrequencyNoteConverter />)

    expect(screen.getByText('選択中: A4')).toBeInTheDocument()
    expect(screen.getByText('440.00 Hz')).toBeInTheDocument()
  })

  it('updates the selection when a different piano key is clicked', () => {
    render(<FrequencyNoteConverter />)

    fireEvent.click(screen.getByRole('button', { name: 'C4' }))

    expect(screen.getByText('選択中: C4')).toBeInTheDocument()
    expect(screen.getByText('261.63 Hz')).toBeInTheDocument()
  })

  it('selects a black key (sharp note) correctly', () => {
    render(<FrequencyNoteConverter />)

    fireEvent.click(screen.getByRole('button', { name: 'C#4' }))

    expect(screen.getByText('選択中: C#4')).toBeInTheDocument()
  })

  it('lists the full C0-B8 note table inside the collapsible details', () => {
    render(<FrequencyNoteConverter />)

    const details = screen.getByText('C0〜B8 全ノート対応表').closest('details')!
    const rows = within(details).getAllByRole('row')
    // 108 note rows + 1 header row
    expect(rows).toHaveLength(109)
    expect(within(details).getByRole('row', { name: /^A4/ })).toHaveTextContent('440.00')
  })
})
