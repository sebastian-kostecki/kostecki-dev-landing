import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fillDurations,
  formatDuration,
  resolveDurations,
  yearsSince,
} from '@/composables/useDuration'
import { careerSince } from '@/content/career'

function at(year: number, month: number, day: number) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(year, month - 1, day))
}

afterEach(() => {
  vi.useRealTimers()
})

describe('formatDuration', () => {
  it('formats whole years at 2026-11-09', () => {
    at(2026, 11, 9)
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('4 lata')
    expect(formatDuration('modulesGarden', 'pl', 'since')).toBe('4 lat')
    expect(formatDuration('modulesGarden', 'en', 'years')).toBe('4 years')
  })

  it('formats half years at 2026-11-09', () => {
    at(2026, 11, 9)
    expect(formatDuration('panelAlpha', 'pl', 'years')).toBe('3,5 roku')
    expect(formatDuration('panelAlpha', 'en', 'years')).toBe('3.5 years')
  })

  it('does not append "+" between half-year steps', () => {
    at(2027, 2, 15)
    expect(formatDuration('panelAlpha', 'pl', 'years')).toBe('3,5 roku')
  })

  it('rolls over at the half-year boundary', () => {
    at(2027, 5, 10)
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('4,5 roku')
    expect(formatDuration('modulesGarden', 'pl', 'since')).toBe('4,5 roku')
    expect(formatDuration('panelAlpha', 'pl', 'years')).toBe('4 lata')
    expect(formatDuration('panelAlpha', 'pl', 'since')).toBe('4 lat')
  })

  it('uses "lat" for five years', () => {
    at(2027, 11, 1)
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('5 lat')
  })

  it('handles one year and half years below one', () => {
    at(2023, 11, 15)
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('1 rok')
    expect(formatDuration('modulesGarden', 'pl', 'since')).toBe('roku')
    expect(formatDuration('modulesGarden', 'en', 'years')).toBe('1 year')
    expect(formatDuration('panelAlpha', 'pl', 'years')).toBe('0,5 roku')
    expect(formatDuration('panelAlpha', 'en', 'years')).toBe('0.5 years')
  })

  it('handles the 12-14 and 22-24 Polish plural exceptions', () => {
    at(2034, 11, 1)
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('12 lat')
    vi.setSystemTime(new Date(2044, 10, 1))
    expect(formatDuration('modulesGarden', 'pl', 'years')).toBe('22 lata')
  })
})

describe('yearsSince', () => {
  it('returns a plain number rounded down to the half year', () => {
    const result = yearsSince('2022-11', new Date(2027, 1, 15))
    expect(typeof result).toBe('number')
    expect(result).toBe(4)
  })
})

describe('fillDurations', () => {
  it('substitutes known tokens', () => {
    at(2026, 11, 9)
    expect(fillDurations('Od {since:modulesGarden} w branży', 'pl')).toBe('Od 4 lat w branży')
    expect(fillDurations('For {years:modulesGarden}', 'en')).toBe('For 4 years')
  })

  it('leaves unknown keys unchanged', () => {
    expect(fillDurations('x {years:unknown} y', 'pl')).toBe('x {years:unknown} y')
  })

  it('leaves text without tokens unchanged', () => {
    expect(fillDurations('Zwykły tekst', 'pl')).toBe('Zwykły tekst')
  })
})

describe('resolveDurations', () => {
  it('preserves structure and non-string values', () => {
    at(2026, 11, 9)
    const input = {
      a: 'Od {since:modulesGarden}',
      b: ['{years:panelAlpha}', { c: 'x' }],
      n: null,
      num: 7,
      flag: true,
    }
    expect(resolveDurations(input, 'pl')).toEqual({
      a: 'Od 4 lat',
      b: ['3,5 roku', { c: 'x' }],
      n: null,
      num: 7,
      flag: true,
    })
  })

  it('does not mutate its input', () => {
    at(2026, 11, 9)
    const input = { a: '{years:modulesGarden}', b: ['{years:panelAlpha}'] }
    const snapshot = structuredClone(input)
    resolveDurations(input, 'pl')
    expect(input).toEqual(snapshot)
  })
})

describe('careerSince', () => {
  it('has no start date in the future', () => {
    for (const [key, since] of Object.entries(careerSince)) {
      expect(yearsSince(since), key).toBeGreaterThanOrEqual(0)
    }
  })
})
