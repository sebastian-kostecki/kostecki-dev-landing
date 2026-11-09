import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { routes, staticRoutes } from '@/router/routes'
import { canonicalUrl, pageMeta, SITE_URL } from '@/seo/page-meta'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, { content: SiteContent; ogLocale: string }> = {
  pl: { content: pl as unknown as SiteContent, ogLocale: 'pl_PL' },
  en: { content: en as unknown as SiteContent, ogLocale: 'en_US' },
}

const copyKey: Record<string, keyof SiteContent['routes']> = {
  home: 'home',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact',
  cv: 'cv',
  'not-found': 'notFound',
}

describe.each(Object.keys(dictionaries))('pageMeta (%s)', (locale) => {
  const { content, ogLocale } = dictionaries[locale]!

  it.each(routes.map((route) => String(route.name)))(
    'maps route %s to its content.routes entry',
    (name) => {
      const entry = content.routes[copyKey[name]!]
      const meta = pageMeta(name, content, '/')
      expect(meta.title).toBe(entry.title)
      expect(meta.description).toBe(entry.description)
    },
  )

  it('builds canonical per static path', () => {
    for (const { path, name } of staticRoutes) {
      const expected = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
      expect(pageMeta(name, content, path).canonical).toBe(expected)
    }
  })

  it('returns null canonical for not-found', () => {
    expect(pageMeta('not-found', content, '/nie-ma-takiej').canonical).toBeNull()
  })

  it('throws for a route name without a content.routes entry', () => {
    expect(() => pageMeta('whatever', content, '/')).toThrow(/whatever/)
  })

  it('sets ogLocale and lang', () => {
    const meta = pageMeta('home', content, '/')
    expect(meta.ogLocale).toBe(ogLocale)
    expect(meta.lang).toBe(locale)
  })
})

describe('canonicalUrl', () => {
  it('keeps the slash for home and strips trailing slashes elsewhere', () => {
    expect(canonicalUrl('/')).toBe('https://kostecki.dev/')
    expect(canonicalUrl('/projects')).toBe('https://kostecki.dev/projects')
    expect(canonicalUrl('/projects/')).toBe('https://kostecki.dev/projects')
  })
})
