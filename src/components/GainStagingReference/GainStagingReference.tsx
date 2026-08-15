import { useMemo, useState } from 'react'
import styles from './GainStagingReference.module.css'
import { PLACEHOLDER_ROWS, filterRows } from '../../lib/gainStaging'

function GainStagingReference() {
  const [query, setQuery] = useState('')
  const filteredRows = useMemo(() => filterRows(PLACEHOLDER_ROWS, query), [query])

  return (
    <div className={styles.container}>
      <p className={styles.placeholderNote}>
        ※仮データです。実データは発注者確認後に差し替えます。
      </p>

      <label className={styles.field}>
        <span>カテゴリ検索</span>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例: キック"
        />
      </label>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>カテゴリ</th>
              <th>ターゲットレベル (dBFS/VU)</th>
              <th>備考</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.category}>
                <th scope="row">{row.category}</th>
                <td>{row.targetLevel}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <p className={styles.empty}>該当するカテゴリがありません。</p>
        )}
      </div>
    </div>
  )
}

export default GainStagingReference
