import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import BpmTapMeasure from './BpmTapMeasure'

describe('BpmTapMeasure', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function tapAt(ms: number) {
    vi.setSystemTime(ms)
    fireEvent.click(screen.getByRole('button', { name: /クリック または スペースキー/ }))
  }

  it('shows a placeholder and zero taps before any tap', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('タップ回数: 0')).toBeInTheDocument()
  })

  it('computes BPM from steady 500ms taps (120 BPM) and counts taps', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    tapAt(0)
    tapAt(500)
    tapAt(1000)
    tapAt(1500)

    expect(screen.getByText('120.0')).toBeInTheDocument()
    expect(screen.getByText('タップ回数: 4')).toBeInTheDocument()
  })

  it('resets the measurement when the gap is 2000ms or more', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    tapAt(0)
    tapAt(500)
    tapAt(2600)

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('タップ回数: 1')).toBeInTheDocument()
  })

  it('clears the measurement when the reset button is clicked', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    tapAt(0)
    tapAt(500)
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }))

    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText('タップ回数: 0')).toBeInTheDocument()
  })

  it('disables the transfer button until a BPM is available', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    expect(screen.getByRole('button', { name: /①/ })).toBeDisabled()

    tapAt(0)
    tapAt(500)

    expect(screen.getByRole('button', { name: /①/ })).toBeEnabled()
  })

  it('calls onTransferBpm with the current BPM when the transfer button is clicked', () => {
    const onTransferBpm = vi.fn()
    render(<BpmTapMeasure onTransferBpm={onTransferBpm} />)

    tapAt(0)
    tapAt(500)
    fireEvent.click(screen.getByRole('button', { name: /①/ }))

    expect(onTransferBpm).toHaveBeenCalledWith(120)
  })

  it('registers a tap on Space keydown and prevents the default scroll action', () => {
    render(<BpmTapMeasure onTransferBpm={vi.fn()} />)

    vi.setSystemTime(0)
    fireEvent.keyDown(window, { code: 'Space' })
    vi.setSystemTime(500)
    fireEvent.keyDown(window, { code: 'Space' })

    expect(screen.getByText('120.0')).toBeInTheDocument()
  })
})
