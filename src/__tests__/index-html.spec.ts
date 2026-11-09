import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const html = readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8')

const CANONICAL_ORIGIN = 'https://kostecki.dev'

function urls(tag: 'link' | 'script', attr: 'href' | 'src'): string[] {
  const tagPattern = new RegExp(`<${tag}\\b[^>]*>`, 'g')
  const attrPattern = new RegExp(`\\b${attr}="([^"]*)"`)
  return (html.match(tagPattern) ?? []).flatMap((element) => {
    const value = attrPattern.exec(element)?.[1]
    return value === undefined ? [] : [value]
  })
}

const isAllowed = (url: string) =>
  (url.startsWith('/') && !url.startsWith('//')) ||
  url === CANONICAL_ORIGIN ||
  url.startsWith(`${CANONICAL_ORIGIN}/`)

describe('index.html', () => {
  it('has link and script tags to check', () => {
    expect(urls('link', 'href').length).toBeGreaterThan(0)
    expect(urls('script', 'src').length).toBeGreaterThan(0)
  })

  it.each([
    ['link href', urls('link', 'href')],
    ['script src', urls('script', 'src')],
  ])('loads every %s from this origin or the canonical host', (_label, list) => {
    expect(list.filter((url) => !isAllowed(url))).toEqual([])
  })
})
