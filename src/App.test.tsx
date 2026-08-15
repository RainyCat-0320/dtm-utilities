import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders 5 feature tabs with the first tab active by default', () => {
    render(<App />)

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(5)
    expect(screen.getByRole('tab', { name: 'ディレイ/リバーブ' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('switches the active panel when a different tab is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: 'BPMタップ' }))

    expect(screen.getByRole('tab', { name: 'BPMタップ' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('タップ回数: 0')).toBeInTheDocument()
  })

  it('hands the tapped BPM off to the delay/reverb tab and switches to it', () => {
    vi.useFakeTimers()
    try {
      render(<App />)

      fireEvent.click(screen.getByRole('tab', { name: 'BPMタップ' }))
      const tapArea = screen.getByRole('button', { name: /クリック または スペースキー/ })
      vi.setSystemTime(0)
      fireEvent.click(tapArea)
      vi.setSystemTime(500)
      fireEvent.click(tapArea)
      fireEvent.click(screen.getByRole('button', { name: /①/ }))

      expect(screen.getByRole('tab', { name: 'ディレイ/リバーブ' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      expect(screen.getByLabelText('BPM')).toHaveValue(120)
    } finally {
      vi.useRealTimers()
    }
  })
})
