import { describe, expect, it } from 'vitest'
import { routes, staticPaths } from '@/router/routes'
import { dictionaries } from '@/composables/useContent'

// `cv.href` is the single switch for the CV page: empty hides every CV link
// and the /cv route itself (no prerender, sitemap or llms.txt entry).
describe('CV page switch', () => {
  const published = dictionaries.pl.cv.href.length > 0

  it('keeps both locales on the same switch position', () => {
    expect(dictionaries.en.cv.href.length > 0).toBe(published)
  })

  it('registers and prerenders /cv only when cv.href is set', () => {
    const hasRoute = routes.some((route) => 'path' in route && route.path === '/cv')
    expect(hasRoute).toBe(published)
    expect(staticPaths.includes('/cv')).toBe(published)
  })

  it('keeps the CV hidden for now', () => {
    expect(published).toBe(false)
  })
})
