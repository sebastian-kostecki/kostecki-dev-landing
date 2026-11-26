import { describe, expect, it } from 'vitest'
import { UMAMI_DOMAINS, UMAMI_SCRIPT_SRC, umamiScriptTag } from '../lib/umami.mjs'

const ID = '3f2a1c4e-8b7d-4e6f-9a0b-1c2d3e4f5a6b'

describe('umamiScriptTag', () => {
  it.each([undefined, '', '   '])('returns null when the website ID is %j', (value) => {
    expect(umamiScriptTag(value)).toBeNull()
  })

  it('builds a deferred same-origin tracker limited to the production domain', () => {
    expect(umamiScriptTag(ID)).toEqual({
      tag: 'script',
      attrs: {
        defer: true,
        src: '/u/script.js',
        'data-website-id': ID,
        'data-domains': 'kostecki.dev',
      },
      injectTo: 'head',
    })
  })

  it('loads the tracker from this origin, so the CSP can stay script-src and connect-src self', () => {
    expect(UMAMI_SCRIPT_SRC.startsWith('/')).toBe(true)
    expect(UMAMI_SCRIPT_SRC.startsWith('//')).toBe(false)
    expect(UMAMI_DOMAINS).toBe('kostecki.dev')
  })

  it('trims and lowercases the ID', () => {
    expect(umamiScriptTag(` ${ID.toUpperCase()}\n`)?.attrs['data-website-id']).toBe(ID)
  })

  it.each(['not-a-uuid', `${ID}x`, ID.slice(0, -1), '<script>'])(
    'fails the build on a malformed ID %j',
    (value) => {
      expect(() => umamiScriptTag(value)).toThrow(/UMAMI_WEBSITE_ID/)
    },
  )
})
