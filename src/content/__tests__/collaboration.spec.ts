import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { scaleLiterals } from '@/content/content-rules'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

// Services that compete with the current employer are never offered as freelance work.
const EMPLOYER_NICHE = /WHMCS|cPanel|Plesk|DirectAdmin|PowerDNS|hosting/i

describe.each(Object.keys(dictionaries))('collaboration (%s)', (locale) => {
  const collaboration = dictionaries[locale]!.collaboration

  it('offers two or three services, each with one outcome sentence', () => {
    expect(collaboration.services.length).toBeGreaterThanOrEqual(2)
    expect(collaboration.services.length).toBeLessThanOrEqual(3)
    for (const service of collaboration.services) {
      expect(service.title).not.toBe('')
      expect(service.outcome.trim().split(/(?<=[.!?])\s+/)).toHaveLength(1)
    }
  })

  it('does not offer WHMCS or hosting integration work', () => {
    const copy = JSON.stringify(collaboration)
    expect(copy).not.toMatch(EMPLOYER_NICHE)
  })

  it('has no scale literals', () => {
    const copy = [collaboration.subtitle, ...collaboration.services.flatMap(Object.values)]
    expect(scaleLiterals(copy.join(' '))).toEqual([])
  })

  it('links to the contact page', () => {
    expect(collaboration.cta.href).toBe('/contact')
  })
})

describe('collaboration across locales', () => {
  it('has the same number of services', () => {
    expect(dictionaries.en!.collaboration.services).toHaveLength(
      dictionaries.pl!.collaboration.services.length,
    )
  })
})
