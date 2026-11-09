// Pure-ish logic for scripts/build-icons.mjs: finding the "prefix:name" icons used in src/
// and cutting just those out of the Iconify JSON sets, so @iconify/vue never calls
// api.iconify.design at runtime (audit D1: icons vanished with ad blockers).

import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getIcons } from '@iconify/utils'

/** Iconify sets used on the page: prefix -> JSON path inside node_modules. */
export const ICON_SETS = {
  'simple-icons': '@iconify-json/simple-icons/icons.json',
  lucide: '@iconify-json/lucide/icons.json',
}

const PATTERN = new RegExp(`\\b(${Object.keys(ICON_SETS).join('|')}):([a-z0-9-]+)\\b`, 'g')

/** @param {string} dir @returns {AsyncGenerator<string>} */
async function* sourceFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'generated') yield* sourceFiles(path)
    } else if (/\.(vue|ts|json)$/.test(entry.name)) {
      yield path
    }
  }
}

/**
 * Collects every "prefix:name" icon referenced in .vue/.ts/.json files under `srcDir`
 * (src/generated/ is skipped, it holds the output).
 * @param {string} srcDir
 * @returns {Promise<Map<string, string[]>>} sorted unique names per prefix, only prefixes in use
 */
export async function collectIconNames(srcDir) {
  /** @type {Map<string, Set<string>>} */
  const used = new Map()
  for await (const file of sourceFiles(srcDir)) {
    for (const [, prefix, name] of (await readFile(file, 'utf8')).matchAll(PATTERN)) {
      if (!prefix || !name) continue
      if (!used.has(prefix)) used.set(prefix, new Set())
      used.get(prefix)?.add(name)
    }
  }
  return new Map([...used].map(([prefix, set]) => [prefix, [...set].sort()]))
}

/**
 * Cuts the requested icons out of the installed Iconify sets.
 * @param {Map<string, string[]>} names icon names per prefix
 * @param {string} rootDir project root holding node_modules
 * @returns {Promise<import('@iconify/types').IconifyJSON[]>}
 * @throws when a prefix is unknown, a set is not installed, or an icon is missing from its set
 */
export async function buildIconCollections(names, rootDir) {
  const collections = []
  for (const [prefix, list] of names) {
    const path = /** @type {Record<string, string>} */ (ICON_SETS)[prefix]
    if (!path) throw new Error(`[icons] unknown icon set "${prefix}"`)
    let set
    try {
      set = JSON.parse(await readFile(resolve(rootDir, 'node_modules', path), 'utf8'))
    } catch (error) {
      throw new Error(`[icons] cannot read ${path} (is the package installed?)`, { cause: error })
    }
    const subset = getIcons(set, list, true)
    if (!subset) throw new Error(`[icons] none of ${list.join(', ')} found in ${prefix}`)
    const missing = list.filter((name) => !subset.icons[name] && !subset.aliases?.[name])
    if (missing.length) throw new Error(`[icons] missing in ${prefix}: ${missing.join(', ')}`)
    collections.push(subset)
  }
  return collections
}
