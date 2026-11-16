import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { ARCHIVE_FOLDER_URL, archiveFolderLabel } from '@/content/archive-proof'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

describe.each(Object.keys(dictionaries))('aiWorkflow.proof (%s)', (locale) => {
  const proof = dictionaries[locale]!.aiWorkflow.proof

  it('has exactly 5 items', () => {
    expect(proof.items).toHaveLength(5)
  })

  it('links every item to an archive folder of one of the two repos', () => {
    for (const item of proof.items) {
      expect(item.url).toMatch(ARCHIVE_FOLDER_URL)
    }
  })

  it('derives labels without a date prefix', () => {
    for (const item of proof.items) {
      expect(archiveFolderLabel(item.url)).not.toMatch(/^\d{4}-/)
    }
  })

  it('links to both archives', () => {
    expect(proof.archiveLinks).toHaveLength(2)
    const urls = proof.archiveLinks.map((link) => link.url).sort()
    expect(urls).toEqual([
      'https://github.com/sebastian-kostecki/household-treasurer/tree/main/context/archive',
      'https://github.com/sebastian-kostecki/root-keeper/tree/main/context/archive',
    ])
  })
})

describe.each(Object.keys(dictionaries))('aiWorkflow.example (%s)', (locale) => {
  const example = dictionaries[locale]!.aiWorkflow.example

  it('links to an archive folder and its pull request', () => {
    expect(example.url).toMatch(ARCHIVE_FOLDER_URL)
    expect(example.prUrl).toMatch(
      /^https:\/\/github\.com\/sebastian-kostecki\/(root-keeper|household-treasurer)\/pull\/\d+$/,
    )
  })

  it('has problem, result and time copy', () => {
    for (const row of example.rows) {
      expect(row.label).not.toBe('')
      expect(row.value).not.toBe('')
    }
    expect(example.rows).toHaveLength(3)
  })
})

describe('aiWorkflow.example across locales', () => {
  it('points to the same change', () => {
    expect(dictionaries.en!.aiWorkflow.example.url).toBe(dictionaries.pl!.aiWorkflow.example.url)
    expect(dictionaries.en!.aiWorkflow.example.prUrl).toBe(
      dictionaries.pl!.aiWorkflow.example.prUrl,
    )
  })
})

describe('aiWorkflow.proof across locales', () => {
  it('uses identical URLs in the same order', () => {
    const urls = (content: SiteContent) => content.aiWorkflow.proof.items.map((item) => item.url)
    expect(urls(dictionaries.en!)).toEqual(urls(dictionaries.pl!))
  })
})

describe('archiveFolderLabel', () => {
  it('strips the date prefix from the folder slug', () => {
    expect(
      archiveFolderLabel(
        'https://github.com/sebastian-kostecki/root-keeper/tree/main/context/archive/2026-10-01-restore-from-backup',
      ),
    ).toBe('restore-from-backup')
  })
})

describe('ARCHIVE_FOLDER_URL', () => {
  const folder = 'https://github.com/sebastian-kostecki/root-keeper/tree/main/context/archive/2026-10-01-x'

  it('accepts a plain archive folder URL', () => {
    expect(folder).toMatch(ARCHIVE_FOLDER_URL)
  })

  it.each([
    ['a query string', `${folder}?plain=1`],
    ['a fragment', `${folder}#readme`],
    ['a trailing slash', `${folder}/`],
    ['a repo outside the list', folder.replace('root-keeper', 'other')],
  ])('rejects %s', (_label, bad) => {
    expect(bad).not.toMatch(ARCHIVE_FOLDER_URL)
  })
})
