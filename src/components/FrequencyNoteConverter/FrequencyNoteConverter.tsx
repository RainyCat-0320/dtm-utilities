import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './FrequencyNoteConverter.module.css'
import {
  MAX_MIDI,
  MIN_MIDI,
  REFERENCE_MIDI,
  buildFullNoteTable,
  freqFromMidi,
  freqToNote,
  noteNameFromMidi,
} from '../../lib/frequencyNote'

const WHITE_NOTE_OFFSETS = [0, 2, 4, 5, 7, 9, 11] // C D E F G A B
const BLACK_KEYS = [
  { offset: 1, afterWhiteIndex: 1 }, // C#
  { offset: 3, afterWhiteIndex: 2 }, // D#
  { offset: 6, afterWhiteIndex: 4 }, // F#
  { offset: 8, afterWhiteIndex: 5 }, // G#
  { offset: 10, afterWhiteIndex: 6 }, // A#
]

const MIN_OCTAVE = Math.floor(MIN_MIDI / 12) - 1 // 0 (C0)
const MAX_OCTAVE = Math.floor(MAX_MIDI / 12) - 1 // 8 (B8)
const OCTAVES = Array.from(
  { length: MAX_OCTAVE - MIN_OCTAVE + 1 },
  (_, i) => MIN_OCTAVE + i,
)

const fullNoteTable = buildFullNoteTable()

function FrequencyNoteConverter() {
  const [freqInput, setFreqInput] = useState(440)
  const [selectedMidi, setSelectedMidi] = useState(REFERENCE_MIDI)
  const selectedKeyRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Only scroll into view for the initial default selection.
    selectedKeyRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  const isFreqValid = Number.isFinite(freqInput) && freqInput > 0
  const freqToNoteResult = useMemo(
    () => (isFreqValid ? freqToNote(freqInput) : null),
    [freqInput, isFreqValid],
  )

  const selectedNoteName = noteNameFromMidi(selectedMidi)
  const selectedFreq = freqFromMidi(selectedMidi)

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.heading}>周波数 → ノート</h2>
        <label className={styles.field}>
          <span>周波数 (Hz)</span>
          <input
            type="number"
            min={0}
            step="any"
            value={freqInput}
            onChange={(event) => setFreqInput(event.target.valueAsNumber)}
          />
        </label>
        {!isFreqValid && (
          <p className={styles.error}>周波数は0より大きい値を入力してください。</p>
        )}
        {freqToNoteResult && (
          <dl className={styles.resultList}>
            <div>
              <dt>ノート名</dt>
              <dd>{freqToNoteResult.noteName}</dd>
            </div>
            <div>
              <dt>MIDIノート番号</dt>
              <dd>{freqToNoteResult.midi}</dd>
            </div>
            <div>
              <dt>セント偏差</dt>
              <dd>
                {freqToNoteResult.cents > 0 ? '+' : ''}
                {freqToNoteResult.cents}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>ノート → 周波数</h2>
        <p className={styles.selectedNote}>選択中: {selectedNoteName}</p>
        <dl className={styles.resultList}>
          <div>
            <dt>ノート名</dt>
            <dd>{selectedNoteName}</dd>
          </div>
          <div>
            <dt>MIDIノート番号</dt>
            <dd>{selectedMidi}</dd>
          </div>
          <div>
            <dt>周波数</dt>
            <dd>{selectedFreq.toFixed(2)} Hz</dd>
          </div>
        </dl>

        <div className={styles.pianoScroll}>
          <div className={styles.piano}>
            {OCTAVES.map((octave) => (
              <div className={styles.octave} key={octave}>
                {WHITE_NOTE_OFFSETS.map((offset) => {
                  const midi = (octave + 1) * 12 + offset
                  const noteName = noteNameFromMidi(midi)
                  return (
                    <button
                      key={midi}
                      type="button"
                      ref={midi === selectedMidi ? selectedKeyRef : undefined}
                      className={
                        midi === selectedMidi ? styles.whiteKeySelected : styles.whiteKey
                      }
                      onClick={() => setSelectedMidi(midi)}
                    >
                      <span>{noteName}</span>
                    </button>
                  )
                })}
                {BLACK_KEYS.map(({ offset, afterWhiteIndex }) => {
                  const midi = (octave + 1) * 12 + offset
                  const noteName = noteNameFromMidi(midi)
                  return (
                    <button
                      key={midi}
                      type="button"
                      ref={midi === selectedMidi ? selectedKeyRef : undefined}
                      className={
                        midi === selectedMidi ? styles.blackKeySelected : styles.blackKey
                      }
                      style={{ left: `${afterWhiteIndex * (100 / 7)}%` }}
                      onClick={() => setSelectedMidi(midi)}
                    >
                      <span>{noteName}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <details className={styles.noteTableDetails}>
        <summary>C0〜B8 全ノート対応表</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ノート名</th>
                <th>MIDI</th>
                <th>周波数 (Hz)</th>
              </tr>
            </thead>
            <tbody>
              {fullNoteTable.map((row) => (
                <tr key={row.midi}>
                  <th scope="row">{row.noteName}</th>
                  <td>{row.midi}</td>
                  <td>{row.freq.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export default FrequencyNoteConverter
