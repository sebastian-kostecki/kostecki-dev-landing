import { canonicalUrl } from '@/seo/page-meta'

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildSitemap(paths: string[]): string {
  const urls = paths.map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
