import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

describe.each(Object.keys(dictionaries))('skills.core (%s)', (locale) => {
  it('says where every core skill is used', () => {
    for (const skill of dictionaries[locale]!.skills.core) {
      expect(skill.usedIn?.trim(), skill.name).toBeTruthy()
    }
  })
})

describe('skills.core across locales', () => {
  it('has the same names in the same order', () => {
    const names = (content: SiteContent) => content.skills.core.map((skill) => skill.name)
    expect(names(dictionaries.en!)).toEqual(names(dictionaries.pl!))
  })
})
