import { describe, expect, it } from 'vitest'
import en from '@/content/en.json'
import { scaleLiterals } from '@/content/content-rules'
import { staticPaths, staticRoutes } from '@/router/routes'
import { buildLlmsTxt } from '@/seo/llms'
import { SITE_REPO_URL } from '@/seo/page-meta'
import type { SiteContent } from '@/types/content'

const content = en as unknown as SiteContent
const text = buildLlmsTxt(content, staticRoutes)

function section(name: string): string {
  const match = text.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`))
  return match?.[1] ?? ''
}

describe('buildLlmsTxt', () => {
  it('starts with the name and role and quotes the description', () => {
    expect(text.startsWith(`# ${content.hero.name} — ${content.hero.label}\n`)).toBe(true)
    expect(text).toContain(`> ${content.meta.description}`)
  })

  it('lists one link per static path under Pages', () => {
    const links = section('Pages').match(/^- \[[^\]]+\]\([^)]+\)/gm) ?? []
    expect(links).toHaveLength(staticPaths.length)
  })

  it('lists the site repository under Public code', () => {
    expect(section('Public code')).toContain(SITE_REPO_URL)
  })

  it('does not mention commits', () => {
    expect(text).not.toMatch(/commit/i)
  })

  it('has no scale literals outside URLs', () => {
    expect(scaleLiterals(text.replace(/https?:\/\/\S+/g, ' '))).toEqual([])
  })

  it('has no unresolved duration tokens', () => {
    expect(text).not.toContain('{years:')
    expect(text).not.toContain('{since:')
  })
})
