import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('BPMタップ測定（Phase 2 で実装予定）')).toBeInTheDocument()
  })
})
