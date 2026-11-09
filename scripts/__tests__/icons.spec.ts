import { fileURLToPath } from 'node:url'
import { iconLoaded } from '@iconify/vue'
import { describe, expect, it } from 'vitest'
import { registerIcons } from '../../src/icons'
import { buildIconCollections, collectIconNames } from '../lib/icons.mjs'

const ROOT = fileURLToPath(new URL('../..', import.meta.url))
const SRC = fileURLToPath(new URL('../../src', import.meta.url))

describe('icons', () => {
  it('registers every icon referenced in src/ from the committed icons.json', async () => {
    const names = await collectIconNames(SRC)
    const referenced = [...names].flatMap(([prefix, list]) => list.map((name) => `${prefix}:${name}`))
    expect(referenced.length).toBeGreaterThan(0)

    registerIcons()

    const missing = referenced.filter((icon) => !iconLoaded(icon))
    expect(missing, 'run `pnpm generate:icons` and commit src/generated/icons.json').toEqual([])
  })

  it('throws when an icon does not exist in its set', async () => {
    const names = new Map([['lucide', ['mail', 'no-such-icon-xyz']]])
    await expect(buildIconCollections(names, ROOT)).rejects.toThrow(/no-such-icon-xyz/)
  })
})
