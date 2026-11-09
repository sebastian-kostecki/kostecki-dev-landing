import { fileURLToPath } from 'node:url'
import { _api, iconLoaded, loadIcon } from '@iconify/vue'
import { describe, expect, it, vi } from 'vitest'
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

  it('never calls the Iconify API for an icon that is not bundled, and says so', async () => {
    const fetchSpy = vi.fn(() => Promise.reject(new Error('unexpected network call')))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    _api.setFetch(fetchSpy as unknown as typeof fetch)

    registerIcons()

    await expect(loadIcon('lucide:no-such-icon-xyz')).rejects.toBeDefined()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('pnpm generate:icons'), expect.anything())
    errorSpy.mockRestore()
  })
})
