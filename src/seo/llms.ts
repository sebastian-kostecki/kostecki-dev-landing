import { isRepo } from '@/content/links'
import type { staticRoutes } from '@/router/routes'
import { canonicalUrl, SITE_REPO_URL } from '@/seo/page-meta'
import type { SiteContent } from '@/types/content'

export function buildLlmsTxt(content: SiteContent, routes: typeof staticRoutes): string {
  const copyKey = (name: string) => (name === 'not-found' ? 'notFound' : name) as keyof SiteContent['routes']

  const contact = content.contact.methods.map((method) => {
    const value = method.type === 'email' || method.type === 'phone' ? method.value : method.href
    return `- ${method.label}: ${value}`
  })

  const pages = routes.map(({ path, name }) => {
    const copy = content.routes[copyKey(name)]
    return `- [${copy.title}](${canonicalUrl(path)}): ${copy.description}`
  })

  const code = content.projects.personal.items
    .filter((item) => item.featured)
    .flatMap((item) =>
      item.links
        .filter((link) => isRepo(link.url))
        .map((link) => `- [${item.title}](${link.url}): ${item.subtitle}`),
    )
  code.push(`- [${content.ui.siteSource}](${SITE_REPO_URL})`)

  return [
    `# ${content.hero.name} — ${content.hero.label}`,
    '',
    `> ${content.meta.description}`,
    '',
    ...contact,
    '',
    '## Pages',
    '',
    ...pages,
    '',
    '## Public code',
    '',
    ...code,
    '',
  ].join('\n')
}
