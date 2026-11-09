import { employer } from '@/content/career'
import { SITE_URL } from '@/seo/page-meta'
import type { SiteContent } from '@/types/content'

export function buildJsonLd(content: SiteContent): object {
  const methods = content.contact.methods
  const email = methods.find((method) => method.type === 'email')
  const sameAs = methods
    .filter((method) => method.type === 'linkedin' || method.type === 'github')
    .map((method) => method.href)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: content.hero.name,
        jobTitle: content.hero.label,
        url: `${SITE_URL}/`,
        ...(email ? { email: email.href } : {}),
        worksFor: { '@type': 'Organization', name: employer.name, url: employer.url },
        knowsAbout: content.skills.core.map((skill) => skill.name),
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: new URL(SITE_URL).host,
        inLanguage: ['pl', 'en'],
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  }
}
