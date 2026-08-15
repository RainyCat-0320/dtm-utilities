import { describe, expect, it } from 'vitest'
import {
  buildFullNoteTable,
  centsOffset,
  freqFromMidi,
  freqToNote,
  midiFromFreq,
  noteNameFromMidi,
} from './frequencyNote'

describe('freqFromMidi', () => {
  it('returns exactly 440Hz for A4 (MIDI 69)', () => {
    expect(freqFromMidi(69)).toBe(440)
  })

  it('returns ~261.63Hz for C4 (MIDI 60)', () => {
    expect(freqFromMidi(60)).toBeCloseTo(261.63, 2)
  })

  it('doubles per octave', () => {
    expect(freqFromMidi(81)).toBeCloseTo(freqFromMidi(69) * 2, 5) // A5
  })
})

describe('midiFromFreq', () => {
  it('finds the exact MIDI note for 440Hz', () => {
    expect(midiFromFreq(440)).toBe(69)
  })

  it('rounds to the nearest note when slightly off-pitch', () => {
    expect(midiFromFreq(445)).toBe(69) // still closest to A4
    expect(midiFromFreq(466)).toBe(70) // closer to A#4
  })
})

describe('noteNameFromMidi', () => {
  it('names A4, C4 and C0/B8 boundaries correctly', () => {
    expect(noteNameFromMidi(69)).toBe('A4')
    expect(noteNameFromMidi(60)).toBe('C4')
    expect(noteNameFromMidi(12)).toBe('C0')
    expect(noteNameFromMidi(119)).toBe('B8')
  })
})

describe('centsOffset', () => {
  it('is 0 when the frequency exactly matches the note', () => {
    expect(centsOffset(440, 69)).toBe(0)
  })

  it('is positive when sharp and negative when flat', () => {
    expect(centsOffset(445, 69)).toBeGreaterThan(0)
    expect(centsOffset(435, 69)).toBeLessThan(0)
  })
})

describe('freqToNote', () => {
  it('combines note name, MIDI number and cents for a slightly sharp A4', () => {
    const result = freqToNote(445)
    expect(result.midi).toBe(69)
    expect(result.noteName).toBe('A4')
    expect(result.cents).toBeGreaterThan(0)
  })
})

describe('buildFullNoteTable', () => {
  it('spans exactly C0 to B8 (108 notes)', () => {
    const table = buildFullNoteTable()
    expect(table).toHaveLength(108)
    expect(table[0]).toEqual({ midi: 12, noteName: 'C0', freq: expect.any(Number) })
    expect(table.at(-1)).toEqual({ midi: 119, noteName: 'B8', freq: expect.any(Number) })
  })

  it('includes A4 at exactly 440.00Hz', () => {
    const table = buildFullNoteTable()
    const a4 = table.find((row) => row.noteName === 'A4')
    expect(a4?.freq).toBe(440)
  })
})
