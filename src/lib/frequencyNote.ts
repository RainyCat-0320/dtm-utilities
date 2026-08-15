export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const

export const REFERENCE_MIDI = 69 // A4
export const REFERENCE_FREQ = 440

export const MIN_MIDI = 12 // C0
export const MAX_MIDI = 119 // B8

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/** MIDIノート番号から周波数(Hz)を算出する。A4(69)=440Hz固定。 */
export function freqFromMidi(midi: number): number {
  return REFERENCE_FREQ * 2 ** ((midi - REFERENCE_MIDI) / 12)
}

/** 周波数から最も近いMIDIノート番号を算出する。 */
export function midiFromFreq(freq: number): number {
  return Math.round(REFERENCE_MIDI + 12 * Math.log2(freq / REFERENCE_FREQ))
}

/** MIDIノート番号からノート名（例: "A4"）を算出する。 */
export function noteNameFromMidi(midi: number): string {
  const name = NOTE_NAMES[((midi % 12) + 12) % 12]
  const octave = Math.floor(midi / 12) - 1
  return `${name}${octave}`
}

/** 指定ノートの正確な周波数からのセント偏差（整数に丸め）。 */
export function centsOffset(freq: number, midi: number): number {
  return Math.round(1200 * Math.log2(freq / freqFromMidi(midi)))
}

export interface FreqToNoteResult {
  midi: number
  noteName: string
  cents: number
}

/** 周波数→ノート変換。ノート名・MIDIノート番号・セント偏差をまとめて返す。 */
export function freqToNote(freq: number): FreqToNoteResult {
  const midi = midiFromFreq(freq)
  return { midi, noteName: noteNameFromMidi(midi), cents: centsOffset(freq, midi) }
}

export interface NoteTableRow {
  midi: number
  noteName: string
  freq: number
}

/** C0(MIDI12)〜B8(MIDI119)の全ノート対応表。 */
export function buildFullNoteTable(): NoteTableRow[] {
  const rows: NoteTableRow[] = []
  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi += 1) {
    rows.push({
      midi,
      noteName: noteNameFromMidi(midi),
      freq: roundTo(freqFromMidi(midi), 2),
    })
  }
  return rows
}
