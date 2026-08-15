import { useCallback, useEffect, useState } from 'react'
import styles from './BpmTapMeasure.module.css'
import { calcBpmFromTaps, initialBpmTapState, recordTap } from '../../lib/bpmTap'

interface BpmTapMeasureProps {
  onTransferBpm: (bpm: number) => void
}

function BpmTapMeasure({ onTransferBpm }: BpmTapMeasureProps) {
  const [state, setState] = useState(initialBpmTapState)

  const tap = useCallback(() => {
    const now = Date.now()
    setState((current) => recordTap(current, now))
  }, [])

  const reset = useCallback(() => {
    setState(initialBpmTapState)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') {
        return
      }
      const target = event.target
      if (
        target instanceof HTMLElement &&
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
      ) {
        return
      }
      event.preventDefault()
      tap()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tap])

  const bpm = calcBpmFromTaps(state.recentTaps)

  return (
    <div className={styles.container}>
      <button type="button" className={styles.tapArea} onClick={tap}>
        <span className={styles.bpmValue}>{bpm === null ? '—' : bpm.toFixed(1)}</span>
        <span className={styles.bpmLabel}>BPM</span>
        <span className={styles.hint}>クリック または スペースキーでタップ</span>
      </button>

      <div className={styles.info}>
        <span>タップ回数: {state.tapCount}</span>
        <button type="button" className={styles.resetButton} onClick={reset}>
          リセット
        </button>
        <button
          type="button"
          className={styles.transferButton}
          disabled={bpm === null}
          onClick={() => {
            if (bpm !== null) {
              onTransferBpm(bpm)
            }
          }}
        >
          ① ディレイ/リバーブへ反映
        </button>
      </div>
    </div>
  )
}

export default BpmTapMeasure
