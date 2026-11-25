import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { careerSince, employer } from '@/content/career'
import { scaleLiterals } from '@/content/content-rules'
import type { SiteContent } from '@/types/content'

const dictionaries: Record<string, SiteContent> = {
  pl: pl as unknown as SiteContent,
  en: en as unknown as SiteContent,
}

const OSS_LINKS = [
  'https://github.com/panelalpha/panelalpha-engine',
  'https://github.com/panelalpha/panelalpha-single-server',
]

// Public repositories on github.com/sebastian-kostecki (checked 2026-11-25). A link to any other
// repo is a 404 for visitors or an old name that only works through a redirect.
const PUBLIC_REPOS = [
  'household-treasurer',
  'root-keeper',
  'menu-maker',
  'day-navigator',
  'focus-blocker',
  'kostecki-dev-landing',
]

describe('career dates', () => {
  it('counts from the LinkedIn dates', () => {
    expect(careerSince).toEqual({ modulesGarden: '2022-07', panelAlpha: '2022-11' })
  })
})

describe('current organisation', () => {
  // ModulesGarden and PanelAlpha are two projects of the same employer; LinkedIn and the GitHub
  // profile list the current role under PanelAlpha.
  it('is PanelAlpha in JSON-LD', () => {
    expect(employer).toEqual({ name: 'PanelAlpha', url: 'https://panelalpha.com' })
  })
})

describe.each(Object.keys(dictionaries))('LinkedIn consistency (%s)', (locale) => {
  const content = dictionaries[locale]!
  const serialized = JSON.stringify(content)

  it('has no Cursor and no backend developer role', () => {
    expect(serialized).not.toContain('Cursor')
    expect(serialized).not.toMatch(/backend developer/i)
  })

  it('presents the role as Full-stack Developer', () => {
    expect(content.hero.label.startsWith('Full-stack Developer')).toBe(true)
  })

  it('does not repeat the PanelAlpha duration and does not say B2B in the summary', () => {
    const experience = content.summary.items.find((item) => item.value.includes('{years:modulesGarden}'))
    expect(experience).toBeDefined()
    expect(experience!.value).not.toContain('{years:panelAlpha}')
    const production = content.summary.items.find((item) => /PanelAlpha/.test(item.value) && item !== experience && !item.value.includes('Developer'))
    expect(production).toBeDefined()
    expect(production!.value).not.toContain('B2B')
  })

  it('names Claude Design as a tool', () => {
    expect(content.aiWorkflow.subtitle).toContain('Claude Design')
    const tools = content.skills.categories.find((category) => category.tags.includes('Claude Code'))
    expect(tools?.tags).toContain('Claude Design')
  })

  it('shows Menu Maker live without a WIP badge', () => {
    const menu = content.projects.personal.items.find((item) => item.title === 'Menu Maker')
    expect(menu).toBeDefined()
    expect(menu!.badge).toBeUndefined()
    expect(menu!.links[0]).toMatchObject({ url: 'https://menu.kostecki.dev', primary: true })
    const github = menu!.links.find((link) => link.url.includes('github.com'))
    expect(github).toBeDefined()
    expect(github!.primary).toBeFalsy()
  })

  it('shows Menu Maker as a featured product in production, like the other two', () => {
    const menu = content.projects.personal.items.find((item) => item.title === 'Menu Maker')!
    expect(menu.featured).toBe(true)
    expect(menu.proves?.trim()).toBeTruthy()
    expect(menu.image).toMatch(/\.webp$/)
    expect(menu.imageAlt?.trim()).toBeTruthy()
    expect(menu.highlights?.length).toBeGreaterThanOrEqual(3)
    for (const highlight of menu.highlights ?? []) {
      expect(scaleLiterals(highlight)).toEqual([])
    }
  })

  it('lists Nawigator dnia with its public repository', () => {
    const navigator = content.projects.personal.items.find((item) => item.title === 'Nawigator dnia')
    expect(navigator).toBeDefined()
    expect(navigator!.featured).toBeFalsy()
    expect(
      navigator!.links.some((link) => link.url === 'https://github.com/sebastian-kostecki/day-navigator'),
    ).toBe(true)
  })

  it('presents ModulesGarden and PanelAlpha as two projects, not employer and product', () => {
    const experience = content.summary.items.find((item) => item.value.includes('{years:modulesGarden}'))!
    expect(experience.value).toContain('ModulesGarden')
    expect(experience.value).toContain('PanelAlpha')
    expect(experience.value).not.toMatch(/(w|at) ModulesGarden/)
    expect(content.projects.featured.context.employer).toBeUndefined()
  })

  it('names all three products in the projects page description', () => {
    expect(content.routes.projects.description).toContain('Menu Maker')
  })

  it('links only to public repositories under their current names', () => {
    const repos = [...serialized.matchAll(/github\.com\/sebastian-kostecki\/([\w.-]+)/g)].map(
      (match) => match[1],
    )
    expect(repos.length).toBeGreaterThan(0)
    expect(repos.filter((repo) => !PUBLIC_REPOS.includes(repo!))).toEqual([])
  })

  it('links the open source block to the Engine and Single Server repos', () => {
    const links = content.projects.featured.openSourceContribution?.links ?? []
    expect(links.map((link) => link.url)).toEqual(OSS_LINKS)
  })

  it('describes PanelAlpha as hosting projects from Git', () => {
    const description = content.projects.featured.description
    expect(description).not.toContain('WordPress management')
    expect(description).not.toContain('zarządzania WordPress')
    expect(description).toContain('Git')
  })
})

describe('open source links match between locales', () => {
  it('has the same URLs and titles in PL and EN', () => {
    const links = (c: SiteContent) => c.projects.featured.openSourceContribution?.links
    expect(links(dictionaries.pl!)).toEqual(links(dictionaries.en!))
  })
})
