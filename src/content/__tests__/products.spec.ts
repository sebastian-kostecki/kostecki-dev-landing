import { describe, expect, it, vi } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { scaleLiterals } from '@/content/content-rules'
import { hostOf, isRepo } from '@/content/links'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

const featured = (content: SiteContent) =>
  content.projects.personal.items.filter((project) => project.featured)

describe.each(Object.keys(dictionaries))('featured products (%s)', (locale) => {
  const content = dictionaries[locale]!
  const products = featured(content)

  it('has exactly 2 featured products with a non-empty proves line', () => {
    expect(products).toHaveLength(2)
    for (const product of products) {
      expect(product.proves?.trim()).toBeTruthy()
    }
  })

  it('has no scale literals in proves, subtitle or highlights', () => {
    for (const product of products) {
      expect(scaleLiterals(product.proves ?? '')).toEqual([])
      expect(scaleLiterals(product.subtitle)).toEqual([])
      for (const highlight of product.highlights ?? []) {
        expect(scaleLiterals(highlight)).toEqual([])
      }
    }
  })

  it('links to the live app and to a public GitHub repo', () => {
    for (const product of products) {
      expect(product.links.some((link) => link.primary)).toBe(true)
      expect(
        product.links.some((link) => link.url.startsWith('https://github.com/sebastian-kostecki/')),
      ).toBe(true)
    }
  })

  it('has no note', () => {
    for (const product of products) {
      expect(product.note).toBeUndefined()
    }
  })

  it('has a homeProducts subtitle without scale literals', () => {
    expect(scaleLiterals(content.projects.homeProducts.subtitle)).toEqual([])
  })

  it('no longer has ui.exploreAllSkills', () => {
    expect(content.ui).not.toHaveProperty('exploreAllSkills')
  })
})

describe('featured products across locales', () => {
  it('uses identical link URLs in the same order', () => {
    const urls = (content: SiteContent) =>
      featured(content).map((product) => product.links.map((link) => link.url))
    expect(urls(dictionaries.en!)).toEqual(urls(dictionaries.pl!))
  })
})

describe('links', () => {
  it('hostOf returns the host of a valid URL', () => {
    expect(hostOf('https://treasurer.kostecki.dev/path')).toBe('treasurer.kostecki.dev')
  })

  it('hostOf returns the input and logs an error for an invalid URL', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(hostOf('not a url')).toBe('not a url')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('isRepo recognises github.com', () => {
    expect(isRepo('https://github.com/sebastian-kostecki/root-keeper')).toBe(true)
    expect(isRepo('https://genealog.kostecki.dev')).toBe(false)
  })
})
