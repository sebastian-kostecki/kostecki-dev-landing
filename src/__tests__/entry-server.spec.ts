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
})
