import { describe, expect, it } from 'vitest'
import pl from '@/content/pl.json'
import en from '@/content/en.json'
import { resolveDurations } from '@/composables/useDuration'

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      keyPaths(item, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

describe('locale dictionaries', () => {
  it('pl.json and en.json have identical key paths', () => {
    expect(keyPaths(pl).sort()).toEqual(keyPaths(en).sort())
  })

  it('leave no unresolved duration tokens after resolution', () => {
    const token = /\{\w+:\w+\}/
    expect(JSON.stringify(resolveDurations(pl, 'pl'))).not.toMatch(token)
    expect(JSON.stringify(resolveDurations(en, 'en'))).not.toMatch(token)
  })
})
