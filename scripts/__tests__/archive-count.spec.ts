import { describe, expect, it } from 'vitest'
import {
  ARCHIVE_REPOS,
  assertSameSelection,
  countArchiveFolders,
  missingFolders,
  selectedArchiveFolders,
} from '../lib/archive-count.mjs'

const RK = 'sebastian-kostecki/root-keeper'
const HT = 'sebastian-kostecki/household-treasurer'
const url = (repo: string, folder: string) =>
  `https://github.com/${repo}/tree/main/context/archive/${folder}`
const contentWith = (...urls: string[]) => ({
  aiWorkflow: { proof: { items: urls.map((u) => ({ url: u })) } },
})

describe('ARCHIVE_REPOS', () => {
  it('lists both archive repositories', () => {
    expect(ARCHIVE_REPOS).toEqual([RK, HT])
  })
})

describe('countArchiveFolders', () => {
  it('counts only directory entries', () => {
    const listing = [
      { name: 'README.md', type: 'file' },
      { name: '2026-09-22-a', type: 'dir' },
      { name: '2026-10-01-b', type: 'dir' },
    ]
    expect(countArchiveFolders(listing)).toBe(2)
  })

  it('returns 0 for a listing without directories', () => {
    expect(countArchiveFolders([{ name: 'README.md', type: 'file' }])).toBe(0)
  })

  it.each([
    ['an object', { message: 'Not Found' }],
    ['null', null],
    ['a string', 'oops'],
  ])('throws when the response is %s instead of an array', (_label, value) => {
    expect(() => countArchiveFolders(value)).toThrow(/array/i)
  })
})

describe('selectedArchiveFolders', () => {
  it('returns repo and folder for each proof item', () => {
    const content = contentWith(url(RK, '2026-10-01-restore-from-backup'), url(HT, '2026-11-04-x'))
    expect(selectedArchiveFolders(content)).toEqual([
      { repo: RK, folder: '2026-10-01-restore-from-backup' },
      { repo: HT, folder: '2026-11-04-x' },
    ])
  })

  it('returns an empty list when content has no proof', () => {
    expect(selectedArchiveFolders({ aiWorkflow: {} })).toEqual([])
    expect(selectedArchiveFolders({})).toEqual([])
  })

  it.each([
    ['a wrong path', 'https://github.com/sebastian-kostecki/root-keeper/tree/main/docs/x'],
    ['a missing folder', `https://github.com/${RK}/tree/main/context/archive`],
    ['a nested path', url(RK, 'a/b')],
    ['a wrong branch', `https://github.com/${RK}/tree/dev/context/archive/x`],
    ['not a URL', 'restore-from-backup'],
  ])('throws for %s', (_label, bad) => {
    expect(() => selectedArchiveFolders(contentWith(bad))).toThrow(bad)
  })

  it('throws for a repo outside the archive list', () => {
    const foreign = url('someone/else', '2026-01-01-x')
    expect(() => selectedArchiveFolders(contentWith(foreign))).toThrow(foreign)
  })
})

describe('missingFolders', () => {
  const listings = {
    [RK]: [
      { name: '2026-10-01-a', type: 'dir' },
      { name: 'README.md', type: 'file' },
    ],
    [HT]: [{ name: '2026-11-04-b', type: 'dir' }],
  }

  it('returns an empty list when every selected folder exists', () => {
    const selected = [
      { repo: RK, folder: '2026-10-01-a' },
      { repo: HT, folder: '2026-11-04-b' },
    ]
    expect(missingFolders(selected, listings)).toEqual([])
  })

  it('returns the selected items absent from their repo listing', () => {
    const selected = [
      { repo: RK, folder: '2026-10-01-a' },
      { repo: RK, folder: '2026-11-04-b' },
      { repo: HT, folder: '2026-10-01-typo' },
    ]
    expect(missingFolders(selected, listings)).toEqual([
      { repo: RK, folder: '2026-11-04-b' },
      { repo: HT, folder: '2026-10-01-typo' },
    ])
  })

  it('does not treat a file as a folder', () => {
    expect(missingFolders([{ repo: RK, folder: 'README.md' }], listings)).toHaveLength(1)
  })
})

describe('assertSameSelection', () => {
  const a = [{ repo: RK, folder: '2026-10-01-a' }]

  it('passes when both locales select the same folders in the same order', () => {
    expect(() => assertSameSelection(a, [...a])).not.toThrow()
    expect(() => assertSameSelection([], [])).not.toThrow()
  })

  it('throws when the locales select different folders', () => {
    const b = [{ repo: RK, folder: '2026-10-02-b' }]
    expect(() => assertSameSelection(a, b)).toThrow(/2026-10-02-b/)
  })

  it('throws when one locale has more items', () => {
    expect(() => assertSameSelection(a, [])).toThrow(/PL.*EN|mismatch/i)
  })
})
