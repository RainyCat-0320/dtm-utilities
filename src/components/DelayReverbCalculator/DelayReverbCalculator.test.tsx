import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DelayReverbCalculator from './DelayReverbCalculator'

describe('DelayReverbCalculator', () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    writeText.mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
  })

  it('shows the default BPM 120 delay time table on first render', () => {
    render(<DelayReverbCalculator />)

    const row = screen.getByRole('row', { name: /1\/4/ })
    expect(row).toHaveTextContent('500.0')
    expect(row).toHaveTextContent('2.00')
  })

  it('recalculates the table when the BPM input changes', async () => {
    const user = userEvent.setup()
    render(<DelayReverbCalculator />)

    const bpmInput = screen.getByLabelText('BPM')
    await user.clear(bpmInput)
    await user.type(bpmInput, '90')

    const row = screen.getByRole('row', { name: /1\/4/ })
    expect(row).toHaveTextContent('666.7')
  })

  it('copies the ms value to the clipboard when a cell is clicked', async () => {
    render(<DelayReverbCalculator />)

    // fireEvent is used here instead of userEvent: in this dependency stack
    // userEvent's synthesized click on a table-nested button reaches the DOM
    // but doesn't reach React's onClick handler, while fireEvent.click does.
    fireEvent.click(screen.getByRole('button', { name: '500.0' }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('500.0')
    })
  })
})
