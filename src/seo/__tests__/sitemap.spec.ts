import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import { staticPaths, staticRoutes } from '@/router/routes'
import { pageMeta } from '@/seo/page-meta'
import { buildSitemap } from '@/seo/sitemap'
import type { SiteContent } from '@/types/content'

const content = pl as unknown as SiteContent
const xml = buildSitemap(staticPaths)
const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1])

describe('buildSitemap', () => {
  it('has one <loc> per static path', () => {
    expect(locs).toHaveLength(staticPaths.length)
  })

  it('uses the canonical URL from pageMeta for every path', () => {
    const expected = staticRoutes.map(({ path, name }) => pageMeta(name, content, path).canonical)
    expect(new Set(locs)).toEqual(new Set(expected))
  })

  it('escapes XML special characters in <loc>', () => {
    expect(buildSitemap(['/a&b'])).toContain('<loc>https://kostecki.dev/a&amp;b</loc>')
  })

  it.each(['lastmod', 'changefreq', 'priority'])('has no %s', (field) => {
    expect(xml).not.toContain(field)
  })
})
