export interface PlatformTarget {
  platform: string
  targetLufs: string
}

export const PLATFORM_TARGETS: PlatformTarget[] = [
  { platform: 'Spotify', targetLufs: '-14' },
  { platform: 'Apple Music', targetLufs: '-16' },
  { platform: 'YouTube', targetLufs: '-14' },
  { platform: 'ニコニコ動画', targetLufs: '-15' },
  { platform: 'CD / クラブ系マスター', targetLufs: '-9 〜 -8' },
]

export const TRUE_PEAK_LIMIT_DBTP = -0.1

export const PLR_RANGE_MIN = 9
export const PLR_RANGE_MAX = 11

export type PlrCategory = 'low' | 'ok' | 'high'

export interface PlrEvaluation {
  category: PlrCategory
  comment: string
}

/** PLR (Peak to Loudness Ratio) = True Peak − Integrated LUFS */
export function calcPlr(lufs: number, truePeak: number): number {
  return truePeak - lufs
}

/** PLR目安レンジ(9〜11)との比較結果を返す。 */
export function evaluatePlr(plr: number): PlrEvaluation {
  if (plr < PLR_RANGE_MIN) {
    return { category: 'low', comment: '圧縮強め（PLRが低い）' }
  }
  if (plr > PLR_RANGE_MAX) {
    return { category: 'high', comment: 'ダイナミックレンジが広め（PLRが高い）' }
  }
  return { category: 'ok', comment: '適正範囲内です' }
}
