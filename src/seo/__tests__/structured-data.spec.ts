import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import { employer } from '@/content/career'
import { scaleLiterals } from '@/content/content-rules'
import { SITE_URL } from '@/seo/page-meta'
import { buildJsonLd } from '@/seo/structured-data'
import type { SiteContent } from '@/types/content'

const content = pl as unknown as SiteContent
const graph = (buildJsonLd(content) as { '@graph': Record<string, unknown>[] })['@graph']
const person = graph.find((node) => node['@type'] === 'Person')!
const website = graph.find((node) => node['@type'] === 'WebSite')!

const hrefOf = (type: string) => content.contact.methods.find((m) => m.type === type)!.href

describe('buildJsonLd', () => {
  it('uses the schema.org context', () => {
    expect((buildJsonLd(content) as Record<string, unknown>)['@context']).toBe('https://schema.org')
  })

  it('maps Person fields from the content', () => {
    expect(person['@id']).toBe('https://kostecki.dev/#person')
    expect(person.name).toBe(content.hero.name)
    expect(person.jobTitle).toBe(content.hero.label)
    expect(person.url).toBe(`${SITE_URL}/`)
    expect(person.email).toBe(hrefOf('email'))
    expect(String(person.email)).toMatch(/^mailto:/)
    expect(person.sameAs).toEqual([hrefOf('linkedin'), hrefOf('github')])
    expect(person.knowsAbout).toEqual(content.skills.core.map((skill) => skill.name))
    expect(person.worksFor).toEqual({
      '@type': 'Organization',
      name: employer.name,
      url: employer.url,
    })
  })

  it('describes the WebSite and links it to the person', () => {
    expect(website['@id']).toBe('https://kostecki.dev/#website')
    expect(website.inLanguage).toEqual(['pl', 'en'])
    expect(website.author).toEqual({ '@id': person['@id'] })
  })

  it('has no scale literals outside URLs', () => {
    const text = JSON.stringify(buildJsonLd(content)).replace(/https?:\/\/[^\s"]+/g, ' ')
    expect(scaleLiterals(text)).toEqual([])
  })
})
