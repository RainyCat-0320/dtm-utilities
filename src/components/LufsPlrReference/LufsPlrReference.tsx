import { useMemo, useState } from 'react'
import styles from './LufsPlrReference.module.css'
import {
  PLATFORM_TARGETS,
  TRUE_PEAK_LIMIT_DBTP,
  calcPlr,
  evaluatePlr,
} from '../../lib/lufsPlr'

function LufsPlrReference() {
  const [lufs, setLufs] = useState(-14)
  const [truePeak, setTruePeak] = useState(TRUE_PEAK_LIMIT_DBTP)

  const isValid = Number.isFinite(lufs) && Number.isFinite(truePeak)
  const plr = useMemo(
    () => (isValid ? calcPlr(lufs, truePeak) : null),
    [lufs, truePeak, isValid],
  )
  const evaluation = useMemo(() => (plr === null ? null : evaluatePlr(plr)), [plr])

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.heading}>早見表</h2>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>プラットフォーム</th>
                <th>ターゲット (LUFS-I)</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_TARGETS.map((row) => (
                <tr key={row.platform}>
                  <th scope="row">{row.platform}</th>
                  <td>{row.targetLufs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.truePeakNote}>
          True Peak 上限: {TRUE_PEAK_LIMIT_DBTP} dBTP（全プラットフォーム共通）
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>簡易計算</h2>
        <div className={styles.controls}>
          <label className={styles.field}>
            <span>Integrated LUFS</span>
            <input
              type="number"
              step="any"
              value={lufs}
              onChange={(event) => setLufs(event.target.valueAsNumber)}
            />
          </label>
          <label className={styles.field}>
            <span>True Peak (dBTP)</span>
            <input
              type="number"
              step="any"
              value={truePeak}
              onChange={(event) => setTruePeak(event.target.valueAsNumber)}
            />
          </label>
        </div>

        {!isValid && <p className={styles.error}>数値を入力してください。</p>}

        {plr !== null && evaluation && (
          <div className={styles.result}>
            <dl className={styles.resultList}>
              <div>
                <dt>PLR</dt>
                <dd>{plr.toFixed(1)}</dd>
              </div>
            </dl>
            <p className={`${styles.comment} ${styles[evaluation.category]}`}>
              {evaluation.comment}（目安レンジ: PLR 9〜11）
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default LufsPlrReference
