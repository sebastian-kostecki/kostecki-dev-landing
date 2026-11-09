import type { SiteContent } from '@/types/content'

export const SITE_URL = 'https://kostecki.dev'
export const SITE_REPO_URL = 'https://github.com/sebastian-kostecki/kostecki-dev-landing'

export interface PageMeta {
  title: string
  description: string
  lang: string
  ogLocale: string
  canonical: string | null
}

// Single place for the canonical URL rule: `/` keeps its trailing slash,
// every other path is SITE_URL + path without a trailing slash.
export function canonicalUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path.replace(/\/+$/, '')}`
}

function routeCopy(routeName: string, content: SiteContent) {
  switch (routeName) {
    case 'projects':
      return content.routes.projects
    case 'skills':
      return content.routes.skills
    case 'contact':
      return content.routes.contact
    case 'cv':
      return content.routes.cv
    case 'not-found':
      return content.routes.notFound
    default:
      return content.routes.home
  }
}

export function pageMeta(routeName: string, content: SiteContent, path: string): PageMeta {
  const { title, description } = routeCopy(routeName, content)
  const lang = content.meta.lang
  return {
    title,
    description,
    lang,
    ogLocale: lang === 'pl' ? 'pl_PL' : 'en_US',
    canonical: routeName === 'not-found' ? null : canonicalUrl(path),
  }
}
