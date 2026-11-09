import type { PageMeta } from '@/seo/page-meta'

export interface InjectPage {
  appHtml: string
  meta: PageMeta
  jsonLd?: object
  noindex?: boolean
}

const APP_PLACEHOLDER = '<div id="app"></div>'

const META_LINE = (attr: string, value: string) =>
  new RegExp(`[ \\t]*<meta ${attr}="${value}" content="[^"]*">[ \\t]*\\n?`, 'g')

const TAGS = {
  title: /<title>[^<]*<\/title>/g,
  description: META_LINE('name', 'description'),
  'og:title': META_LINE('property', 'og:title'),
  'og:description': META_LINE('property', 'og:description'),
  'og:url': META_LINE('property', 'og:url'),
  'og:locale': META_LINE('property', 'og:locale'),
  'og:locale:alternate': META_LINE('property', 'og:locale:alternate'),
  'twitter:title': META_LINE('name', 'twitter:title'),
  'twitter:description': META_LINE('name', 'twitter:description'),
  canonical: /[ \t]*<link rel="canonical" href="[^"]*">[ \t]*\n?/g,
} as const

type TagName = keyof typeof TAGS

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function countOf(template: string, pattern: RegExp): number {
  return template.match(pattern)?.length ?? 0
}

function assertOnce(template: string, name: string, pattern: RegExp): void {
  const count = countOf(template, pattern)
  if (count !== 1) {
    throw new Error(`Template tag "${name}" must occur exactly once, found ${count}`)
  }
}

// Replacer is always a function so `$&`, `$'` and `$\`` in content stay literal.
function replaceTag(template: string, name: TagName, replacement: string): string {
  return template.replace(TAGS[name], () => replacement)
}

export function injectPage(template: string, page: InjectPage): string {
  const { appHtml, meta, jsonLd, noindex } = page

  assertOnce(template, '<div id="app"></div>', new RegExp(escapeRegExp(APP_PLACEHOLDER), 'g'))
  for (const name of Object.keys(TAGS) as TagName[]) assertOnce(template, name, TAGS[name])
  assertOnce(template, '</head>', /<\/head>/g)

  const title = escapeAttr(meta.title)
  const description = escapeAttr(meta.description)

  let out = template
  out = replaceTag(out, 'title', `<title>${escapeText(meta.title)}</title>`)
  out = replaceTag(out, 'description', `    <meta name="description" content="${description}">\n`)
  out = replaceTag(out, 'og:title', `    <meta property="og:title" content="${title}">\n`)
  out = replaceTag(
    out,
    'og:description',
    `    <meta property="og:description" content="${description}">\n`,
  )
  out = replaceTag(
    out,
    'og:locale',
    `    <meta property="og:locale" content="${escapeAttr(meta.ogLocale)}">\n`,
  )
  out = replaceTag(
    out,
    'og:locale:alternate',
    `    <meta property="og:locale:alternate" content="${escapeAttr(meta.ogLocaleAlternate)}">\n`,
  )
  out = replaceTag(out, 'twitter:title', `    <meta name="twitter:title" content="${title}">\n`)
  out = replaceTag(
    out,
    'twitter:description',
    `    <meta name="twitter:description" content="${description}">\n`,
  )

  if (meta.canonical === null) {
    out = replaceTag(out, 'canonical', '')
    out = replaceTag(out, 'og:url', '')
  } else {
    const url = escapeAttr(meta.canonical)
    out = replaceTag(out, 'canonical', `    <link rel="canonical" href="${url}">\n`)
    out = replaceTag(out, 'og:url', `    <meta property="og:url" content="${url}">\n`)
  }

  const headExtras: string[] = []
  if (noindex) headExtras.push('    <meta name="robots" content="noindex">\n')
  if (jsonLd !== undefined) {
    // `<` escaped so a `</script>` inside a value cannot close the block.
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    headExtras.push(`    <script type="application/ld+json">${json}</script>\n`)
  }
  if (headExtras.length > 0) {
    out = out.replace(/[ \t]*<\/head>/, () => `${headExtras.join('')}  </head>`)
  }

  return out.replace(APP_PLACEHOLDER, () => `<div id="app">${appHtml}</div>`)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
