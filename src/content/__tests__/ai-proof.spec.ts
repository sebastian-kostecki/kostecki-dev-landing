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
