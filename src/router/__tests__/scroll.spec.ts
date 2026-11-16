import { describe, expect, it } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import { COLLABORATION_ANCHOR, scrollBehavior } from '@/router/scroll'

const to = (hash: string) => ({ hash }) as RouteLocationNormalized

describe('scrollBehavior', () => {
  it('scrolls to the element named by the hash', () => {
    expect(scrollBehavior(to('#wspolpraca'))).toEqual({ el: '#wspolpraca' })
  })

  it('scrolls to the top without a hash', () => {
    expect(scrollBehavior(to(''))).toEqual({ top: 0 })
  })
})

describe('COLLABORATION_ANCHOR', () => {
  // The link goes out on LinkedIn, so it must not change or depend on the locale.
  it('is the published, locale-independent id', () => {
    expect(COLLABORATION_ANCHOR).toBe('wspolpraca')
  })
})
