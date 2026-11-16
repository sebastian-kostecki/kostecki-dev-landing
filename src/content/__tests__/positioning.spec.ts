import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { pageMeta } from '@/seo/page-meta'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

// The niche the site leads with: hosting control panels, WHMCS billing and PowerDNS on Laravel.
const NICHE_TERMS = ['cPanel', 'Plesk', 'DirectAdmin', 'WHMCS', 'PowerDNS', 'Laravel']

describe.each(Object.keys(dictionaries))('positioning (%s)', (locale) => {
  const content = dictionaries[locale]!

  it('names the niche in the first hero sentence', () => {
    for (const term of NICHE_TERMS) {
      expect(content.hero.valueProp).toContain(term)
    }
  })

  it('keeps the production line as the second hero sentence', () => {
    expect(content.hero.valuePropAccent).not.toBe('')
  })

  it('states availability in one sentence pair under the headline', () => {
    expect(content.hero.availability).toMatch(/Laravel/)
    expect(content.hero.availability.length).toBeLessThan(160)
  })

  it('puts the niche into home title, description and Open Graph copy', () => {
    const meta = pageMeta('home', content, '/')
    for (const term of ['WHMCS', 'PowerDNS', 'Laravel']) {
      expect(meta.title).toContain(term)
    }
    for (const term of NICHE_TERMS) {
      expect(meta.description).toContain(term)
      expect(content.meta.description).toContain(term)
    }
  })
})
