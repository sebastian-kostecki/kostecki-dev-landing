import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import { render } from '@/entry-server'
import { staticPaths } from '@/router/routes'

describe('entry-server render', () => {
  it('renders /projects with the projects section title and route name', async () => {
    const { html, routeName } = await render('/projects')
    expect(routeName).toBe('projects')
    expect(html).toContain(pl.projects.title)
  })

  it.each(staticPaths)('renders non-empty html for %s', async (path) => {
    const { html } = await render(path)
    expect(html.length).toBeGreaterThan(0)
  })

  it('renders not-found for an unknown path', async () => {
    const { html, routeName } = await render('/nie-ma-takiej')
    expect(routeName).toBe('not-found')
    expect(html).toContain(pl.ui.notFoundTitle)
  })

  it('renders the header on / visible, without hiding attributes or classes', async () => {
    const { html } = await render('/')
    const tag = html.match(/<header[^>]*>/)?.[0]
    expect(tag).toBeDefined()
    expect(tag).not.toContain('aria-hidden')
    expect(tag).not.toContain('-translate-y-full')
    expect(tag).not.toContain('opacity-0')
    expect(tag).not.toContain('pointer-events-none')
  })

  it('renders the header on /projects with a background', async () => {
    const { html } = await render('/projects')
    const tag = html.match(/<header[^>]*>/)?.[0]
    expect(tag).toBeDefined()
    expect(tag).toContain('bg-background/70')
  })
})
