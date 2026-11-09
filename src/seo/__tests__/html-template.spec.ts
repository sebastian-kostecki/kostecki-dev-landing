import { describe, expect, it } from 'vitest'
import { injectPage } from '@/seo/html-template'
import type { PageMeta } from '@/seo/page-meta'

const template = `<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta name="description" content="old desc">
    <link rel="canonical" href="https://kostecki.dev/">
    <meta property="og:url" content="https://kostecki.dev/">
    <meta property="og:title" content="old og title">
    <meta property="og:description" content="old og desc">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="pl_PL">
    <meta name="twitter:title" content="old tw title">
    <meta name="twitter:description" content="old tw desc">
    <title>Old title</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`

const meta: PageMeta = {
  title: 'Projekty — Sebastian Kostecki',
  description: 'Opis projektów',
  lang: 'pl',
  ogLocale: 'pl_PL',
  canonical: 'https://kostecki.dev/projects',
}

describe('injectPage', () => {
  it('replaces every tag and fills #app', () => {
    const out = injectPage(template, { appHtml: '<main>treść</main>', meta })
    expect(out).toContain('<title>Projekty — Sebastian Kostecki</title>')
    expect(out).toContain('<meta name="description" content="Opis projektów">')
    expect(out).toContain('<meta property="og:title" content="Projekty — Sebastian Kostecki">')
    expect(out).toContain('<meta property="og:description" content="Opis projektów">')
    expect(out).toContain('<meta property="og:url" content="https://kostecki.dev/projects">')
    expect(out).toContain('<meta property="og:locale" content="pl_PL">')
    expect(out).toContain('<meta name="twitter:title" content="Projekty — Sebastian Kostecki">')
    expect(out).toContain('<meta name="twitter:description" content="Opis projektów">')
    expect(out).toContain('<link rel="canonical" href="https://kostecki.dev/projects">')
    expect(out).toContain('<div id="app"><main>treść</main></div>')
    expect(out).toContain('<meta property="og:locale:alternate" content="pl_PL">')
    expect(out).not.toContain('old')
    expect(out).not.toContain('application/ld+json')
    expect(out).not.toContain('noindex')
  })

  it('escapes quotes, ampersands and angle brackets in attributes', () => {
    const out = injectPage(template, {
      appHtml: '',
      meta: { ...meta, description: 'a "b" & <c>' },
    })
    expect(out).toContain('<meta name="description" content="a &quot;b&quot; &amp; &lt;c&gt;">')
  })

  it('keeps $& and similar patterns literal in meta and appHtml', () => {
    const out = injectPage(template, {
      appHtml: "<p>cost $& $' $` $1</p>",
      meta: { ...meta, description: 'x $& y' },
    })
    expect(out).toContain('content="x $&amp; y"')
    expect(out).toContain("<div id=\"app\"><p>cost $& $' $` $1</p></div>")
  })

  it('injects JSON-LD before </head> without allowing </script> to close it', () => {
    const out = injectPage(template, {
      appHtml: '',
      meta,
      jsonLd: { name: '</script><b>x' },
    })
    const block = out.match(/<script type="application\/ld\+json">(.*)<\/script>/)
    expect(block).not.toBeNull()
    expect(block![1]).not.toContain('<')
    expect(JSON.parse(block![1]!)).toEqual({ name: '</script><b>x' })
    expect(out.indexOf('application/ld+json')).toBeLessThan(out.indexOf('</head>'))
  })

  it('renders the 404 variant: noindex, no canonical, no og:url, no JSON-LD', () => {
    const out = injectPage(template, {
      appHtml: '<p>404</p>',
      meta: { ...meta, canonical: null },
      noindex: true,
    })
    expect(out).toContain('<meta name="robots" content="noindex">')
    expect(out).not.toContain('rel="canonical"')
    expect(out).not.toContain('og:url')
    expect(out).not.toContain('application/ld+json')
    expect(out).toContain('og:locale:alternate')
  })

  it('throws naming the tag when it is missing', () => {
    const broken = template.replace(/<link rel="canonical"[^>]*>/, '')
    expect(() => injectPage(broken, { appHtml: '', meta })).toThrow(/canonical/)
  })

  it('throws when #app placeholder occurs twice', () => {
    const doubled = template.replace('<body>', '<body><div id="app"></div>')
    expect(() => injectPage(doubled, { appHtml: '', meta })).toThrow(/<div id="app"><\/div>/)
  })

  it('throws when #app placeholder is already filled', () => {
    const filled = template.replace('<div id="app"></div>', '<div id="app"><p>x</p></div>')
    expect(() => injectPage(filled, { appHtml: '', meta })).toThrow(/found 0/)
  })
})
