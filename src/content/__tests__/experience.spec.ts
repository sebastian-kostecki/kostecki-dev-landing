import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { scaleLiterals } from '@/content/content-rules'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

const ENGINE_COMMITS_URL = 'https://github.com/panelalpha/panelalpha-engine/commits?author=skostecki'

describe.each(Object.keys(dictionaries))('projects experience (%s)', (locale) => {
  const projects = dictionaries[locale]!.projects

  it('no longer has a separate openSource project', () => {
    expect(projects).not.toHaveProperty('openSource')
  })

  it('exposes Engine as an open-source contribution of PanelAlpha', () => {
    const contribution = projects.featured.openSourceContribution
    expect(contribution).toBeDefined()
    expect(contribution!.link.url).toBe(ENGINE_COMMITS_URL)
    expect(contribution!.text).not.toBe('')
    expect(contribution!.context).not.toBe('')
  })

  it('has no scale literals in PanelAlpha scope copy', () => {
    const contribution = projects.featured.openSourceContribution!
    for (const responsibility of projects.featured.responsibilities) {
      expect(scaleLiterals(responsibility)).toEqual([])
    }
    expect(scaleLiterals(contribution.text)).toEqual([])
    expect(scaleLiterals(contribution.context)).toEqual([])
    expect(scaleLiterals(projects.homeExperience.subtitle)).toEqual([])
  })
})

describe('projects experience across locales', () => {
  it('uses the same Engine link URL', () => {
    const url = (content: SiteContent) => content.projects.featured.openSourceContribution?.link.url
    expect(url(dictionaries.en!)).toBe(url(dictionaries.pl!))
  })

  it('has the same number of responsibilities', () => {
    const count = (content: SiteContent) => content.projects.featured.responsibilities.length
    expect(count(dictionaries.en!)).toBe(count(dictionaries.pl!))
  })
})

describe('scaleLiterals', () => {
  it.each([
    'Laravel 13 + PostgreSQL + Inertia',
    'React 19 + TypeScript',
    'lint, Larastan 7, Pest',
    'PHP 8.5',
    "pipeline'y CI: lint, Larastan, Pest, Playwright e2e",
  ])('allows %s', (text) => {
    expect(scaleLiterals(text)).toEqual([])
  })

  it.each([
    '14 decyzji architektonicznych (ADR)',
    'Ponad 130 plików testów Pest',
    'ponad 40 PR-ów',
    '4 workflowy CI',
    'ponad 600 commitów',
    '14 architecture decisions (ADR)',
    '130+ Pest test files',
    '40+ pull requests',
    '4 CI workflows: lint, Larastan 7, Pest tests and Playwright e2e',
    '600+ commits',
  ])('rejects %s', (text) => {
    expect(scaleLiterals(text).length).toBeGreaterThan(0)
  })
})
