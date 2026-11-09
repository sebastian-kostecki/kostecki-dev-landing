import type { RouteName } from '@/router/routes'
import type { SiteContent } from '@/types/content'

export const SITE_URL = 'https://kostecki.dev'
export const SITE_REPO_URL = 'https://github.com/sebastian-kostecki/kostecki-dev-landing'

export interface PageMeta {
  title: string
  description: string
  lang: string
  ogLocale: string
  ogLocaleAlternate: string
  canonical: string | null
}

// Single place for the canonical URL rule: `/` keeps its trailing slash,
// every other path is SITE_URL + path without a trailing slash.
export function canonicalUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path.replace(/\/+$/, '')}`
}

// One mapping from route name to its `content.routes` entry; Record<RouteName, …>
// makes the compiler demand an entry for every new route.
const routeCopyKey: Record<RouteName, keyof SiteContent['routes']> = {
  home: 'home',
  projects: 'projects',
  skills: 'skills',
  contact: 'contact',
  cv: 'cv',
  'not-found': 'notFound',
}

export function routeCopy(routeName: string, content: SiteContent) {
  if (!Object.hasOwn(routeCopyKey, routeName)) {
    throw new Error(`pageMeta: no content.routes entry for route "${routeName}"`)
  }
  return content.routes[routeCopyKey[routeName as RouteName]]
}

export function pageMeta(routeName: string, content: SiteContent, path: string): PageMeta {
  const { title, description } = routeCopy(routeName, content)
  const lang = content.meta.lang
  return {
    title,
    description,
    lang,
    ogLocale: lang === 'pl' ? 'pl_PL' : 'en_US',
    ogLocaleAlternate: lang === 'pl' ? 'en_US' : 'pl_PL',
    canonical: routeName === 'not-found' ? null : canonicalUrl(path),
  }
}
