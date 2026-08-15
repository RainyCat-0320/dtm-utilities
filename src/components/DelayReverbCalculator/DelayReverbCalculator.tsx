import { Fragment, useMemo, useState } from 'react'
import styles from './DelayReverbCalculator.module.css'
import { calcDelayTimeTable, calcReverbEstimates } from '../../lib/delayReverb'

const TIME_SIGNATURE_OPTIONS = [1, 2, 4, 8, 16, 32, 64] as const

const NOTE_VALUE_LABELS: Record<number, string> = {
  1: '1/1',
  2: '1/2',
  4: '1/4',
  8: '1/8',
  16: '1/16',
  32: '1/32',
  64: '1/64',
}

interface DelayReverbCalculatorProps {
  initialBpm?: number
}

function DelayReverbCalculator({ initialBpm = 120 }: DelayReverbCalculatorProps) {
  const [bpm, setBpm] = useState(initialBpm)
  const [numerator, setNumerator] = useState(4)
  const [denominator, setDenominator] = useState(4)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const isBpmValid = Number.isFinite(bpm) && bpm >= 20 && bpm <= 999

  const delayTimeTable = useMemo(
    () => (isBpmValid ? calcDelayTimeTable(bpm) : []),
    [bpm, isBpmValid],
  )
  const reverbEstimates = useMemo(
    () => (isBpmValid ? calcReverbEstimates(bpm, numerator, denominator) : []),
    [bpm, numerator, denominator, isBpmValid],
  )

  async function copyMs(key: string, ms: number) {
    await navigator.clipboard.writeText(ms.toFixed(1))
    setCopiedKey(key)
    window.setTimeout(
      () => setCopiedKey((current) => (current === key ? null : current)),
      1000,
    )
  }

  return (
    <div className={styles.container}>
      <section className={styles.controls}>
        <label className={styles.field}>
          <span>BPM</span>
          <input
            type="number"
            min={20}
            max={999}
            value={bpm}
            onChange={(event) => setBpm(event.target.valueAsNumber)}
          />
        </label>
        <label className={styles.field}>
          <span>拍子</span>
          <div className={styles.timeSignature}>
            <select
              value={numerator}
              onChange={(event) => setNumerator(Number(event.target.value))}
              aria-label="拍子（分子）"
            >
              {TIME_SIGNATURE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span aria-hidden="true">/</span>
            <select
              value={denominator}
              onChange={(event) => setDenominator(Number(event.target.value))}
              aria-label="拍子（分母）"
            >
              {TIME_SIGNATURE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </label>
      </section>

      {!isBpmValid && (
        <p className={styles.error}>BPM は 20〜999 の範囲で入力してください。</p>
      )}

      <h2 className={styles.heading}>ディレイタイム表</h2>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2}>音価</th>
              <th colSpan={2}>ノーマル</th>
              <th colSpan={2}>付点</th>
              <th colSpan={2}>3連</th>
            </tr>
            <tr>
              <th>ms</th>
              <th>Hz</th>
              <th>ms</th>
              <th>Hz</th>
              <th>ms</th>
              <th>Hz</th>
            </tr>
          </thead>
          <tbody>
            {delayTimeTable.map((row) => (
              <tr key={row.denominator}>
                <th scope="row">{NOTE_VALUE_LABELS[row.denominator]}</th>
                {(['normal', 'dotted', 'triplet'] as const).map((variant) => {
                  const key = `${row.denominator}-${variant}`
                  const { ms, hz } = row[variant]
                  return (
                    <Fragment key={key}>
                      <td>
                        <button
                          type="button"
                          className={styles.copyCell}
                          onClick={() => copyMs(key, ms)}
                        >
                          {ms.toFixed(1)}
                          {copiedKey === key && (
                            <span className={styles.copiedBadge}>コピー済み</span>
                          )}
                        </button>
                      </td>
                      <td>{hz.toFixed(2)}</td>
                    </Fragment>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={styles.heading}>リバーブ目安値</h2>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>用途</th>
              <th>プリディレイ (ms)</th>
              <th>ディケイ (ms)</th>
            </tr>
          </thead>
          <tbody>
            {reverbEstimates.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.preDelayMs.toFixed(1)}</td>
                <td>{row.decayMs.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DelayReverbCalculator
