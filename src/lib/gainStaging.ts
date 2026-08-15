export interface GainStagingRow {
  category: string
  targetLevel: string
  note: string
}

/**
 * 仮データ（3行）。発注者から正式なデータ定義を受領後に差し替える。
 * @see docs/開発指示書_v1.1.md 4-⑤
 */
export const PLACEHOLDER_ROWS: GainStagingRow[] = [
  { category: 'キック', targetLevel: '-18 dBFS (peak)', note: '仮データ' },
  { category: 'ボーカル', targetLevel: '-12 dBFS (RMS)', note: '仮データ' },
  { category: 'マスターバス', targetLevel: '-6 dBFS (peak)', note: '仮データ' },
]

/** カテゴリ名の部分一致（大文字小文字を区別しない）でフィルタする。 */
export function filterRows(rows: GainStagingRow[], query: string): GainStagingRow[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery === '') {
    return rows
  }
  return rows.filter((row) => row.category.toLowerCase().includes(normalizedQuery))
}
